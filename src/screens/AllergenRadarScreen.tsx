import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { sensoryEngine } from '../utils/soundEffects';

export const AllergenRadarScreen: React.FC = () => {
  const {
    userProfile,
    toggleAllergen,
    addToWatchlist,
    removeFromWatchlist,
    toggleSentrySetting,
    updateUserProfile,
  } = useApp();

  const [customInput, setCustomInput] = useState('');
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleAddWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      addToWatchlist(customInput.trim());
      setCustomInput('');
    }
  };

  const handleSaveAndSync = async () => {
    setSyncFeedback('Synchronizing with Cloud Health Vault...');
    try {
      await updateUserProfile({
        lastSynced: 'Just now',
      });
      setSyncFeedback('Saved & Synchronized to Cloud!');
    } catch {
      setSyncFeedback('Saved locally (Offline Mode)');
    }
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  const activeAllergens = userProfile.activeAllergens;
  const activeCount = activeAllergens.filter((a) => a.active).length;

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 font-mono-tech text-xs text-[#64748b]">
            <span className="hover:text-[#0f172a]">Settings</span>
            <span>&gt;</span>
            <span className="hover:text-[#0f172a]">Safety Profiles</span>
            <span>&gt;</span>
            <span className="text-[#65a30d] font-bold">Allergen Radar &amp; Safety Sentry</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfccb] text-[#65a30d] font-mono-tech text-xs uppercase font-bold tracking-wider shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#84cc16] animate-pulse"></span>
              Live Engine v4.2 • Active Sentry
            </span>
            <span className="text-xs text-[#64748b] hidden sm:inline">
              Profile: <strong className="text-[#0f172a]">{userProfile.displayName}</strong>
            </span>
          </div>
        </div>

        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-1">
            <div className="inline-flex items-center gap-1.5 font-mono-tech text-xs text-[#65a30d] uppercase font-bold tracking-widest">
              <span className="material-symbols-outlined text-base">radar</span>
              <span>Bespoke Bio-Sensory Shield</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] tracking-tight">
              Personal Allergen Radar &amp; Sensory Alert Engine
            </h1>
            <p className="text-xs sm:text-sm text-[#565e74] leading-relaxed">
              Configure physiological sensitivities, cross-reactivity threshold tiers, and real-time sensory alarms for
              zero-hesitation supermarket scanning.
            </p>
          </div>

          {/* Quick Summary Stats Card */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[#f7fee7] flex items-center justify-center text-[#65a30d]">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <div className="text-base font-bold text-[#0f172a]">{activeCount} Active Targets</div>
              <div className="text-xs text-[#64748b]">1,248 Derivations Monitored</div>
            </div>
          </div>
        </div>

        {/* Main Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Primary Column (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Section 1: Active Allergen Radar */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#65a30d] text-lg">shield</span>
                    <h2 className="text-base font-bold text-[#0f172a]">Active Allergen Radar</h2>
                  </div>
                  <p className="text-xs text-[#64748b]">Click any chip to toggle monitoring state and calibrate clinical tolerance.</p>
                </div>

                {/* Severity Legend */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fff1f2] text-[#e11d48] font-mono-tech text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]"></span> Anaphylactic
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fffbeb] text-[#d97706] font-mono-tech text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span> Intolerance
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ecfccb] text-[#65a30d] font-mono-tech text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16]"></span> Sensitivity
                  </span>
                </div>
              </div>

              {/* Allergen Interactive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeAllergens.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleAllergen(item.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                      item.active
                        ? item.tier === 1
                          ? 'bg-[#fff1f2] border-[#ffdad6] shadow-xs'
                          : item.tier === 2
                          ? 'bg-[#fffbeb] border-[#fde68a] shadow-xs'
                          : 'bg-[#f7fee7] border-[#d9f99d] shadow-xs'
                        : 'bg-[#f8fafc] border-slate-100 hover:bg-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          item.active
                            ? item.tier === 1
                              ? 'bg-[#ffdad6] text-[#e11d48]'
                              : item.tier === 2
                              ? 'bg-[#fef3c7] text-[#d97706]'
                              : 'bg-[#ecfccb] text-[#65a30d]'
                            : 'bg-slate-200 text-[#64748b]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{item.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0f172a] truncate">{item.name}</div>
                        <div
                          className={`font-mono-tech text-[10px] font-semibold uppercase ${
                            item.tier === 1
                              ? 'text-[#e11d48]'
                              : item.tier === 2
                              ? 'text-[#d97706]'
                              : 'text-[#65a30d]'
                          }`}
                        >
                          Tier {item.tier} • {item.tierLabel}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        item.active
                          ? item.tier === 1
                            ? 'bg-[#e11d48] text-white'
                            : item.tier === 2
                            ? 'bg-[#d97706] text-white'
                            : 'bg-[#65a30d] text-white'
                          : 'bg-slate-200 text-[#64748b]'
                      }`}
                    >
                      {item.active ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Custom Watchlist & E-Numbers */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#65a30d] text-lg">filter_alt</span>
                <h2 className="text-base font-bold text-[#0f172a]">Chemical &amp; E-Number Watchlist</h2>
              </div>
              <p className="text-xs text-[#64748b]">
                Block artificial food colorants, emulsifiers, synthetic preservatives, and non-caloric sweeteners across
                ingredient statements.
              </p>

              {/* Input Bar */}
              <form onSubmit={handleAddWatchlist} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-base">
                    search
                  </span>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g. Red Dye #40, Titanium Dioxide (E171), MSG (E621)..."
                    className="w-full h-11 pl-10 pr-4 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#0f172a] outline-none focus:bg-white focus:ring-2 focus:ring-[#84cc16]/20 focus:border-[#84cc16] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-6 rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white font-mono-tech text-xs font-bold transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Add to Watchlist</span>
                </button>
              </form>

              {/* Watchlist Badges Flow */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {userProfile.watchlist.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f1f5f9] text-[#1e293b] font-mono-tech text-xs font-medium border border-slate-200/50"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#84cc16]"></span>
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeFromWatchlist(item)}
                      className="text-[#94a3b8] hover:text-[#e11d48] transition-colors ml-1"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </span>
                ))}
              </div>
            </section>

            {/* Section 3: Simulated Live Alert Preview */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#e11d48] text-lg">sensors</span>
                    <h2 className="text-base font-bold text-[#0f172a]">Simulated Real-Time Alert Preview</h2>
                  </div>
                  <p className="text-xs text-[#64748b]">How your handheld scanner visualizes immediate hazard detections.</p>
                </div>
                <span className="font-mono-tech text-[10px] px-2.5 py-1 bg-slate-100 rounded-full text-[#64748b] uppercase font-bold">
                  Scan Sandbox
                </span>
              </div>

              {/* Alert Banner Box */}
              <div className="rounded-2xl bg-[#fff1f2] p-5 border border-[#ffdad6] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#e11d48]"></div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#e11d48] flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
                      <span className="material-symbols-outlined text-xl">error</span>
                    </div>
                    <div>
                      <div className="font-mono-tech text-[10px] uppercase font-bold text-[#e11d48] tracking-wider mb-0.5">
                        CRITICAL MATCH • INSTANT HAZARD LOCKOUT
                      </div>
                      <h3 className="text-sm font-bold text-[#0f172a]">“Golden Harvest Crispy Granola”</h3>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Contains <span className="font-bold text-[#e11d48] underline">Peanut Flour</span> &amp;{' '}
                        <span className="font-bold text-[#d97706]">Malted Wheat Extract (Gluten)</span>. Immediate
                        physiological risk flag for <strong>{userProfile.displayName}</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center gap-1 shrink-0 self-end sm:self-center">
                    <span className="px-3 py-1 rounded-full bg-[#e11d48] text-white font-mono-tech text-[10px] font-bold uppercase tracking-wider">
                      DO NOT INGEST
                    </span>
                    <span className="font-mono-tech text-[10px] text-[#64748b]">Match Confidence: 99.8%</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right / Tactical Column (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Sensory Feedback Matrix */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#65a30d] text-lg">vibration</span>
                <h2 className="text-base font-bold text-[#0f172a]">Scan Sentry Feedback</h2>
              </div>
              <p className="text-xs text-[#64748b]">Hardware triggers designed for high-distraction, crowded grocery aisles.</p>

              {/* Toggles */}
              <div className="space-y-3">
                {/* Toggle 1: Push Modal Takeover */}
                <div className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#e11d48] text-lg mt-0.5">fullscreen</span>
                    <div>
                      <div className="text-xs font-bold text-[#0f172a]">Push Screen Takeover</div>
                      <div className="text-[11px] text-[#64748b] leading-relaxed">
                        Forceful red modal lock preventing accidental dismissals upon severe allergen detection.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSentrySetting('pushTakeover')}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                      userProfile.sentrySettings.pushTakeover ? 'bg-[#84cc16]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        userProfile.sentrySettings.pushTakeover ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Toggle 2: Audible Hazard Tone */}
                <div className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#d97706] text-lg mt-0.5">volume_up</span>
                    <div>
                      <div className="text-xs font-bold text-[#0f172a]">Audible Hazard Piercing Tone</div>
                      <div className="text-[11px] text-[#64748b] leading-relaxed">
                        Distinctive high-frequency dual-beep audible over supermarket background noise.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toggleSentrySetting('audibleTone');
                      if (!userProfile.sentrySettings.audibleTone) sensoryEngine.playHazardTone();
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                      userProfile.sentrySettings.audibleTone ? 'bg-[#84cc16]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        userProfile.sentrySettings.audibleTone ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Toggle 3: Haptic Pulse Sequence */}
                <div className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#65a30d] text-lg mt-0.5">phonelink_ring</span>
                    <div>
                      <div className="text-xs font-bold text-[#0f172a]">Triple Haptic Pulse Sequence</div>
                      <div className="text-[11px] text-[#64748b] leading-relaxed">
                        Rhythmic vibration pattern triggered through smartphone &amp; connected smartwatch.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toggleSentrySetting('hapticPulse');
                      if (!userProfile.sentrySettings.hapticPulse) sensoryEngine.triggerHaptic();
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                      userProfile.sentrySettings.hapticPulse ? 'bg-[#84cc16]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        userProfile.sentrySettings.hapticPulse ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Toggle 4: Caregiver Emergency Dispatch */}
                <div className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#64748b] text-lg mt-0.5">sms</span>
                    <div>
                      <div className="text-xs font-bold text-[#0f172a]">Caregiver Emergency Dispatch</div>
                      <div className="text-[11px] text-[#64748b] leading-relaxed">
                        Send automated GPS coordinates and scanned product data if scanned while shopping solo.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSentrySetting('caregiverDispatch')}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                      userProfile.sentrySettings.caregiverDispatch ? 'bg-[#84cc16]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        userProfile.sentrySettings.caregiverDispatch ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            </section>

            {/* Regulatory Standards Compliance Badge */}
            <section className="bg-gradient-to-br from-[#f7fee7] to-[#ecfccb] rounded-3xl p-6 border border-[#d9f99d] space-y-3 shadow-xs">
              <div className="flex items-center gap-1.5 font-mono-tech text-xs text-[#65a30d] font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Clinical Data Integrity</span>
              </div>
              <h3 className="text-sm font-bold text-[#0f172a]">Regulatory Standards Synchronized</h3>
              <p className="text-xs text-[#565e74] leading-relaxed">
                NutriScan algorithms continuously ingest and validate against the <strong>FDA Food Allergen Labeling &amp; Consumer Protection Act (FALCPA)</strong> and <strong>EU Regulation 1169/2011 (FIC)</strong>, monitoring cross-contamination declarations and over 1,200 hidden nomenclature derivatives.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl flex items-center gap-1.5 shadow-xs">
                  <span className="material-symbols-outlined text-[#65a30d] text-base">check_circle</span>
                  <span className="font-semibold text-[11px]">FDA 9 Allergens</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl flex items-center gap-1.5 shadow-xs">
                  <span className="material-symbols-outlined text-[#65a30d] text-base">check_circle</span>
                  <span className="font-semibold text-[11px]">EU 14 Mandatory</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl flex items-center gap-1.5 shadow-xs">
                  <span className="material-symbols-outlined text-[#65a30d] text-base">check_circle</span>
                  <span className="font-semibold text-[11px]">Advisory (PAL)</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl flex items-center gap-1.5 shadow-xs">
                  <span className="material-symbols-outlined text-[#65a30d] text-base">check_circle</span>
                  <span className="font-semibold text-[11px]">Codex Rules</span>
                </div>
              </div>
            </section>

            {/* Save Profile Master Action Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono-tech text-xs text-[#64748b]">Cloud Sync Status:</span>
                <span className="inline-flex items-center gap-1 font-mono-tech text-xs text-[#65a30d] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#84cc16] animate-pulse"></span>
                  All Synced to Mobile App
                </span>
              </div>

              <button
                type="button"
                onClick={handleSaveAndSync}
                className="w-full h-12 rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white font-mono-tech text-xs font-bold transition-all shadow-[0_4px_16px_rgba(132,204,22,0.25)] flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg">cloud_sync</span>
                <span>{syncFeedback || 'Save & Synchronize Allergen Profile'}</span>
              </button>

              <p className="text-[11px] text-center text-[#64748b]">
                Last modified {userProfile.lastSynced || '14 minutes ago'} • Encrypted with zero-knowledge health vaults
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
