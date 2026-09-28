import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ProductAnalysisScreen: React.FC = () => {
  const { selectedProduct, setSelectedProductId, setActiveTab, userProfile, products } = useApp();
  const [activeTab, setActiveAnalysisTab] = useState<'ingredients' | 'nutrition' | 'certifications'>('ingredients');
  const [showBanner, setShowBanner] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const prod = selectedProduct;
  const hasAllergens = prod.allergensDetected.length > 0;

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 p-3.5 bg-[#0f172a] text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#84cc16] text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Top Allergen Conflict Drawer */}
      {showBanner && hasAllergens && (
        <div className="w-full bg-[#fff1f2] border-b border-[#ffdad6] shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ffdad6] text-[#e11d48] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">warning</span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono-tech text-[10px] uppercase font-bold bg-[#e11d48] text-white px-2 py-0.5 rounded-full">
                    Severe Hazard Match
                  </span>
                  <span className="text-xs text-[#0f172a]">
                    Matched Profile: <strong>{userProfile.displayName} (Peanuts, Tree Nuts, Soy, Celiac)</strong>
                  </span>
                </div>
                <p className="text-xs text-[#93000a] leading-relaxed">
                  Product contains <strong className="underline">{prod.allergensDetected.join(', ')}</strong>.{' '}
                  {prod.facilityWarnings[0] || 'Airborne cross-contact possible.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
              {prod.safeAlternative && (
                <button
                  onClick={() => {
                    const el = document.getElementById('safe-swap-anchor');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="h-8 px-4 rounded-full bg-[#e11d48] hover:bg-[#be0037] text-white font-mono-tech text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>View Safe Swaps (3 ready)</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              )}
              <button
                onClick={() => setShowBanner(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-[#0f172a] flex items-center justify-center transition-colors"
                title="Dismiss"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Breadcrumbs & Scan Meta */}
        <nav className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-mono-tech text-xs text-[#64748b]">
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#0f172a]">
              Products
            </button>
            <span>&gt;</span>
            <span className="hover:text-[#0f172a]">{prod.brand}</span>
            <span>&gt;</span>
            <span className="text-[#65a30d] font-bold truncate max-w-[200px]">{prod.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#84cc16]"></span>
            <span className="font-mono-tech text-[10px] uppercase text-[#64748b]">
              Database Synchronized: Today, 09:42 EST
            </span>
          </div>
        </nav>

        {/* Product Overview Card */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative z-10">
            {/* Left: Product Snapshot Frame */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="relative rounded-2xl bg-slate-50 overflow-hidden aspect-[4/3] flex items-center justify-center border border-slate-100 shadow-inner">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-2.5 left-2.5 bg-[#0f172a]/80 backdrop-blur-md text-white font-mono-tech text-[10px] uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#a3e635]">verified</span>
                  <span>Lab Verified Pack</span>
                </div>
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[#0f172a] font-mono-tech text-[10px] font-bold">
                  Net Wt. {prod.netWeight}
                </div>
              </div>

              <div className="flex items-center justify-between px-1 font-mono-tech text-xs text-[#64748b]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#65a30d]">barcode_scanner</span>
                  <span>UPC {prod.barcode}</span>
                </span>
                <span className="text-[#65a30d] font-bold">100% Label Parsed</span>
              </div>
            </div>

            {/* Center: Title & Nomenclature */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ecfccb] text-[#65a30d] font-mono-tech text-[10px] font-bold uppercase">
                  <span className="material-symbols-outlined text-xs">eco</span>
                  <span>Verified Botanical Manufacturer</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">{prod.name}</h1>
                <p className="text-xs text-[#64748b]">
                  Manufactured by <strong className="text-[#0f172a]">{prod.brand}</strong> • Category:{' '}
                  <span className="text-[#1e293b] font-medium">{prod.category}</span>
                </p>
              </div>

              {/* Rapid Attributes */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f8fafc] text-xs font-semibold text-[#1e293b] border border-slate-200/60">
                  <span className="material-symbols-outlined text-xs text-[#65a30d]">check_circle</span>
                  <span>Non-GMO Project</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f8fafc] text-xs font-semibold text-[#1e293b] border border-slate-200/60">
                  <span className="material-symbols-outlined text-xs text-[#65a30d]">check_circle</span>
                  <span>100% Whole Grain</span>
                </span>
                {hasAllergens && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#fff1f2] text-xs font-semibold text-[#e11d48] border border-[#ffdad6]">
                    <span className="material-symbols-outlined text-xs">cancel</span>
                    <span>Gluten / Allergens Detected</span>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  onClick={() => setActiveTab('ingredient-clarity')}
                  className="h-10 px-5 rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white font-mono-tech text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  <span>Decode Plain English</span>
                </button>
                <button
                  onClick={() => {
                    setIsSaved(!isSaved);
                    showToast(isSaved ? 'Removed from favorites' : 'Saved to your favorites list!');
                  }}
                  className={`h-10 px-4 rounded-full font-mono-tech text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    isSaved ? 'bg-[#ecfccb] text-[#65a30d]' : 'bg-[#f1f5f9] text-[#0f172a] hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{isSaved ? 'bookmark_added' : 'bookmark'}</span>
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Link copied to clipboard!');
                  }}
                  className="h-10 w-10 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] flex items-center justify-center transition-colors"
                  title="Share Report"
                >
                  <span className="material-symbols-outlined text-base">ios_share</span>
                </button>
              </div>
            </div>

            {/* Right: Transparency Score & Nutri-Score */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <div className="bg-[#f7fee7] rounded-2xl p-4 border border-[#d9f99d] space-y-2">
                <span className="font-mono-tech text-[10px] uppercase text-[#64748b] tracking-wider font-bold">
                  NutriScan Transparency Score
                </span>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#0f172a]">{prod.transparencyScore}</span>
                    <span className="text-xs text-[#64748b]">/100</span>
                  </div>
                  <span
                    className={`font-mono-tech text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      prod.transparencyScore >= 80
                        ? 'bg-[#ecfccb] text-[#65a30d]'
                        : 'bg-[#fffbeb] text-[#d97706]'
                    }`}
                  >
                    {prod.transparencyScore >= 80 ? 'Outstanding' : 'Moderate'}
                  </span>
                </div>
                {/* Score bar */}
                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#84cc16] h-full rounded-full transition-all duration-700"
                    style={{ width: `${prod.transparencyScore}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#64748b]">
                  Evaluated across chemical binders, unrefined natural staples, and processing severity.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Nutri-Score */}
                <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center shadow-xs">
                  <div className="font-mono-tech text-[10px] text-[#64748b] uppercase font-bold">Nutri-Score</div>
                  <div
                    className={`my-1 inline-flex items-center justify-center w-9 h-9 rounded-full font-mono-tech text-base font-extrabold shadow-sm ${
                      prod.nutriScore === 'A'
                        ? 'bg-[#ecfccb] text-[#65a30d]'
                        : prod.nutriScore === 'B'
                        ? 'bg-[#84cc16] text-[#0f172a]'
                        : 'bg-[#ffdad6] text-[#e11d48]'
                    }`}
                  >
                    {prod.nutriScore}
                  </div>
                  <div className="text-[11px] text-[#0f172a] font-medium">
                    {prod.nutriScore === 'A' || prod.nutriScore === 'B' ? 'Balanced Choice' : 'Caution Choice'}
                  </div>
                </div>

                {/* NOVA Group */}
                <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center shadow-xs">
                  <div className="font-mono-tech text-[10px] text-[#64748b] uppercase font-bold">NOVA Class</div>
                  <div className="my-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#fef3c7] text-[#d97706] font-mono-tech text-base font-extrabold shadow-sm">
                    {prod.novaGroup}
                  </div>
                  <div className="text-[11px] text-[#0f172a] font-medium">Group {prod.novaGroup} Processed</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Deep Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Verbatim Label & Regulatory Declarations */}
          <div className="lg:col-span-5 space-y-6">
            {/* FDA Verbatim Panel */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#65a30d] text-base">receipt_long</span>
                  <h2 className="text-sm font-bold text-[#0f172a]">Verbatim Label Copy</h2>
                </div>
                <span className="font-mono-tech text-[10px] text-[#64748b] bg-slate-100 px-2 py-0.5 rounded">
                  FDA Standard Format
                </span>
              </div>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Transcribed directly from consumer packaging via automated optical analysis. Highlighted terms correlate
                with known allergen antibodies.
              </p>
              <div className="bg-[#f8fafc] rounded-2xl p-4 text-xs leading-relaxed text-[#1e293b] border border-slate-100">
                {prod.ingredientsVerbatim}
              </div>

              {/* Allergen Declaration Box */}
              <div className="rounded-2xl bg-[#fff1f2] p-4 space-y-2 border border-[#ffdad6]">
                <div className="flex items-center gap-1.5 text-[#e11d48] font-mono-tech text-[11px] font-bold">
                  <span className="material-symbols-outlined text-sm">report_problem</span>
                  <span>MANDATORY CONTAINS DECLARATION</span>
                </div>
                <p className="text-xs text-[#93000a] leading-relaxed font-semibold">{prod.mandatoryWarning}</p>
              </div>
            </div>

            {/* Nutrient Summary Callout */}
            <div className="bg-[#f7fee7] rounded-3xl p-6 border border-[#d9f99d] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0f172a]">Macronutrient Profile ({prod.netWeight})</h3>
                <span className="font-mono-tech text-xs text-[#65a30d] font-bold">{prod.nutrients.calories} Calories</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-xs">
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase block">Carbs</span>
                  <span className="text-sm font-bold text-[#0f172a] block">{prod.nutrients.carbs}</span>
                  <span className="text-[10px] text-[#65a30d]">{prod.nutrients.fiber} Fiber</span>
                </div>
                <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-xs">
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase block">Sugars</span>
                  <span className="text-sm font-bold text-[#d97706] block">{prod.nutrients.sugars}</span>
                  <span className="text-[10px] text-[#64748b]">{prod.nutrients.addedSugars} Added</span>
                </div>
                <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-xs">
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase block">Protein</span>
                  <span className="text-sm font-bold text-[#0f172a] block">{prod.nutrients.protein}</span>
                  <span className="text-[10px] text-[#65a30d]">Plant-based</span>
                </div>
                <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-xs">
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase block">Fat</span>
                  <span className="text-sm font-bold text-[#0f172a] block">{prod.nutrients.totalFat}</span>
                  <span className="text-[10px] text-[#64748b]">{prod.nutrients.satFat} Sat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Itemized Scientific Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            {/* Interactive Tabs Header */}
            <div className="bg-white rounded-2xl p-1.5 border border-slate-100 shadow-xs flex items-center gap-1">
              <button
                onClick={() => setActiveAnalysisTab('ingredients')}
                className={`flex-1 py-2 px-3 rounded-xl font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'ingredients'
                    ? 'bg-[#ecfccb] text-[#65a30d] shadow-xs'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">science</span>
                <span>Ingredients ({prod.ingredientsAnalysis.length})</span>
              </button>
              <button
                onClick={() => setActiveAnalysisTab('nutrition')}
                className={`flex-1 py-2 px-3 rounded-xl font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'nutrition'
                    ? 'bg-[#ecfccb] text-[#65a30d] shadow-xs'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">table_chart</span>
                <span>Nutrition Facts</span>
              </button>
              <button
                onClick={() => setActiveAnalysisTab('certifications')}
                className={`flex-1 py-2 px-3 rounded-xl font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'certifications'
                    ? 'bg-[#ecfccb] text-[#65a30d] shadow-xs'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">workspace_premium</span>
                <span>Certifications</span>
              </button>
            </div>

            {/* TAB 1: Ingredients Breakdown */}
            {activeTab === 'ingredients' && (
              <div className="space-y-2.5">
                {prod.ingredientsAnalysis.map((item, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 border transition-all flex items-start justify-between gap-4 ${
                      item.status === 'Allergen'
                        ? 'bg-[#fff1f2] border-[#ffdad6]'
                        : item.status === 'Moderate'
                        ? 'bg-[#fffbeb] border-[#fde68a]'
                        : 'bg-white border-slate-100 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                          item.status === 'Allergen'
                            ? 'bg-[#e11d48] animate-ping'
                            : item.status === 'Moderate'
                            ? 'bg-[#d97706]'
                            : 'bg-[#84cc16]'
                        }`}
                      ></span>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`text-xs font-bold ${
                              item.status === 'Allergen' ? 'text-[#93000a]' : 'text-[#0f172a]'
                            }`}
                          >
                            {item.name}
                          </h4>
                          {item.category && (
                            <span
                              className={`font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.status === 'Allergen'
                                  ? 'bg-[#e11d48] text-white'
                                  : item.status === 'Moderate'
                                  ? 'bg-[#fef3c7] text-[#b45309]'
                                  : 'bg-[#ecfccb] text-[#65a30d]'
                              }`}
                            >
                              {item.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748b] leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    {item.percentage && (
                      <span className="font-mono-tech text-[10px] text-[#64748b] shrink-0 font-bold">
                        {item.percentage}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Nutrition Facts */}
            {activeTab === 'nutrition' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                <div className="flex items-baseline justify-between border-b pb-3 border-slate-100">
                  <div>
                    <span className="font-mono-tech text-[10px] text-[#64748b] uppercase">Serving Size</span>
                    <div className="text-sm font-bold text-[#0f172a]">{prod.nutrients.servingSize}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-tech text-[10px] text-[#64748b] uppercase">Calories</span>
                    <div className="text-sm font-bold text-[#65a30d]">{prod.nutrients.calories} kcal</div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="font-bold text-[#0f172a]">Total Fat {prod.nutrients.totalFat}</span>
                    <span className="font-mono-tech font-bold text-[#65a30d]">{prod.nutrients.totalFatDV}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 pl-4 border-b border-slate-50 text-[#64748b]">
                    <span>Saturated Fat {prod.nutrients.satFat}</span>
                    <span className="font-mono-tech">{prod.nutrients.satFatDV}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="font-bold text-[#0f172a]">Sodium {prod.nutrients.sodium}</span>
                    <span className="font-mono-tech font-bold text-[#65a30d]">{prod.nutrients.sodiumDV}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="font-bold text-[#0f172a]">Total Carbohydrate {prod.nutrients.carbs}</span>
                    <span className="font-mono-tech font-bold text-[#65a30d]">{prod.nutrients.carbsDV}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 pl-4 border-b border-slate-50 text-[#64748b]">
                    <span>Dietary Fiber {prod.nutrients.fiber}</span>
                    <span className="font-mono-tech">{prod.nutrients.fiberDV}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 pl-4 border-b border-slate-50 text-[#d97706]">
                    <span>Total Sugars {prod.nutrients.sugars}</span>
                    <span className="font-mono-tech font-bold">Includes {prod.nutrients.addedSugars} Added</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="font-bold text-[#0f172a]">Protein {prod.nutrients.protein}</span>
                    <span className="font-mono-tech font-bold text-[#65a30d]">{prod.nutrients.proteinDV}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Certifications */}
            {activeTab === 'certifications' && (
              <div className="space-y-3">
                {prod.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#ecfccb] text-[#65a30d] flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">{cert.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0f172a]">{cert.title}</h4>
                        <p className="text-[11px] text-[#64748b]">{cert.details}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#65a30d] text-xl">check_circle</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Anchored Safe Swap Section */}
        {prod.safeAlternative && (
          <section
            id="safe-swap-anchor"
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left: Callout */}
              <div className="flex items-start gap-4 max-w-xl">
                <div className="w-14 h-14 rounded-2xl bg-[#ecfccb] text-[#65a30d] flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-3xl">health_and_safety</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-[10px] uppercase bg-[#84cc16] text-[#0f172a] font-bold px-2 py-0.5 rounded-full">
                      100% Safe Match Found
                    </span>
                    <span className="font-mono-tech text-[10px] text-[#64748b]">Zero Allergen Conflicts</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a]">{prod.safeAlternative.name}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{prod.safeAlternative.summary}</p>
                </div>
              </div>

              {/* Center: Score Mini Badge */}
              <div className="flex items-center gap-6 bg-[#f7fee7] px-6 py-3.5 rounded-2xl border border-[#d9f99d] w-full lg:w-auto justify-around">
                <div className="text-center">
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase block font-semibold">Score</span>
                  <span className="text-base font-extrabold text-[#65a30d]">Grade {prod.safeAlternative.nutriScore}</span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="text-center">
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase block font-semibold">
                    Facility Risk
                  </span>
                  <span className="text-base font-extrabold text-[#65a30d]">{prod.safeAlternative.facilityRisk}</span>
                </div>
              </div>

              {/* Right: CTA */}
              <div className="shrink-0 w-full lg:w-auto flex flex-col gap-1.5 text-center">
                <button
                  onClick={() => {
                    const match = products.find((p) => p.name.includes('PureSeed') || p.name.includes('Almond'));
                    if (match) setSelectedProductId(match.id);
                    showToast('Switched to verified safe alternative!');
                  }}
                  className="w-full lg:w-auto h-11 px-6 rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                >
                  <span>View Safe Alternative</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
                <span className="text-[11px] text-[#64748b]">
                  Available at {prod.safeAlternative.availableNearStores || 4} nearby stores
                </span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
