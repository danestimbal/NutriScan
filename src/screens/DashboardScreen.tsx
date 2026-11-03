import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NutritionHistoryChart } from '../components/NutritionHistoryChart';
import { ResearchMetricsPanel } from '../components/ResearchMetricsPanel';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = products.filter((prod) => {
    // Safety status filter
    if (activeFilter === 'safe' && !(prod.nutriScore === 'A' && prod.allergensDetected.length === 0)) return false;
    if (activeFilter === 'warnings' && !(prod.allergensDetected.length > 0 && prod.nutriScore !== 'D')) return false;
    if (activeFilter === 'severe' && !(prod.allergensDetected.includes('Peanut Flour') || prod.nutriScore === 'D')) return false;

    // Category filter (Figure 3 in IngreGuide RS-IV Plan)
    if (selectedCategory === 'all') return true;
    const catLower = prod.category.toLowerCase();
    if (selectedCategory === 'drinks') return catLower.includes('drink') || catLower.includes('beverage');
    if (selectedCategory === 'snacks') return catLower.includes('snack') || catLower.includes('bar') || catLower.includes('chip') || catLower.includes('confectionery') || catLower.includes('treat');
    if (selectedCategory === 'dairy') return catLower.includes('dairy') || catLower.includes('milk') || catLower.includes('cheese') || catLower.includes('yogurt') || catLower.includes('butter');
    if (selectedCategory === 'bakery') return catLower.includes('bakery') || catLower.includes('bread') || catLower.includes('muffin') || catLower.includes('tortilla');
    if (selectedCategory === 'pantry') return catLower.includes('pantry') || catLower.includes('sauce') || catLower.includes('grain') || catLower.includes('rice') || catLower.includes('pasta') || catLower.includes('condiment') || catLower.includes('spread') || catLower.includes('cereal') || catLower.includes('oat');
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Top Greeting Banner & Live Shield */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#eef2ff] rounded-full blur-3xl pointer-events-none opacity-80"></div>
          <div className="flex flex-col gap-2 z-10">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Good morning, {userProfile.displayName}!
              </h1>
              <div className="inline-flex items-center gap-1.5 bg-[#e0e7ff] px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#5379EE] animate-ping"></span>
                <span className="font-mono-tech text-xs text-[#4338ca] font-bold">
                  Shield Active: {userProfile.activeAllergens.filter((a) => a.active).length} restrictions
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Peanuts, Gluten, Dairy, and Added Emulsifiers are actively monitored across all your scans.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 z-10 flex-wrap">
            <button
              onClick={() => setActiveTab('onboarding')}
              className="inline-flex items-center gap-1.5 bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#5379EE] px-4 py-2 rounded-full font-mono-tech text-xs font-bold transition-all border border-[#dbe4fe]"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Profile Wizard</span>
            </button>
            <button
              onClick={() => setActiveTab('allergen-radar')}
              className="inline-flex items-center gap-1.5 bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#5379EE] px-4 py-2 rounded-full font-mono-tech text-xs font-bold transition-all border border-[#dbe4fe]"
            >
              <span className="material-symbols-outlined text-base">radar</span>
              <span>Allergen Radar</span>
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className="inline-flex items-center gap-1.5 bg-[#5379EE] hover:bg-[#4368DD] text-white px-5 py-2 rounded-full font-mono-tech text-xs font-bold transition-all shadow-[0_4px_16px_rgba(83,121,238,0.35)] active:scale-95"
            >
              <span className="material-symbols-outlined text-base">qr_code_scanner</span>
              <span>Quick Scan</span>
            </button>
          </div>
        </div>

        {/* Stat Counters Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#e0e7ff] flex items-center justify-center text-[#5379EE]">
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
            <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] flex items-center justify-center text-[#059669]">
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

        {/* Figure 3: Hero Action Banner - "READY? SET, SCAN!" with periwinkle theme */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Hero Card: READY? SET, SCAN! (mirroring Figure 3 left side) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#4F72EC] via-[#5379EE] to-[#6C90FA] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
            {/* Ambient watermarks & decorative elements from Figure 3 */}
            <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute top-6 right-6 w-16 h-16 rounded-full border border-white/20 pointer-events-none"></div>
            <div className="absolute top-14 right-14 w-8 h-8 rounded-full border border-white/20 pointer-events-none"></div>

            <div className="space-y-4 z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span className="font-mono-tech text-[10px] text-white font-bold uppercase tracking-wider">
                  IngreGuide Barcode Recognition System
                </span>
              </div>

              {/* Figure 3 Title: Vertical white accent bar + READY? SET, SCAN! */}
              <div className="flex items-stretch gap-3.5">
                <div className="w-1.5 bg-white rounded-full"></div>
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase leading-none">
                    READY?<br />SET,<br />SCAN!
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-white/90 max-w-md pt-1">
                &quot;Read with Sight, Choose What's Right.&quot; Point your camera at any packaged food barcode or upload an image to decode ingredients instantly.
              </p>
            </div>

            {/* Figure 3 Reticle Box & "SCAN HERE!" Button */}
            <div className="mt-6 pt-4 border-t border-white/20 z-10">
              {/* Reticle Viewfinder Area */}
              <div className="relative w-full py-4 px-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-between mb-4">
                {/* 4 Corner Crosshairs */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white"></div>

                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-white text-2xl">crop_free</span>
                  <div className="text-xs text-white">
                    <p className="font-bold">UPC / EAN Barcode Detector</p>
                    <p className="text-white/80 text-[11px]">Ready for instant auto-focus</p>
                  </div>
                </div>

                {/* Big Prominent "SCAN HERE!" Button from Figure 3 */}
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="px-6 py-3 bg-[#6B8FF8] hover:bg-white text-white hover:text-[#5379EE] font-black text-sm rounded-full transition-all border-2 border-white flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)] active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                  <span className="tracking-wide">SCAN HERE!</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: High Alert Allergen Trigger Clash */}
          <div className="lg:col-span-5 bg-[#fff1f2] rounded-3xl p-6 sm:p-7 border border-[#ffdad6] flex flex-col justify-between shadow-xs">
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
                <span className="material-symbols-outlined text-[#5379EE] text-base">lightbulb</span>
                <span className="text-[11px]">
                  Suggested Clean Alternative:{' '}
                  <strong className="text-[#5379EE]">Nut-Free Pure Amaranth Bites</strong>
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

        {/* Figure 3: "Welcome Back, User!" Header with Blue Underline */}
        <div className="pt-2">
          <h1 className="text-2xl sm:text-3xl font-black text-[#5379EE] tracking-tight underline decoration-4 decoration-[#5379EE] underline-offset-8">
            Welcome Back, {userProfile.displayName || 'User'}!
          </h1>
        </div>

        {/* Figure 3: "— RECENT SCANS —" Carousel with Chevrons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#475569]">
              — RECENT SCANS —
            </h2>
            <button
              onClick={() => setActiveTab('scanner')}
              className="text-xs font-mono-tech text-[#5379EE] hover:underline flex items-center gap-1 font-bold"
            >
              <span>Scan New Item</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Left Chevron from Figure 3 */}
            <button
              onClick={() => {
                const el = document.getElementById('recent-scans-track');
                if (el) el.scrollBy({ left: -260, behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-full bg-[#e0e7ff] hover:bg-[#5379EE] text-[#5379EE] hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
              title="Previous recent scans"
            >
              <span className="material-symbols-outlined text-2xl">chevron_left</span>
            </button>

            {/* Horizontal scroll cards */}
            <div id="recent-scans-track" className="flex-1 flex gap-4 overflow-x-auto pb-2 scrollbar-thin scroll-smooth">
              {products.length === 0 ? (
                <div className="py-8 text-center text-sm font-mono-tech text-[#94a3b8] w-full">
                  NO RECENT SCANS YET...
                </div>
              ) : (
                products.slice(0, 6).map((prod) => {
                  const hasAllergens = prod.allergensDetected.length > 0;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        setActiveTab('product-analysis');
                      }}
                      className="w-64 shrink-0 bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:shadow-md hover:border-[#5379EE]/50 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-50"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono-tech text-[#64748b] block uppercase truncate">
                            {prod.brand}
                          </span>
                          <h4 className="text-xs font-bold text-[#0f172a] truncate">{prod.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono-tech ${
                                prod.nutriScore === 'A'
                                  ? 'bg-[#e0e7ff] text-[#4338ca]'
                                  : prod.nutriScore === 'B'
                                  ? 'bg-[#ecfdf5] text-[#059669]'
                                  : 'bg-[#fef3c7] text-[#d97706]'
                              }`}
                            >
                              Nutri-Score {prod.nutriScore}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between text-[11px]">
                        <span
                          className={`font-semibold ${
                            hasAllergens ? 'text-[#e11d48]' : 'text-[#059669]'
                          }`}
                        >
                          {hasAllergens ? `${prod.allergensDetected.length} Allergens` : 'Verified Safe'}
                        </span>
                        <span className="text-[#5379EE] font-mono-tech text-[10px]">Inspect &gt;</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Chevron from Figure 3 */}
            <button
              onClick={() => {
                const el = document.getElementById('recent-scans-track');
                if (el) el.scrollBy({ left: 260, behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-full bg-[#e0e7ff] hover:bg-[#5379EE] text-[#5379EE] hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
              title="Next recent scans"
            >
              <span className="material-symbols-outlined text-2xl">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Figure 3: "— PRODUCT CATEGORIES —" Carousel with Chevrons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#475569]">
              — PRODUCT CATEGORIES —
            </h2>
            <span className="text-xs text-[#64748b]">Select to filter catalog</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Left Chevron */}
            <button
              onClick={() => {
                const el = document.getElementById('categories-track');
                if (el) el.scrollBy({ left: -220, behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-full bg-[#e0e7ff] hover:bg-[#5379EE] text-[#5379EE] hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
              title="Previous categories"
            >
              <span className="material-symbols-outlined text-2xl">chevron_left</span>
            </button>

            {/* Category Cards matching Figure 3 */}
            <div id="categories-track" className="flex-1 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scroll-smooth">
              {[
                { id: 'all', label: 'ALL ITEMS', subLabel: 'Catalog', icon: 'apps', count: products.length },
                { id: 'drinks', label: 'DRINKS', subLabel: 'Beverages', icon: 'local_cafe', count: 1 },
                { id: 'dairy', label: 'DAIRY', subLabel: 'Milks & Cheeses', icon: 'egg_alt', count: 1, isHeroInMockup: true },
                { id: 'cereal', label: 'CEREAL', subLabel: 'Grains & Oats', icon: 'grain', count: 2 },
                { id: 'snacks', label: 'SNACKS', subLabel: 'Bars & Chips', icon: 'cookie', count: 2 },
                { id: 'bakery', label: 'BAKERY', subLabel: 'Breads & Pastry', icon: 'bakery_dining', count: 1 },
                { id: 'pantry', label: 'PANTRY', subLabel: 'Sauces & Spices', icon: 'kitchen', count: 1 },
              ].map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`min-w-[150px] p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#5379EE] text-white border-[#5379EE] shadow-lg scale-105 z-10'
                        : 'bg-white border-slate-200 text-[#0f172a] hover:border-[#5379EE]/50 hover:bg-[#f8fafc]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 bg-white/20">
                      <span
                        className={`material-symbols-outlined text-3xl ${
                          isSelected ? 'text-white' : 'text-[#5379EE]'
                        }`}
                      >
                        {cat.icon}
                      </span>
                    </div>
                    <span className="text-xs font-black tracking-wide block uppercase">
                      {cat.label}
                    </span>
                    <span
                      className={`text-[10px] font-mono-tech mt-0.5 ${
                        isSelected ? 'text-white/80' : 'text-[#64748b]'
                      }`}
                    >
                      {cat.subLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Chevron */}
            <button
              onClick={() => {
                const el = document.getElementById('categories-track');
                if (el) el.scrollBy({ left: 220, behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-full bg-[#e0e7ff] hover:bg-[#5379EE] text-[#5379EE] hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
              title="Next categories"
            >
              <span className="material-symbols-outlined text-2xl">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Nutritional Intake History & 30-Day Trends (Recharts) */}
        <NutritionHistoryChart />

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
                    ? 'bg-[#5379EE] text-white shadow-xs'
                    : 'bg-white text-[#64748b] hover:text-[#0f172a] border border-slate-100'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setActiveFilter('safe')}
                className={`px-3 py-1 rounded-full font-mono-tech text-xs font-bold transition-all ${
                  activeFilter === 'safe'
                    ? 'bg-[#5379EE] text-white shadow-xs'
                    : 'bg-white text-[#64748b] hover:text-[#0f172a] border border-slate-100'
                }`}
              >
                Safe (100%)
              </button>
              <button
                onClick={() => setActiveFilter('warnings')}
                className={`px-3 py-1 rounded-full font-mono-tech text-xs font-bold transition-all ${
                  activeFilter === 'warnings'
                    ? 'bg-[#5379EE] text-white shadow-xs'
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
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#5379EE]/50 transition-all cursor-pointer group"
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
                              ? 'text-[#4338ca]'
                              : prod.nutriScore === 'B'
                              ? 'text-[#5379EE]'
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
                            : 'bg-[#e0e7ff] text-[#4338ca]'
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
                          : 'text-[#5379EE]'
                      }`}
                    >
                      {isHazard ? 'Shield Flagged' : prod.allergensDetected.length > 0 ? 'Trace Caution' : 'Verified Safe'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerScanCheck(prod);
                      }}
                      className="w-7 h-7 rounded-full bg-[#f1f5f9] hover:bg-[#5379EE] hover:text-white flex items-center justify-center text-[#64748b] transition-colors"
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

        {/* Research Study Evaluation & Empirical Metrics (IngreGuide RS-IV Section C1 & C3) */}
        <ResearchMetricsPanel />

        {/* Bottom Section: Split 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Daily Nutrition Insight */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#5379EE]">
                  <span className="material-symbols-outlined text-base">science</span>
                  <span className="font-mono-tech text-[10px] font-bold uppercase tracking-wider">
                    Scientific Intelligence
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
                <div className="p-3 rounded-xl bg-[#eef2ff] flex flex-col">
                  <span className="font-mono-tech text-[11px] text-[#5379EE] font-bold">E412 (Guar Gum)</span>
                  <span className="text-xs text-[#0f172a] font-medium">Safe Botanical</span>
                </div>
                <div className="p-3 rounded-xl bg-[#fff1f2] flex flex-col">
                  <span className="font-mono-tech text-[11px] text-[#e11d48] font-bold">E407 (Carrageenan)</span>
                  <span className="text-xs text-[#0f172a] font-medium">Inflammation Risk</span>
                </div>
                <div className="p-3 rounded-xl bg-[#e0e7ff] flex flex-col">
                  <span className="font-mono-tech text-[11px] text-[#4338ca] font-bold">E322 (Lecithin)</span>
                  <span className="text-xs text-[#0f172a] font-medium">Sunflower Pure</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-2 border-t border-slate-50">
              <button
                onClick={() => setActiveTab('ingredient-clarity')}
                className="inline-flex items-center gap-1 font-mono-tech text-xs font-bold text-[#5379EE] hover:text-[#0f172a] transition-colors"
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
                <span className="w-8 h-8 rounded-full bg-[#e0e7ff] flex items-center justify-center text-[#5379EE]">
                  <span className="material-symbols-outlined text-base">bolt</span>
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setActiveTab('allergen-radar')}
                  className="p-3 rounded-2xl hover:bg-[#eef2ff] transition-colors flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#e0e7ff] flex items-center justify-center text-[#5379EE]">
                      <span className="material-symbols-outlined text-lg">radar</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0f172a] group-hover:text-[#5379EE] transition-colors block">
                        Edit Allergen Radar
                      </span>
                      <span className="text-[11px] text-[#64748b]">Fine-tune tolerance thresholds &amp; sensitivity</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#5379EE] text-base transition-colors">
                    chevron_right
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSelectedProductId('prod-roasted-granola');
                    setActiveTab('product-analysis');
                  }}
                  className="p-3 rounded-2xl hover:bg-[#eef2ff] transition-colors flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#e0e7ff] flex items-center justify-center text-[#5379EE]">
                      <span className="material-symbols-outlined text-lg">swap_horiz</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0f172a] group-hover:text-[#5379EE] transition-colors block">
                        Safe Swaps Directory
                      </span>
                      <span className="text-[11px] text-[#64748b]">Browse 4,500+ verified allergen-safe substitutes</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#5379EE] text-base transition-colors">
                    chevron_right
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('allergen-radar')}
                  className="p-3 rounded-2xl hover:bg-[#eef2ff] transition-colors flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#e0e7ff] flex items-center justify-center text-[#5379EE]">
                      <span className="material-symbols-outlined text-lg">add_circle</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0f172a] group-hover:text-[#5379EE] transition-colors block">
                        Add Custom Additive Watch
                      </span>
                      <span className="text-[11px] text-[#64748b]">Track artificial sweeteners, dyes, or preservatives</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#5379EE] text-base transition-colors">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-50 text-[11px] text-[#64748b]">
              <span>Database Synced: 2 min ago</span>
              <span className="inline-flex items-center gap-1 font-mono-tech text-[#5379EE] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5379EE]"></span>
                Cloud Sync Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
