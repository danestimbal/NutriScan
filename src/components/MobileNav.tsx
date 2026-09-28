import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#e2e8f0] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="h-16 px-4 flex items-center justify-around relative">
        {/* Item 1: Home / Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 transition-all ${
            activeTab === 'dashboard' ? 'text-[#65a30d]' : 'text-[#64748b] hover:text-[#0f172a]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">grid_view</span>
          <span className="font-sans text-[11px] font-semibold tracking-tight">Home</span>
        </button>

        {/* Item 2: Allergens / Radar */}
        <button
          onClick={() => setActiveTab('allergen-radar')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 transition-all ${
            activeTab === 'allergen-radar' ? 'text-[#65a30d]' : 'text-[#64748b] hover:text-[#0f172a]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">shield_with_heart</span>
          <span className="font-sans text-[11px] font-semibold tracking-tight">Allergens</span>
        </button>

        {/* Item 3: Center Floating Scanner Button */}
        <div className="relative -top-5 flex flex-col items-center justify-center mx-2">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-4 border-white ${
              activeTab === 'scanner'
                ? 'bg-[#0f172a] text-[#84cc16] shadow-[#84cc16]/40'
                : 'bg-gradient-to-tr from-[#0d7a5f] to-[#84cc16] text-white shadow-[#0d7a5f]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[28px]">barcode_scanner</span>
          </button>
          <span className="font-mono-tech text-[10px] font-bold text-[#0f172a] mt-0.5">Scan</span>
        </div>

        {/* Item 4: History / Product Analysis */}
        <button
          onClick={() => setActiveTab('product-analysis')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 transition-all ${
            activeTab === 'product-analysis' || activeTab === 'ingredient-clarity'
              ? 'text-[#65a30d]'
              : 'text-[#64748b] hover:text-[#0f172a]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">history</span>
          <span className="font-sans text-[11px] font-semibold tracking-tight">Products</span>
        </button>

        {/* Item 5: Admin / Operations */}
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 transition-all ${
            activeTab === 'admin' ? 'text-[#65a30d]' : 'text-[#64748b] hover:text-[#0f172a]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">tune</span>
          <span className="font-sans text-[11px] font-semibold tracking-tight">Admin</span>
        </button>
      </div>
    </nav>
  );
};
