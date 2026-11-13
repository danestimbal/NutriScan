import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AllergenItem } from '../types';
import { sensoryEngine } from '../utils/soundEffects';

interface RegimenOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const REGIMEN_OPTIONS: RegimenOption[] = [
  { id: 'general', label: 'Balanced / Omnivore', description: 'No dietary restrictions. Allergen and watchlist checks still apply.', icon: 'restaurant' },
  { id: 'vegetarian', label: 'Vegetarian', description: 'Warns when a product lists meat, fish, shellfish, gelatin or rennet.', icon: 'eco' },
  { id: 'vegan', label: 'Vegan', description: 'Warns when a product lists meat, fish, dairy, eggs, honey or gelatin.', icon: 'spa' },
  { id: 'pescatarian', label: 'Pescatarian', description: 'Warns when a product lists meat, gelatin or other land-animal ingredients.', icon: 'phishing' },
  { id: 'diabetic', label: 'Diabetic / Low Glycemic', description: 'Saved to your profile. No automatic check yet: review the sugar breakdown on each product.', icon: 'monitor_heart' },
  { id: 'low-sodium', label: 'Low Sodium (DASH)', description: 'Warns when a product has more than 140 mg of sodium per serving.', icon: 'favorite' },
  { id: 'keto', label: 'Keto / Low Carb', description: 'Saved to your profile. No automatic check yet: review the carbohydrates on each product.', icon: 'fitness_center' },
  { id: 'halal', label: 'Halal', description: 'Warns when a product lists pork, gelatin or alcohol so you can check the source. It cannot confirm halal certification.', icon: 'verified' },
];

const COMMON_WATCHLIST_PRESETS = [
  { name: 'High Fructose Corn Syrup', category: 'Sugar & Caloric Sweeteners', desc: 'A common added sugar in soft drinks and snacks' },
  { name: 'Red Dye #40 (Allura AC / E129)', category: 'Synthetic Colorant', desc: 'Synthetic red colour; carries a warning label in the EU' },
  { name: 'Monosodium Glutamate (E621)', category: 'Flavor Enhancer', desc: 'Flavour enhancer some people prefer to avoid' },
  { name: 'Sodium Nitrite (E250)', category: 'Cured Meat Preservative', desc: 'Curing salt used in processed meats' },
  { name: 'Carrageenan (E407)', category: 'Industrial Thickener', desc: 'Seaweed-based thickener some people prefer to avoid' },
  { name: 'Aspartame (E951)', category: 'Artificial Sweetener', desc: 'Sweetener that people with PKU must avoid' },
  { name: 'Potassium Sorbate (E202)', category: 'Antimicrobial Preservative', desc: 'Common preservative' },
  { name: 'Partially Hydrogenated Oils', category: 'Industrial Trans Fat', desc: 'Source of industrial trans fat' },
];

