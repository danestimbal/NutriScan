export interface AllergenItem {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  tierLabel: 'Anaphylactic' | 'Intolerance' | 'Sensitivity';
  active: boolean;
  icon: string;
  description: string;
}

export interface UserAllergenProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  activeAllergens: AllergenItem[];
  watchlist: string[];
  sentrySettings: {
    pushTakeover: boolean;
    audibleTone: boolean;
    hapticPulse: boolean;
    caregiverDispatch: boolean;
  };
  lastSynced?: string;
}

export interface IngredientAnalysisItem {
  name: string;
  description: string;
  status: 'Safe' | 'Moderate' | 'Allergen';
  category?: string;
  percentage?: string;
  isAllergenMatch?: boolean;
}

export interface AdditiveDecodedItem {
  eCode: string;
  name: string;
  translation: string;
  scientificRole: string;
  toxicityRisk: string;
  badge: string;
}

export interface SugarBreakdownItem {
  name: string;
  amount: string;
  sharePercent: number;
  description: string;
  badge?: string;
}

export interface SafeAlternative {
  id: string;
  name: string;
  brand: string;
  nutriScore: string;
  facilityRisk: string;
  image: string;
  summary: string;
  availableNearStores?: number;
}

export interface FoodProduct {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  netWeight: string;
  image: string;
  nutriScore: 'A' | 'B' | 'C' | 'D' | 'E';
  novaGroup: 1 | 2 | 3 | 4;
  transparencyScore: number;
  allergensDetected: string[];
  facilityWarnings: string[];
  ingredientsVerbatim: string;
  mandatoryWarning: string;
  isVerified: boolean;
  verdictSummary: string;
  dietaryRecommendation: string;
  ingredientsAnalysis: IngredientAnalysisItem[];
  additivesDecoded: AdditiveDecodedItem[];
  sugarsBreakdown: {
    totalGrams: number;
    percentDV: number;
    glycemicIndex: number;
    glycemicLabel: string;
    items: SugarBreakdownItem[];
  };
  nutrients: {
    calories: number;
    servingSize: string;
    totalFat: string;
    totalFatDV: string;
    satFat: string;
    satFatDV: string;
    sodium: string;
    sodiumDV: string;
    carbs: string;
    carbsDV: string;
    fiber: string;
    fiberDV: string;
    sugars: string;
    addedSugars: string;
    protein: string;
    proteinDV: string;
    potassium?: string;
  };
  certifications: Array<{
    title: string;
    details: string;
    verified: boolean;
    icon: string;
  }>;
  safeAlternative?: SafeAlternative;
  moderationStatus?: 'approved' | 'needs_review' | 'flagged';
  userReportsCount?: number;
  moderationNotes?: string;
}

export interface ScanLog {
  id: string;
  userId: string;
  barcode: string;
  productName: string;
  brand: string;
  verdict: 'SAFE' | 'WARNING' | 'HAZARD';
  verdictLabel: string;
  allergensMatched: string[];
  timestamp: string;
  confidence: number;
}

export interface AdditivePolicy {
  eCode: string;
  name: string;
  description: string;
  isEnforced: boolean;
  enforcedCount: number;
  badge: string;
  statusText: string;
}
