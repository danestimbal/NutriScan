import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLandingSettings } from '../hooks/useLandingSettings';
import { FoodProduct } from '../types';
import { Heading, PILL_BTN, PRIMARY_BTN, gradeClass } from '../components/landingUi';
import { hasGap } from '../utils/barcode';

const GRADE_TABS = [
  { id: 'all', label: 'All', grades: ['A', 'B', 'C', 'D', 'E'] },
  { id: 'ab', label: 'Grade A–B', grades: ['A', 'B'] },
  { id: 'c', label: 'Grade C', grades: ['C'] },
  { id: 'de', label: 'Grade D–E', grades: ['D', 'E'] },
];

const PAGE_SIZE = 24;

/** Public product catalog page: search and filter every product, open its analysis. */
export const CatalogScreen: React.FC = () => {
  const { products, isLoggedIn, enterGuestMode, setActiveTab, setSelectedProductId } = useApp();
  const { catalog } = useLandingSettings();

  const [gradeTab, setGradeTab] = useState('all');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Start from the first page whenever the filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [gradeTab, query]);

  const filtered = useMemo(() => {
    const grades = GRADE_TABS.find((t) => t.id === gradeTab)?.grades || [];
    const q = query.trim().toLowerCase();
    return products
      // Products without a real grade only appear under "All"
      .filter((p) => (hasGap(p, 'nutriScore') ? gradeTab === 'all' : grades.includes(p.nutriScore)))
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.barcode.includes(q) ||
          p.allergensDetected.some((a) => a.toLowerCase().includes(q))
      );
  }, [products, gradeTab, query]);

  const shown = filtered.slice(0, visibleCount);

  const openProduct = (product: FoodProduct) => {
    setSelectedProductId(product.id);
    setActiveTab('product-analysis');
    window.scrollTo({ top: 0 });
  };

  const openScanner = async () => {
    if (!isLoggedIn) await enterGuestMode();
    setActiveTab('scanner');
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFF] text-[#1E293B] pt-24 sm:pt-28 pb-28 lg:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <Heading as="h1" lead={catalog.titleLead} accent={catalog.titleAccent} className="text-3xl sm:text-5xl" />
            <p className="mt-4 text-sm font-medium text-[#334155] max-w-md">{catalog.subtitle}</p>
          </div>
          <button type="button" onClick={openScanner} className={`${PILL_BTN} ${PRIMARY_BTN} h-11 px-7 gap-2 self-start md:self-auto`}>
            <span className="material-symbols-outlined text-lg">barcode_scanner</span>
            {catalog.buttonLabel}
          </button>
        </div>

        {/* Search + grade filters */}
        <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex items-center w-full lg:max-w-sm">
            <span className="absolute left-4 material-symbols-outlined text-[#64748B] text-lg pointer-events-none">search</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, brand, barcode or allergen"
              aria-label="Search products"
              className="w-full h-11 pl-11 pr-4 rounded-full bg-white border border-[#CBD5E1] text-sm text-[#1E293B] placeholder:text-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {GRADE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setGradeTab(tab.id)}
                aria-pressed={gradeTab === tab.id}
                className={`${PILL_BTN} h-9 px-5 ${
                  gradeTab === tab.id
                    ? 'bg-[#2563EB] text-white shadow-[0_6px_16px_rgba(37,99,235,0.3)]'
                    : 'bg-white text-[#1E293B] shadow-xs hover:bg-[#EEF2FF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-xs text-[#64748B]">
          {filtered.length === products.length
            ? `${products.length} products`
            : `${filtered.length} of ${products.length} products`}
        </p>

        {/* Product grid */}
        {shown.length === 0 ? (
          <div className="mt-4 bg-white rounded-2xl border border-[#DBEAFE] p-10 text-center">
            <span className="material-symbols-outlined text-4xl text-[#93A8E8]">search_off</span>
            <p className="mt-2 text-sm font-semibold">No products match these filters.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setGradeTab('all');
              }}
              className="mt-3 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
            {shown.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => openProduct(product)}
                className="group self-start text-left cursor-pointer min-w-0"
              >
                <span className="relative block aspect-[10/9] rounded-xl overflow-hidden bg-[#EEF2FF] shadow-xs">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-[#93A8E8]">
                      <span className="material-symbols-outlined text-5xl">nutrition</span>
                    </span>
                  )}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                      hasGap(product, 'nutriScore') ? 'bg-slate-200 text-[#475569]' : gradeClass(product.nutriScore)
                    }`}
                  >
                    {hasGap(product, 'nutriScore') ? 'Not rated' : `Grade ${product.nutriScore}`}
                  </span>
                </span>
                <span className="mt-3 block text-sm font-bold leading-snug line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                  {product.name}
                </span>
                <span className="block text-xs text-[#64748B] truncate">{product.brand}</span>
                {!product.isVerified && (
                  <span className="mt-1 block text-[11px] text-[#b45309]">Imported, not yet reviewed</span>
                )}
                {product.allergensDetected.length > 0 && (
                  <span className="mt-1.5 block text-[11px] font-semibold text-rose-600 truncate">
                    Contains: {product.allergensDetected.slice(0, 3).join(', ')}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {visibleCount < filtered.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              className={`${PILL_BTN} h-11 px-8 bg-white text-[#1E293B] border border-[#CBD5E1] hover:bg-[#EEF2FF]`}
            >
              Show more ({filtered.length - visibleCount} left)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
