import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodProduct, UserAllergenProfile, ScanLog, AdditivePolicy } from '../types';
import { initialUserProfile, seedProducts, initialScanLogs, initialAdditivePolicies } from '../data/seedData';
import {
  auth,
  db,
  loginWithGoogle,
  loginWithFacebook,
  loginWithEmail,
  registerWithEmail,
  resetPassword,
  loginAnonymouslyUser,
  logoutUser,
  sanitizePayload,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { sensoryEngine } from '../utils/soundEffects';
import { seedDatabaseIfEmpty } from '../utils/firestoreSeeder';

export type NavigationTab =
  | 'dashboard'
  | 'allergen-radar'
  | 'scanner'
  | 'product-analysis'
  | 'ingredient-clarity'
  | 'admin'
  | 'auth'
  | 'onboarding';

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
  addNewProduct: (product: FoodProduct) => Promise<void>;
  updateProduct: (product: FoodProduct) => Promise<void>;
  reseedDatabase: () => Promise<void>;
  isSeeding: boolean;
  isLoggedIn: boolean;
  currentUserEmail: string | null;
  handleGoogleLogin: () => Promise<void>;
  handleFacebookLogin: () => Promise<void>;
  handleEmailLogin: (email: string, pass: string) => Promise<void>;
  handleEmailRegister: (email: string, pass: string, fullName: string) => Promise<void>;
  handlePasswordReset: (email: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  enterGuestMode: () => Promise<void>;
  hazardAlertProduct: FoodProduct | null;
  setHazardAlertProduct: (prod: FoodProduct | null) => void;
  triggerScanCheck: (product: FoodProduct) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [userProfile, setUserProfile] = useState<UserAllergenProfile>(() => {
    const saved = localStorage.getItem('ingreguide_profile') || localStorage.getItem('nutriscan_profile');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });
  const [products, setProducts] = useState<FoodProduct[]>(seedProducts);
  const [selectedProductId, setSelectedProductIdState] = useState<string>('prod-roasted-granola');
  const [scanLogs, setScanLogs] = useState<ScanLog[]>(() => {
    const saved = localStorage.getItem('ingreguide_scanlogs') || localStorage.getItem('nutriscan_scanlogs');
    return saved ? JSON.parse(saved) : initialScanLogs;
  });
  const [additivePolicies, setAdditivePolicies] = useState<AdditivePolicy[]>(() => {
    const saved = localStorage.getItem('ingreguide_policies') || localStorage.getItem('nutriscan_policies');
    return saved ? JSON.parse(saved) : initialAdditivePolicies;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(initialUserProfile.email);
  const [hazardAlertProduct, setHazardAlertProduct] = useState<FoodProduct | null>(null);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Initial seed check & real-time sync with Firestore database collections
  useEffect(() => {
    // 1. Seed database with 52 food products if not already seeded
    seedDatabaseIfEmpty().catch((err) => {
      console.warn('Initial seed verification notice:', err);
    });

    // 2. Real-time Firestore snapshot for products catalog
    const productsColl = collection(db, 'products');
    const unsubscribeProducts = onSnapshot(
      productsColl,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedProducts = snapshot.docs.map((docSnap) => docSnap.data() as FoodProduct);
          setProducts(loadedProducts);
          localStorage.setItem('ingreguide_products_cache', JSON.stringify(loadedProducts));
        }
      },
      (error) => {
        console.warn('Firestore products snapshot listener:', error);
      }
    );

    // 3. Real-time Firestore snapshot for additive policies
    const policiesColl = collection(db, 'additivePolicies');
    const unsubscribePolicies = onSnapshot(
      policiesColl,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedPolicies = snapshot.docs.map((docSnap) => docSnap.data() as AdditivePolicy);
          setAdditivePolicies(loadedPolicies);
          localStorage.setItem('ingreguide_policies', JSON.stringify(loadedPolicies));
        }
      },
      (error) => {
        console.warn('Firestore policies snapshot listener:', error);
      }
    );

    return () => {
      unsubscribeProducts();
      unsubscribePolicies();
    };
  }, []);

  // Sync auth state & hydrate profile from Firestore
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUserEmail(user.email);
        try {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data() as Partial<UserAllergenProfile>;
            setUserProfile((prev) => {
              const merged = { ...prev, ...data, uid: user.uid, email: user.email || prev.email };
              localStorage.setItem('ingreguide_profile', JSON.stringify(merged));
              return merged;
            });
          } else {
            setUserProfile((prev) => {
              const updated = {
                ...prev,
                uid: user.uid,
                displayName: user.displayName || prev.displayName,
                email: user.email || prev.email,
                photoURL: user.photoURL || prev.photoURL,
              };
              localStorage.setItem('ingreguide_profile', JSON.stringify(updated));
              setDoc(userRef, sanitizePayload(updated), { merge: true }).catch(() => {});
              return updated;
            });
          }
        } catch {
          // Fallback to local profile
          setUserProfile((prev) => ({
            ...prev,
            uid: user.uid,
            displayName: user.displayName || prev.displayName,
            email: user.email || prev.email,
            photoURL: user.photoURL || prev.photoURL,
          }));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Save profile to local storage & Firestore if user is signed in
  const updateUserProfile = async (partial: Partial<UserAllergenProfile>) => {
    const updated = { ...userProfile, ...partial, lastSynced: 'Just now' };
    setUserProfile(updated);
    localStorage.setItem('ingreguide_profile', JSON.stringify(updated));

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
    localStorage.setItem('ingreguide_scanlogs', JSON.stringify(updated));
  };

  const clearScanLogs = () => {
    setScanLogs([]);
    localStorage.removeItem('ingreguide_scanlogs');
    localStorage.removeItem('nutriscan_scanlogs');
  };

  const toggleAdditivePolicy = async (eCode: string) => {
    const updated = additivePolicies.map((p) =>
      p.eCode === eCode ? { ...p, isEnforced: !p.isEnforced } : p
    );
    setAdditivePolicies(updated);
    localStorage.setItem('ingreguide_policies', JSON.stringify(updated));

    const target = updated.find((p) => p.eCode === eCode);
    if (target) {
      try {
        await setDoc(doc(db, 'additivePolicies', eCode), sanitizePayload(target), { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `additivePolicies/${eCode}`);
      }
    }
  };

  const addNewProduct = async (product: FoodProduct) => {
    const updated = [product, ...products];
    setProducts(updated);
    try {
      await setDoc(doc(db, 'products', product.id), sanitizePayload(product), { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `products/${product.id}`);
    }
  };

  const updateProduct = async (product: FoodProduct) => {
    const updated = products.map((p) => (p.id === product.id ? product : p));
    setProducts(updated);
    try {
      await setDoc(doc(db, 'products', product.id), sanitizePayload(product), { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${product.id}`);
    }
  };

  const reseedDatabaseAction = async () => {
    setIsSeeding(true);
    try {
      await seedDatabaseIfEmpty(true);
    } catch (err) {
      console.error('Manual reseed failed:', err);
      throw err;
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGoogleLoginAction = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        setIsLoggedIn(true);
        setCurrentUserEmail(user.email);
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists() || !snap.data()?.profileCompleted) {
          setActiveTab('onboarding');
        } else {
          setActiveTab('dashboard');
        }
      }
    } catch (e: any) {
      console.warn('Google login popup cancelled or blocked:', e);
      throw e;
    }
  };

  const handleFacebookLoginAction = async () => {
    try {
      const user = await loginWithFacebook();
      if (user) {
        setIsLoggedIn(true);
        setCurrentUserEmail(user.email);
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists() || !snap.data()?.profileCompleted) {
          setActiveTab('onboarding');
        } else {
          setActiveTab('dashboard');
        }
      }
    } catch (e: any) {
      console.warn('Facebook login error:', e);
      throw e;
    }
  };

  const handleEmailLoginAction = async (email: string, pass: string) => {
    const user = await loginWithEmail(email, pass);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUserEmail(user.email);
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data()?.profileCompleted) {
        setActiveTab('dashboard');
      } else {
        setActiveTab('onboarding');
      }
    }
  };

  const handleEmailRegisterAction = async (email: string, pass: string, fullName: string) => {
    const user = await registerWithEmail(email, pass, fullName);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUserEmail(user.email);
      const updatedProfile = {
        uid: user.uid,
        displayName: fullName || 'Allergy Warrior',
        email: user.email || email,
        profileCompleted: false,
      };
      await updateUserProfile(updatedProfile);
      setActiveTab('onboarding');
    }
  };

  const handlePasswordResetAction = async (email: string) => {
    await resetPassword(email);
  };

  const handleLogoutAction = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setCurrentUserEmail(null);
    setActiveTab('auth');
  };

  const enterGuestMode = async () => {
    try {
      await loginAnonymouslyUser();
    } catch {
      // In case anonymous auth is restricted, continue with local guest profile
    }
    setIsLoggedIn(true);
    setCurrentUserEmail('guest@ingreguide.ph');
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
        reseedDatabase: reseedDatabaseAction,
        isSeeding,
        isLoggedIn,
        currentUserEmail,
        handleGoogleLogin: handleGoogleLoginAction,
        handleFacebookLogin: handleFacebookLoginAction,
        handleEmailLogin: handleEmailLoginAction,
        handleEmailRegister: handleEmailRegisterAction,
        handlePasswordReset: handlePasswordResetAction,
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
