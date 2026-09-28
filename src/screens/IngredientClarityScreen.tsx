import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const IngredientClarityScreen: React.FC = () => {
  const { selectedProduct, setSelectedProductId, setActiveTab } = useApp();
  const [clarityMode, setClarityMode] = useState<'decoded' | 'original'>('decoded');
  const [savedToCollection, setSavedToCollection] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const prod = selectedProduct;

  const handleSave = () => {
    setSavedToCollection(!savedToCollection);
    setToastMsg(savedToCollection ? 'Removed from Safe Foods' : 'Saved to Safe Foods Collection!');
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 p-3.5 bg-[#0f172a] text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#84cc16] text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb Row */}
        <div className="flex items-center gap-2 font-mono-tech text-xs text-[#64748b]">
          <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#65a30d]">
            Products
          </button>
          <span>&gt;</span>
          <span className="hover:text-[#65a30d]">{prod.brand}</span>
          <span>&gt;</span>
          <span className="text-[#0f172a] font-semibold truncate max-w-[200px]">{prod.name}</span>
          <span>&gt;</span>
          <span className="bg-[#ecfccb] text-[#65a30d] px-2.5 py-0.5 rounded-full font-bold">Decoded Clarity</span>
        </div>

        {/* Product Bar & Mode Switch */}
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#f7fee7] overflow-hidden shrink-0 border border-[#d9f99d] shadow-xs">
              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">{prod.name}</h1>
                <span className="bg-[#ecfccb] text-[#65a30d] font-mono-tech text-[10px] px-2.5 py-1 rounded-full uppercase font-bold">
                  Clean Botanical
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                {prod.netWeight} Bar • {prod.ingredientsAnalysis.length + 3} Listed Ingredients • UPC {prod.barcode}
              </p>
            </div>
          </div>

          {/* Mode Toggle Switch */}
          <div className="flex items-center bg-[#f0f3ff] p-1 rounded-full self-start lg:self-auto shadow-inner">
            <button
              onClick={() => setClarityMode('original')}
              className={`px-4 py-1.5 rounded-full font-mono-tech text-xs transition-all ${
                clarityMode === 'original'
                  ? 'bg-white text-[#0f172a] shadow-xs font-bold'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              Original Label
            </button>
            <button
              onClick={() => setClarityMode('decoded')}
              className={`px-4 py-1.5 rounded-full font-mono-tech text-xs transition-all flex items-center gap-1.5 ${
                clarityMode === 'decoded'
                  ? 'bg-[#84cc16] text-[#0f172a] shadow-xs font-bold'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>Decoded Plain English</span>
            </button>
          </div>
        </div>

        {/* Top 3 Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metric 1: Processing Scale */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono-tech text-[10px] text-[#64748b] uppercase font-bold">Processing Scale</span>
                <h3 className="text-base font-bold text-[#0f172a] mt-1">NOVA {prod.novaGroup} • Processed</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#ecfccb] flex items-center justify-center text-[#65a30d]">
                <span className="material-symbols-outlined text-xl">kitchen</span>
              </div>
            </div>
            <p className="text-xs text-[#64748b] mt-2 leading-relaxed">
              Prepared by adding unrefined natural ingredients, sea salt, and plant oil to raw whole grains.
            </p>
            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between font-mono-tech text-[10px] text-[#64748b] mb-1">
                <span>NOVA 1 (Raw)</span>
                <span className="font-bold text-[#65a30d]">Tier {prod.novaGroup} (Moderate)</span>
                <span>NOVA 4 (Ultra)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 flex overflow-hidden">
                <div className="h-full bg-[#84cc16] w-1/4"></div>
                <div className="h-full bg-[#a3e635] w-1/4"></div>
                <div className="h-full bg-[#d97706] w-1/4"></div>
                <div className="h-full bg-slate-200 w-1/4"></div>
              </div>
            </div>
          </div>

          {/* Metric 2: Safety & Cleanliness Score */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono-tech text-[10px] text-[#64748b] uppercase font-bold">Safety &amp; Cleanliness</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-[#0f172a]">{prod.transparencyScore}</span>
                  <span className="font-mono-tech text-xs text-[#64748b]">/ 100</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#f7fee7] flex items-center justify-center text-[#65a30d]">
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
            </div>
            <div className="space-y-1 mt-2 text-xs text-[#65a30d] font-medium">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>0 synthetic coal-tar colorants</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>0 petrochemical preservatives (BHA/BHT)</span>
              </div>
            </div>
            <span className="font-mono-tech text-[10px] text-[#64748b] mt-3">Botanical purity index: Outstanding</span>
          </div>

          {/* Metric 3: Allergen Hazard Index */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono-tech text-[10px] text-[#64748b] uppercase font-bold">Allergen Radar</span>
                <h3 className="text-base font-bold text-[#0f172a] mt-1">
                  {prod.allergensDetected.length > 0 ? 'Moderate Sensitivity' : 'Clear Purity'}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#fffbeb] flex items-center justify-center text-[#d97706]">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
            </div>
            <p className="text-xs text-[#64748b] mt-2 leading-relaxed">
              Contains: <strong className="text-[#0f172a]">{prod.allergensDetected.join(', ') || 'None'}</strong>.
            </p>
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              {prod.allergensDetected.map((a, i) => (
                <span
                  key={i}
                  className="bg-[#fff1f2] text-[#e11d48] px-2.5 py-0.5 rounded-full font-mono-tech text-[10px] font-bold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">priority_high</span> {a}
                </span>
              ))}
              <span className="bg-[#ecfccb] text-[#65a30d] px-2.5 py-0.5 rounded-full font-mono-tech text-[10px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check</span> Dairy Free
              </span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Decoded Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Additives Decoded & Sugar Breakdown (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section: Additives Decoded */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#ecfccb] flex items-center justify-center text-[#65a30d]">
                    <span className="material-symbols-outlined text-base">biotech</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0f172a]">Additives Decoded</h2>
                    <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider">
                      E-Numbers Translated to Kitchen Realities
                    </span>
                  </div>
                </div>
                <span className="font-mono-tech text-[10px] bg-slate-100 px-2.5 py-0.5 rounded-full text-[#64748b]">
                  {prod.additivesDecoded.length} Regulated Functional Agents
                </span>
              </div>

              {/* Additives List */}
              <div className="space-y-3">
                {prod.additivesDecoded.length === 0 ? (
                  <p className="text-xs text-[#64748b]">No complex chemical food additives detected in this product.</p>
                ) : (
                  prod.additivesDecoded.map((additive, i) => (
                    <div
                      key={i}
                      className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100 space-y-2 hover:bg-[#f7fee7]/40 transition-colors"
                    >
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16]"></span>
                          <span className="font-bold text-xs text-[#0f172a]">{additive.name}</span>
                          <span className="font-mono-tech text-[10px] text-[#64748b] bg-slate-200/60 px-1.5 py-0.5 rounded">
                            {additive.eCode}
                          </span>
                        </div>
                        <span className="bg-[#ecfccb] text-[#65a30d] font-mono-tech text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-xs">eco</span>
                          <span>{additive.badge}</span>
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-100/80">
                        <span className="font-mono-tech text-[10px] text-[#65a30d] uppercase font-bold tracking-wide block">
                          Plain English Translation
                        </span>
                        <p className="text-xs text-[#1e293b] mt-0.5 leading-relaxed">{additive.translation}</p>
                      </div>

                      <div className="flex items-center justify-between font-mono-tech text-[11px] text-[#64748b] pt-1">
                        <span>Scientific role: {additive.scientificRole}</span>
                        <span className="text-[#65a30d] font-semibold">{additive.toxicityRisk}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Section: Sugars & Sweeteners Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#fffbeb] flex items-center justify-center text-[#d97706]">
                    <span className="material-symbols-outlined text-base">nutrition</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0f172a]">Sugars &amp; Sweeteners Breakdown</h2>
                    <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider">
                      Unmasking Hidden Caloric Densities
                    </span>
                  </div>
                </div>
                <span className="font-mono-tech text-[10px] bg-[#fffbeb] text-[#d97706] px-2.5 py-0.5 rounded-full font-bold">
                  {prod.sugarsBreakdown.totalGrams}g Total ({prod.sugarsBreakdown.percentDV}% DV)
                </span>
              </div>

              {/* Alert Callout */}
              <div className="bg-[#fffbeb] rounded-2xl p-4 border border-[#fde68a] flex items-start gap-3">
                <span className="material-symbols-outlined text-[#d97706] text-xl shrink-0 mt-0.5">flag</span>
                <div>
                  <h4 className="text-xs font-bold text-[#0f172a]">Multiple Sugar Disguises Detected</h4>
                  <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">
                    Manufacturers frequently distribute sugar across 3 distinct names so that whole oats can remain listed
                    as the #1 ingredient by weight.
                  </p>
                </div>
              </div>

              {/* Sweetener Stack */}
              <div className="space-y-2">
                {prod.sugarsBreakdown.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#f8fafc] p-3 rounded-2xl border border-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]"></span>
                      <div>
                        <span className="text-xs font-bold text-[#0f172a] block">{item.name}</span>
                        <span className="text-[11px] text-[#64748b]">{item.description}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono-tech text-xs font-bold text-[#0f172a] block">{item.amount}</span>
                      <span className="font-mono-tech text-[10px] text-[#64748b]">{item.sharePercent}% of sugar load</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Glycemic Spark Visual */}
              <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100 space-y-2">
                <div className="flex justify-between font-mono-tech text-[10px] text-[#64748b]">
                  <span>Estimated Glycemic Index Impact</span>
                  <span className="text-[#d97706] font-bold">{prod.sugarsBreakdown.glycemicLabel}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 flex overflow-hidden">
                  <div className="h-full bg-[#65a30d]" style={{ width: '35%' }}></div>
                  <div className="h-full bg-[#d97706]" style={{ width: '25%' }}></div>
                  <div className="h-full bg-slate-200" style={{ width: '40%' }}></div>
                </div>
                <p className="text-[11px] text-[#64748b]">
                  Fiber from whole rolled oats slows down postprandial insulin spiking significantly.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Whole Foods, Verdict & Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Whole Foods & Staples */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-[#ecfccb] flex items-center justify-center text-[#65a30d]">
                  <span className="material-symbols-outlined text-base">spa</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0f172a]">Whole Foods &amp; Staples</h2>
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider">
                    Unadulterated Ingredients
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f8fafc] border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-[#f7fee7] overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=200&auto=format&fit=crop&q=80"
                      alt="Whole Grain Rolled Oats"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#0f172a] truncate">Whole Rolled Oats</h4>
                    <p className="text-[11px] text-[#64748b] line-clamp-2">
                      Raw, unbleached oat groats rich in beta-glucan heart-healthy soluble fiber.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f8fafc] border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-[#f7fee7] overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80"
                      alt="Roasted Almond Bits"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#0f172a] truncate">Roasted Almond Bits</h4>
                    <p className="text-[11px] text-[#64748b] line-clamp-2">
                      Dry-roasted whole sweet tree nuts providing clean monounsaturated plant fats.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f8fafc] border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-[#f7fee7] overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=200&auto=format&fit=crop&q=80"
                      alt="Wildflower Honey"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#0f172a] truncate">Pure Wildflower Honey</h4>
                    <p className="text-[11px] text-[#64748b] line-clamp-2">
                      Unpasteurized natural floral sweetener retaining active pollen enzymes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The NutriScan Verdict */}
            <div className="bg-[#f7fee7] rounded-3xl p-6 border border-[#d9f99d] shadow-xs space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#65a30d] text-2xl">workspace_premium</span>
                <h3 className="text-base font-bold text-[#0f172a]">The NutriScan Verdict</h3>
              </div>
              <p className="text-xs text-[#1e293b] leading-relaxed">{prod.verdictSummary}</p>
              <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 flex items-center justify-between border border-[#d9f99d]">
                <span className="font-mono-tech text-[10px] text-[#64748b] uppercase font-bold">
                  Dietary Recommendation
                </span>
                <span className="font-mono-tech text-xs font-bold text-[#65a30d]">{prod.dietaryRecommendation}</span>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
              <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider font-bold block">
                Dietary Actions
              </span>
              <button
                onClick={handleSave}
                className={`w-full h-12 rounded-full font-mono-tech text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                  savedToCollection
                    ? 'bg-[#ecfccb] text-[#65a30d]'
                    : 'bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {savedToCollection ? 'bookmark_added' : 'bookmark_add'}
                </span>
                <span>{savedToCollection ? 'Saved to Clean Nutrition Log' : 'Save to Safe Foods Collection'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => alert('PDF clinical summary generated for download.')}
                  className="h-10 rounded-full bg-[#ecfccb] hover:bg-[#d9f99d] text-[#65a30d] font-mono-tech text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    setToastMsg('Share link copied!');
                    setTimeout(() => setToastMsg(null), 2000);
                  }}
                  className="h-10 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] font-mono-tech text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">share</span>
                  <span>Share Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
