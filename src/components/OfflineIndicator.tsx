import React from 'react';
import { useOnlineStatus } from '../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-[#d97706] px-4 py-2 text-xs font-semibold text-white shadow-xl animate-bounce">
      <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
      <span>Offline Mode — Cached food data active</span>
    </div>
  );
};
