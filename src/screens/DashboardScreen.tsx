import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NutritionHistoryChart } from '../components/NutritionHistoryChart';
import { findProductByBarcode, getSmartProductFallbackImage, isPlaceholderProductImage, hasGap } from '../utils/barcode';

export const DashboardScreen: React.FC = () => {
  const {
    userProfile,
    setActiveTab,
    products,
    setSelectedProductId,
    scanLogs,
    triggerScanCheck,
    evaluateForUser,
    additivePolicies,
    isLoggedIn,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'safe' | 'warnings' | 'severe'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const matrixScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollMatrix = (direction: 'left' | 'right') => {
    if (!matrixScrollRef.current) return;
    const scrollAmount = matrixScrollRef.current.clientWidth * 0.85;
    matrixScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Live Dashboard Stats synced from Firestore scanLogs, userProfile & products
  const totalScans = scanLogs.length;
  const warningsFlagged = scanLogs.filter((l) => l.verdict === 'HAZARD' || l.verdict === 'WARNING').length;
  const safeScansCount = scanLogs.filter((l) => l.verdict === 'SAFE').length;
  const safeChoiceRate = totalScans > 0 ? `${Math.round((safeScansCount / totalScans) * 100)}%` : '—';
  const savedProductsCount = (userProfile.savedProductIds || []).length;

  /** Each catalog product checked against this user's profile (allergens, watchlist, diets, policies). */
  const verdictById = React.useMemo(
    () => new Map(products.map((p) => [p.id, evaluateForUser(p)])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, userProfile.activeAllergens, userProfile.watchlist, userProfile.dietaryPreferences, additivePolicies]
  );
  const verdictOf = (id: string) => verdictById.get(id)?.verdict || 'SAFE';
  const countWith = (verdict: 'SAFE' | 'WARNING' | 'HAZARD') => products.filter((p) => verdictOf(p.id) === verdict).length;
  const enforcedPolicies = additivePolicies.filter((policy) => policy.isEnforced);

  // Recent scanned products derived from Firestore scanLogs first, then catalog fallback
  const recentScannedProducts = React.useMemo(() => {
    const seen = new Set<string>();
    const list = [];
    for (const log of scanLogs) {
      const matched = findProductByBarcode(products, log.barcode);
      if (matched && !seen.has(matched.id)) {
        seen.add(matched.id);
        list.push(matched);
      }
    }
    for (const p of products) {
      if (list.length >= 8) break;
      if (!seen.has(p.id)) {
        seen.add(p.id);
        list.push(p);
      }
    }
    return list;
  }, [scanLogs, products]);

  // Most recent scan that raised an alert for this user (nothing is shown until one happens)
  const latestClashLog = scanLogs.find((l) => l.verdict === 'HAZARD' || l.verdict === 'WARNING');
  const clashProduct = latestClashLog ? findProductByBarcode(products, latestClashLog.barcode) : undefined;
  const clashImage =
    clashProduct && !isPlaceholderProductImage(clashProduct.image)
      ? clashProduct.image
      : getSmartProductFallbackImage(clashProduct?.name || latestClashLog?.productName || '', clashProduct?.category);

  const filteredProducts = products.filter((prod) => {
    // Safety status filter
    if (activeFilter === 'safe' && verdictOf(prod.id) !== 'SAFE') return false;
    if (activeFilter === 'warnings' && verdictOf(prod.id) !== 'WARNING') return false;
    if (activeFilter === 'severe' && verdictOf(prod.id) !== 'HAZARD') return false;

    // Category filter (Figure 3 in IngreGuide RS-IV Plan)
    if (selectedCategory === 'all') return true;
    const catLower = prod.category.toLowerCase();
    if (selectedCategory === 'drinks') return catLower.includes('drink') || catLower.includes('beverage');
    if (selectedCategory === 'cereal') return catLower.includes('cereal') || catLower.includes('breakfast') || catLower.includes('oat');
    if (selectedCategory === 'snacks') return catLower.includes('snack') || catLower.includes('bar') || catLower.includes('chip') || catLower.includes('confectionery') || catLower.includes('treat');
    if (selectedCategory === 'dairy') return catLower.includes('dairy') || catLower.includes('milk') || catLower.includes('cheese') || catLower.includes('yogurt') || catLower.includes('butter');
    if (selectedCategory === 'bakery') return catLower.includes('bakery') || catLower.includes('bread') || catLower.includes('muffin') || catLower.includes('tortilla');
    if (selectedCategory === 'pantry') return catLower.includes('pantry') || catLower.includes('sauce') || catLower.includes('grain') || catLower.includes('rice') || catLower.includes('pasta') || catLower.includes('condiment') || catLower.includes('spread') || catLower.includes('cereal') || catLower.includes('oat');
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Stat Counters Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#e0e7ff] flex items-center justify-center text-[#5379EE]">
              <span className="material-symbols-outlined text-2xl">barcode_scanner</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0f172a] block">{totalScans}</span>
              <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">
                Total Scans
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#fff1f2] flex items-center justify-center text-[#e11d48]">
              <span className="material-symbols-outlined text-2xl">shield_with_heart</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#e11d48] block">{warningsFlagged}</span>
              <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">
                Warnings Flagged
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] flex items-center justify-center text-[#059669]">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0f172a] block">{safeChoiceRate}</span>
              <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">
                Scans Without Alerts
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#f0f3ff] flex items-center justify-center text-[#565e74]">
              <span className="material-symbols-outlined text-2xl">bookmark</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0f172a] block">{savedProductsCount}</span>
              <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">
                Saved Products
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
                <span className="text-[10px] text-white font-bold uppercase tracking-wider">
                  IngreGuide Barcode Scanner
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
                    <p className="text-white/80 text-[11px]">Camera, photo upload or manual entry</p>
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

          {/* Card 2: the user's most recent real alert */}
          {latestClashLog ? (
            <div
              className={`lg:col-span-5 rounded-3xl p-6 sm:p-7 border flex flex-col justify-between shadow-xs ${
                latestClashLog.verdict === 'HAZARD' ? 'bg-[#fff1f2] border-[#ffdad6]' : 'bg-[#fffbeb] border-[#fde68a]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0f172a]">Your Latest Alert</h2>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Scanned {latestClashLog.timestamp} • Barcode {latestClashLog.barcode}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                    latestClashLog.verdict === 'HAZARD' ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#fef3c7] text-[#92400e]'
                  }`}
                >
                  {latestClashLog.verdict === 'HAZARD' ? 'Hazard' : 'Warning'}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl my-4 border border-slate-100 flex items-center gap-3.5 shadow-xs">
                <img
                  src={clashImage}
                  alt={latestClashLog.productName}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getSmartProductFallbackImage(
                      latestClashLog.productName,
                      clashProduct?.category
                    );
                  }}
                  className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-[#0f172a] truncate">{latestClashLog.productName}</h3>
                  <p className="text-xs text-[#1e293b] mt-1">{latestClashLog.verdictLabel}</p>
                </div>
              </div>

              {clashProduct && (
                <button
                  onClick={() => {
                    setSelectedProductId(clashProduct.id);
                    setActiveTab('product-analysis');
                  }}
                  className="self-end h-9 px-4 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                >
                  View Product
                </button>
              )}
            </div>
          ) : (
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 flex flex-col justify-center items-center text-center shadow-xs">
              <span className="w-12 h-12 rounded-2xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </span>
              <h2 className="text-lg font-bold text-[#0f172a] mt-3">No alerts yet</h2>
              <p className="text-xs text-[#64748b] mt-1 max-w-xs">
                {userProfile.activeAllergens.some((a) => a.active)
                  ? 'When a scanned product conflicts with your profile, it will appear here.'
                  : 'Switch on your allergens in the Allergen Radar so scans can be checked against them.'}
              </p>
              <button
                onClick={() => setActiveTab('allergen-radar')}
                className="mt-4 h-9 px-4 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5379EE] text-xs font-bold transition-colors"
              >
                Open Allergen Radar
              </button>
            </div>
          )}
        </div>

        {/* Main Section: Recent Scans & Product Health Matrix */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#0f172a]">Recent Scans &amp; Product Matrix</h2>
              <p className="text-xs text-[#64748b]">
                Each product checked against your allergen profile, with its Nutri-Score.
              </p>
            </div>
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeFilter === 'all'
                    ? 'bg-[#5379EE] text-white shadow-xs'
                    : 'bg-white text-[#64748b] hover:text-[#0f172a] border border-slate-100'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setActiveFilter('safe')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeFilter === 'safe'
                    ? 'bg-[#5379EE] text-white shadow-xs'
                    : 'bg-white text-[#64748b] hover:text-[#0f172a] border border-slate-100'
                }`}
              >
                No conflict ({countWith('SAFE')})
              </button>
              <button
                onClick={() => setActiveFilter('warnings')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeFilter === 'warnings'
                    ? 'bg-[#5379EE] text-white shadow-xs'
                    : 'bg-white text-[#64748b] hover:text-[#0f172a] border border-slate-100'
                }`}
              >
                Warnings ({countWith('WARNING')})
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Product Matrix with Left & Right Arrows */}
          <div className="relative flex items-center gap-2">
            {/* Left Scroll Arrow */}
            <button
              type="button"
              onClick={() => scrollMatrix('left')}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full bg-[#e8edff] hover:bg-[#5379EE] text-[#5379EE] hover:text-white flex items-center justify-center shrink-0 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>

            <div
              ref={matrixScrollRef}
              className="flex items-stretch gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filteredProducts.map((prod) => {
                const verdict = verdictOf(prod.id);
                const isHazard = verdict === 'HAZARD';
                const isWarning = verdict === 'WARNING';
                const gradeMissing = hasGap(prod, 'nutriScore');

                return (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setSelectedProductId(prod.id);
                      setActiveTab('product-analysis');
                    }}
                    className="w-[260px] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] shrink-0 snap-start bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#5379EE]/50 transition-all cursor-pointer group"
                  >
                    <div className="space-y-3">
                      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getSmartProductFallbackImage(
                              prod.name,
                              prod.category
                            );
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs">
                          <span className="text-[10px] text-[#64748b] font-bold">GRADE</span>
                          <span
                            className={`text-xs font-extrabold ${
                              gradeMissing
                                ? 'text-[#64748b]'
                                : prod.nutriScore === 'A' || prod.nutriScore === 'B'
                                ? 'text-[#047857]'
                                : prod.nutriScore === 'C'
                                ? 'text-[#d97706]'
                                : 'text-[#e11d48]'
                            }`}
                          >
                            {gradeMissing ? '—' : prod.nutriScore}
                          </span>
                        </div>
                        <div
                          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold shadow-xs ${
                            isHazard
                              ? 'bg-[#fff1f2] text-[#e11d48]'
                              : isWarning
                              ? 'bg-[#fffbeb] text-[#d97706]'
                              : 'bg-[#e0e7ff] text-[#4338ca]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {isHazard ? 'report' : isWarning ? 'warning' : 'check_circle'}
                          </span>
                          <span>{isHazard ? 'HAZARD' : isWarning ? 'WARNING' : 'NO CONFLICT'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-[#64748b] uppercase">
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
                            : isWarning
                            ? 'text-[#d97706]'
                            : 'text-[#5379EE]'
                        }`}
                      >
                        {verdictById.get(prod.id)?.label || ''}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerScanCheck(prod);
                        }}
                        className="w-7 h-7 rounded-full bg-[#f1f5f9] hover:bg-[#5379EE] hover:text-white flex items-center justify-center text-[#64748b] transition-colors"
                        title="Log this product as scanned"
                      >
                        <span className="material-symbols-outlined text-base">radar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Scroll Arrow */}
            <button
              type="button"
              onClick={() => scrollMatrix('right')}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full bg-[#e8edff] hover:bg-[#5379EE] text-[#5379EE] hover:text-white flex items-center justify-center shrink-0 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Nutritional Intake History & 30-Day Trends (Recharts) */}
        <NutritionHistoryChart />

        {/* Bottom Section: Split 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: additives currently flagged by the administrators (from the database) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#0f172a]">Additives IngreGuide Flags</h3>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                  A scanned product that lists one of these shows a warning. The list is managed by the administrators.
                </p>
              </div>

              {enforcedPolicies.length === 0 ? (
                <p className="text-xs text-[#64748b] bg-[#f8fafc] rounded-xl p-3 border border-slate-100">
                  No additives are being flagged right now.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {enforcedPolicies.map((policy) => (
                    <div key={policy.eCode} className="p-3 rounded-xl bg-[#eef2ff] flex flex-col">
                      <span className="text-[11px] text-[#5379EE] font-bold">{policy.eCode}</span>
                      <span className="text-xs text-[#0f172a] font-medium">{policy.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-2 border-t border-slate-50">
              <button
                onClick={() => setActiveTab('catalog')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#5379EE] hover:text-[#0f172a] transition-colors"
              >
                <span>Browse the product catalog</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
                      <span className="text-[11px] text-[#64748b]">Choose your allergens and how serious each one is</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#5379EE] text-base transition-colors">
                    chevron_right
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('catalog')}
                  className="p-3 rounded-2xl hover:bg-[#eef2ff] transition-colors flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#e0e7ff] flex items-center justify-center text-[#5379EE]">
                      <span className="material-symbols-outlined text-lg">storefront</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0f172a] group-hover:text-[#5379EE] transition-colors block">
                        Product Catalog
                      </span>
                      <span className="text-[11px] text-[#64748b]">Browse and search all {products.length} products</span>
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
                        Edit My Watchlist
                      </span>
                      <span className="text-[11px] text-[#64748b]">Ingredients and E-numbers you want to be warned about</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#5379EE] text-base transition-colors">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 text-[11px] text-[#64748b]">
              {isLoggedIn
                ? 'Your profile and scan history are saved to your account.'
                : 'You are not signed in. Your profile is saved on this device only.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
