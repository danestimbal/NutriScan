import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PushTakeoverModal } from './components/PushTakeoverModal';

import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ScannerScreen } from './screens/ScannerScreen';
import { ProductAnalysisScreen } from './screens/ProductAnalysisScreen';
import { IngredientClarityScreen } from './screens/IngredientClarityScreen';
import { AllergenRadarScreen } from './screens/AllergenRadarScreen';
import { AdminScreen } from './screens/AdminScreen';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9ff] text-[#111c2d]">
      <Header />
      <PushTakeoverModal />
      <OfflineIndicator />

      <main className="flex-1 w-full">
        {activeTab === 'auth' && <AuthScreen />}
        {activeTab === 'dashboard' && <DashboardScreen />}
        {activeTab === 'scanner' && <ScannerScreen />}
        {activeTab === 'product-analysis' && <ProductAnalysisScreen />}
        {activeTab === 'ingredient-clarity' && <IngredientClarityScreen />}
        {activeTab === 'allergen-radar' && <AllergenRadarScreen />}
        {activeTab === 'admin' && <AdminScreen />}
      </main>

      {/* Global Footer */}
      <footer className="w-full bg-[#f0f3ff] border-t border-[#dae2fd]/60 py-6 mb-16 lg:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-[#65a30d]">NutriScan</span>
            <span className="text-xs text-[#64748b]">
              • Modern Botanical Food Clarity &amp; Allergen Intelligence
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono-tech text-xs text-[#64748b]">
            <button
              onClick={() => setActiveTab('auth')}
              className="hover:text-[#0f172a] transition-colors"
            >
              Public Portal
            </button>
            <button
              onClick={() => setActiveTab('ingredient-clarity')}
              className="hover:text-[#0f172a] transition-colors"
            >
              E-Codes Index
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-[#0f172a] transition-colors font-bold text-[#65a30d]"
            >
              Admin Console
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
