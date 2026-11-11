import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{
  className?: string;
  variant?: 'header' | 'menu';
}> = ({ className = '', variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, suppress
  if (isInstalled) {
    return null;
  }

  const menuItemClasses = `w-full text-left px-3 py-2 text-xs font-medium text-[#1e293b] hover:bg-[#eef2ff] rounded-xl flex items-center gap-2 cursor-pointer ${className}`;

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'menu') {
      return (
        <button onClick={install} className={menuItemClasses}>
          <span className="material-symbols-outlined text-sm text-[#5379EE]">install_mobile</span>
          <span>Install App (PWA)</span>
        </button>
      );
    }
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#5379EE] hover:bg-white/90 font-mono-tech text-xs font-bold transition-all shadow-sm active:scale-95 ${className}`}
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
        {variant === 'menu' ? (
          <button onClick={() => setShowIOSGuide(true)} className={menuItemClasses}>
            <span className="material-symbols-outlined text-sm text-[#5379EE]">add_to_home_screen</span>
            <span>Install App (PWA)</span>
          </button>
        ) : (
          <button
            onClick={() => setShowIOSGuide(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 border border-white/30 font-mono-tech text-xs font-bold transition-colors ${className}`}
          >
            <span className="material-symbols-outlined text-sm">add_to_home_screen</span>
            <span>Add to Home Screen</span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#e0e7ff] flex items-center justify-center text-[#5379EE] mb-3">
                <span className="material-symbols-outlined text-2xl">install_mobile</span>
              </div>
              <h3 className="text-lg font-bold text-[#0f172a]">Install IngreGuide on iPhone / iPad</h3>
              <p className="mt-2 text-sm text-[#64748b] leading-relaxed text-left">
                1. Tap the <strong>Share</strong> button <span className="material-symbols-outlined text-base align-middle text-[#5379EE]">ios_share</span> in Safari's bottom toolbar.<br />
                2. Scroll down the menu and tap <strong>Add to Home Screen</strong> <span className="material-symbols-outlined text-base align-middle text-[#5379EE]">add_box</span>.<br />
                3. Tap <strong>Add</strong> in the top right corner.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-full bg-[#5379EE] py-2.5 text-sm font-bold text-white hover:bg-[#4368DD] transition-all shadow-sm"
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
  const handleFallbackInstall = () => {
    alert(
      "To install IngreGuide: on Chrome/Edge, click the install icon in your address bar; on mobile, select 'Add to Home screen' from your browser menu."
    );
  };

  if (variant === 'menu') {
    return (
      <button onClick={handleFallbackInstall} className={menuItemClasses} title="Install PWA on device">
        <span className="material-symbols-outlined text-sm text-[#5379EE]">install_mobile</span>
        <span>Install App (PWA)</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleFallbackInstall}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 font-mono-tech text-xs font-bold transition-colors ${className}`}
      title="Install PWA on device"
    >
      <span className="material-symbols-outlined text-sm">install_mobile</span>
      <span className="hidden sm:inline">Install App</span>
    </button>
  );
};
