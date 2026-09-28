import React, { useState } from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, userProfile, isLoggedIn, handleLogout, products, setSelectedProductId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.barcode.includes(query) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.allergensDetected.some((a) => a.toLowerCase().includes(query.toLowerCase())) ||
        p.additivesDecoded.some((ad) => ad.eCode.toLowerCase().includes(query.toLowerCase()) || ad.name.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  const navItems: { tab: NavigationTab; label: string }[] = [
    { tab: 'dashboard', label: 'Dashboard' },
    { tab: 'allergen-radar', label: 'Allergen Radar' },
    { tab: 'scanner', label: 'Scanner' },
    { tab: 'product-analysis', label: 'Product Analysis' },
    { tab: 'ingredient-clarity', label: 'Ingredient Clarity' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#e7eff8] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#84cc16] to-[#0d7a5f] p-0.5 shadow-sm flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">spa</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-xl font-bold tracking-tight text-[#0f172a]">NutriScan</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full bg-[#ecfccb] text-[#65a30d] font-mono-tech text-[10px] font-bold">
                v2.4 LIVE
              </span>
            </div>
          </div>
        </div>

        {/* Global Live Search Bar */}
        <div className="flex-1 max-w-md hidden md:block relative">
          <div className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-3.5 text-[#64748b] pointer-events-none text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              placeholder="Scan UPC, E-numbers (e.g. E621), additives..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-white text-[#0f172a] placeholder:text-[#94a3b8] text-sm border border-[#e2e8f0] outline-none transition-all shadow-[0_1px_6px_rgba(132,204,22,0.06)] focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-3 text-[#94a3b8] hover:text-[#0f172a]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>

          {/* Quick Search Popover Results */}
          {showSearchResults && (
            <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-2 max-h-80 overflow-y-auto z-50">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#64748b]">
                  No matching foods or E-codes found. Try UPC: 016000275270
                </div>
              ) : (
                searchResults.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setSelectedProductId(prod.id);
                      setActiveTab('product-analysis');
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f7fee7] cursor-pointer transition-colors"
                  >
                    <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0f172a] truncate">{prod.name}</span>
                        <span
                          className={`font-mono-tech text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            prod.nutriScore === 'A'
                              ? 'bg-[#ecfccb] text-[#65a30d]'
                              : prod.nutriScore === 'B'
                              ? 'bg-[#f7fee7] text-[#84cc16]'
                              : 'bg-[#fffbeb] text-[#d97706]'
                          }`}
                        >
                          Score {prod.nutriScore}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748b] truncate block">
                        {prod.brand} • UPC {prod.barcode}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`font-sans text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-[#ecfccb] text-[#65a30d] font-bold shadow-xs'
                    : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Admin shortcut button */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono-tech text-[11px] font-bold transition-colors ${
              activeTab === 'admin'
                ? 'bg-[#0f172a] text-[#84cc16]'
                : 'bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">shield_person</span>
            <span>Admin</span>
          </button>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <img
                src={
                  userProfile.photoURL ||
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
                }
                alt="Sarah Chen Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#84cc16]/30"
              />
              <span className="material-symbols-outlined text-[#64748b] text-base hidden sm:inline">
                expand_more
              </span>
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-[#0f172a]">{userProfile.displayName}</p>
                  <p className="text-[11px] text-[#64748b] truncate">{userProfile.email}</p>
                  <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ecfccb] text-[#65a30d] text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16]"></span>
                    Bio-Shield Active
                  </span>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setActiveTab('allergen-radar');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1e293b] hover:bg-[#f7fee7] rounded-xl flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm text-[#84cc16]">radar</span>
                    Edit Allergen Radar
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1e293b] hover:bg-[#f7fee7] rounded-xl flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm text-[#0f172a]">admin_panel_settings</span>
                    Operations Console
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('auth');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1e293b] hover:bg-[#f7fee7] rounded-xl flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm text-[#64748b]">switch_account</span>
                    Switch Account / Portal
                  </button>
                  {isLoggedIn && (
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-[#e11d48] hover:bg-[#fff1f2] rounded-xl flex items-center gap-2 mt-1 border-t border-slate-50"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span>
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
