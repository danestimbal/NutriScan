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
    /** Legacy field: the feature was never built, so the app no longer reads or shows it. */
    caregiverDispatch?: boolean;
  };
  dietaryPreferences?: string[];
  healthGoals?: string[];
  profileCompleted?: boolean;
  lastSynced?: string;
  intakeHistory?: DailyNutritionalIntake[];
  savedProductIds?: string[];
  researchMetrics?: ResearchMetrics;
}

/**
 * Automatically recorded scan measurements. Only records with `version: 2` are real:
 * earlier versions were pre-filled with placeholder numbers and are ignored.
 */
export interface ResearchMetrics {
  version: 2;
  /** Barcode lookups attempted (camera, photo, manual entry and live tests). */
  trialCount: number;
  /** Lookups that returned a product record. */
  successfulScans: number;
  /** Measured lookup durations in milliseconds, most recent last. */
  retrievalTimes: number[];
}

/** Product fields that could not be filled from a real source and must be shown as "not available". */
export type ProductDataGap = 'ingredients' | 'nutrition' | 'nutriScore' | 'nova' | 'transparency';

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
  /** Where this record came from, e.g. "Open Food Facts" or "Admin entry". */
  dataSource?: string;
  /** Fields with no real data. Screens must not present these as facts. */
  dataGaps?: ProductDataGap[];
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
  /** Legacy field from older logs; the app does not compute a confidence value. */
  confidence?: number;
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

export interface IntakeLogItem {
  id: string;
  name: string;
  sugar: number; // grams
  sodium: number; // mg
  protein: number; // grams
  calories?: number;
  time?: string;
}

export interface DailyNutritionalIntake {
  date: string; // formatted 'MMM dd' or 'YYYY-MM-DD'
  displayDate: string; // e.g. "Sep 14"
  dayIndex: number;
  sugar: number; // grams
  sodium: number; // mg
  protein: number; // grams
  calories: number;
  items: IntakeLogItem[];
}

export interface NutritionSummaryStats {
  avgSugar: number;
  avgSodium: number;
  avgProtein: number;
  totalDays: number;
  sugarThresholdPct: number;
  sodiumThresholdPct: number;
  proteinGoalPct: number;
}
