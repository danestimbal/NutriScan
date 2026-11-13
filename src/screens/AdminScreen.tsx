import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodProduct } from '../types';
import {
  buildIngredientsAnalysis,
  fetchExternalProductByBarcode,
  hasGap,
  resolveBestProductImage,
} from '../utils/barcode';
import { detectAllergensFromText } from '../utils/allergens';
import { LandingSettingsPanel } from '../components/LandingSettingsPanel';
import { UserManagementPanel } from '../components/UserManagementPanel';
import { ResearchMetricsPanel } from '../components/ResearchMetricsPanel';
import { OWNER_ADMIN_EMAIL } from '../config/admin';

/** Only admins see the console; everyone else gets a sign-in / access notice. */
export const AdminScreen: React.FC = () => {
  const { adminRole, isAdmin, currentUserEmail, setActiveTab, handleLogout } = useApp();

  if (isAdmin) return <AdminConsole />;

  const checking = adminRole === 'loading';
  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] pt-28 pb-24 px-4 flex justify-center">
      <div className="max-w-md w-full h-fit bg-white rounded-3xl border border-slate-100 shadow-xs p-8 text-center">
        <span className="mx-auto w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center">
          <span className={`material-symbols-outlined text-3xl ${checking ? 'animate-spin' : ''}`}>
            {checking ? 'progress_activity' : 'admin_panel_settings'}
          </span>
        </span>
        <h1 className="mt-4 text-lg font-extrabold text-[#0f172a]">
          {checking ? 'Checking admin access…' : 'Admins only'}
        </h1>
        {!checking && (
          <>
            <p className="mt-2 text-sm text-[#64748b] leading-relaxed">
              {currentUserEmail && currentUserEmail !== 'guest@ingreguide.ph'
                ? `${currentUserEmail} does not have admin rights.`
                : 'Sign in with an admin account to open the Admin Console.'}{' '}
              Admin rights are granted by the owner ({OWNER_ADMIN_EMAIL}) and need a verified email, such as Google
              sign-in.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-2 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] text-xs font-bold cursor-pointer"
              >
                Back to app
              </button>
              <button
                type="button"
                onClick={() => handleLogout()}
                className="px-4 py-2 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold cursor-pointer"
              >
                Sign in with another account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AdminConsole: React.FC = () => {
  const {
    products,
    updateProduct,
    addNewProduct,
    reseedDatabase,
    isSeeding,
    additivePolicies,
    toggleAdditivePolicy,
    setSelectedProductId,
    setActiveTab,
    scanLogs,
    userProfile,
    currentUserEmail,
  } = useApp();

  const needsReviewCount = products.filter((p) => p.moderationStatus === 'needs_review' || !p.isVerified).length;
  const flaggedCount = products.filter(
    (p) => p.moderationStatus === 'flagged' || (p.userReportsCount && p.userReportsCount > 0)
  ).length;
  const verifiedAdditivesCount =
    additivePolicies.length +
    products.reduce((sum, p) => sum + (p.additivesDecoded?.length || 0), 0);
  const enforcedPoliciesCount = additivePolicies.filter((p) => p.isEnforced).length;
  const activeAllergenCount = userProfile.activeAllergens.filter((a) => a.active).length;

  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'review' | 'flagged' | 'gluten'>('all');
  const [adminSearch, setAdminSearch] = useState('');
  const [adminView, setAdminView] = useState<'catalog' | 'users' | 'research' | 'frontpage'>('catalog');
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New product form state
  const [newBarcode, setNewBarcode] = useState('');
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newIngredients, setNewIngredients] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newAllergens, setNewAllergens] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newNutriScore, setNewNutriScore] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarcode || !newName) return;

    const resolvedImage =
      newImage.trim() ||
      (await resolveBestProductImage({
        barcode: newBarcode,
        name: newName,
        brand: newBrand,
        category: newCategory,
      }));

    const ingredientsText = newIngredients.trim();
    const typedAllergens = newAllergens
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);
    const allergens = typedAllergens.length ? typedAllergens : detectAllergensFromText(ingredientsText);

    const newProd: FoodProduct = {
      id: `prod-${Date.now()}`,
      barcode: newBarcode.trim(),
      name: newName.trim(),
      brand: newBrand.trim() || 'Brand not listed',
      category: newCategory.trim() || 'Uncategorized',
      netWeight: newWeight.trim() || 'Not listed',
      image: resolvedImage,
      nutriScore: newNutriScore,
      novaGroup: 4,
      transparencyScore: 0,
      allergensDetected: allergens,
      facilityWarnings: [],
      ingredientsVerbatim:
        ingredientsText || 'No ingredient list has been entered for this product. Read the package label.',
      mandatoryWarning: allergens.length
        ? `CONTAINS: ${allergens.join(', ').toUpperCase()}.`
        : ingredientsText
          ? 'No major allergens found in the ingredient list entered.'
          : 'Allergens could not be checked because no ingredient list has been entered.',
      isVerified: true,
      verdictSummary: 'Added by an IngreGuide administrator.',
      dietaryRecommendation: allergens.length
        ? `Avoid if you react to ${allergens.join(' or ')}.`
        : 'No recommendation recorded.',
      ingredientsAnalysis: buildIngredientsAnalysis(ingredientsText),
      additivesDecoded: [],
      sugarsBreakdown: { totalGrams: 0, percentDV: 0, glycemicIndex: 0, glycemicLabel: 'Not available', items: [] },
      nutrients: {
        calories: 0,
        servingSize: 'Not listed',
        totalFat: '—',
        totalFatDV: '—',
        satFat: '—',
        satFatDV: '—',
        sodium: '—',
        sodiumDV: '—',
        carbs: '—',
        carbsDV: '—',
        fiber: '—',
        fiberDV: '—',
        sugars: '—',
        addedSugars: '—',
        protein: '—',
        proteinDV: '—',
      },
      certifications: [],
      moderationStatus: 'approved',
      dataSource: 'Admin entry',
      // Nutrition facts, processing group and transparency score are not collected by this form.
      dataGaps: ['nutrition', 'nova', 'transparency', ...(ingredientsText ? [] : (['ingredients'] as const))],
    };

    addNewProduct(newProd);
    setShowNewModal(false);
    showToast(`Added ${newName} to the catalog.`);
    setNewIngredients('');
    setNewAllergens('');
    setNewBarcode('');
    setNewName('');
    setNewBrand('');
    setNewImage('');
  };

  /** Downloads the catalog as a CSV file. */
  const exportCatalogCsv = () => {
    const cell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const header = ['Barcode', 'Name', 'Brand', 'Category', 'Nutri-Score', 'NOVA', 'Allergens', 'Verified', 'Source', 'Missing data'];
    const rows = products.map((prod) => [
      prod.barcode,
      prod.name,
      prod.brand,
      prod.category,
      hasGap(prod, 'nutriScore') ? '' : prod.nutriScore,
      hasGap(prod, 'nova') ? '' : prod.novaGroup,
      prod.allergensDetected.join('; '),
      prod.isVerified ? 'yes' : 'no',
      prod.dataSource || '',
      (prod.dataGaps || []).join('; '),
    ]);
    const csv = [header, ...rows].map((r) => r.map(cell).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `IngreGuide_Catalog_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    showToast(`Exported ${products.length} products.`);
  };

  /** Re-imports unverified, automatically imported products so placeholder values from older versions are replaced. */
  const refreshImportedProducts = async () => {
    const targets = products.filter((prod) => prod.id.startsWith('ext-') && prod.moderationStatus !== 'approved');
    if (targets.length === 0) {
      showToast('No unreviewed imported products to refresh.');
      return;
    }
    setIsRefreshing(true);
    let updated = 0;
    for (const prod of targets) {
      const fresh = await fetchExternalProductByBarcode(prod.barcode);
      if (fresh) {
        await updateProduct({ ...fresh, id: prod.id });
        updated++;
      }
    }
    setIsRefreshing(false);
    showToast(`Refreshed ${updated} of ${targets.length} imported products from the online sources.`);
  };

  /** Number of catalog products that list a given additive code. */
  const productsWithAdditive = (eCode: string) => {
    const pattern = new RegExp(`\\b${eCode.replace(/[^a-z0-9]/gi, '')}\\b`, 'i');
    return products.filter(
      (prod) =>
        prod.additivesDecoded.some((a) => pattern.test(a.eCode)) || pattern.test(prod.ingredientsVerbatim || '')
    ).length;
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
          <span className="material-symbols-outlined text-[#5379EE] text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top System Bar & Environment Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5379EE] text-xs font-bold shadow-xs">
              <span className="material-symbols-outlined text-sm">shield_person</span>
              <span>Admin Console</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f5f9] text-[#565e74] text-xs">
              <span className="material-symbols-outlined text-sm">person</span>
              <span>{currentUserEmail || 'Signed in'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f5f9] text-[#565e74] text-xs">
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              <span>{products.length} products in the database</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              disabled={isSeeding}
              onClick={async () => {
                try {
                  await reseedDatabase();
                  showToast('Sample catalog and additive policies written to the database.');
                } catch (err: any) {
                  showToast(`Could not write the sample catalog: ${err?.message || 'check your connection'}`);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <span className={`material-symbols-outlined text-sm ${isSeeding ? 'animate-spin' : ''}`}>
                {isSeeding ? 'refresh' : 'cloud_sync'}
              </span>
              <span>{isSeeding ? 'Writing…' : 'Restore Sample Catalog'}</span>
            </button>
            <button
              disabled={isRefreshing}
              onClick={refreshImportedProducts}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <span className={`material-symbols-outlined text-sm ${isRefreshing ? 'animate-spin' : ''}`}>refresh</span>
              <span>{isRefreshing ? 'Refreshing…' : 'Refresh Imported Products'}</span>
            </button>
            <button
              onClick={exportCatalogCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Export Catalog CSV</span>
            </button>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>New Product</span>
            </button>
          </div>
        </div>

        {/* Console View Switcher */}
        <div className="inline-flex flex-wrap gap-1 p-1 bg-white rounded-2xl border border-slate-100 shadow-xs">
          {(
            [
              { id: 'catalog', label: 'Catalog & Moderation', icon: 'inventory_2' },
              { id: 'users', label: 'Users', icon: 'manage_accounts' },
              { id: 'research', label: 'Research & Compliance', icon: 'science' },
              { id: 'frontpage', label: 'Front Page Settings', icon: 'web' },
            ] as const
          ).map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setAdminView(view.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                adminView === view.id ? 'bg-[#5379EE] text-white shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{view.icon}</span>
              <span>{view.label}</span>
            </button>
          ))}
        </div>

        {adminView === 'frontpage' ? (
          <LandingSettingsPanel onToast={showToast} />
        ) : adminView === 'users' ? (
          <UserManagementPanel onToast={showToast} />
        ) : adminView === 'research' ? (
          <ResearchMetricsPanel />
        ) : (
          <>
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
              placeholder="Search the catalog by product name, brand or barcode"
              className="w-full h-12 pl-11 pr-4 rounded-full bg-white text-[#0f172a] placeholder:text-[#94a3b8] text-xs font-medium border border-slate-200 shadow-xs outline-none focus:bg-[#EEF2FF]/40 focus:border-[#5379EE] transition-all"
            />
          </div>
        </div>

        {/* KPI Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-bold">
                  Total Food Products
                </span>
                <span className="text-3xl font-extrabold text-[#0f172a] mt-1 block">{products.length}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#5379EE]">
                <span className="material-symbols-outlined text-xl">nutrition</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs">
              <span className="flex items-center text-[#5379EE] font-bold">
                <span className="material-symbols-outlined text-xs">cloud_done</span> Live DB
              </span>
              <span className="text-[#64748b]">{products.filter((p) => p.isVerified).length} verified in catalog</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5379EE]"></div>
          </div>

          <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-bold">
                  Additives &amp; Policies
                </span>
                <span className="text-3xl font-extrabold text-[#0f172a] mt-1 block">{verifiedAdditivesCount}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#5379EE]">
                <span className="material-symbols-outlined text-xl">verified_user</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#5379EE] text-[10px] font-bold">
                {enforcedPoliciesCount}/{additivePolicies.length} ENFORCED
              </span>
              <span className="text-[#64748b]">additive policies switched on</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4368DD]"></div>
          </div>

          <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-bold">
                  My Scans (This Account)
                </span>
                <span className="text-3xl font-extrabold text-[#0f172a] mt-1 block">{scanLogs.length}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center text-[#565e74]">
                <span className="material-symbols-outlined text-xl">group</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs">
              <span className="flex items-center text-[#5379EE] font-bold">
                <span className="material-symbols-outlined text-xs">radar</span> {activeAllergenCount} active targets
              </span>
              <span className="text-[#64748b]">{userProfile.watchlist.length} watchlist rules</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#565e74]"></div>
          </div>

          <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-bold">
                  Pending Submissions
                </span>
                <span className="text-3xl font-extrabold text-[#e11d48] mt-1 block">{needsReviewCount}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#fff1f2] flex items-center justify-center text-[#e11d48]">
                <span className="material-symbols-outlined text-xl">pending_actions</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-[#fff1f2] text-[#e11d48] text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] animate-ping"></span>
                {needsReviewCount > 0 ? 'ACTION NEEDED' : 'ALL VERIFIED'}
              </span>
              <span className="text-[#64748b]">{flaggedCount} flagged items</span>
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
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeCatalogTab === 'all'
                      ? 'bg-white text-[#0f172a] shadow-xs'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  All Products ({products.length})
                </button>
                <button
                  onClick={() => setActiveCatalogTab('review')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeCatalogTab === 'review'
                      ? 'bg-white text-[#0f172a] shadow-xs'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  <span>Needs Review</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#e11d48] text-white text-[10px]">
                    {needsReviewCount}
                  </span>
                </button>
                <button
                  onClick={() => setActiveCatalogTab('flagged')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeCatalogTab === 'flagged'
                      ? 'bg-white text-[#0f172a] shadow-xs'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  <span>Flagged Discrepancies</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#fffbeb] text-[#d97706] text-[10px]">
                    {flaggedCount}
                  </span>
                </button>
                <button
                  onClick={() => setActiveCatalogTab('gluten')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeCatalogTab === 'gluten'
                      ? 'bg-white text-[#0f172a] shadow-xs'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  Gluten-Free Audits
                </button>
              </div>

            </div>

            {/* Moderation List Cards */}
            <div className="space-y-4">
              {filteredCatalog.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:border-[#5379EE]/50 transition-all space-y-3"
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
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              prod.isVerified
                                ? 'bg-[#EEF2FF] text-[#5379EE]'
                                : 'bg-[#fffbeb] text-[#d97706]'
                            }`}
                          >
                            {prod.dataSource === 'Sample catalog'
                              ? 'Sample data'
                              : prod.isVerified
                                ? 'Verified'
                                : prod.dataSource
                                  ? `Imported: ${prod.dataSource}`
                                  : 'Unverified'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#64748b]">
                          <span className="text-[#0f172a] font-semibold">UPC: {prod.barcode}</span>
                          <span>•</span>
                          <span className="font-medium text-[#0f172a]">{prod.brand}</span>
                          <span>•</span>
                          <span>{prod.ingredientsAnalysis.length} Ingredients</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                          {prod.allergensDetected.map((a, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full bg-[#fff1f2] text-[#e11d48] text-[10px] font-bold flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-xs">warning</span>
                              <span>{a}</span>
                            </span>
                          ))}
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#5379EE] text-[10px] font-bold">
                            {hasGap(prod, 'nutriScore') ? 'Nutri-Score not rated' : `Nutri-Score ${prod.nutriScore}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col items-end justify-between gap-2 shrink-0">
                      {prod.userReportsCount && prod.userReportsCount > 0 ? (
                        <div className="flex items-center gap-1 text-[#e11d48] text-[10px] bg-[#fff1f2] px-2.5 py-1 rounded-full font-bold">
                          <span className="material-symbols-outlined text-xs">flag</span>
                          <span>{prod.userReportsCount} user reports pending</span>
                        </div>
                      ) : (
                        <div
                          className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-bold ${
                            prod.isVerified ? 'text-[#5379EE] bg-[#EEF2FF]' : 'text-[#d97706] bg-[#fffbeb]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">{prod.isVerified ? 'verified' : 'pending'}</span>
                          <span>
                            {prod.isVerified
                              ? 'Verified'
                              : `Needs review${prod.dataGaps?.length ? ` • missing ${prod.dataGaps.join(', ')}` : ''}`}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            setSelectedProductId(prod.id);
                            setActiveTab('product-analysis');
                          }}
                          className="px-3 py-1.5 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] text-xs font-bold transition-colors"
                        >
                          Inspect Specs
                        </button>
                        <button
                          onClick={() => {
                            updateProduct({ ...prod, isVerified: true, moderationStatus: 'approved' });
                            showToast(`Verified & published ${prod.name}!`);
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all shadow-xs"
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
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5379EE] animate-pulse"></span>
                  <h2 className="text-sm font-bold text-[#0f172a]">My Recent Scans</h2>
                </div>
              </div>

              <div className="space-y-2.5">
                {scanLogs.length === 0 && (
                  <p className="text-xs text-[#64748b]">No scans on this account yet. User scan history is under the Users tab.</p>
                )}
                {scanLogs.slice(0, 4).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-[#f8fafc] border border-slate-100 flex items-start gap-3"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        log.verdict === 'HAZARD'
                          ? 'bg-[#fff1f2] text-[#e11d48]'
                          : log.verdict === 'WARNING'
                          ? 'bg-[#fffbeb] text-[#d97706]'
                          : 'bg-[#EEF2FF] text-[#5379EE]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {log.verdict === 'HAZARD'
                          ? 'emergency'
                          : log.verdict === 'WARNING'
                          ? 'report'
                          : 'verified'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#0f172a] truncate">{log.productName}</span>
                        <span className="text-[10px] text-[#64748b] shrink-0">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#64748b] truncate">
                        {log.brand} • UPC: {log.barcode}
                      </p>
                      <span
                        className={`text-[10px] font-bold block mt-0.5 ${
                          log.verdict === 'HAZARD'
                            ? 'text-[#e11d48]'
                            : log.verdict === 'WARNING'
                            ? 'text-[#d97706]'
                            : 'text-[#5379EE]'
                        }`}
                      >
                        {log.verdictLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Additive Policy Engine */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#0f172a]">Additive Policy Engine</h2>
                  <p className="text-xs text-[#64748b]">Products listing a switched-on additive show a warning when scanned</p>
                </div>
                <span className="material-symbols-outlined text-[#5379EE]">tune</span>
              </div>

              <div className="space-y-3">
                {additivePolicies.map((policy) => (
                  <div
                    key={policy.eCode}
                    className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
                      policy.isEnforced ? 'bg-[#EEF2FF] border-[#c7d2fe]' : 'bg-[#f8fafc] border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-white text-[#5379EE] font-bold text-[10px] border border-slate-200/50">
                          {policy.eCode}
                        </span>
                        <span className="text-xs font-bold text-[#0f172a]">{policy.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleAdditivePolicy(policy.eCode)}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                          policy.isEnforced ? 'bg-[#5379EE]' : 'bg-slate-300'
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
                    <div className="flex items-center gap-1.5 text-[10px] text-[#5379EE] font-bold">
                      <span className="material-symbols-outlined text-xs">
                        {policy.isEnforced ? 'check_circle' : 'pause_circle'}
                      </span>
                      <span>
                        {policy.isEnforced ? 'On' : 'Off'} • found in {productsWithAdditive(policy.eCode)} of {products.length}{' '}
                        catalog products
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-[#64748b]">Changes take effect for all users as soon as you toggle them.</p>
            </div>
          </div>
        </div>
          </>
        )}
      </div>

      {/* New Product Entry Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-4 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#e0e7ff] text-[#5379EE] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f172a]">New Product Entry</h3>
                  <p className="text-xs text-[#64748b]">Only what you enter is saved. Missing details are shown as "not available".</p>
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
                  <label className="block text-[11px] font-semibold text-[#1e293b]">Barcode (UPC/EAN)</label>
                  <input
                    type="text"
                    required
                    value={newBarcode}
                    onChange={(e) => setNewBarcode(e.target.value)}
                    placeholder="e.g. 012345678901"
                    className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#5379EE]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#1e293b]">Nutri-Score</label>
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
                <label className="block text-[11px] font-semibold text-[#1e293b]">Product Title</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Product name as printed on the package"
                  className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#5379EE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#1e293b]">Brand / Maker</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="Brand or manufacturer"
                    className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#5379EE]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#1e293b]">Net Weight</label>
                  <input
                    type="text"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="e.g. 45g"
                    className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#5379EE]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#1e293b]">
                  Declared allergens (comma separated; leave blank to detect from the ingredient list)
                </label>
                <input
                  type="text"
                  value={newAllergens}
                  onChange={(e) => setNewAllergens(e.target.value)}
                  placeholder="e.g. Almonds, Soy Lecithin"
                  className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#5379EE]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#1e293b]">Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Snacks, Beverages, Dairy"
                  className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#5379EE]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#1e293b]">
                  Ingredient list (copy it from the package)
                </label>
                <textarea
                  value={newIngredients}
                  onChange={(e) => setNewIngredients(e.target.value)}
                  rows={3}
                  placeholder="e.g. Wheat flour, sugar, palm oil, cocoa powder, soy lecithin, salt"
                  className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#5379EE] leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#1e293b]">
                  Product Image URL (optional — auto-fetched if blank)
                </label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://... (leave blank to auto-fetch from barcode/brand)"
                  className="w-full h-10 px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#5379EE]"
                />
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold transition-all shadow-sm"
                >
                  Publish to Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-5 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0f172a] text-xs font-bold transition-colors"
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
