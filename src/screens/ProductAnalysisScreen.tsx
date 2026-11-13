import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSmartProductFallbackImage, hasGap } from '../utils/barcode';

export const ProductAnalysisScreen: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProductId,
    setActiveTab,
    userProfile,
    products,
    toggleSavedProduct,
    evaluateForUser,
    isLoggedIn,
  } = useApp();
  const [activeTab, setActiveAnalysisTab] = useState<'ingredients' | 'nutrition' | 'certifications'>('ingredients');
  const [showBanner, setShowBanner] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const prod = selectedProduct;
  const hasAllergens = prod.allergensDetected.length > 0;
  const isSaved = (userProfile.savedProductIds || []).includes(prod.id);
  const evaluation = evaluateForUser(prod);
  const isSample = prod.dataSource === 'Sample catalog';
  const activeAllergenCount = userProfile.activeAllergens.filter((a) => a.active).length;
  const nutritionMissing = hasGap(prod, 'nutrition');
  const gradeMissing = hasGap(prod, 'nutriScore');
  const novaMissing = hasGap(prod, 'nova');
  const scoreMissing = hasGap(prod, 'transparency');
  const scoreLabel = prod.transparencyScore >= 80 ? 'High' : prod.transparencyScore >= 50 ? 'Moderate' : 'Low';
  const gradeNote = gradeMissing
    ? 'Not rated'
    : prod.nutriScore === 'A' || prod.nutriScore === 'B'
      ? 'Better choice'
      : prod.nutriScore === 'C'
        ? 'Moderate'
        : 'Limit intake';
  const alternativeProduct = prod.safeAlternative
    ? products.find((p) => p.id === prod.safeAlternative?.id || p.name === prod.safeAlternative?.name)
    : undefined;

  const BANNER = {
    HAZARD: { wrap: 'bg-[#fff1f2] border-[#ffdad6]', icon: 'bg-[#ffdad6] text-[#e11d48]', pill: 'bg-[#e11d48] text-white', text: 'text-[#93000a]', symbol: 'report', title: 'Conflicts with your profile' },
    WARNING: { wrap: 'bg-[#fffbeb] border-[#fde68a]', icon: 'bg-[#fef3c7] text-[#b45309]', pill: 'bg-[#d97706] text-white', text: 'text-[#92400e]', symbol: 'warning', title: 'Check before eating' },
    SAFE: { wrap: 'bg-[#EEF2FF] border-[#c7d2fe]', icon: 'bg-white text-[#5379EE]', pill: 'bg-[#5379EE] text-white', text: 'text-[#1e3a8a]', symbol: 'info', title: 'Allergen information' },
  } as const;
  const banner = BANNER[evaluation.verdict];
  const bannerLines: string[] = [];
  if (evaluation.matched.length) bannerLines.push(`Contains ${evaluation.matched.map((a) => a.name).join(', ')}, which you marked on your Allergen Radar.`);
  if (evaluation.mayContain.length) bannerLines.push(`May contain ${evaluation.mayContain.map((a) => a.name).join(', ')} (advisory statement on the product).`);
  if (evaluation.watchlistHits.length) bannerLines.push(`On your watchlist: ${evaluation.watchlistHits.join(', ')}.`);
  if (evaluation.policyHits.length) bannerLines.push(`Additives flagged by IngreGuide: ${evaluation.policyHits.map((x) => `${x.name} (${x.eCode})`).join(', ')}.`);
  evaluation.dietFlags.forEach((flag) => bannerLines.push(`${flag.diet} diet: ${flag.reason}.`));
  if (evaluation.ingredientsUnknown) bannerLines.push('No ingredient list is available for this product, so it could not be checked. Read the package label.');
  if (bannerLines.length === 0 && hasAllergens) {
    bannerLines.push(
      activeAllergenCount > 0
        ? `This product declares ${prod.allergensDetected.join(', ')}. None of these are switched on in your Allergen Radar.`
        : `This product declares ${prod.allergensDetected.join(', ')}. You have no allergens switched on, so nothing was checked against your profile.`
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 p-3.5 bg-[#0f172a] text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#5379EE] text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Result of checking this product against the user's own profile */}
      {showBanner && bannerLines.length > 0 && (
        <div className={`w-full border-b shadow-xs ${banner.wrap}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${banner.icon}`}>
                <span className="material-symbols-outlined text-lg">{banner.symbol}</span>
              </div>
              <div className="space-y-1">
                <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${banner.pill}`}>
                  {banner.title}
                </span>
                {bannerLines.map((line) => (
                  <p key={line} className={`text-xs leading-relaxed ${banner.text}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-[#0f172a] flex items-center justify-center transition-colors shrink-0"
              title="Dismiss"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Canvas Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Breadcrumbs & Scan Meta */}
        <nav className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
            <button onClick={() => setActiveTab('catalog')} className="hover:text-[#0f172a]">
              Products
            </button>
            <span>&gt;</span>
            <span className="hover:text-[#0f172a]">{prod.brand}</span>
            <span>&gt;</span>
            <span className="text-[#5379EE] font-bold truncate max-w-[200px]">{prod.name}</span>
          </div>
        </nav>

        {/* Product Overview Card */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative z-10">
            {/* Left: Product Snapshot Frame */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="relative rounded-2xl bg-slate-50 overflow-hidden aspect-[4/3] flex items-center justify-center border border-slate-100 shadow-inner">
                <img
                  src={prod.image}
                  alt={prod.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getSmartProductFallbackImage(prod.name, prod.category);
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-[#0f172a]/80 backdrop-blur-md text-white text-[10px] uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#5379EE]">
                    {isSample ? 'science' : prod.isVerified ? 'verified' : 'pending'}
                  </span>
                  <span>{isSample ? 'Sample data' : prod.isVerified ? 'Admin verified' : 'Not yet reviewed'}</span>
                </div>
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[#0f172a] text-[10px] font-bold">
                  Net Wt. {prod.netWeight}
                </div>
              </div>

              <div className="flex items-center justify-between px-1 text-xs text-[#64748b]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#5379EE]">barcode_scanner</span>
                  <span>UPC {prod.barcode}</span>
                </span>
                {prod.dataSource && <span className="text-[#64748b]">Source: {prod.dataSource}</span>}
              </div>
            </div>

            {/* Center: Title & Nomenclature */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">{prod.name}</h1>
                <p className="text-xs text-[#64748b]">
                  Brand: <strong className="text-[#0f172a]">{prod.brand}</strong> • Category:{' '}
                  <span className="text-[#1e293b] font-medium">{prod.category}</span>
                </p>
              </div>

              {/* Attributes recorded for this product */}
              <div className="flex flex-wrap gap-2 pt-1">
                {prod.certifications.slice(0, 3).map((cert) => (
                  <span
                    key={cert.title}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f8fafc] text-xs font-semibold text-[#1e293b] border border-slate-200/60"
                  >
                    <span className="material-symbols-outlined text-xs text-[#5379EE]">check_circle</span>
                    <span>{cert.title}</span>
                  </span>
                ))}
                {hasAllergens && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#fff1f2] text-xs font-semibold text-[#e11d48] border border-[#ffdad6]">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    <span>Allergens declared</span>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  onClick={() => setActiveTab('ingredient-clarity')}
                  className="h-10 px-5 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  <span>Decode Plain English</span>
                </button>
                <button
                  onClick={() => {
                    const nowSaved = toggleSavedProduct(prod.id);
                    showToast(
                      nowSaved
                        ? `Saved to your favorites${isLoggedIn ? '' : ' on this device'}`
                        : 'Removed from favorites'
                    );
                  }}
                  className={`h-10 px-4 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    isSaved ? 'bg-[#EEF2FF] text-[#5379EE]' : 'bg-[#f1f5f9] text-[#0f172a] hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{isSaved ? 'bookmark_added' : 'bookmark'}</span>
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`${prod.name} (${prod.brand}), barcode ${prod.barcode}`);
                    showToast('Product name and barcode copied');
                  }}
                  className="h-10 w-10 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] flex items-center justify-center transition-colors"
                  title="Copy product details"
                >
                  <span className="material-symbols-outlined text-base">content_copy</span>
                </button>
              </div>
            </div>

            {/* Right: Transparency Score & Nutri-Score */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <div className="bg-[#eef2ff] rounded-2xl p-4 border border-[#c7d2fe] space-y-2">
                <span className="text-[10px] uppercase text-[#64748b] tracking-wider font-bold">
                  IngreGuide Transparency Score
                </span>
                {scoreMissing ? (
                  <>
                    <span className="block text-lg font-extrabold text-[#64748b]">Not scored</span>
                    <p className="text-[11px] text-[#64748b]">
                      This product was imported automatically and has not been scored by an administrator.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[#0f172a]">{prod.transparencyScore}</span>
                        <span className="text-xs text-[#64748b]">/100</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          prod.transparencyScore >= 80 ? 'bg-[#e0e7ff] text-[#4338ca]' : 'bg-[#fffbeb] text-[#d97706]'
                        }`}
                      >
                        {scoreLabel}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#5379EE] h-full rounded-full transition-all duration-700"
                        style={{ width: `${prod.transparencyScore}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-[#64748b]">
                      IngreGuide&apos;s rating of how minimally processed and additive-free this product is.
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Nutri-Score */}
                <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center shadow-xs">
                  <div className="text-[10px] text-[#64748b] uppercase font-bold">Nutri-Score</div>
                  <div
                    className={`my-1 inline-flex items-center justify-center w-9 h-9 rounded-full text-base font-extrabold shadow-sm ${
                      gradeMissing
                        ? 'bg-slate-100 text-[#64748b]'
                        : prod.nutriScore === 'A' || prod.nutriScore === 'B'
                          ? 'bg-[#ecfdf5] text-[#047857]'
                          : prod.nutriScore === 'C'
                            ? 'bg-[#fef3c7] text-[#b45309]'
                            : 'bg-[#ffdad6] text-[#e11d48]'
                    }`}
                  >
                    {gradeMissing ? '—' : prod.nutriScore}
                  </div>
                  <div className="text-[11px] text-[#0f172a] font-medium">{gradeNote}</div>
                </div>

                {/* NOVA Group */}
                <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center shadow-xs">
                  <div className="text-[10px] text-[#64748b] uppercase font-bold">NOVA Class</div>
                  <div className="my-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#fef3c7] text-[#d97706] text-base font-extrabold shadow-sm">
                    {novaMissing ? '—' : prod.novaGroup}
                  </div>
                  <div className="text-[11px] text-[#0f172a] font-medium">
                    {novaMissing ? 'Not rated' : `Processing group ${prod.novaGroup} of 4`}
                  </div>
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
                  <span className="material-symbols-outlined text-[#5379EE] text-base">receipt_long</span>
                  <h2 className="text-sm font-bold text-[#0f172a]">Ingredient Statement</h2>
                </div>
              </div>
              <p className="text-xs text-[#64748b] leading-relaxed">
                {isSample
                  ? 'This is a sample record that has not been checked against a real package, so details may differ from the actual product.'
                  : `The ingredient list recorded for this product${prod.dataSource ? ` (source: ${prod.dataSource})` : ''}.`}{' '}
                Recipes change, so the package in your hand is always the final word.
              </p>
              <div className="bg-[#f8fafc] rounded-2xl p-4 text-xs leading-relaxed text-[#1e293b] border border-slate-100">
                {prod.ingredientsVerbatim}
              </div>

              {/* Allergen Declaration Box */}
              <div className="rounded-2xl bg-[#fff1f2] p-4 space-y-2 border border-[#ffdad6]">
                <div className="flex items-center gap-1.5 text-[#e11d48] text-[11px] font-bold">
                  <span className="material-symbols-outlined text-sm">report_problem</span>
                  <span>ALLERGEN DECLARATION</span>
                </div>
                <p className="text-xs text-[#93000a] leading-relaxed font-semibold">{prod.mandatoryWarning}</p>
              </div>
            </div>

            {/* Nutrient Summary Callout */}
            <div className="bg-[#EEF2FF] rounded-3xl p-6 border border-[#c7d2fe] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0f172a]">Nutrition ({prod.nutrients.servingSize})</h3>
                {!nutritionMissing && (
                  <span className="text-xs text-[#5379EE] font-bold">{prod.nutrients.calories} Calories</span>
                )}
              </div>
              {nutritionMissing ? (
                <p className="text-xs text-[#64748b] bg-white rounded-xl p-3 border border-slate-100">
                  Nutrition facts are not available for this product. Check the package label.
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-xs">
                    <span className="text-[10px] text-[#64748b] uppercase block">Carbs</span>
                    <span className="text-sm font-bold text-[#0f172a] block">{prod.nutrients.carbs}</span>
                    <span className="text-[10px] text-[#5379EE]">{prod.nutrients.fiber} Fiber</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-xs">
                    <span className="text-[10px] text-[#64748b] uppercase block">Sugars</span>
                    <span className="text-sm font-bold text-[#d97706] block">{prod.nutrients.sugars}</span>
                    <span className="text-[10px] text-[#64748b]">{prod.nutrients.addedSugars} Added</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-xs">
                    <span className="text-[10px] text-[#64748b] uppercase block">Protein</span>
                    <span className="text-sm font-bold text-[#0f172a] block">{prod.nutrients.protein}</span>
                    <span className="text-[10px] text-[#64748b]">{prod.nutrients.proteinDV} DV</span>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-xs">
                    <span className="text-[10px] text-[#64748b] uppercase block">Fat</span>
                    <span className="text-sm font-bold text-[#0f172a] block">{prod.nutrients.totalFat}</span>
                    <span className="text-[10px] text-[#64748b]">{prod.nutrients.satFat} Sat</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Itemized Scientific Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            {/* Interactive Tabs Header */}
            <div className="bg-white rounded-2xl p-1.5 border border-slate-100 shadow-xs flex items-center gap-1">
              <button
                onClick={() => setActiveAnalysisTab('ingredients')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'ingredients'
                    ? 'bg-[#EEF2FF] text-[#5379EE] shadow-xs'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">science</span>
                <span>Ingredients ({prod.ingredientsAnalysis.length})</span>
              </button>
              <button
                onClick={() => setActiveAnalysisTab('nutrition')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'nutrition'
                    ? 'bg-[#EEF2FF] text-[#5379EE] shadow-xs'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">table_chart</span>
                <span>Nutrition Facts</span>
              </button>
              <button
                onClick={() => setActiveAnalysisTab('certifications')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'certifications'
                    ? 'bg-[#EEF2FF] text-[#5379EE] shadow-xs'
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
                {prod.ingredientsAnalysis.length === 0 && (
                  <p className="bg-white rounded-2xl p-4 border border-slate-100 text-xs text-[#64748b]">
                    No ingredient list is available for this product. Check the package label.
                  </p>
                )}
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
                            : 'bg-[#5379EE]'
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
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.status === 'Allergen'
                                  ? 'bg-[#e11d48] text-white'
                                  : item.status === 'Moderate'
                                  ? 'bg-[#fef3c7] text-[#b45309]'
                                  : 'bg-[#EEF2FF] text-[#5379EE]'
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
                      <span className="text-[10px] text-[#64748b] shrink-0 font-bold">
                        {item.percentage}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Nutrition Facts */}
            {activeTab === 'nutrition' && nutritionMissing && (
              <p className="bg-white rounded-3xl p-6 border border-slate-100 text-xs text-[#64748b]">
                Nutrition facts are not available for this product. Check the package label.
              </p>
            )}
            {activeTab === 'nutrition' && !nutritionMissing && (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                <div className="flex items-baseline justify-between border-b pb-3 border-slate-100">
                  <div>
                    <span className="text-[10px] text-[#64748b] uppercase">Serving Size</span>
                    <div className="text-sm font-bold text-[#0f172a]">{prod.nutrients.servingSize}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#64748b] uppercase">Calories</span>
                    <div className="text-sm font-bold text-[#5379EE]">{prod.nutrients.calories} kcal</div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="font-bold text-[#0f172a]">Total Fat {prod.nutrients.totalFat}</span>
                    <span className="font-bold text-[#5379EE]">{prod.nutrients.totalFatDV}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 pl-4 border-b border-slate-50 text-[#64748b]">
                    <span>Saturated Fat {prod.nutrients.satFat}</span>
                    <span className="">{prod.nutrients.satFatDV}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="font-bold text-[#0f172a]">Sodium {prod.nutrients.sodium}</span>
                    <span className="font-bold text-[#5379EE]">{prod.nutrients.sodiumDV}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="font-bold text-[#0f172a]">Total Carbohydrate {prod.nutrients.carbs}</span>
                    <span className="font-bold text-[#5379EE]">{prod.nutrients.carbsDV}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 pl-4 border-b border-slate-50 text-[#64748b]">
                    <span>Dietary Fiber {prod.nutrients.fiber}</span>
                    <span className="">{prod.nutrients.fiberDV}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 pl-4 border-b border-slate-50 text-[#d97706]">
                    <span>Total Sugars {prod.nutrients.sugars}</span>
                    <span className="font-bold">Includes {prod.nutrients.addedSugars} Added</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="font-bold text-[#0f172a]">Protein {prod.nutrients.protein}</span>
                    <span className="font-bold text-[#5379EE]">{prod.nutrients.proteinDV}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Certifications */}
            {activeTab === 'certifications' && (
              <div className="space-y-3">
                {prod.certifications.length === 0 && (
                  <p className="bg-white rounded-2xl p-4 border border-slate-100 text-xs text-[#64748b]">
                    No certifications are recorded for this product.
                  </p>
                )}
                {prod.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">{cert.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0f172a]">{cert.title}</h4>
                        <p className="text-[11px] text-[#64748b]">{cert.details}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#5379EE] text-xl">check_circle</span>
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
                <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-3xl">health_and_safety</span>
                </div>
                <div className="space-y-1">
                  <span className="inline-block text-[10px] uppercase bg-[#5379EE] text-white font-bold px-2 py-0.5 rounded-full">
                    Suggested alternative
                  </span>
                  <h3 className="text-lg font-bold text-[#0f172a]">{prod.safeAlternative.name}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{prod.safeAlternative.summary}</p>
                </div>
              </div>

              {/* Center: Score Mini Badge */}
              <div className="flex items-center gap-6 bg-[#EEF2FF] px-6 py-3.5 rounded-2xl border border-[#c7d2fe] w-full lg:w-auto justify-around">
                <div className="text-center">
                  <span className="text-[10px] text-[#64748b] uppercase block font-semibold">Score</span>
                  <span className="text-base font-extrabold text-[#5379EE]">Grade {prod.safeAlternative.nutriScore}</span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="text-center">
                  <span className="text-[10px] text-[#64748b] uppercase block font-semibold">
                    Facility Risk
                  </span>
                  <span className="text-base font-extrabold text-[#5379EE]">{prod.safeAlternative.facilityRisk}</span>
                </div>
              </div>

              {/* Right: CTA (only when the alternative exists in the catalog) */}
              {alternativeProduct && (
                <div className="shrink-0 w-full lg:w-auto">
                  <button
                    onClick={() => {
                      setSelectedProductId(alternativeProduct.id);
                      window.scrollTo({ top: 0 });
                    }}
                    className="w-full lg:w-auto h-11 px-6 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                  >
                    <span>View Alternative</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
