import React from 'react';
import { useApp } from '../context/AppContext';

export const PushTakeoverModal: React.FC = () => {
  const { hazardAlertProduct, setHazardAlertProduct, userProfile, setActiveTab, setSelectedProductId } = useApp();

  if (!hazardAlertProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border-2 border-[#e11d48] overflow-hidden flex flex-col">
        {/* Top Severe Siren Bar */}
        <div className="bg-[#e11d48] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl animate-bounce">warning</span>
            <div>
              <span className="font-mono-tech text-[10px] uppercase font-bold tracking-widest text-[#ffdad6] block">
                CRITICAL BIO-SHIELD LOCKOUT
              </span>
              <h2 className="text-base font-bold tracking-tight">ALERT: RADAR TRIGGERED!</h2>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono-tech text-[10px] font-bold">
            DO NOT INGEST
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-4">
          {/* Product Banner */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#fff1f2] border border-[#ffdad6]">
            <img
              src={hazardAlertProduct.image}
              alt={hazardAlertProduct.name}
              className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-[#e11d48] uppercase tracking-wider block">
                Severe Clinical Risk for {userProfile.displayName}
              </span>
              <h3 className="text-sm font-bold text-[#0f172a] truncate">{hazardAlertProduct.name}</h3>
              <p className="text-xs text-[#64748b] truncate">{hazardAlertProduct.brand}</p>
            </div>
          </div>

          {/* Trigger Details */}
          <div className="space-y-2">
            <p className="text-xs text-[#1e293b] leading-relaxed">
              This product contains active concentrations of:{' '}
              <strong className="text-[#e11d48] font-bold">
                {hazardAlertProduct.allergensDetected.join(', ')}
              </strong>
              .
            </p>
            <div className="p-2.5 rounded-xl bg-amber-50 text-[11px] text-[#b45309] flex items-start gap-2">
              <span className="material-symbols-outlined text-sm mt-0.5 shrink-0">info</span>
              <span>{hazardAlertProduct.facilityWarnings[0] || 'Cross-contact possible in shared manufacturing facility.'}</span>
            </div>
          </div>

          {/* Recommended Safe Swap Teaser */}
          {hazardAlertProduct.safeAlternative && (
            <div className="p-3.5 rounded-2xl bg-[#f7fee7] border border-[#d9f99d] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={hazardAlertProduct.safeAlternative.image}
                  alt={hazardAlertProduct.safeAlternative.name}
                  className="w-10 h-10 rounded-lg object-cover bg-white shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#65a30d] uppercase block">Safe Swap Ready</span>
                  <p className="text-xs font-bold text-[#0f172a] truncate">
                    {hazardAlertProduct.safeAlternative.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedProductId(hazardAlertProduct.id);
                  setActiveTab('product-analysis');
                  setHazardAlertProduct(null);
                }}
                className="px-3 py-1.5 rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white font-mono-tech text-[11px] font-bold transition-all shrink-0"
              >
                Switch
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedProductId(hazardAlertProduct.id);
                setActiveTab('product-analysis');
                setHazardAlertProduct(null);
              }}
              className="w-full py-2.5 rounded-full bg-[#e11d48] hover:bg-[#be0037] text-white font-sans text-xs font-bold transition-all shadow-sm"
            >
              Inspect Hazards
            </button>
            <button
              onClick={() => setHazardAlertProduct(null)}
              className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-sans text-xs font-bold transition-colors"
            >
              Acknowledge &amp; Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
