import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const DashboardScreen: React.FC = () => {
  const {
    userProfile,
    setActiveTab,
    products,
    setSelectedProductId,
    scanLogs,
    triggerScanCheck,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'safe' | 'warnings' | 'severe'>('all');

  const filteredProducts = products.filter((prod) => {
    if (activeFilter === 'safe') return prod.nutriScore === 'A' && prod.allergensDetected.length === 0;
    if (activeFilter === 'warnings') return prod.allergensDetected.length > 0 && prod.nutriScore !== 'D';
    if (activeFilter === 'severe') return prod.allergensDetected.includes('Peanut Flour') || prod.nutriScore === 'D';
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Top Greeting Banner & Live Shield */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#f7fee7] rounded-full blur-3xl pointer-events-none opacity-80"></div>
          <div className="flex flex-col gap-2 z-10">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Good morning, {userProfile.displayName}!
              </h1>
              <div className="inline-flex items-center gap-1.5 bg-[#ecfccb] px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#84cc16] animate-ping"></span>
                <span className="font-mono-tech text-xs text-[#65a30d] font-bold">
                  Shield Active: {userProfile.activeAllergens.filter((a) => a.active).length} restrictions
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Peanuts, Gluten, Dairy, and Added Emulsifiers are actively monitored across all your scans.
            </p>
          </div>
          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => setActiveTab('allergen-radar')}
              className="inline-flex items-center gap-1.5 bg-[#ecfccb] hover:bg-[#d9f99d] text-[#65a30d] px-4 py-2 rounded-full font-mono-tech text-xs font-bold transition-all"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Edit Tiers</span>
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className="inline-flex items-center gap-1.5 bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white px-5 py-2 rounded-full font-mono-tech text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-base">qr_code_scanner</span>
              <span>Quick Scan</span>
            </button>
          </div>
        </div>

        {/* Stat Counters Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#ecfccb] flex items-center justify-center text-[#65a30d]">
              <span className="material-symbols-outlined text-2xl">barcode_scanner</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0f172a] block">48</span>
              <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">
                Scans This Month
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#fff1f2] flex items-center justify-center text-[#e11d48]">
              <span className="material-symbols-outlined text-2xl">shield_with_heart</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#e11d48] block">12</span>
              <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">
                Warnings Flagged
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#f7fee7] flex items-center justify-center text-[#65a30d]">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0f172a] block">98%</span>
              <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">
                Safe Choice Rate
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#f0f3ff] flex items-center justify-center text-[#565e74]">
              <span className="material-symbols-outlined text-2xl">swap_calls</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0f172a] block">3</span>
              <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">
                Saved Swaps
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Hero Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Scanner Trigger Box */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono-tech text-[10px] text-[#65a30d] font-bold uppercase tracking-wider">
                  Fast Detection
                </span>
                <h2 className="text-lg font-bold text-[#0f172a]">Quick Barcode &amp; Label Scanner</h2>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Scan packaged goods or upload high-res ingredient lists to verify purity instantly.
                </p>
              </div>
              <span className="w-10 h-10 rounded-full bg-[#ecfccb] flex items-center justify-center text-[#65a30d]">
                <span className="material-symbols-outlined text-xl">camera_alt</span>
              </span>
            </div>

            <div
              onClick={() => setActiveTab('scanner')}
              className="my-5 p-6 rounded-2xl bg-[#f7fee7] border border-dashed border-[#84cc16] flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-[#ecfccb]/60 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#65a30d] shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">upload_file</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#0f172a]">Drop nutrition panel or packaging image</p>
                <p className="text-[11px] text-[#64748b]">Supports JPG, PNG, WEBP or Barcode scans</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('scanner')}
              className="w-full h-11 bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white rounded-full font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">view_in_ar</span>
              <span>Open Scanner Viewfinder</span>
            </button>
          </div>

          {/* Card 2: Emergency Allergen Alert Summary */}
          <div className="lg:col-span-6 bg-[#fff1f2] rounded-3xl p-6 sm:p-7 border border-[#ffdad6] flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[#e11d48]">
                  <span className="material-symbols-outlined text-base">warning</span>
                  <span className="font-mono-tech text-[10px] uppercase font-bold tracking-wider">High Alert Trigger</span>
                </div>
                <h2 className="text-lg font-bold text-[#0f172a]">Recent Allergen Clash Detected</h2>
                <p className="text-xs text-[#64748b] mt-0.5">Scanned 14 minutes ago at Greenleaf Market.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#ffdad6] text-[#93000a] font-mono-tech text-[10px] font-bold uppercase">
                Severe Trigger
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl my-4 border border-[#ffdad6] flex items-center gap-3.5 shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1517093707577-03f69e6b432a?w=400&auto=format&fit=crop&q=80"
                alt="Golden Harvest Granola"
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-[#0f172a] truncate">Golden Harvest Honey Oat Crunch</h3>
                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#fff1f2] text-[#e11d48] font-mono-tech text-[10px] font-bold">
                    Contains Peanut Flour
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#fff1f2] text-[#e11d48] font-mono-tech text-[10px] font-bold">
                    Wheat Gluten
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
              <div className="flex items-center gap-1 text-xs text-[#0f172a]">
                <span className="material-symbols-outlined text-[#65a30d] text-base">lightbulb</span>
                <span className="text-[11px]">
                  Suggested Clean Alternative:{' '}
                  <strong className="text-[#65a30d]">Nut-Free Pure Amaranth Bites</strong>
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedProductId('prod-roasted-granola');
                  setActiveTab('product-analysis');
                }}
                className="px-4 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-[#0f172a] font-mono-tech text-xs font-bold rounded-full transition-colors shadow-xs"
              >
                View Safe Swap
              </button>
            </div>
          </div>
        </div>

        {/* Main Section: Recent Scans & Product Health Matrix */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#0f172a]">Recent Scans &amp; Product Matrix</h2>
              <p className="text-xs text-[#64748b]">
                Real-time breakdown of allergen alerts, Nutri-Score, and botanical purity.
              </p>
            </div>
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-full font-mono-tech text-xs font-bold transition-all ${
                  activeFilter === 'all'
                    ? 'bg-[#ecfccb] text-[#65a30d]'
                    : 'bg-white text-[#64748b] hover:text-[#0f172a] border border-slate-100'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setActiveFilter('safe')}
                className={`px-3 py-1 rounded-full font-mono-tech text-xs font-bold transition-all ${
                  activeFilter === 'safe'
                    ? 'bg-[#ecfccb] text-[#65a30d]'
                    : 'bg-white text-[#64748b] hover:text-[#0f172a] border border-slate-100'
                }`}
              >
                Safe (100%)
              </button>
              <button
                onClick={() => setActiveFilter('warnings')}
                className={`px-3 py-1 rounded-full font-mono-tech text-xs font-bold transition-all ${
                  activeFilter === 'warnings'
                    ? 'bg-[#ecfccb] text-[#65a30d]'
                    : 'bg-white text-[#64748b] hover:text-[#0f172a] border border-slate-100'
                }`}
              >
                Warnings ({products.filter((p) => p.allergensDetected.length > 0).length})
              </button>
            </div>
          </div>

          {/* 4-Column Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.slice(0, 4).map((prod) => {
              const isHazard = prod.allergensDetected.some((a) =>
                userProfile.activeAllergens
                  .filter((ua) => ua.active)
                  .some((ua) => a.toLowerCase().includes(ua.name.toLowerCase().split(' ')[0]))
              );

              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    setSelectedProductId(prod.id);
                    setActiveTab('product-analysis');
                  }}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#84cc16]/50 transition-all cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs">
                        <span className="font-mono-tech text-[10px] text-[#64748b] font-bold">SCORE</span>
                        <span
                          className={`font-mono-tech text-xs font-extrabold ${
                            prod.nutriScore === 'A'
                              ? 'text-[#65a30d]'
                              : prod.nutriScore === 'B'
                              ? 'text-[#84cc16]'
                              : 'text-[#d97706]'
                          }`}
                        >
                          {prod.nutriScore}
                        </span>
                      </div>
                      <div
                        className={`absolute top-2 right-2 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono-tech text-[10px] font-bold shadow-xs ${
                          isHazard
                            ? 'bg-[#fff1f2] text-[#e11d48]'
                            : prod.allergensDetected.length > 0
                            ? 'bg-[#fffbeb] text-[#d97706]'
                            : 'bg-[#ecfccb] text-[#65a30d]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {isHazard ? 'warning' : prod.allergensDetected.length > 0 ? 'report' : 'check_circle'}
                        </span>
                        <span>{isHazard ? 'ALERT' : prod.allergensDetected.length > 0 ? 'FLAGGED' : 'SAFE'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-[#64748b] font-mono-tech uppercase">
                        {prod.brand} • {prod.netWeight}
                      </span>
                      <h3 className="text-sm font-bold text-[#0f172a] truncate">{prod.name}</h3>
                      <p className="text-xs text-[#64748b] mt-1 line-clamp-2 leading-relaxed">
                        {prod.verdictSummary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold ${
                        isHazard
                          ? 'text-[#e11d48]'
                          : prod.allergensDetected.length > 0
                          ? 'text-[#d97706]'
                          : 'text-[#65a30d]'
                      }`}
                    >
                      {isHazard ? 'Shield Flagged' : prod.allergensDetected.length > 0 ? 'Trace Caution' : 'Verified Safe'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerScanCheck(prod);
                      }}
                      className="w-7 h-7 rounded-full bg-[#f1f5f9] hover:bg-[#84cc16] hover:text-[#0f172a] flex items-center justify-center text-[#64748b] transition-colors"
                      title="Test Sensory Scan"
                    >
                      <span className="material-symbols-outlined text-base">radar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Split 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Daily Nutrition Insight */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#65a30d]">
                  <span className="material-symbols-outlined text-base">science</span>
                  <span className="font-mono-tech text-[10px] font-bold uppercase tracking-wider">
                    Botanical Lab Intelligence
                  </span>
                </div>
                <span className="font-mono-tech text-[11px] text-[#64748b]">2 min read</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0f172a]">Understanding E-Numbers, Thickeners &amp; Emulsifiers</h3>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                  Not all additives are harmful. Discover which common stabilizers like E407 (Carrageenan) impact
                  intestinal mucosa, and safe natural alternatives like cold-water acacia fiber.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-[#f7fee7] flex flex-col">
                  <span className="font-mono-tech text-[11px] text-[#65a30d] font-bold">E412 (Guar Gum)</span>
                  <span className="text-xs text-[#0f172a] font-medium">Safe Botanical</span>
                </div>
                <div className="p-3 rounded-xl bg-[#fff1f2] flex flex-col">
                  <span className="font-mono-tech text-[11px] text-[#e11d48] font-bold">E407 (Carrageenan)</span>
                  <span className="text-xs text-[#0f172a] font-medium">Inflammation Risk</span>
                </div>
                <div className="p-3 rounded-xl bg-[#ecfccb] flex flex-col">
                  <span className="font-mono-tech text-[11px] text-[#65a30d] font-bold">E322 (Lecithin)</span>
                  <span className="text-xs text-[#0f172a] font-medium">Sunflower Pure</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-2 border-t border-slate-50">
              <button
                onClick={() => setActiveTab('ingredient-clarity')}
                className="inline-flex items-center gap-1 font-mono-tech text-xs font-bold text-[#65a30d] hover:text-[#0f172a] transition-colors"
              >
                <span>Read full additive guide</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button
                onClick={() => alert('Article bookmarked to clinical reading list.')}
                className="text-[11px] text-[#64748b] hover:text-[#0f172a]"
              >
                Bookmark Article
              </button>
            </div>
          </div>

          {/* Right Column: Quick Actions & Watchlists */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#0f172a]">Actions &amp; Watchlists</h3>
                <span className="w-8 h-8 rounded-full bg-[#ecfccb] flex items-center justify-center text-[#65a30d]">
                  <span className="material-symbols-outlined text-base">bolt</span>
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setActiveTab('allergen-radar')}
                  className="p-3 rounded-2xl hover:bg-[#f7fee7] transition-colors flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#ecfccb] flex items-center justify-center text-[#65a30d]">
                      <span className="material-symbols-outlined text-lg">radar</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0f172a] group-hover:text-[#65a30d] transition-colors block">
                        Edit Allergen Radar
                      </span>
                      <span className="text-[11px] text-[#64748b]">Fine-tune tolerance thresholds &amp; sensitivity</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#65a30d] text-base transition-colors">
                    chevron_right
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSelectedProductId('prod-roasted-granola');
                    setActiveTab('product-analysis');
                  }}
                  className="p-3 rounded-2xl hover:bg-[#f7fee7] transition-colors flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#ecfccb] flex items-center justify-center text-[#65a30d]">
                      <span className="material-symbols-outlined text-lg">swap_horiz</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0f172a] group-hover:text-[#65a30d] transition-colors block">
                        Safe Swaps Directory
                      </span>
                      <span className="text-[11px] text-[#64748b]">Browse 4,500+ verified allergen-safe substitutes</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#65a30d] text-base transition-colors">
                    chevron_right
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('allergen-radar')}
                  className="p-3 rounded-2xl hover:bg-[#f7fee7] transition-colors flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#ecfccb] flex items-center justify-center text-[#65a30d]">
                      <span className="material-symbols-outlined text-lg">add_circle</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0f172a] group-hover:text-[#65a30d] transition-colors block">
                        Add Custom Additive Watch
                      </span>
                      <span className="text-[11px] text-[#64748b]">Track artificial sweeteners, dyes, or preservatives</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#65a30d] text-base transition-colors">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-50 text-[11px] text-[#64748b]">
              <span>Database Synced: 2 min ago</span>
              <span className="inline-flex items-center gap-1 font-mono-tech text-[#65a30d] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16]"></span>
                Cloud Sync Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
