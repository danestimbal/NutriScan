import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSmartProductFallbackImage } from '../utils/barcode';

export const IngredientClarityScreen: React.FC = () => {
  const { selectedProduct, setActiveTab, userProfile, toggleSavedProduct } = useApp();
  const [clarityMode, setClarityMode] = useState<'decoded' | 'original'>('decoded');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const prod = selectedProduct;
  const savedToCollection = (userProfile.savedProductIds || []).includes(prod.id);
  const wholeFoodItems =
    prod.ingredientsAnalysis.filter((item) => item.status === 'Safe').length > 0
      ? prod.ingredientsAnalysis.filter((item) => item.status === 'Safe')
      : prod.ingredientsAnalysis;
  const isDairyFree = !prod.allergensDetected.some(
    (a) => a.toLowerCase().includes('milk') || a.toLowerCase().includes('dairy') || a.toLowerCase().includes('lactose')
  );
  const isGlutenFree = !prod.allergensDetected.some(
    (a) => a.toLowerCase().includes('wheat') || a.toLowerCase().includes('gluten') || a.toLowerCase().includes('barley')
  );

  // Dynamic NOVA group metadata
  const novaMeta = (() => {
    switch (prod.novaGroup) {
      case 1:
        return {
          title: 'NOVA 1 • Unprocessed / Raw',
          tierLabel: 'Tier 1 (Minimal)',
          description:
            'Unprocessed or minimally processed whole food prepared through natural fermentation, pressing, or filtering with no synthetic additives.',
        };
      case 2:
        return {
          title: 'NOVA 2 • Culinary Ingredient',
          tierLabel: 'Tier 2 (Low)',
          description:
            'Processed culinary ingredient derived directly from whole foods by pressing, refining, grinding, or milling.',
        };
      case 3:
        return {
          title: 'NOVA 3 • Processed Food',
          tierLabel: 'Tier 3 (Moderate)',
          description:
            'Prepared by combining whole foods with culinary ingredients such as salt, oil, or sugar for preservation and flavor.',
        };
      default:
        return {
          title: 'NOVA 4 • Ultra-Processed',
          tierLabel: 'Tier 4 (Ultra)',
          description:
            'Industrial formulation containing multiple refined extracts, synthetic additives, emulsifiers, or flavor enhancers.',
        };
    }
  })();

  // Dynamic Safety & Cleanliness breakdown
  const highRiskAdditives = prod.additivesDecoded.filter(
    (a) => a.toxicityRisk.toLowerCase().includes('high') || a.toxicityRisk.toLowerCase().includes('moderate')
  );
  const purityIndexLabel =
    prod.transparencyScore >= 90
      ? 'Outstanding'
      : prod.transparencyScore >= 75
        ? 'Good'
        : prod.transparencyScore >= 50
          ? 'Moderate'
          : 'Low (Ultra-Processed)';

  // Dynamic Glycemic & Sugar metrics
  const totalSugars = prod.sugarsBreakdown.totalGrams;
  const sweetenerItems = prod.sugarsBreakdown.items.filter((i) => totalSugars > 0 || !i.name.toLowerCase().includes('zero'));
  const hasMultipleSugars = totalSugars > 0 && sweetenerItems.length > 1;
  const glycemicBarPercent =
    totalSugars === 0
      ? 5
      : prod.sugarsBreakdown.glycemicLabel.toLowerCase().includes('low')
        ? 25
        : prod.sugarsBreakdown.glycemicLabel.toLowerCase().includes('moderate')
          ? 55
          : 85;

  const glycemicExplanation = (() => {
    if (totalSugars === 0) {
      return `0g total sugars and ${prod.nutrients.carbs} carbohydrates produce virtually zero postprandial blood glucose or insulin spike.`;
    }
    const fiberVal = parseFloat(prod.nutrients.fiber) || 0;
    if (fiberVal >= 3) {
      return `${prod.nutrients.fiber} of dietary fiber per serving helps moderate glucose absorption from ${totalSugars}g total sugars (${prod.nutrients.addedSugars} added).`;
    }
    return `Contains ${totalSugars}g total sugars (${prod.nutrients.addedSugars} added) with ${prod.nutrients.fiber} dietary fiber per ${prod.nutrients.servingSize} serving.`;
  })();

  const handleSave = () => {
    const nowSaved = toggleSavedProduct(prod.id);
    setToastMsg(nowSaved ? 'Saved to Safe Foods Collection (Synced to Cloud)!' : 'Removed from Safe Foods');
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 p-3.5 bg-[#0f172a] text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#5379EE] text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb Row */}
        <div className="flex items-center gap-2 font-mono-tech text-xs text-[#64748b]">
          <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#5379EE]">
            Products
          </button>
          <span>&gt;</span>
          <span className="hover:text-[#5379EE]">{prod.brand}</span>
          <span>&gt;</span>
          <span className="text-[#0f172a] font-semibold truncate max-w-[200px]">{prod.name}</span>
          <span>&gt;</span>
          <span className="bg-[#EEF2FF] text-[#5379EE] px-2.5 py-0.5 rounded-full font-bold">Decoded Clarity</span>
        </div>

        {/* Product Bar & Mode Switch */}
        <div className="w-full bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] overflow-hidden shrink-0 border border-[#dae2fd] shadow-xs">
              <img
                src={prod.image}
                alt={prod.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getSmartProductFallbackImage(prod.name, prod.category);
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">{prod.name}</h1>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                {prod.netWeight} • {prod.category} • {prod.ingredientsAnalysis.length} Listed{' '}
                {prod.ingredientsAnalysis.length === 1 ? 'Ingredient' : 'Ingredients'} • UPC {prod.barcode}
              </p>
            </div>
          </div>

          {/* Mode Toggle Switch */}
          <div className="flex items-center bg-[#f0f3ff] p-1 rounded-full self-start lg:self-auto shadow-inner">
            <button
              onClick={() => setClarityMode('original')}
              className={`px-4 py-1.5 rounded-full font-mono-tech text-xs transition-all cursor-pointer ${clarityMode === 'original'
                    ? 'bg-white text-[#0f172a] shadow-xs font-bold'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
            >
              Original Label
            </button>
            <button
              onClick={() => setClarityMode('decoded')}
              className = {`px-4 py-1.5 rounded-full font-mono-tech text-xs transition-all flex items-center gap-1.5 cursor-pointer ${clarityMode === 'decoded'
                  ? 'bg-[#5379EE] text-white shadow-xs font-bold'
                  : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
            >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>Decoded Plain English</span>
          </button>
        </div>
      </div>

      {/* Original Label Raw Statement Banner when toggled */}
      {clarityMode === 'original' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono-tech text-xs uppercase font-bold text-[#0f172a]">
              Original Package Ingredient Declaration ({prod.brand})
            </span>
            <span className="font-mono-tech text-[11px] text-[#64748b]">Serving Size: {prod.nutrients.servingSize}</span>
          </div>
          <p className="font-mono-tech text-xs text-[#1e293b] leading-relaxed bg-[#f8fafc] p-4 rounded-2xl border border-slate-100 uppercase">
            INGREDIENTS:{' '}
            {prod.ingredientsVerbatim ||
              `${prod.ingredientsAnalysis.map((i) => i.name).join(', ')}${prod.additivesDecoded.length > 0
                ? `, ${prod.additivesDecoded.map((a) => `${a.name} (${a.eCode})`).join(', ')}`
                : ''
              }.`}
          </p>
          {prod.allergensDetected.length > 0 && (
            <p className="font-mono-tech text-xs font-bold text-[#e11d48]">
              CONTAINS: {prod.allergensDetected.join(', ').toUpperCase()}.
            </p>
          )}
        </div>
      )}

      {/* Top 3 Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Processing Scale */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono-tech text-[10px] text-[#64748b] uppercase font-bold">Processing Scale</span>
              <h3 className="text-base font-bold text-[#0f172a] mt-1">{novaMeta.title}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#5379EE]">
              <span className="material-symbols-outlined text-xl">kitchen</span>
            </div>
          </div>
          <p className="text-xs text-[#64748b] mt-2 leading-relaxed">{novaMeta.description}</p>
          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between font-mono-tech text-[10px] text-[#64748b] mb-1">
              <span>NOVA 1 (Raw)</span>
              <span className="font-bold text-[#5379EE]">{novaMeta.tierLabel}</span>
              <span>NOVA 4 (Ultra)</span>
            </div>
              <div className="w-full h-2 rounded-full bg-slate-100 flex overflow-hidden gap-0.5">
                <div className={`h-full w-1/4 ${prod.novaGroup >= 1 ? 'bg-[#10b981]' : 'bg-slate-200'}`}></div>
                <div className={`h-full w-1/4 ${prod.novaGroup >= 2 ? 'bg-[#5379EE]' : 'bg-slate-200'}`}></div>
                <div className={`h-full w-1/4 ${prod.novaGroup >= 3 ? 'bg-[#d97706]' : 'bg-slate-200'}`}></div>
                <div className={`h-full w-1/4 ${prod.novaGroup >= 4 ? 'bg-[#e11d48]' : 'bg-slate-200'}`}></div>
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
              <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#5379EE]">
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
            </div>
              <div className="space-y-1 mt-2 text-xs font-medium">
                {prod.additivesDecoded.length === 0 ? (
                  <>
                    <div className="flex items-center gap-1.5 text-[#059669]">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>0 synthetic additives or artificial dyes</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#5379EE]">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>0 chemical preservatives detected</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 text-[#d97706]">
                      <span className="material-symbols-outlined text-sm">info</span>
                      <span>
                        {prod.additivesDecoded.length} functional additive{prod.additivesDecoded.length === 1 ? '' : 's'} decoded
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 ${highRiskAdditives.length > 0 ? 'text-[#e11d48]' : 'text-[#5379EE]'
                        }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {highRiskAdditives.length > 0 ? 'warning' : 'check_circle'}
                      </span>
                      <span>
                        {highRiskAdditives.length > 0
                          ? `${highRiskAdditives.length} elevated-caution agent(s) flagged`
                          : 'Low toxicological risk profile'}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <span className="font-mono-tech text-[10px] text-[#64748b] mt-3">
                Botanical purity index: {purityIndexLabel}
              </span>
            </div>

            {/* Metric 3: Allergen Hazard Index */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase font-bold">Allergen Radar</span>
                  <h3 className="text-base font-bold text-[#0f172a] mt-1">
                    {prod.allergensDetected.length > 0 ? 'Allergen Trigger Detected' : 'Clear Purity'}
                  </h3>
                </div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${prod.allergensDetected.length > 0
                        ? 'bg-[#fffbeb] text-[#d97706]'
                        : 'bg-[#ecfdf5] text-[#059669]'
                      }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {prod.allergensDetected.length > 0 ? 'warning' : 'verified_user'}
                    </span>
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
                  {isDairyFree && (
                    <span className="bg-[#EEF2FF] text-[#5379EE] px-2.5 py-0.5 rounded-full font-mono-tech text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">check</span> Dairy Free
                    </span>
                  )}
                  {isGlutenFree && (
                    <span className="bg-[#ecfdf5] text-[#059669] px-2.5 py-0.5 rounded-full font-mono-tech text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">check</span> Gluten Free
                    </span>
                  )}
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
                      <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#5379EE]">
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
                      {prod.additivesDecoded.length} Regulated Functional{' '}
                      {prod.additivesDecoded.length === 1 ? 'Agent' : 'Agents'}
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
                          className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100 space-y-2 hover:bg-[#EEF2FF]/40 transition-colors"
                        >
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#5379EE]"></span>
                              <span className="font-bold text-xs text-[#0f172a]">{additive.name}</span>
                              <span className="font-mono-tech text-[10px] text-[#64748b] bg-slate-200/60 px-1.5 py-0.5 rounded">
                                {additive.eCode}
                              </span>
                            </div>
                            <span className="bg-[#EEF2FF] text-[#5379EE] font-mono-tech text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                              <span className="material-symbols-outlined text-xs">eco</span>
                              <span>{additive.badge}</span>
                            </span>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-slate-100/80">
                            <span className="font-mono-tech text-[10px] text-[#5379EE] uppercase font-bold tracking-wide block">
                              Plain English Translation
                            </span>
                            <p className="text-xs text-[#1e293b] mt-0.5 leading-relaxed">{additive.translation}</p>
                          </div>

                          <div className="flex items-center justify-between font-mono-tech text-[11px] text-[#64748b] pt-1">
                            <span>Scientific role: {additive.scientificRole}</span>
                            <span className="text-[#5379EE] font-semibold">{additive.toxicityRisk}</span>
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
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${totalSugars === 0 ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fffbeb] text-[#d97706]'
                            }`}
                        >
                          <span className="material-symbols-outlined text-base">nutrition</span>
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-[#0f172a]">Sugars &amp; Sweeteners Breakdown</h2>
                          <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider">
                            Unmasking Hidden Caloric Densities
                          </span>
                        </div>
                      </div>
                        <span
                          className={`font-mono-tech text-[10px] px-2.5 py-0.5 rounded-full font-bold ${totalSugars === 0 ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fffbeb] text-[#d97706]'
                            }`}
                        >
                          {totalSugars}g Total ({prod.sugarsBreakdown.percentDV}% DV)
                        </span>
                    </div>

                        {/* Dynamic Sugar Callout based on actual product sugar profile */}
                        {totalSugars === 0 ? (
                          <div className="bg-[#ecfdf5] rounded-2xl p-4 border border-[#a7f3d0] flex items-start gap-3">
                            <span className="material-symbols-outlined text-[#059669] text-xl shrink-0 mt-0.5">verified</span>
                            <div>
                              <h4 className="text-xs font-bold text-[#065f46]">Zero Sugar &amp; No Hidden Sweeteners</h4>
                              <p className="text-xs text-[#047857] mt-0.5 leading-relaxed">
                                {prod.name} contains 0g total sugars and 0g added sugars per {prod.nutrients.servingSize} serving.
                              </p>
                            </div>
                          </div>
                      ) : hasMultipleSugars ? (
                      <div className="bg-[#fffbeb] rounded-2xl p-4 border border-[#fde68a] flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#d97706] text-xl shrink-0 mt-0.5">flag</span>
                        <div>
                          <h4 className="text-xs font-bold text-[#0f172a]">
                            Multiple Sweetener Sources Detected ({sweetenerItems.length} types)
                          </h4>
                          <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">
                            Sugars in {prod.name} are distributed across{' '}
                            <strong>{sweetenerItems.map((s) => s.name).join(', ')}</strong> totaling {totalSugars}g per{' '}
                            {prod.nutrients.servingSize} serving ({prod.nutrients.addedSugars} added sugars).
                          </p>
                        </div>
                      </div>
                      ) : (
                      <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-200 flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#5379EE] text-xl shrink-0 mt-0.5">info</span>
                        <div>
                          <h4 className="text-xs font-bold text-[#0f172a]">Single Sugar Profile</h4>
                          <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">
                            Contains {totalSugars}g total sugars ({prod.nutrients.addedSugars} added sugars) per{' '}
                            {prod.nutrients.servingSize} serving.
                          </p>
                        </div>
                      </div>
              )}

                      {/* Sweetener Stack */}
                      <div className="space-y-2">
                        {prod.sugarsBreakdown.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-[#f8fafc] p-3 rounded-2xl border border-slate-100"
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${totalSugars === 0 ? 'bg-[#10b981]' : 'bg-[#d97706]'
                                  }`}
                              ></span>
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
                          <span
                            className={`font-bold ${totalSugars === 0 ? 'text-[#059669]' : 'text-[#d97706]'
                              }`}
                          >
                            {prod.sugarsBreakdown.glycemicLabel}
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-200 flex overflow-hidden">
                          <div
                            className={`h-full transition-all ${totalSugars === 0
                                ? 'bg-[#10b981]'
                                : glycemicBarPercent <= 35
                                  ? 'bg-[#5379EE]'
                                  : glycemicBarPercent <= 65
                                    ? 'bg-[#d97706]'
                                    : 'bg-[#e11d48]'
                              }`}
                            style={{ width: `${glycemicBarPercent}%` }}
                          ></div>
                        </div>
                        <p className="text-[11px] text-[#64748b]">{glycemicExplanation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Whole Foods, Verdict & Actions (5 Cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Whole Foods & Staples */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#5379EE]">
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
                        {wholeFoodItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f8fafc] border border-slate-100"
                          >
                            <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] overflow-hidden shrink-0 flex items-center justify-center text-[#5379EE]">
                              <img
                                src={getSmartProductFallbackImage(item.name, prod.category)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#0f172a] truncate">{item.name}</h4>
                              <p className="text-[11px] text-[#64748b] line-clamp-2">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* The IngreGuide Verdict */}
                    <div className="bg-[#eef2ff] rounded-3xl p-6 border border-[#c7d2fe] shadow-xs space-y-3 relative overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#5379EE] text-2xl">workspace_premium</span>
                        <h3 className="text-base font-bold text-[#0f172a]">The IngreGuide Verdict</h3>
                      </div>
                      <p className="text-xs text-[#1e293b] leading-relaxed">{prod.verdictSummary}</p>
                      <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 flex items-center justify-between border border-[#c7d2fe]">
                        <span className="font-mono-tech text-[10px] text-[#64748b] uppercase font-bold">
                          Dietary Recommendation
                        </span>
                        <span className="font-mono-tech text-xs font-bold text-[#5379EE]">{prod.dietaryRecommendation}</span>
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
                      <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider font-bold block">
                        Dietary Actions
                      </span>
                      <button
                        onClick={handleSave}
                        className={`w-full h-12 rounded-full font-mono-tech text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${savedToCollection
                              ? 'bg-[#EEF2FF] text-[#5379EE]'
                              : 'bg-[#5379EE] hover:bg-[#4368DD] text-white'
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
                  className="h-10 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5379EE] font-mono-tech text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
                  className="h-10 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] font-mono-tech text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
