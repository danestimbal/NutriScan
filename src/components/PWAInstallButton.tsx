import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, suppress
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white font-mono-tech text-xs font-bold transition-all shadow-sm active:scale-95 ${className}`}
      >
        <span className="material-symbols-outlined text-sm">install_mobile</span>
        <span>Install PWA</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecfccb] text-[#65a30d] hover:bg-[#d9f99d] font-mono-tech text-xs font-bold transition-colors ${className}`}
        >
          <span className="material-symbols-outlined text-sm">add_to_home_screen</span>
          <span>Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#ecfccb] flex items-center justify-center text-[#65a30d] mb-3">
                <span className="material-symbols-outlined text-2xl">install_mobile</span>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a]">Install NutriScan on iPhone / iPad</h3>
              <p className="mt-2 text-sm text-[#64748b] leading-relaxed text-left">
                1. Tap the <strong>Share</strong> button <span className="material-symbols-outlined text-base align-middle text-[#84cc16]">ios_share</span> in Safari's bottom toolbar.<br />
                2. Scroll down the menu and tap <strong>Add to Home Screen</strong> <span className="material-symbols-outlined text-base align-middle text-[#84cc16]">add_box</span>.<br />
                3. Tap <strong>Add</strong> in the top right corner.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-full bg-[#84cc16] py-2.5 text-sm font-bold text-[#0f172a] hover:bg-[#65a30d] hover:text-white transition-all shadow-sm"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop install prompt button for demonstration
  return (
    <button
      onClick={() => {
        alert("To install NutriScan: on Chrome/Edge, click the install icon in your address bar; on mobile, select 'Add to Home screen' from your browser menu.");
      }}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ecfccb] hover:bg-[#d9f99d] text-[#65a30d] font-mono-tech text-xs font-bold transition-colors ${className}`}
      title="Install PWA on device"
    >
      <span className="material-symbols-outlined text-sm">install_mobile</span>
      <span className="hidden sm:inline">Install App</span>
    </button>
  );
};
