import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useApp } from '../context/AppContext';
import { FoodProduct } from '../types';
import {
  createBarcodeReader,
  findProductByBarcode,
  cameraSupportStatus,
  decodeVideoFrame,
  decodeImageUrl,
  fetchExternalProductByBarcode,
  isPlaceholderProductImage,
  resolveBestProductImage,
} from '../utils/barcode';

type CameraStatus = 'starting' | 'active' | 'denied' | 'insecure' | 'unsupported' | 'no-camera' | 'error';

const CAMERA_STATUS_MESSAGES: Record<Exclude<CameraStatus, 'active' | 'starting'>, string> = {
  denied: 'Camera permission was denied. Allow camera access in your browser settings, then retry.',
  insecure: 'Camera access requires HTTPS. Open the app via https:// or http://localhost.',
  unsupported: 'This browser does not support camera access. Upload a photo or enter the code manually.',
  'no-camera': 'No camera was found on this device. Upload a photo or enter the code manually.',
  error: 'The camera could not be started. It may be in use by another app.',
};

const DEFAULT_HINT = 'Hold barcode 20–30cm from the camera so it is sharp, in good light';
const ZOOM_FACTORS = { '1x': 1, '2x': 2, '3x': 3 } as const;

export const ScannerScreen: React.FC = () => {
  const {
    products,
    setSelectedProductId,
    setActiveTab,
    scanLogs,
    clearScanLogs,
    triggerScanCheck,
    addNewProduct,
    updateProduct,
    userProfile,
  } = useApp();

  const [scanMode, setScanMode] = useState<'barcode' | 'ocr'>('barcode');
  const [manualCode, setManualCode] = useState('');
  const [manualError, setManualError] = useState('');
  const [zoomLevel, setZoomLevel] = useState<'1x' | '2x' | '3x'>('1x');
  const [torchOn, setTorchOn] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('starting');
  const [cameraRetryKey, setCameraRetryKey] = useState(0);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [torchSupported, setTorchSupported] = useState(false);
  const [zoomRange, setZoomRange] = useState<{ min: number; max: number } | null>(null);
  const [resolution, setResolution] = useState<string | null>(null);
  const [targetAcquired, setTargetAcquired] = useState(false);
  const [isDecodingFile, setIsDecodingFile] = useState(false);
  const [detectionModalProduct, setDetectionModalProduct] = useState<FoodProduct | null>(null);
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [toastHint, setToastHint] = useState(DEFAULT_HINT);

  const cameraActive = cameraStatus === 'active';

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastScanRef = useRef<{ code: string; at: number } | null>(null);
  const modalOpenRef = useRef(false);
  const targetTimerRef = useRef<number | undefined>(undefined);

  const getReader = () => {
    if (!readerRef.current) readerRef.current = createBarcodeReader();
    return readerRef.current;
  };

  // Pause camera result handling while a result modal is open
  useEffect(() => {
    modalOpenRef.current = !!detectionModalProduct || !!notFoundCode;
  }, [detectionModalProduct, notFoundCode]);

  const handleScanProduct = (prod: FoodProduct) => {
    triggerScanCheck(prod);
    setNotFoundCode(null);
    setDetectionModalProduct(prod);
  };

  /** Looks up a decoded barcode locally first, then queries RetailerAPI + Open Food Facts. */
  const handleBarcodeResult = async (code: string) => {
    const match = findProductByBarcode(products, code);
    if (match) {
      if (isPlaceholderProductImage(match.image)) {
        const betterImage = await resolveBestProductImage(match);
        const enriched = { ...match, image: betterImage };
        await updateProduct(enriched);
        handleScanProduct(enriched);
      } else {
        handleScanProduct(match);
      }
      return;
    }

    setToastHint(`Looking up barcode ${code} via RetailerAPI...`);
    const externalProduct = await fetchExternalProductByBarcode(code);
    setToastHint(DEFAULT_HINT);

    if (externalProduct) {
      await addNewProduct(externalProduct);
      handleScanProduct(externalProduct);
    } else {
      setDetectionModalProduct(null);
      setNotFoundCode(code);
    }
  };

  /** Called for every barcode the live camera decodes. */
  const handleCameraDetection = (code: string) => {
    if (modalOpenRef.current) return;
    const now = Date.now();
    const last = lastScanRef.current;
    if (last && last.code === code && now - last.at < 4000) return;
    lastScanRef.current = { code, at: now };

    navigator.vibrate?.(80);
    setTargetAcquired(true);
    window.clearTimeout(targetTimerRef.current);
    targetTimerRef.current = window.setTimeout(() => setTargetAcquired(false), 2000);
    handleBarcodeResult(code);
  };

  // Keep the latest handler available to the long-lived scan loop
  const cameraDetectionRef = useRef(handleCameraDetection);
  cameraDetectionRef.current = handleCameraDetection;

  // Start the camera and continuously decode barcodes from the live feed
  useEffect(() => {
    const support = cameraSupportStatus();
    if (support !== 'ok') {
      setCameraStatus(support);
      return;
    }
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let stream: MediaStream | null = null;
    let loopTimer: number | undefined;
    const canvas = document.createElement('canvas');
    setCameraStatus('starting');

    const size = { width: { ideal: 1920 }, height: { ideal: 1080 } };
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: selectedDeviceId
        ? { deviceId: { exact: selectedDeviceId }, ...size }
        : { facingMode: { ideal: 'environment' }, ...size },
    };

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        video.srcObject = stream;
        await video.play().catch(() => undefined);
        if (cancelled) return;

        const track = stream.getVideoTracks()[0];
        const caps = (track.getCapabilities?.() ?? {}) as MediaTrackCapabilities & {
          zoom?: { min: number; max: number };
          torch?: boolean;
          focusMode?: string[];
        };
        // Ask for continuous autofocus where supported (sharper barcodes)
        if (caps.focusMode?.includes('continuous')) {
          track.applyConstraints({ advanced: [{ focusMode: 'continuous' } as MediaTrackConstraintSet] }).catch(() => undefined);
        }
        setZoomRange(caps.zoom && caps.zoom.max > caps.zoom.min ? { min: caps.zoom.min, max: caps.zoom.max } : null);
        setTorchSupported(!!caps.torch);
        const settings = track.getSettings();
        setResolution(settings.height ? `${settings.height}p` : null);
        setCameraStatus('active');

        // Device labels are only available after permission is granted
        BrowserMultiFormatReader.listVideoInputDevices()
          .then((devices) => !cancelled && setVideoDevices(devices))
          .catch(() => undefined);

        // Decode loop
        let attempt = 0;
        const scan = async () => {
          if (cancelled) return;
          try {
            const code = await decodeVideoFrame(video, getReader(), canvas, attempt++);
            if (code && !cancelled) cameraDetectionRef.current(code);
          } catch (err) {
            console.warn('Barcode decode error:', err);
          }
          if (!cancelled) loopTimer = window.setTimeout(scan, 100);
        };
        scan();
      } catch (err: unknown) {
        if (cancelled) return;
        const name = (err as { name?: string })?.name;
        console.warn('Camera unavailable:', err);
        if (name === 'NotAllowedError' || name === 'SecurityError') setCameraStatus('denied');
        else if (name === 'NotFoundError' || name === 'OverconstrainedError') setCameraStatus('no-camera');
        else setCameraStatus('error');
      }
    };
    start();

    return () => {
      cancelled = true;
      window.clearTimeout(loopTimer);
      stream?.getTracks().forEach((t) => t.stop());
      if (video.srcObject === stream) video.srcObject = null;
      if (streamRef.current === stream) streamRef.current = null;
      setTorchOn(false);
      setZoomLevel('1x');
    };
  }, [selectedDeviceId, cameraRetryKey]);

  useEffect(() => () => window.clearTimeout(targetTimerRef.current), []);

  const getVideoTrack = () => streamRef.current?.getVideoTracks()[0];

  const handleToggleTorch = async () => {
    const track = getVideoTrack();
    if (!track || !torchSupported) {
      setToastHint('Flashlight is not supported by this camera');
      return;
    }
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn } as MediaTrackConstraintSet] });
      setTorchOn(!torchOn);
    } catch {
      setToastHint('Could not toggle the flashlight');
    }
  };

  const handleZoom = async (level: '1x' | '2x' | '3x') => {
    const track = getVideoTrack();
    if (!track || !zoomRange) {
      setToastHint('Zoom is not supported by this camera');
      return;
    }
    const zoom = Math.min(Math.max(ZOOM_FACTORS[level], zoomRange.min), zoomRange.max);
    try {
      await track.applyConstraints({ advanced: [{ zoom } as MediaTrackConstraintSet] });
      setZoomLevel(level);
    } catch {
      setToastHint('Could not change zoom');
    }
  };

  /** Decodes the current camera frame (tries normal and contrast-boosted crops). */
  const handleCaptureFrame = async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setToastHint('Camera is not ready yet — try again in a moment');
      return;
    }
    const canvas = document.createElement('canvas');
    const reader = getReader();
    const code =
      (await decodeVideoFrame(video, reader, canvas, 0)) ??
      (await decodeVideoFrame(video, reader, canvas, 1)) ??
      (await decodeVideoFrame(video, reader, canvas, 2)) ??
      (await decodeVideoFrame(video, reader, canvas, 3));
    if (code) {
      lastScanRef.current = { code, at: Date.now() };
      handleBarcodeResult(code);
    } else {
      setToastHint('No barcode found — hold it 20–30cm away so it is sharp, in good light');
    }
  };

  const handleManualSearch = async (codeToSearch?: string) => {
    const code = (codeToSearch || manualCode).trim();
    if (!code || !/^\d{8,14}$/.test(code)) {
      setManualError('Please enter a valid numeric 8 to 14 digit barcode.');
      return;
    }
    setManualError('');
    const match = findProductByBarcode(products, code);
    if (match) {
      if (isPlaceholderProductImage(match.image)) {
        const betterImage = await resolveBestProductImage(match);
        const enriched = { ...match, image: betterImage };
        await updateProduct(enriched);
        handleScanProduct(enriched);
      } else {
        handleScanProduct(match);
      }
      return;
    }

    setToastHint(`Looking up barcode ${code} via RetailerAPI...`);
    const externalProduct = await fetchExternalProductByBarcode(code);
    setToastHint(DEFAULT_HINT);

    if (externalProduct) {
      await addNewProduct(externalProduct);
      handleScanProduct(externalProduct);
    } else {
      setManualError(`No product with barcode ${code} was found in local catalog or RetailerAPI.`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;

    setIsDecodingFile(true);
    setToastHint(`Reading barcode from ${file.name}...`);
    const url = URL.createObjectURL(file);
    try {
      const code = await decodeImageUrl(url, getReader());
      if (code) {
        setToastHint(DEFAULT_HINT);
        handleBarcodeResult(code);
      } else {
        setToastHint('No barcode detected in that image — try a sharper, closer photo');
      }
    } catch {
      setToastHint('No barcode detected in that image — try a sharper, closer photo');
    } finally {
      URL.revokeObjectURL(url);
      setIsDecodingFile(false);
    }
  };

  const activeAllergenCount = userProfile.activeAllergens.filter((a) => a.active).length;

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Status Ribbon & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono-tech text-xs text-[#64748b]">
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#0f172a] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span>Dashboard</span>
            </button>
            <span>/</span>
            <span className="text-[#5379EE] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">barcode_scanner</span>
              <span>Scanner</span>
            </span>
          </div>

          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-xs ${
              cameraActive ? 'bg-[#e0e7ff]' : cameraStatus === 'starting' ? 'bg-slate-100' : 'bg-[#fff1f2]'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {cameraActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5379EE] opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  cameraActive ? 'bg-[#4338ca]' : cameraStatus === 'starting' ? 'bg-slate-400' : 'bg-[#e11d48]'
                }`}
              ></span>
            </span>
            <span
              className={`font-mono-tech text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                cameraActive ? 'text-[#4338ca]' : cameraStatus === 'starting' ? 'text-[#64748b]' : 'text-[#e11d48]'
              }`}
            >
              {cameraActive
                ? 'Live Scanner: EAN-13 / UPC-A / EAN-8 Active'
                : cameraStatus === 'starting'
                ? 'Starting Camera...'
                : 'Camera Offline — Upload or Manual Entry'}
            </span>
          </div>
        </div>

        {/* Header with Mode Switcher */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#5379EE] font-bold">
                IngreGuide Optical Engine
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-mono-tech text-[10px] text-[#64748b]">Zero-Latency Vision</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Multi-Modal Barcode &amp; Ingredient Scanner
            </h1>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1 leading-relaxed">
              Scan barcodes, QR codes, or packaging labels using your webcam or uploaded packaging photos for instantaneous
              allergen cross-referencing.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-[#f1f5f9] rounded-full self-start lg:self-center shadow-inner">
            <button
              onClick={() => setScanMode('barcode')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-mono-tech text-xs font-bold transition-all ${
                scanMode === 'barcode'
                  ? 'bg-white text-[#0f172a] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              <span className="material-symbols-outlined text-base text-[#5379EE]">barcode_reader</span>
              <span>UPC / EAN Lens</span>
            </button>
            <button
              onClick={() => setScanMode('ocr')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-mono-tech text-xs font-bold transition-all ${
                scanMode === 'ocr'
                  ? 'bg-white text-[#0f172a] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              <span className="material-symbols-outlined text-base text-[#5379EE]">document_scanner</span>
              <span>Label OCR Reader</span>
            </button>
          </div>
        </div>

        {/* 2-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Viewfinder & Upload Box (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Camera Viewfinder Panel */}
            <div className="bg-[#0f172a] rounded-3xl overflow-hidden shadow-xl border border-slate-800 flex flex-col relative">
              {/* Top Bar Overlay */}
              <div className="bg-[#0f172a]/85 backdrop-blur-md px-4 py-2.5 flex items-center justify-between z-20 border-b border-white/5">
                <div className="flex items-center gap-2 text-[#f1f5f9] font-mono-tech text-xs">
                  <span className="material-symbols-outlined text-[#38bdf8] text-sm animate-pulse">videocam</span>
                  <span>{cameraActive ? `Live Camera${resolution ? ` (${resolution})` : ''}` : 'Camera Offline'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono-tech text-[10px]">
                    {scanMode === 'barcode' ? 'BARCODE' : 'LABEL'}
                  </span>
                  {cameraActive && (
                    <span className="px-2 py-0.5 rounded-full bg-[#5379EE]/30 text-[#93c5fd] font-mono-tech text-[10px]">
                      AUTO-DETECT
                    </span>
                  )}
                </div>
              </div>

              {/* Viewfinder Video / Simulation Canvas */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group select-none">
                {/* Live camera feed (barcodes are decoded from this element) */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Background image + status message if camera inactive */}
                {!cameraActive && (
                  <img
                    src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1000&auto=format&fit=crop&q=80"
                    alt="Camera unavailable"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
                  />
                )}
                {!cameraActive && (
                  <div className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2 px-6 text-center">
                    <span className="text-xs text-white/90 max-w-sm">
                      {cameraStatus === 'starting'
                        ? 'Requesting camera access...'
                        : CAMERA_STATUS_MESSAGES[cameraStatus]}
                    </span>
                    {(cameraStatus === 'denied' || cameraStatus === 'error' || cameraStatus === 'no-camera') && (
                      <button
                        onClick={() => setCameraRetryKey((k) => k + 1)}
                        className="h-8 px-4 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white font-mono-tech text-xs font-bold transition-all"
                      >
                        Retry Camera
                      </button>
                    )}
                  </div>
                )}

                {/* Vignette Shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/60 pointer-events-none"></div>

                {/* Targeting Box / Reticles */}
                <div className="relative w-64 sm:w-72 h-40 sm:h-44 z-10 flex items-center justify-center pointer-events-none">
                  {/* 4 Corner Reticles with vibrant IngreGuide blue / cyan */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#38bdf8] rounded-tl-lg shadow-[0_0_12px_#38bdf8]"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#38bdf8] rounded-tr-lg shadow-[0_0_12px_#38bdf8]"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#38bdf8] rounded-bl-lg shadow-[0_0_12px_#38bdf8]"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#38bdf8] rounded-br-lg shadow-[0_0_12px_#38bdf8]"></div>

                  {/* Animated Laser Scan Line */}
                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent shadow-[0_0_14px_4px_#38bdf8] animate-laser"></div>

                  {/* Center Crosshair */}
                  <div className="opacity-40 flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl">center_focus_strong</span>
                    <span className="font-mono-tech text-[10px] text-white/90 uppercase tracking-widest mt-1">
                      {scanMode === 'barcode' ? 'Center Barcode' : 'Align Nutrition Label'}
                    </span>
                  </div>

                  {/* Target Acquired Tag (shown briefly after a successful decode) */}
                  {targetAcquired && (
                    <div className="absolute bottom-2 right-2 bg-[#0f172a]/90 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping"></span>
                      <span className="font-mono-tech text-[10px] text-[#e0f2fe] uppercase font-bold">Target Acquired</span>
                    </div>
                  )}
                </div>

                {/* Floating Hint Toast */}
                <div className="absolute top-4 bg-white/90 backdrop-blur-md text-[#0f172a] px-3.5 py-1 rounded-full shadow-md text-xs font-medium flex items-center gap-1.5 pointer-events-none">
                  <span className="material-symbols-outlined text-[#5379EE] text-sm">lightbulb</span>
                  <span>{toastHint}</span>
                </div>
              </div>

              {/* Viewfinder Controls Bar */}
              <div className="bg-white p-4 flex flex-wrap items-center justify-between gap-4">
                {/* Left: Device Selection & Resolution */}
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <div className="relative flex-1">
                    <select
                      className="w-full h-9 pl-3 pr-8 rounded-full bg-[#f1f5f9] text-[#0f172a] text-xs font-semibold appearance-none outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                      value={selectedDeviceId ?? ''}
                      disabled={videoDevices.length === 0}
                      onChange={(e) => setSelectedDeviceId(e.target.value || undefined)}
                    >
                      <option value="">Default Camera (rear if available)</option>
                      {videoDevices.map((device, i) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${i + 1}`}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-2 text-[#64748b] pointer-events-none text-base">
                      expand_more
                    </span>
                  </div>
                  {resolution && (
                    <span className="px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#0f172a] font-mono-tech text-xs font-bold">
                      {resolution}
                    </span>
                  )}
                </div>

                {/* Right: Zoom & Flash Controls & Snap */}
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center bg-[#f1f5f9] p-0.5 rounded-full ${zoomRange ? '' : 'opacity-50'}`}
                    title={zoomRange ? 'Camera zoom' : 'Zoom is not supported by this camera'}
                  >
                    {(['1x', '2x', '3x'] as const).map((z) => (
                      <button
                        key={z}
                        disabled={!zoomRange}
                        onClick={() => handleZoom(z)}
                        className={`px-2.5 py-1 rounded-full font-mono-tech text-[11px] font-bold transition-all disabled:cursor-not-allowed ${
                          zoomLevel === z ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
                        }`}
                      >
                        {z}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleToggleTorch}
                    disabled={!torchSupported}
                    title={torchSupported ? 'Toggle flashlight' : 'Flashlight is not supported by this camera'}
                    className={`h-9 px-3 rounded-full font-mono-tech text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      torchOn ? 'bg-[#5379EE] text-white' : 'bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">flash_on</span>
                    <span className="hidden sm:inline">Fill Light</span>
                  </button>

                  <button
                    onClick={handleCaptureFrame}
                    disabled={!cameraActive}
                    className="h-9 w-9 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white flex items-center justify-center shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Scan current frame"
                  >
                    <span className="material-symbols-outlined text-lg">camera</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs hover:border-[#5379EE] transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#5379EE] shrink-0 group-hover:scale-105 transition-transform">
                  <span className={`material-symbols-outlined text-3xl ${isDecodingFile ? 'animate-spin' : ''}`}>
                    {isDecodingFile ? 'progress_activity' : 'cloud_upload'}
                  </span>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-bold text-sm text-[#0f172a]">Upload Packaging Imagery</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#2563EB] font-mono-tech text-[10px] font-bold">
                      OCR + EAN
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1">
                    Choose a clear, close-up photo of the package barcode (PNG, JPG, or WEBP) to decode it.
                  </p>
                </div>
                <button
                  type="button"
                  className="h-10 px-5 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white font-mono-tech text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0"
                >
                  <span className="material-symbols-outlined text-base">folder_open</span>
                  <span>Browse Files</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap items-center justify-between text-[#64748b] text-[11px] gap-2">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#5379EE]">check_circle</span>
                  Auto-deskews curved cans &amp; pouches
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#5379EE]">check_circle</span>
                  High dynamic range shadow rejection
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Manual Code Lookup, Simulator & Live Feed (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Emergency Allergen Shield Active Alert Banner */}
            <div className="bg-[#fff1f2] rounded-3xl p-5 border border-[#ffdad6] relative overflow-hidden flex items-start gap-3.5 shadow-xs">
              <div className="w-1.5 bg-[#e11d48] absolute left-0 top-0 bottom-0"></div>
              <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#e11d48] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">shield_with_heart</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#e11d48]">Emergency Allergen Shield Active</h2>
                  <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-ping"></span>
                </div>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                  Scanning will immediately halt and trigger audible/visual warnings if active profile allergens are
                  detected ({activeAllergenCount} active targets).
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#e11d48] font-mono-tech text-[10px] font-bold">
                    STRICT PROFILE
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#64748b] font-mono-tech text-[10px] font-bold">
                    Audio Sirens On
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Code Lookup Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0f172a]">Manual Code Lookup</h3>
                  <p className="text-xs text-[#64748b]">Input worn or damaged product digits directly</p>
                </div>
                <span className="material-symbols-outlined text-[#64748b]">dialpad</span>
              </div>

              {/* Input Group */}
              <div className="space-y-1">
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#94a3b8] text-base">numbers</span>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                    placeholder="Enter 12-digit UPC or 13-digit EAN"
                    className="w-full h-11 pl-10 pr-24 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#0f172a] outline-none focus:bg-white focus:ring-2 focus:ring-[#5379EE]/20 focus:border-[#5379EE] transition-all"
                  />
                  <button
                    onClick={() => handleManualSearch()}
                    className="absolute right-1.5 h-8 px-4 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white font-mono-tech text-xs font-bold transition-all"
                  >
                    Search
                  </button>
                </div>
                {manualError && <p className="text-[11px] text-[#e11d48] pl-3">{manualError}</p>}
              </div>

              {/* Recent Lookups Pills */}
              <div>
                <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider block mb-2 font-bold">
                  Recent Lookups
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      setManualCode('016000275270');
                      handleManualSearch('016000275270');
                    }}
                    className="px-2.5 py-1 rounded-full bg-[#f8fafc] hover:bg-[#EEF2FF] text-[#0f172a] text-[11px] font-medium border border-slate-200/60 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-[#5379EE]">history</span>
                    <span>016000275270 (Granola Bar)</span>
                  </button>
                  <button
                    onClick={() => {
                      setManualCode('894700010045');
                      handleManualSearch('894700010045');
                    }}
                    className="px-2.5 py-1 rounded-full bg-[#f8fafc] hover:bg-[#EEF2FF] text-[#0f172a] text-[11px] font-medium border border-slate-200/60 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-[#5379EE]">history</span>
                    <span>894700010045 (Chobani Greek)</span>
                  </button>
                  <button
                    onClick={() => {
                      setManualCode('051500255162');
                      handleManualSearch('051500255162');
                    }}
                    className="px-2.5 py-1 rounded-full bg-[#f8fafc] hover:bg-[#EEF2FF] text-[#0f172a] text-[11px] font-medium border border-slate-200/60 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-[#5379EE]">history</span>
                    <span>051500255162 (Jif Peanut Butter)</span>
                  </button>
                  <button
                    onClick={() => {
                      setManualCode('049000028904');
                      handleManualSearch('049000028904');
                    }}
                    className="px-2.5 py-1 rounded-full bg-[#f8fafc] hover:bg-[#EEF2FF] text-[#0f172a] text-[11px] font-medium border border-slate-200/60 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-[#5379EE]">history</span>
                    <span>049000028904 (Coca-Cola)</span>
                  </button>
                </div>
              </div>

              {/* Simulator Test Suite */}
              <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-[10px] text-[#0f172a] uppercase font-bold tracking-wider">
                    Simulator Test Suite
                  </span>
                  <span className="font-mono-tech text-[10px] text-[#5379EE]">Click to Inject</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleScanProduct(products[6] || products[0])}
                    className="p-2.5 rounded-xl bg-white hover:bg-[#fff1f2] border border-slate-200/60 text-left transition-colors flex flex-col"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono-tech text-xs font-bold text-[#e11d48]">Peanut Honey Oat</span>
                      <span className="material-symbols-outlined text-[#e11d48] text-sm">warning</span>
                    </div>
                    <span className="text-[10px] text-[#64748b] mt-0.5">Triggers Allergen Shield</span>
                  </button>

                  <button
                    onClick={() => handleScanProduct(products[7] || products[1])}
                    className="p-2.5 rounded-xl bg-white hover:bg-[#EEF2FF] border border-slate-200/60 text-left transition-colors flex flex-col"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono-tech text-xs font-bold text-[#2563EB]">Pure Matcha</span>
                      <span className="material-symbols-outlined text-[#5379EE] text-sm">check_circle</span>
                    </div>
                    <span className="text-[10px] text-[#64748b] mt-0.5">100% Allergen Safe</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Real-time Scan Feed */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#0f172a]">Live Scan Feed</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 font-mono-tech text-[10px] text-[#64748b]">
                    {scanLogs.length} logs
                  </span>
                </div>
                <button
                  onClick={clearScanLogs}
                  className="font-mono-tech text-[10px] uppercase font-bold text-[#64748b] hover:text-[#0f172a]"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-2">
                {scanLogs.slice(0, 4).map((log) => (
                  <div
                    key={log.id}
                    onClick={() => {
                      const match = products.find((p) => p.barcode === log.barcode);
                      if (match) {
                        setSelectedProductId(match.id);
                        setActiveTab('product-analysis');
                      }
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                      log.verdict === 'HAZARD'
                        ? 'bg-[#fff1f2] hover:bg-[#ffe4e6]'
                        : log.verdict === 'WARNING'
                        ? 'bg-[#fffbeb] hover:bg-[#fef3c7]'
                        : 'bg-[#f8fafc] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          log.verdict === 'HAZARD'
                            ? 'bg-[#ffdad6] text-[#e11d48]'
                            : log.verdict === 'WARNING'
                            ? 'bg-[#fef3c7] text-[#d97706]'
                            : 'bg-[#EEF2FF] text-[#2563EB]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {log.verdict === 'HAZARD' ? 'report' : log.verdict === 'WARNING' ? 'warning' : 'check'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#0f172a] truncate block">{log.productName}</span>
                        <span className="text-[10px] text-[#64748b] font-mono-tech block">
                          UPC {log.barcode} • {log.timestamp}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        log.verdict === 'HAZARD'
                          ? 'bg-[#e11d48] text-white'
                          : log.verdict === 'WARNING'
                          ? 'bg-[#d97706] text-white'
                          : 'bg-[#EEF2FF] text-[#2563EB]'
                      }`}
                    >
                      {log.verdict}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-[#64748b]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#5379EE]">sync</span>
                  <span>Syncing to Dietary History</span>
                </span>
                <span className="text-[#5379EE] font-bold">Cloud Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Immediate Detection Modal Result */}
      {detectionModalProduct && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6 flex flex-col gap-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    detectionModalProduct.allergensDetected.length > 0
                      ? 'bg-[#fff1f2] text-[#e11d48]'
                      : 'bg-[#EEF2FF] text-[#2563EB]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {detectionModalProduct.allergensDetected.length > 0 ? 'warning' : 'verified'}
                  </span>
                </div>
                <div>
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase">Detection Verdict</span>
                  <h3 className="text-sm font-bold text-[#0f172a] truncate max-w-[200px]">
                    {detectionModalProduct.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDetectionModalProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#64748b] hover:text-[#0f172a]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div
              className={`p-3.5 rounded-2xl flex items-center gap-3 ${
                detectionModalProduct.allergensDetected.length > 0
                  ? 'bg-[#fff1f2] text-[#e11d48]'
                  : 'bg-[#EEF2FF] text-[#2563EB]'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">
                {detectionModalProduct.allergensDetected.length > 0 ? 'report' : 'check_circle'}
              </span>
              <div className="text-xs">
                <span className="font-bold block">
                  {detectionModalProduct.allergensDetected.length > 0
                    ? 'Allergen Conflict Detected'
                    : '100% Free of Target Allergens'}
                </span>
                <span>
                  {detectionModalProduct.allergensDetected.length > 0
                    ? `Contains: ${detectionModalProduct.allergensDetected.join(', ')}`
                    : 'Zero peanuts, gluten, dairy, or soy identified.'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-[#64748b]">
              <div className="flex justify-between">
                <span>Barcode Scanned:</span>
                <span className="font-mono-tech font-bold text-[#0f172a]">{detectionModalProduct.barcode}</span>
              </div>
              <div className="flex justify-between">
                <span>Nutri-Score Rating:</span>
                <span className="font-mono-tech font-bold text-[#2563EB]">Grade {detectionModalProduct.nutriScore}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Scale:</span>
                <span className="font-mono-tech text-[#0f172a]">NOVA Group {detectionModalProduct.novaGroup}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedProductId(detectionModalProduct.id);
                  setActiveTab('product-analysis');
                  setDetectionModalProduct(null);
                }}
                className="flex-1 h-11 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                <span>Open Ingredient Deep-Dive</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button
                onClick={() => setDetectionModalProduct(null)}
                className="px-5 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-mono-tech text-xs font-bold transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barcode decoded but not in the product database */}
      {notFoundCode && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6 flex flex-col gap-4 border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#fffbeb] text-[#d97706]">
                  <span className="material-symbols-outlined text-lg">search_off</span>
                </div>
                <div>
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase">Barcode Detected</span>
                  <h3 className="text-sm font-bold text-[#0f172a]">Product Not in Database</h3>
                </div>
              </div>
              <button
                onClick={() => setNotFoundCode(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#64748b] hover:text-[#0f172a]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fffbeb] text-[#92400e] text-xs leading-relaxed">
              We read the barcode, but no product with this code exists in the IngreGuide database yet, so its
              ingredients and allergens can't be checked. Read the package label carefully before eating.
            </div>

            <div className="flex justify-between text-xs text-[#64748b]">
              <span>Barcode Scanned:</span>
              <span className="font-mono-tech font-bold text-[#0f172a]">{notFoundCode}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setNotFoundCode(null)}
                className="flex-1 h-11 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">barcode_scanner</span>
                <span>Scan Another</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