export const OnboardingProfileScreen: React.FC = () => {
  const { userProfile, updateUserProfile, setActiveTab } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedRegimens, setSelectedRegimens] = useState<string[]>(
    userProfile.dietaryPreferences || []
  );
  const [allergensList, setAllergensList] = useState<AllergenItem[]>(userProfile.activeAllergens);
  const [selectedWatchlist, setSelectedWatchlist] = useState<string[]>(
    userProfile.watchlist || []
  );
  const [customWatchItem, setCustomWatchItem] = useState('');
  const [sentryAlerts, setSentryAlerts] = useState({
    pushTakeover: userProfile.sentrySettings.pushTakeover ?? true,
    audibleTone: userProfile.sentrySettings.audibleTone ?? true,
    hapticPulse: userProfile.sentrySettings.hapticPulse ?? true,
  });
  const [saving, setSaving] = useState(false);

  // Toggle dietary regimen
  const toggleRegimen = (label: string) => {
    setSelectedRegimens((prev) =>
      prev.includes(label) ? prev.filter((r) => r !== label) : [...prev, label]
    );
  };

  // Toggle allergen active state
  const toggleAllergenItem = (id: string) => {
    setAllergensList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  // Change tier for an allergen
  const setTier = (id: string, tier: 1 | 2 | 3) => {
    const tierLabels: Record<1 | 2 | 3, 'Anaphylactic' | 'Intolerance' | 'Sensitivity'> = {
      1: 'Anaphylactic',
      2: 'Intolerance',
      3: 'Sensitivity',
    };
    setAllergensList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, tier, tierLabel: tierLabels[tier], active: true } : item
      )
    );
  };

  // Toggle watchlist item
  const toggleWatchlistPreset = (name: string) => {
    setSelectedWatchlist((prev) =>
      prev.includes(name) ? prev.filter((w) => w !== name) : [...prev, name]
    );
  };

  const addCustomWatchItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWatchItem.trim() && !selectedWatchlist.includes(customWatchItem.trim())) {
      setSelectedWatchlist([...selectedWatchlist, customWatchItem.trim()]);
      setCustomWatchItem('');
    }
  };

  const removeWatchItem = (itemToRemove: string) => {
    setSelectedWatchlist(selectedWatchlist.filter((w) => w !== itemToRemove));
  };

  // Save profile and finalize onboarding
  const handleFinalizeProfile = async () => {
    setSaving(true);
    sensoryEngine.playSafeChime();
    try {
      await updateUserProfile({
        dietaryPreferences: selectedRegimens,
        activeAllergens: allergensList,
        watchlist: selectedWatchlist,
        sentrySettings: sentryAlerts,
        profileCompleted: true,
        lastSynced: 'Just now',
      });
      setTimeout(() => {
        setSaving(false);
        setActiveTab('dashboard');
      }, 700);
    } catch {
      setSaving(false);
      setActiveTab('dashboard');
    }
  };

  const activeAllergenCount = allergensList.filter((a) => a.active).length;

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Progress & Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
                Personalize Your Food Safety Shield
              </h1>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                Welcome, <strong className="text-[#0f172a]">{userProfile.displayName}</strong>! Set your dietary guardrails, allergen sensitivities, and sentry alert preferences.
              </p>
            </div>

            <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0">
              <span className="text-xs font-bold text-[#5379EE]">
                Step {step} of 4
              </span>
              <span className="text-[11px] text-[#94a3b8]">
                {step === 1 && 'Dietary Regimen'}
                {step === 2 && 'Allergens & Tiers'}
                {step === 3 && 'Additives Watchlist'}
                {step === 4 && 'Sensory Sentry'}
              </span>
            </div>
          </div>

          {/* Stepper Dots Bar */}
          <div className="grid grid-cols-4 gap-2 pt-6">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  step === i
                    ? 'bg-[#5379EE]'
                    : step > i
                    ? 'bg-[#a5b4fc]'
                    : 'bg-slate-200'
                }`}
                title={`Jump to Step ${i}`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Dietary Lifestyle & Regimens */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-[#5379EE] font-bold uppercase tracking-wider">
                  Phase 1 of 4
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] mt-1">
                  Select Your Dietary Regimens &amp; Goals
                </h2>
                <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                  Choose any that apply. Each option says what the app checks for when you scan a product.
                </p>
              </div>
              <span className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">restaurant_menu</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {REGIMEN_OPTIONS.map((item) => {
                const isSelected = selectedRegimens.includes(item.label);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleRegimen(item.label)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#EEF2FF] border-[#5379EE] shadow-sm'
                        : 'bg-[#f8fafc] border-slate-200/80 hover:bg-slate-100/80'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#5379EE] text-white shadow-xs' : 'bg-slate-200 text-[#64748b]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-bold ${isSelected ? 'text-[#1e3a8a]' : 'text-[#0f172a]'}`}>
                          {item.label}
                        </h3>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[#5379EE] text-lg">check_circle</span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748b] mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-[#64748b]">
                {selectedRegimens.length} regimen{selectedRegimens.length !== 1 ? 's' : ''} selected
              </span>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Allergens</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Allergen Sensitivities & Severity Tiers */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-[#5379EE] font-bold uppercase tracking-wider">
                  Phase 2 of 4
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] mt-1">
                  Configure Your Allergen Shield &amp; Severity
                </h2>
                <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                  Based on FDA FALCPA 9 &amp; EU FIC 14 standards. Tap to activate monitoring, and calibrate your tolerance level.
                </p>
              </div>
              <span className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">shield</span>
              </span>
            </div>

            {/* Severity explanation ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#f8fafc] p-3.5 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#e11d48]"></span>
                <div>
                  <p className="text-xs font-bold text-[#e11d48]">Tier 1: Anaphylactic</p>
                  <p className="text-[10px] text-[#64748b]">Full red alert, tone and vibration</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#d97706]"></span>
                <div>
                  <p className="text-xs font-bold text-[#d97706]">Tier 2: Intolerance</p>
                  <p className="text-[10px] text-[#64748b]">Amber warning</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#5379EE]"></span>
                <div>
                  <p className="text-xs font-bold text-[#5379EE]">Tier 3: Sensitivity</p>
                  <p className="text-[10px] text-[#64748b]">Amber warning</p>
                </div>
              </div>
            </div>

            {/* Allergen items list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {allergensList.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.active
                      ? item.tier === 1
                        ? 'bg-[#fff1f2] border-[#ffdad6] shadow-xs'
                        : item.tier === 2
                        ? 'bg-[#fffbeb] border-[#fde68a] shadow-xs'
                        : 'bg-[#EEF2FF] border-[#C7D2FE] shadow-xs'
                      : 'bg-[#f8fafc] border-slate-200/60 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      onClick={() => toggleAllergenItem(item.id)}
                      className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          item.active
                            ? item.tier === 1
                              ? 'bg-[#ffdad6] text-[#e11d48]'
                              : item.tier === 2
                              ? 'bg-[#fef3c7] text-[#d97706]'
                              : 'bg-[#EEF2FF] text-[#2563EB]'
                            : 'bg-slate-200 text-[#64748b]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#0f172a] truncate">{item.name}</h4>
                        <span
                          className={`text-[10px] font-bold ${
                            item.active
                              ? item.tier === 1
                                ? 'text-[#e11d48]'
                                : item.tier === 2
                                ? 'text-[#d97706]'
                                : 'text-[#2563EB]'
                              : 'text-[#94a3b8]'
                          }`}
                        >
                          {item.active ? item.tierLabel : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={() => toggleAllergenItem(item.id)}
                      className="w-4 h-4 rounded text-[#5379EE] accent-[#5379EE] cursor-pointer mt-1"
                    />
                  </div>

                  {/* Tier selector when active */}
                  {item.active && (
                    <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-200/50">
                      <span className="text-[10px] text-[#64748b] mr-1">Tier:</span>
                      <button
                        type="button"
                        onClick={() => setTier(item.id, 1)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          item.tier === 1
                            ? 'bg-[#e11d48] text-white shadow-xs'
                            : 'bg-white text-[#e11d48] border border-[#ffdad6]'
                        }`}
                      >
                        Anaphylactic
                      </button>
                      <button
                        type="button"
                        onClick={() => setTier(item.id, 2)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          item.tier === 2
                            ? 'bg-[#d97706] text-white shadow-xs'
                            : 'bg-white text-[#d97706] border border-[#fde68a]'
                        }`}
                      >
                        Intolerance
                      </button>
                      <button
                        type="button"
                        onClick={() => setTier(item.id, 3)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          item.tier === 3
                            ? 'bg-[#5379EE] text-white shadow-xs'
                            : 'bg-white text-[#5379EE] border border-[#C7D2FE]'
                        }`}
                      >
                        Sensitivity
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Additives</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Additives & Ingredients Watchlist */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-[#5379EE] font-bold uppercase tracking-wider">
                  Phase 3 of 4
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] mt-1">
                  Chemical Additives &amp; E-Codes Watchlist
                </h2>
                <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                  Flag high-risk synthetic preservatives, artificial sweeteners, industrial thickeners, and colorants during scans.
                </p>
              </div>
              <span className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">biotech</span>
              </span>
            </div>

            {/* Custom Watchlist Input */}
            <form onSubmit={addCustomWatchItem} className="flex gap-2">
              <input
                type="text"
                value={customWatchItem}
                onChange={(e) => setCustomWatchItem(e.target.value)}
                placeholder="Add custom ingredient (e.g. Palm Oil, Maltitol, Titanium Dioxide)"
                className="flex-1 h-11 px-4 rounded-full bg-[#f8fafc] border border-[#cbd5e1] text-xs text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#5379EE] focus:ring-2 focus:ring-[#5379EE]/20 transition-all"
              />
              <button
                type="submit"
                className="px-5 h-11 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Add Item</span>
              </button>
            </form>

            {/* Common Presets Grid */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                Common Choices (Tap to Toggle)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COMMON_WATCHLIST_PRESETS.map((item) => {
                  const isChecked = selectedWatchlist.includes(item.name);
                  return (
                    <div
                      key={item.name}
                      onClick={() => toggleWatchlistPreset(item.name)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'bg-[#EEF2FF] border-[#5379EE]'
                          : 'bg-[#f8fafc] border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isChecked ? 'bg-[#5379EE]' : 'bg-slate-300'
                            }`}
                          ></span>
                          <span className={`text-xs font-bold truncate ${isChecked ? 'text-[#1e3a8a]' : 'text-[#0f172a]'}`}>
                            {item.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748b] mt-0.5">{item.desc}</p>
                      </div>
                      <span
                        className={`material-symbols-outlined text-lg ${
                          isChecked ? 'text-[#5379EE]' : 'text-slate-300'
                        }`}
                      >
                        {isChecked ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Currently Active Watchlist Pills */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
                Active Watchlist Chips ({selectedWatchlist.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedWatchlist.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0e7ff] text-[#4338ca] text-xs font-bold shadow-2xs"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeWatchItem(item)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Sentry Alerts</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Real-time Sentry & Final Review */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-[#5379EE] font-bold uppercase tracking-wider">
                  Phase 4 of 4
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] mt-1">
                  Sensory Sentry &amp; Hazard Alert Configuration
                </h2>
                <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                  Decide how IngreGuide reacts when an allergen conflict or high-risk additive is detected during barcode scans.
                </p>
              </div>
              <span className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">notifications_active</span>
              </span>
            </div>

            <div className="space-y-3">
              {/* Sentry Setting 1: Audible Alarm */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">volume_up</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a]">Audible Acoustic Alarm Tone</h4>
                    <p className="text-[11px] text-[#64748b]">
                      Plays a two-beep warning tone when a scanned product contains one of your allergens.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => sensoryEngine.playHazardTone()}
                    className="text-[11px] font-bold text-[#5379EE] hover:underline"
                  >
                    Test Tone
                  </button>
                  <input
                    type="checkbox"
                    checked={sentryAlerts.audibleTone}
                    onChange={(e) => setSentryAlerts({ ...sentryAlerts, audibleTone: e.target.checked })}
                    className="w-4 h-4 rounded text-[#5379EE] accent-[#5379EE] cursor-pointer"
                  />
                </div>
              </div>

              {/* Sentry Setting 2: Haptic Pulse */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">vibration</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a]">Haptic Vibration Pulse</h4>
                    <p className="text-[11px] text-[#64748b]">
                      Three-pulse vibration on phones and browsers that support it.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => sensoryEngine.triggerHaptic()}
                    className="text-[11px] font-bold text-[#5379EE] hover:underline"
                  >
                    Test Haptic
                  </button>
                  <input
                    type="checkbox"
                    checked={sentryAlerts.hapticPulse}
                    onChange={(e) => setSentryAlerts({ ...sentryAlerts, hapticPulse: e.target.checked })}
                    className="w-4 h-4 rounded text-[#5379EE] accent-[#5379EE] cursor-pointer"
                  />
                </div>
              </div>

              {/* Sentry Setting 3: Push Takeover Modal */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">crisis_alert</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a]">Full-Screen Push Takeover Modal</h4>
                    <p className="text-[11px] text-[#64748b]">
                      Shows a full-screen red warning when a scanned product contains one of your allergens.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sentryAlerts.pushTakeover}
                  onChange={(e) => setSentryAlerts({ ...sentryAlerts, pushTakeover: e.target.checked })}
                  className="w-4 h-4 rounded text-[#5379EE] accent-[#5379EE] cursor-pointer"
                />
              </div>

            </div>

            {/* Profile Summary Card */}
            <div className="bg-[#f0f3ff] p-5 rounded-2xl border border-[#dae2fd]/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5379EE] font-bold uppercase tracking-wider">
                  Profile Summary
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5379EE]"></span>
                  Ready to Save
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-[#64748b]">Regimens</p>
                  <p className="font-bold text-sm text-[#0f172a]">{selectedRegimens.length}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-[#64748b]">Active Allergens</p>
                  <p className="font-bold text-sm text-[#0f172a]">{activeAllergenCount}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-[#64748b]">Watchlist Targets</p>
                  <p className="font-bold text-sm text-[#0f172a]">{selectedWatchlist.length}</p>
                </div>
              </div>
              <p className="text-[10px] text-[#64748b] leading-tight">
                Stored in accordance with Republic Act No. 10173 (Philippine Data Privacy Act of 2012) and synchronized to your secure Firebase health partition.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleFinalizeProfile}
                className="px-8 py-3 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(83,121,238,0.35)] flex items-center gap-2 cursor-pointer active:scale-98"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                    <span>Saving…</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">verified_user</span>
                    <span>Save Profile &amp; Continue</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
