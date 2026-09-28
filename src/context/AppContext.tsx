import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodProduct, UserAllergenProfile, ScanLog, AdditivePolicy } from '../types';
import { initialUserProfile, seedProducts, initialScanLogs, initialAdditivePolicies } from '../data/seedData';
import { auth, db, loginWithGoogle, logoutUser, sanitizePayload, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { sensoryEngine } from '../utils/soundEffects';

export type NavigationTab =
  | 'dashboard'
  | 'allergen-radar'
  | 'scanner'
  | 'product-analysis'
  | 'ingredient-clarity'
  | 'admin'
  | 'auth';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userProfile: UserAllergenProfile;
  updateUserProfile: (profile: Partial<UserAllergenProfile>) => Promise<void>;
  toggleAllergen: (allergenId: string) => void;
  addToWatchlist: (item: string) => void;
  removeFromWatchlist: (item: string) => void;
  toggleSentrySetting: (setting: keyof UserAllergenProfile['sentrySettings']) => void;
  products: FoodProduct[];
  selectedProduct: FoodProduct;
  setSelectedProductId: (id: string) => void;
  scanLogs: ScanLog[];
  addScanLog: (log: Omit<ScanLog, 'id' | 'timestamp'>) => void;
  clearScanLogs: () => void;
  additivePolicies: AdditivePolicy[];
  toggleAdditivePolicy: (eCode: string) => void;
  addNewProduct: (product: FoodProduct) => void;
  updateProduct: (product: FoodProduct) => void;
  isLoggedIn: boolean;
  currentUserEmail: string | null;
  handleGoogleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  enterGuestMode: () => void;
  hazardAlertProduct: FoodProduct | null;
  setHazardAlertProduct: (prod: FoodProduct | null) => void;
  triggerScanCheck: (product: FoodProduct) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [userProfile, setUserProfile] = useState<UserAllergenProfile>(() => {
    const saved = localStorage.getItem('nutriscan_profile');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });
  const [products, setProducts] = useState<FoodProduct[]>(seedProducts);
  const [selectedProductId, setSelectedProductIdState] = useState<string>('prod-roasted-granola');
  const [scanLogs, setScanLogs] = useState<ScanLog[]>(() => {
    const saved = localStorage.getItem('nutriscan_scanlogs');
    return saved ? JSON.parse(saved) : initialScanLogs;
  });
  const [additivePolicies, setAdditivePolicies] = useState<AdditivePolicy[]>(() => {
    const saved = localStorage.getItem('nutriscan_policies');
    return saved ? JSON.parse(saved) : initialAdditivePolicies;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(initialUserProfile.email);
  const [hazardAlertProduct, setHazardAlertProduct] = useState<FoodProduct | null>(null);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUserEmail(user.email);
        setUserProfile((prev) => ({
          ...prev,
          uid: user.uid,
          displayName: user.displayName || prev.displayName,
          email: user.email || prev.email,
          photoURL: user.photoURL || prev.photoURL,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Save profile to local storage & Firestore if user is signed in
  const updateUserProfile = async (partial: Partial<UserAllergenProfile>) => {
    const updated = { ...userProfile, ...partial, lastSynced: 'Just now' };
    setUserProfile(updated);
    localStorage.setItem('nutriscan_profile', JSON.stringify(updated));

    if (auth.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, sanitizePayload(updated), { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }
    }
  };

  const toggleAllergen = (allergenId: string) => {
    const updatedAllergens = userProfile.activeAllergens.map((item) =>
      item.id === allergenId ? { ...item, active: !item.active } : item
    );
    updateUserProfile({ activeAllergens: updatedAllergens });
  };

  const addToWatchlist = (item: string) => {
    const trimmed = item.trim();
    if (!trimmed || userProfile.watchlist.includes(trimmed)) return;
    const updated = [trimmed, ...userProfile.watchlist];
    updateUserProfile({ watchlist: updated });
  };

  const removeFromWatchlist = (item: string) => {
    const updated = userProfile.watchlist.filter((x) => x !== item);
    updateUserProfile({ watchlist: updated });
  };

  const toggleSentrySetting = (setting: keyof UserAllergenProfile['sentrySettings']) => {
    const updated = {
      ...userProfile.sentrySettings,
      [setting]: !userProfile.sentrySettings[setting],
    };
    updateUserProfile({ sentrySettings: updated });
  };

  const setSelectedProductId = (id: string) => {
    setSelectedProductIdState(id);
  };

  const selectedProduct =
    products.find((p) => p.id === selectedProductId || p.barcode === selectedProductId) || products[0];

  const addScanLog = (logData: Omit<ScanLog, 'id' | 'timestamp'>) => {
    const newLog: ScanLog = {
      ...logData,
      id: `scan-${Date.now()}`,
      timestamp: 'Just now',
    };
    const updated = [newLog, ...scanLogs];
    setScanLogs(updated);
    localStorage.setItem('nutriscan_scanlogs', JSON.stringify(updated));
  };

  const clearScanLogs = () => {
    setScanLogs([]);
    localStorage.removeItem('nutriscan_scanlogs');
  };

  const toggleAdditivePolicy = (eCode: string) => {
    const updated = additivePolicies.map((p) =>
      p.eCode === eCode ? { ...p, isEnforced: !p.isEnforced } : p
    );
    setAdditivePolicies(updated);
    localStorage.setItem('nutriscan_policies', JSON.stringify(updated));
  };

  const addNewProduct = (product: FoodProduct) => {
    const updated = [product, ...products];
    setProducts(updated);
  };

  const updateProduct = (product: FoodProduct) => {
    const updated = products.map((p) => (p.id === product.id ? product : p));
    setProducts(updated);
  };

  const handleGoogleLoginAction = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        setIsLoggedIn(true);
        setCurrentUserEmail(user.email);
        updateUserProfile({
          uid: user.uid,
          displayName: user.displayName || 'Allergy Warrior',
          email: user.email || '',
          photoURL: user.photoURL || undefined,
        });
        setActiveTab('dashboard');
      }
    } catch (e) {
      console.warn('Google login popup cancelled or blocked:', e);
    }
  };

  const handleLogoutAction = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setCurrentUserEmail(null);
    setActiveTab('auth');
  };

  const enterGuestMode = () => {
    setIsLoggedIn(true);
    setCurrentUserEmail('guest@nutriscan.app');
    setActiveTab('dashboard');
  };

  // Cross-reference a product with active user allergies to trigger sensory sentry
  const triggerScanCheck = (product: FoodProduct) => {
    const activeAllergenNames = userProfile.activeAllergens
      .filter((a) => a.active)
      .map((a) => a.name.toLowerCase());

    const hasMatch = product.allergensDetected.some((allergen) =>
      activeAllergenNames.some(
        (target) =>
          allergen.toLowerCase().includes(target) ||
          (target.includes('peanut') && allergen.toLowerCase().includes('peanut')) ||
          (target.includes('gluten') && allergen.toLowerCase().includes('gluten')) ||
          (target.includes('dairy') && (allergen.toLowerCase().includes('dairy') || allergen.toLowerCase().includes('milk') || allergen.toLowerCase().includes('lactose'))) ||
          (target.includes('soy') && allergen.toLowerCase().includes('soy'))
      )
    );

    const verdict = hasMatch ? 'HAZARD' : product.allergensDetected.length > 0 ? 'WARNING' : 'SAFE';

    addScanLog({
      userId: userProfile.uid,
      barcode: product.barcode,
      productName: product.name,
      brand: product.brand,
      verdict,
      verdictLabel: hasMatch ? 'Allergen Conflict Triggered' : verdict === 'WARNING' ? 'Trace Caution' : '100% Allergen Safe',
      allergensMatched: product.allergensDetected,
      confidence: 99.8,
    });

    if (hasMatch) {
      if (userProfile.sentrySettings.audibleTone) {
        sensoryEngine.playHazardTone();
      }
      if (userProfile.sentrySettings.hapticPulse) {
        sensoryEngine.triggerHaptic();
      }
      if (userProfile.sentrySettings.pushTakeover) {
        setHazardAlertProduct(product);
      }
    } else {
      sensoryEngine.playSafeChime();
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userProfile,
        updateUserProfile,
        toggleAllergen,
        addToWatchlist,
        removeFromWatchlist,
        toggleSentrySetting,
        products,
        selectedProduct,
        setSelectedProductId,
        scanLogs,
        addScanLog,
        clearScanLogs,
        additivePolicies,
        toggleAdditivePolicy,
        addNewProduct,
        updateProduct,
        isLoggedIn,
        currentUserEmail,
        handleGoogleLogin: handleGoogleLoginAction,
        handleLogout: handleLogoutAction,
        enterGuestMode,
        hazardAlertProduct,
        setHazardAlertProduct,
        triggerScanCheck,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
