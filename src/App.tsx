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
import { OnboardingProfileScreen } from './screens/OnboardingProfileScreen';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const isLanding = activeTab === 'auth';

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9ff] text-[#1e293b]">
      {!isLanding && <Header />}
      <PushTakeoverModal />
      <OfflineIndicator />

      <main className="flex-1 w-full">
        {activeTab === 'auth' && <AuthScreen />}
        {activeTab === 'onboarding' && <OnboardingProfileScreen />}
        {activeTab === 'dashboard' && <DashboardScreen />}
        {activeTab === 'scanner' && <ScannerScreen />}
        {activeTab === 'product-analysis' && <ProductAnalysisScreen />}
        {activeTab === 'ingredient-clarity' && <IngredientClarityScreen />}
        {activeTab === 'allergen-radar' && <AllergenRadarScreen />}
        {activeTab === 'admin' && <AdminScreen />}
      </main>

      {/* Global Footer */}
      <footer
        className={`w-full bg-[#f0f3ff] border-t border-[#dae2fd]/60 py-6 text-[#64748b] ${
          !isLanding ? 'mb-16 lg:mb-0' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
            <span className="font-extrabold text-base text-[#3b5bdb]">
              Ingre<span className="text-[#5379EE]">Guide</span>
            </span>
            <span className="text-xs">
              • &quot;Read with Sight, Choose What&apos;s Right&quot; | Science Investigatory Project (2026–2027) • RA 10173 &amp; WCAG 2.2
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono-tech text-xs">
            <button
              onClick={() => setActiveTab('auth')}
              className="hover:text-[#5379EE] transition-colors cursor-pointer"
            >
              Public Portal
            </button>
            <button
              onClick={() => setActiveTab('ingredient-clarity')}
              className="hover:text-[#5379EE] transition-colors cursor-pointer"
            >
              E-Codes Index
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="transition-colors font-bold text-[#5379EE] hover:underline cursor-pointer"
            >
              Admin Console
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      {!isLanding && <MobileNav />}
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
