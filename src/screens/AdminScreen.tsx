import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodProduct } from '../types';

export const AdminScreen: React.FC = () => {
  const {
    products,
    updateProduct,
    addNewProduct,
    additivePolicies,
    toggleAdditivePolicy,
    setSelectedProductId,
    setActiveTab,
  } = useApp();

  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'review' | 'flagged' | 'gluten'>('all');
  const [adminSearch, setAdminSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New product form state
  const [newBarcode, setNewBarcode] = useState('');
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('Whole Grain Snack Bars & Cereals');
  const [newWeight, setNewWeight] = useState('50g');
  const [newAllergens, setNewAllergens] = useState('');
  const [newNutriScore, setNewNutriScore] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarcode || !newName) return;

    const newProd: FoodProduct = {
      id: `prod-${Date.now()}`,
      barcode: newBarcode,
      name: newName,
      brand: newBrand || 'Independent Maker',
      category: newCategory,
      netWeight: newWeight,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      nutriScore: newNutriScore,
      novaGroup: 2,
      transparencyScore: 90,
      allergensDetected: newAllergens ? newAllergens.split(',').map((s) => s.trim()) : [],
      facilityWarnings: ['Verified facility audit.'],
      ingredientsVerbatim: 'Whole Grain Ingredients, Sea Salt, Natural Flavors.',
      mandatoryWarning: newAllergens ? `CONTAINS: ${newAllergens}` : 'No major allergens declared.',
      isVerified: true,
      verdictSummary: 'Clean formulation reviewed by administrative nutrition staff.',
      dietaryRecommendation: 'Clean Whole Food Snack',
      ingredientsAnalysis: [
        {
          name: newName,
          description: 'Whole ingredients matrix.',
          status: 'Safe',
          category: 'Natural',
        },
      ],
      additivesDecoded: [],
      sugarsBreakdown: {
        totalGrams: 4,
        percentDV: 8,
        glycemicIndex: 35,
        glycemicLabel: 'Low (35 GI)',
        items: [],
      },
      nutrients: {
        calories: 150,
        servingSize: newWeight,
        totalFat: '4g',
        totalFatDV: '5%',
        satFat: '0.5g',
        satFatDV: '2%',
        sodium: '80mg',
        sodiumDV: '3%',
        carbs: '22g',
        carbsDV: '8%',
        fiber: '4g',
        fiberDV: '14%',
        sugars: '4g',
        addedSugars: '2g',
        protein: '5g',
        proteinDV: '10%',
      },
      certifications: [
        {
          title: 'Admin Verified Batch',
          details: 'Certified in NutriScan Catalog v2.4',
          verified: true,
          icon: 'verified_user',
        },
      ],
      moderationStatus: 'approved',
    };

    addNewProduct(newProd);
    setShowNewModal(false);
    showToast(`Added ${newName} to verified catalog!`);
    setNewBarcode('');
    setNewName('');
    setNewBrand('');
  };

  const filteredCatalog = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.barcode.includes(adminSearch) ||
      p.brand.toLowerCase().includes(adminSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (activeCatalogTab === 'review') return p.moderationStatus === 'needs_review' || !p.isVerified;
    if (activeCatalogTab === 'flagged') return p.moderationStatus === 'flagged' || (p.userReportsCount && p.userReportsCount > 0);
    if (activeCatalogTab === 'gluten') return p.allergensDetected.some((a) => a.toLowerCase().includes('gluten') || a.toLowerCase().includes('wheat'));
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 p-3.5 bg-[#0f172a] text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#84cc16] text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top System Bar & Environment Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfccb] text-[#65a30d] font-mono-tech text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#84cc16]"></span>
              <span>ADMIN PORTAL • v2.4.9</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f5f9] text-[#565e74] font-mono-tech text-xs">
              <span className="material-symbols-outlined text-sm">dns</span>
              <span>Prod Cluster (US-East)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f5f9] text-[#65a30d] font-mono-tech text-xs">
              <span className="material-symbols-outlined text-sm">favorite</span>
              <span>Database Status: Healthy (99.99%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Audit logs exported to CSV & JSON format.')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] font-mono-tech text-xs font-bold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Export Audit Logs</span>
            </button>
            <button
              onClick={() => showToast('Edge CDN cache purged and rule matrix re-deployed.')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#ecfccb] hover:bg-[#d9f99d] text-[#65a30d] font-mono-tech text-xs font-bold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>Deploy Matrix to Edge CDN</span>
            </button>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white font-mono-tech text-xs font-bold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>+ New Product Entry</span>
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <div className="relative flex items-center">
            <span className="absolute left-4 material-symbols-outlined text-[#64748b] text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search UPC barcode, food brand, additive E-code, or user profile ID..."
              className="w-full h-12 pl-11 pr-24 rounded-full bg-white text-[#0f172a] placeholder:text-[#94a3b8] text-xs font-medium border border-slate-200 shadow-xs outline-none focus:bg-[#f7fee7] focus:border-[#84cc16] transition-all"
            />
            <div className="absolute right-4 flex items-center gap-1">
              <kbd className="px-2 py-0.5 rounded bg-slate-100 font-mono-tech text-[10px] text-[#64748b]">⌘</kbd>
              <kbd className="px-2 py-0.5 rounded bg-slate-100 font-mono-tech text-[10px] text-[#64748b]">K</kbd>
            </div>
          </div>
        </div>

        {/* KPI Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider font-bold">
                  Total Food Products
                </span>
                <span className="text-3xl font-extrabold text-[#0f172a] mt-1 block">14,820</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#ecfccb] flex items-center justify-center text-[#65a30d]">
                <span className="material-symbols-outlined text-xl">nutrition</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs">
              <span className="flex items-center text-[#65a30d] font-mono-tech font-bold">
                <span className="material-symbols-outlined text-xs">trending_up</span> +4.2%
              </span>
              <span className="text-[#64748b]">from last week (+593 items)</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#84cc16]"></div>
          </div>

          <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider font-bold">
                  Verified Additives &amp; Codes
                </span>
                <span className="text-3xl font-extrabold text-[#0f172a] mt-1 block">3,450</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#f7fee7] flex items-center justify-center text-[#65a30d]">
                <span className="material-symbols-outlined text-xl">verified_user</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-[#ecfccb] text-[#65a30d] font-mono-tech text-[10px] font-bold">
                100% VERIFIED
              </span>
              <span className="text-[#64748b]">EU EFSA &amp; US FDA Synced</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#65a30d]"></div>
          </div>

          <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider font-bold">
                  Active User Profiles
                </span>
                <span className="text-3xl font-extrabold text-[#0f172a] mt-1 block">892</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center text-[#565e74]">
                <span className="material-symbols-outlined text-xl">group</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs">
              <span className="flex items-center text-[#65a30d] font-mono-tech font-bold">
                <span className="material-symbols-outlined text-xs">arrow_upward</span> +18 today
              </span>
              <span className="text-[#64748b]">542 custom radars</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#565e74]"></div>
          </div>

          <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider font-bold">
                  Pending Submissions
                </span>
                <span className="text-3xl font-extrabold text-[#e11d48] mt-1 block">18</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#fff1f2] flex items-center justify-center text-[#e11d48]">
                <span className="material-symbols-outlined text-xl">pending_actions</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-[#fff1f2] text-[#e11d48] font-mono-tech text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] animate-ping"></span>
                ACTION NEEDED
              </span>
              <span className="text-[#64748b]">Requires verification</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#e11d48]"></div>
          </div>
        </div>

        {/* Main Content 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Moderation & Product Catalog (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Catalog Filter Tabs */}
            <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1 p-0.5 bg-[#f1f5f9] rounded-xl">
                <button
                  onClick={() => setActiveCatalogTab('all')}
                  className={`px-3.5 py-1.5 rounded-lg font-mono-tech text-xs font-bold transition-all ${
                    activeCatalogTab === 'all'
                      ? 'bg-white text-[#0f172a] shadow-xs'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  All Products ({products.length})
                </button>
                <button
                  onClick={() => setActiveCatalogTab('review')}
                  className={`px-3.5 py-1.5 rounded-lg font-mono-tech text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeCatalogTab === 'review'
                      ? 'bg-white text-[#0f172a] shadow-xs'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  <span>Needs Review</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#e11d48] text-white text-[10px]">18</span>
                </button>
                <button
                  onClick={() => setActiveCatalogTab('flagged')}
                  className={`px-3.5 py-1.5 rounded-lg font-mono-tech text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeCatalogTab === 'flagged'
                      ? 'bg-white text-[#0f172a] shadow-xs'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  <span>Flagged Discrepancies</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#fffbeb] text-[#d97706] text-[10px]">7</span>
                </button>
                <button
                  onClick={() => setActiveCatalogTab('gluten')}
                  className={`px-3.5 py-1.5 rounded-lg font-mono-tech text-xs font-bold transition-all ${
                    activeCatalogTab === 'gluten'
                      ? 'bg-white text-[#0f172a] shadow-xs'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  Gluten-Free Audits
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#64748b]">
                <span>Sort by:</span>
                <span className="font-mono-tech font-bold text-[#0f172a] bg-[#f1f5f9] px-2.5 py-1 rounded-md">
                  Recent Submissions
                </span>
              </div>
            </div>

            {/* Moderation List Cards */}
            <div className="space-y-4">
              {filteredCatalog.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:border-[#84cc16]/50 transition-all space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-18 h-18 rounded-2xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-[#0f172a]">{prod.name}</h3>
                          <span
                            className={`px-2 py-0.5 rounded font-mono-tech text-[10px] font-bold uppercase ${
                              prod.isVerified
                                ? 'bg-[#ecfccb] text-[#65a30d]'
                                : 'bg-[#fffbeb] text-[#d97706]'
                            }`}
                          >
                            {prod.isVerified ? 'Commercial Verified' : 'Crowd Submission'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#64748b]">
                          <span className="font-mono-tech text-[#0f172a] font-semibold">UPC: {prod.barcode}</span>
                          <span>•</span>
                          <span className="font-medium text-[#0f172a]">{prod.brand}</span>
                          <span>•</span>
                          <span>{prod.ingredientsAnalysis.length} Ingredients</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                          {prod.allergensDetected.map((a, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full bg-[#fff1f2] text-[#e11d48] font-mono-tech text-[10px] font-bold flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-xs">warning</span>
                              <span>{a}</span>
                            </span>
                          ))}
                          <span className="px-2.5 py-0.5 rounded-full bg-[#ecfccb] text-[#65a30d] font-mono-tech text-[10px] font-bold">
                            ✓ Score {prod.nutriScore}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col items-end justify-between gap-2 shrink-0">
                      {prod.userReportsCount && prod.userReportsCount > 0 ? (
                        <div className="flex items-center gap-1 text-[#e11d48] font-mono-tech text-[10px] bg-[#fff1f2] px-2.5 py-1 rounded-full font-bold">
                          <span className="material-symbols-outlined text-xs">flag</span>
                          <span>{prod.userReportsCount} user reports pending</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[#65a30d] font-mono-tech text-[10px] bg-[#ecfccb] px-2.5 py-1 rounded-full font-bold">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          <span>Auto-Audited Today</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            setSelectedProductId(prod.id);
                            setActiveTab('product-analysis');
                          }}
                          className="px-3 py-1.5 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] font-mono-tech text-xs font-bold transition-colors"
                        >
                          Inspect Specs
                        </button>
                        <button
                          onClick={() => {
                            updateProduct({ ...prod, isVerified: true, moderationStatus: 'approved' });
                            showToast(`Verified & published ${prod.name}!`);
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white font-mono-tech text-xs font-bold transition-all shadow-xs"
                        >
                          Verify &amp; Publish
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Flag note if present */}
                  {prod.moderationNotes && (
                    <div className="p-3 bg-[#fff1f2] rounded-xl flex items-center gap-2 border border-[#ffdad6]">
                      <span className="material-symbols-outlined text-[#e11d48] text-base shrink-0">info</span>
                      <p className="text-xs text-[#93000a] leading-tight font-medium">
                        <strong>Flag Details:</strong> {prod.moderationNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Audit Radar Logs & Policy Engine (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Audit & Radar Logs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] animate-pulse"></span>
                  <h2 className="text-sm font-bold text-[#0f172a]">Live Radar Logs</h2>
                </div>
                <span className="font-mono-tech text-[10px] px-2 py-0.5 rounded bg-[#ecfccb] text-[#65a30d] font-bold">
                  REAL-TIME
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-[#f8fafc] border border-slate-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#fff1f2] text-[#e11d48] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base">emergency</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0f172a] truncate">Peanut Warning Triggered</span>
                      <span className="text-[10px] text-[#64748b]">2m ago</span>
                    </div>
                    <p className="text-[11px] text-[#64748b] truncate">User #4892 • Scanned Protein Bar</p>
                    <span className="font-mono-tech text-[10px] text-[#e11d48] font-bold block mt-0.5">
                      Match: Severe Anaphylactic Tier
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#f8fafc] border border-slate-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ecfccb] text-[#65a30d] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base">person_edit</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0f172a] truncate">Dietary Profile Updated</span>
                      <span className="text-[10px] text-[#64748b]">14m ago</span>
                    </div>
                    <p className="text-[11px] text-[#64748b] truncate">User #9011 added Celiac/Gluten filter</p>
                    <span className="font-mono-tech text-[10px] text-[#65a30d] font-bold block mt-0.5">
                      Radar sensitivity recalibrated
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#f8fafc] border border-slate-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#fffbeb] text-[#d97706] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base">report</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0f172a] truncate">Barcode Misread Report</span>
                      <span className="text-[10px] text-[#64748b]">41m ago</span>
                    </div>
                    <p className="text-[11px] text-[#64748b] truncate">UPC: 841029302 flagged for unlisted sulfites</p>
                    <span className="font-mono-tech text-[10px] text-[#d97706] font-bold block mt-0.5">
                      Queued for OCR retry
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => showToast('Opening live telemetry feed window.')}
                className="w-full py-2.5 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] font-mono-tech text-xs font-bold transition-colors text-center"
              >
                Stream Full Event Stream (1,294 today)
              </button>
            </div>

            {/* Additive Policy Engine */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#0f172a]">Additive Policy Engine</h2>
                  <p className="text-xs text-[#64748b]">Configure scanning risk rules &amp; E-Code alerts</p>
                </div>
                <span className="material-symbols-outlined text-[#65a30d]">tune</span>
              </div>

              <div className="space-y-3">
                {additivePolicies.map((policy) => (
                  <div
                    key={policy.eCode}
                    className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
                      policy.isEnforced ? 'bg-[#f7fee7] border-[#d9f99d]' : 'bg-[#f8fafc] border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-white text-[#65a30d] font-mono-tech font-bold text-[10px] border border-slate-200/50">
                          {policy.eCode}
                        </span>
                        <span className="text-xs font-bold text-[#0f172a]">{policy.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleAdditivePolicy(policy.eCode)}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                          policy.isEnforced ? 'bg-[#84cc16]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                            policy.isEnforced ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        ></div>
                      </button>
                    </div>
                    <p className="text-xs text-[#64748b] leading-relaxed">{policy.description}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#65a30d] font-mono-tech font-bold">
                      <span className="material-symbols-outlined text-xs">
                        {policy.isEnforced ? 'check_circle' : 'pause_circle'}
                      </span>
                      <span>{policy.statusText}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => showToast('Rules pushed to global edge nodes.')}
                className="w-full py-3 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-mono-tech text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                <span>Deploy Additive Matrix to Edge CDN</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Product Entry Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-4 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#ecfccb] text-[#65a30d] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f172a]">New Product Entry</h3>
                  <p className="text-xs text-[#64748b]">Add verified item to global NutriScan food catalog</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#64748b] hover:text-[#0f172a]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-mono-tech text-[11px] font-semibold text-[#1e293b]">Barcode (UPC/EAN)</label>
                  <input
                    type="text"
                    required
                    value={newBarcode}
                    onChange={(e) => setNewBarcode(e.target.value)}
                    placeholder="e.g. 012345678901"
                    className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#84cc16]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono-tech text-[11px] font-semibold text-[#1e293b]">Nutri-Score</label>
                  <select
                    value={newNutriScore}
                    onChange={(e) => setNewNutriScore(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none"
                  >
                    <option value="A">Grade A (Optimal)</option>
                    <option value="B">Grade B (Balanced)</option>
                    <option value="C">Grade C (Moderate)</option>
                    <option value="D">Grade D (Caution)</option>
                    <option value="E">Grade E (Low)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-mono-tech text-[11px] font-semibold text-[#1e293b]">Product Title</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. PureSeed Ancient Grain & Flax Bar"
                  className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#84cc16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-mono-tech text-[11px] font-semibold text-[#1e293b]">Brand / Maker</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. PureSeed Co."
                    className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#84cc16]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono-tech text-[11px] font-semibold text-[#1e293b]">Net Weight</label>
                  <input
                    type="text"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="e.g. 45g"
                    className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#84cc16]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-mono-tech text-[11px] font-semibold text-[#1e293b]">
                  Declared Allergens (comma separated)
                </label>
                <input
                  type="text"
                  value={newAllergens}
                  onChange={(e) => setNewAllergens(e.target.value)}
                  placeholder="e.g. Almonds, Soy Lecithin"
                  className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#84cc16]"
                />
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white font-mono-tech text-xs font-bold transition-all shadow-sm"
                >
                  Publish to Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-5 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-mono-tech text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
