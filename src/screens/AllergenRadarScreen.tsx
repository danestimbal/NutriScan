import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { sensoryEngine } from '../utils/soundEffects';
import { ALLERGEN_DEFS, MONITORED_TERM_COUNT, tierLabelFor } from '../utils/allergens';

export const AllergenRadarScreen: React.FC = () => {
  const {
    userProfile,
    toggleAllergen,
    addToWatchlist,
    removeFromWatchlist,
    toggleSentrySetting,
    updateUserProfile,
    scanLogs,
    isLoggedIn,
  } = useApp();

  /** Most recent scan that raised a warning or hazard for this user (none until one happens). */
  const latestAlert = scanLogs.find((l) => l.verdict === 'HAZARD' || l.verdict === 'WARNING');

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
    setSyncFeedback('Saving…');
    try {
      await updateUserProfile({ lastSynced: new Date().toLocaleString() });
      setSyncFeedback(isLoggedIn ? 'Saved to your account' : 'Saved on this device');
    } catch {
      setSyncFeedback('Saved on this device only');
    }
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  const setAllergenTier = (id: string, tier: 1 | 2 | 3) => {
    updateUserProfile({
      activeAllergens: userProfile.activeAllergens.map((item) =>
        item.id === id ? { ...item, tier, tierLabel: tierLabelFor(tier) } : item
      ),
    });
  };

  const activeAllergens = userProfile.activeAllergens;
  const activeCount = activeAllergens.filter((a) => a.active).length;

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <span className="text-xs text-[#5379EE] font-bold">Allergen Radar</span>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#64748b] hidden sm:inline">
              Profile: <strong className="text-[#0f172a]">{userProfile.displayName || userProfile.email?.split('@')[0] || 'Guest'}</strong>
            </span>
          </div>
        </div>

        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] tracking-tight">
              Your Allergen Radar &amp; Alerts
            </h1>
            <p className="text-xs sm:text-sm text-[#565e74] leading-relaxed">
              Switch on the allergens you need to avoid, set how serious each one is for you, and choose how the app
              warns you when a scanned product contains them.
            </p>
          </div>

          {/* Quick Summary Stats Card */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#5379EE]">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <div className="text-base font-bold text-[#0f172a]">
                {activeCount} {activeCount === 1 ? 'allergen' : 'allergens'} switched on
              </div>
              <div className="text-xs text-[#64748b]">
                {MONITORED_TERM_COUNT} ingredient names recognised across {ALLERGEN_DEFS.length} allergens
              </div>
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
                    <span className="material-symbols-outlined text-[#5379EE] text-lg">shield</span>
                    <h2 className="text-base font-bold text-[#0f172a]">Active Allergen Radar</h2>
                  </div>
                  <p className="text-xs text-[#64748b]">Tap an allergen to switch it on or off. Use the menu to set how serious it is for you.</p>
                </div>

                {/* Severity Legend */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fff1f2] text-[#e11d48] text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]"></span> Anaphylactic
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fffbeb] text-[#d97706] text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span> Intolerance
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#2563EB] text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5379EE]"></span> Sensitivity
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
                          : 'bg-[#EEF2FF] border-[#C7D2FE] shadow-xs'
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
                              : 'bg-[#EEF2FF] text-[#2563EB]'
                            : 'bg-slate-200 text-[#64748b]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{item.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0f172a] truncate">{item.name}</div>
                        <div
                          className={`text-[10px] font-semibold uppercase ${
                            item.tier === 1
                              ? 'text-[#e11d48]'
                              : item.tier === 2
                              ? 'text-[#d97706]'
                              : 'text-[#2563EB]'
                          }`}
                        >
                          {item.active ? 'On' : `Default: ${item.tierLabel}`}
                        </div>
                      </div>
                    </div>

                    {item.active && (
                      <select
                        value={item.tier}
                        aria-label={`Severity for ${item.name}`}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setAllergenTier(item.id, Number(e.target.value) as 1 | 2 | 3)}
                        className="h-7 px-1.5 mr-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-[#0f172a] shrink-0 cursor-pointer"
                      >
                        <option value={1}>Anaphylactic</option>
                        <option value={2}>Intolerance</option>
                        <option value={3}>Sensitivity</option>
                      </select>
                    )}
                    {!item.active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 bg-slate-200 text-[#64748b]">
                        OFF
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Custom Watchlist & E-Numbers */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5379EE] text-lg">filter_alt</span>
                <h2 className="text-base font-bold text-[#0f172a]">Chemical &amp; E-Number Watchlist</h2>
              </div>
              <p className="text-xs text-[#64748b]">
                Add any ingredient or E-number you want to avoid. A scanned product that lists it shows a warning.
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
                    className="w-full h-11 pl-10 pr-4 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#0f172a] outline-none focus:bg-white focus:ring-2 focus:ring-[#5379EE]/20 focus:border-[#5379EE] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-6 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Add to Watchlist</span>
                </button>
              </form>

              {/* Watchlist Badges Flow */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {userProfile.watchlist.length === 0 && (
                  <span className="text-xs text-[#64748b]">Your watchlist is empty.</span>
                )}
                {userProfile.watchlist.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f1f5f9] text-[#1e293b] text-xs font-medium border border-slate-200/50"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#5379EE]"></span>
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

            {/* Section 3: the user's most recent real alert */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#e11d48] text-lg">sensors</span>
                  <h2 className="text-base font-bold text-[#0f172a]">Latest Alert</h2>
                </div>
                <p className="text-xs text-[#64748b]">The most recent scan that raised a warning for your profile.</p>
              </div>

              {latestAlert ? (
                <div
                  className={`rounded-2xl p-5 border relative overflow-hidden ${
                    latestAlert.verdict === 'HAZARD' ? 'bg-[#fff1f2] border-[#ffdad6]' : 'bg-[#fffbeb] border-[#fde68a]'
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      latestAlert.verdict === 'HAZARD' ? 'bg-[#e11d48]' : 'bg-[#d97706]'
                    }`}
                  ></div>
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${
                        latestAlert.verdict === 'HAZARD' ? 'bg-[#e11d48]' : 'bg-[#d97706]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {latestAlert.verdict === 'HAZARD' ? 'error' : 'warning'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#0f172a]">{latestAlert.productName}</h3>
                      <p className="text-xs text-[#1e293b] mt-0.5">{latestAlert.verdictLabel}</p>
                      <p className="text-[11px] text-[#64748b] mt-1">
                        {latestAlert.brand} • Barcode {latestAlert.barcode} • {latestAlert.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#64748b] bg-[#f8fafc] rounded-2xl p-4 border border-slate-100">
                  No alerts yet. When a scanned product conflicts with your profile it will appear here.
                </p>
              )}
            </section>
          </div>

          {/* Right / Tactical Column (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Sensory Feedback Matrix */}
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5379EE] text-lg">vibration</span>
                <h2 className="text-base font-bold text-[#0f172a]">Scan Sentry Feedback</h2>
              </div>
              <p className="text-xs text-[#64748b]">How the app warns you when a scanned product conflicts with your profile.</p>

              {/* Toggles */}
              <div className="space-y-3">
                {/* Toggle 1: Push Modal Takeover */}
                <div className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#e11d48] text-lg mt-0.5">fullscreen</span>
                    <div>
                      <div className="text-xs font-bold text-[#0f172a]">Full-Screen Warning</div>
                      <div className="text-[11px] text-[#64748b] leading-relaxed">
                        Shows a full-screen red warning when a scanned product contains one of your allergens.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSentrySetting('pushTakeover')}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                      userProfile.sentrySettings.pushTakeover ? 'bg-[#5379EE]' : 'bg-slate-300'
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
                      <div className="text-xs font-bold text-[#0f172a]">Warning Tone</div>
                      <div className="text-[11px] text-[#64748b] leading-relaxed">
                        Plays a two-beep warning tone when a scanned product contains one of your allergens.
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
                      userProfile.sentrySettings.audibleTone ? 'bg-[#5379EE]' : 'bg-slate-300'
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
                    <span className="material-symbols-outlined text-[#5379EE] text-lg mt-0.5">phonelink_ring</span>
                    <div>
                      <div className="text-xs font-bold text-[#0f172a]">Vibration</div>
                      <div className="text-[11px] text-[#64748b] leading-relaxed">
                        Vibrates the phone in a three-pulse pattern, on devices and browsers that support vibration.
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
                      userProfile.sentrySettings.hapticPulse ? 'bg-[#5379EE]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        userProfile.sentrySettings.hapticPulse ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>

              </div>
            </section>

            {/* What the radar covers */}
            <section className="bg-gradient-to-br from-[#eef2ff] to-[#e0e7ff] rounded-3xl p-6 border border-[#c7d2fe] space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-[#0f172a]">What the radar checks</h3>
              <p className="text-xs text-[#565e74] leading-relaxed">
                IngreGuide looks for {MONITORED_TERM_COUNT} ingredient names across {ALLERGEN_DEFS.length} allergens in
                a product&apos;s ingredient list and allergen statement. The list covers the nine major allergens in US
                law (FALCPA and the FASTER Act) and the fourteen allergens in EU Regulation 1169/2011 (crustaceans and molluscs are grouped as shellfish).
              </p>
              <p className="text-xs text-[#565e74] leading-relaxed">
                &ldquo;May contain&rdquo; statements are shown as warnings. The check is only as good as the ingredient
                data on record, so always read the package label, especially for severe allergies.
              </p>
            </section>

            {/* Save Profile Master Action Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748b]">Where this is saved:</span>
                <span className="text-xs text-[#0f172a] font-bold">
                  {isLoggedIn ? 'Your IngreGuide account' : 'This device only'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSaveAndSync}
                className="w-full h-12 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(83,121,238,0.3)] flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg">cloud_sync</span>
                <span>{syncFeedback || 'Save Allergen Profile'}</span>
              </button>

              <p className="text-[11px] text-center text-[#64748b]">
                Changes are saved automatically as you make them.
                {userProfile.lastSynced && userProfile.lastSynced !== 'Just now'
                  ? ` Last saved ${userProfile.lastSynced}.`
                  : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
