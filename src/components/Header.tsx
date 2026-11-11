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
    { tab: 'product-analysis', label: 'Product Analysis' },
    { tab: 'ingredient-clarity', label: 'Ingredient Clarity' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#5379EE] text-white shadow-[0_2px_12px_rgba(83,121,238,0.25)] border-b border-[#4367db]">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand / Logo (matching Figure 2 & Figure 3) */}
        <div
          onClick={() => setActiveTab('auth')}
          title="View IngreGuide Landing Page"
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
        >
          {/* Framed Scanner Logo Emblem with Leaf & Barcode */}
          <div className="relative w-10 h-10 rounded-xl bg-white/15 border-2 border-white/60 p-1 flex items-center justify-center shadow-xs">
            {/* Reticle corner notches */}
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b-2 border-r-2 border-white"></div>
            <div className="flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-sans text-xl font-black tracking-tight text-white uppercase drop-shadow-xs">
                INGREGUIDE
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full bg-white/20 text-white font-mono-tech text-[10px] font-bold border border-white/30">
                RS-IV
              </span>
            </div>
            <span className="text-[10px] font-medium text-white/90 hidden md:inline leading-none tracking-wide">
              Read with Sight, Choose What's Right.
            </span>
          </div>
        </div>

        {/* Global Live Search Bar (matching Figure 3 "Search For...") */}
        <div className="flex-1 max-w-md hidden md:block relative">
          <div className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-3.5 text-[#5379EE] pointer-events-none text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              placeholder="Search For... (e.g. Cereals, 016000275270, E-numbers)"
              className="w-full h-10 pl-10 pr-4 rounded-full bg-white text-[#0f172a] placeholder:text-[#94a3b8] text-sm border-0 outline-none transition-all shadow-[0_2px_8px_rgba(0,0,0,0.08)] focus:ring-2 focus:ring-white/80"
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
            <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 max-h-80 overflow-y-auto z-50 text-[#0f172a]">
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
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#eef2ff] cursor-pointer transition-colors"
                  >
                    <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0f172a] truncate">{prod.name}</span>
                        <span
                          className={`font-mono-tech text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            prod.nutriScore === 'A'
                              ? 'bg-[#e0e7ff] text-[#4338ca]'
                              : prod.nutriScore === 'B'
                              ? 'bg-[#ecfdf5] text-[#059669]'
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
            const isHome = item.tab === 'dashboard';
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                title={item.label}
                aria-label={item.label}
                className={`font-sans text-xs ${isHome ? 'p-2' : 'px-3.5 py-1.5'} rounded-full transition-all whitespace-nowrap cursor-pointer inline-flex items-center justify-center ${
                  isActive
                    ? 'bg-white text-[#4368dd] font-bold shadow-xs'
                    : 'text-white/90 hover:text-white hover:bg-white/10 font-semibold'
                }`}
              >
                {isHome ? (
                  <span className="material-symbols-outlined text-lg leading-none">home</span>
                ) : (
                  <span>{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin shortcut button */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono-tech text-[11px] font-bold transition-colors ${
              activeTab === 'admin'
                ? 'bg-white text-[#4368dd]'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <span className="material-symbols-outlined text-sm">shield_person</span>
            <span>Admin</span>
          </button>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/15 transition-colors border border-white/30 cursor-pointer"
            >
              {userProfile.photoURL && !userProfile.photoURL.includes('photo-1494790108377') ? (
                <img
                  src={userProfile.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white/60"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white text-[#5379EE] font-black text-xs flex items-center justify-center ring-2 ring-white/60 uppercase">
                  {(userProfile.displayName && userProfile.displayName !== 'Sarah Chen'
                    ? userProfile.displayName
                    : userProfile.email || 'G'
                  )
                    .trim()
                    .charAt(0)}
                </div>
              )}
              <span className="material-symbols-outlined text-white text-base hidden sm:inline">
                expand_more
              </span>
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-[#0f172a]">
                    {userProfile.displayName && userProfile.displayName !== 'Sarah Chen'
                      ? userProfile.displayName
                      : userProfile.email
                      ? userProfile.email.split('@')[0]
                      : 'Guest User'}
                  </p>
                  {userProfile.email && userProfile.email !== 'sarah.chen@nutrition-lab.com' && (
                    <p className="text-[11px] text-[#64748b] truncate">{userProfile.email}</p>
                  )}
                  <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e0e7ff] text-[#4338ca] text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5379EE]"></span>
                    Bio-Shield Active
                  </span>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setActiveTab('onboarding');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1e293b] hover:bg-[#eef2ff] rounded-xl flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm text-[#5379EE]">tune</span>
                    Personalize Shield (Onboarding)
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('allergen-radar');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1e293b] hover:bg-[#eef2ff] rounded-xl flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm text-[#5379EE]">radar</span>
                    Edit Allergen Radar
                  </button>
                  <PWAInstallButton variant="menu" />
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1e293b] hover:bg-[#eef2ff] rounded-xl flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm text-[#0f172a]">admin_panel_settings</span>
                    Operations Console
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('auth');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1e293b] hover:bg-[#eef2ff] rounded-xl flex items-center gap-2"
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
