/**
 * Single source of truth for allergen detection and profile matching.
 *
 * Every screen that says "this product conflicts with your profile" must go
 * through evaluateProduct() so the answer is the same everywhere.
 */
import { AdditivePolicy, AllergenItem, FoodProduct, UserAllergenProfile } from '../types';

export interface AllergenDef {
  id: string;
  /** Label written onto products when this allergen is detected in text. */
  label: string;
  /** Name shown in the user's allergen radar. */
  profileName: string;
  icon: string;
  description: string;
  defaultTier: 1 | 2 | 3;
  terms: string[];
}

/**
 * The nine US major food allergens (FALCPA + FASTER Act) and the remaining EU Annex II
 * allergens (mustard, celery, lupin, sulphites; molluscs are grouped under shellfish).
 */
export const ALLERGEN_DEFS: AllergenDef[] = [
  {
    id: 'peanuts',
    label: 'Peanuts',
    profileName: 'Peanuts',
    icon: 'warning',
    description: 'Peanuts and peanut-derived ingredients such as groundnut (arachis) oil.',
    defaultTier: 1,
    terms: ['peanut', 'peanuts', 'groundnut', 'groundnuts', 'arachis'],
  },
  {
    id: 'tree-nuts',
    label: 'Tree Nuts',
    profileName: 'Tree Nuts',
    icon: 'nutrition',
    description: 'Almonds, cashews, walnuts, pecans, hazelnuts, pistachios, macadamias and similar nuts.',
    defaultTier: 1,
    terms: [
      'tree nut', 'tree nuts', 'almond', 'almonds', 'cashew', 'cashews', 'walnut', 'walnuts', 'pecan', 'pecans',
      'hazelnut', 'hazelnuts', 'pistachio', 'pistachios', 'macadamia', 'macadamias', 'brazil nut', 'brazil nuts',
      'pine nut', 'pine nuts', 'praline', 'marzipan',
    ],
  },
  {
    id: 'dairy',
    label: 'Milk / Dairy',
    profileName: 'Milk / Dairy',
    icon: 'water_drop',
    description: 'Milk and milk-derived ingredients such as whey, casein, butter, cheese and lactose.',
    defaultTier: 1,
    terms: [
      'milk', 'dairy', 'whey', 'casein', 'caseinate', 'caseinates', 'lactose', 'lactoglobulin', 'butter',
      'buttermilk', 'cheese', 'cream', 'yogurt', 'yoghurt', 'ghee',
    ],
  },
  {
    id: 'eggs',
    label: 'Eggs',
    profileName: 'Eggs',
    icon: 'egg',
    description: 'Eggs and egg-derived ingredients such as albumin.',
    defaultTier: 1,
    terms: ['egg', 'eggs', 'albumin', 'albumen', 'ovalbumin', 'egg white', 'egg yolk'],
  },
  {
    id: 'soy',
    label: 'Soy',
    profileName: 'Soy',
    icon: 'spa',
    description: 'Soybeans and soy-derived ingredients, including lecithin when its source is not stated.',
    defaultTier: 1,
    terms: ['soy', 'soya', 'soybean', 'soybeans', 'edamame', 'tofu', 'miso', 'tempeh', 'lecithin'],
  },
  {
    id: 'gluten',
    label: 'Wheat / Gluten',
    profileName: 'Wheat / Gluten',
    icon: 'grain',
    description: 'Wheat and other gluten-containing grains such as barley, rye and malt.',
    defaultTier: 1,
    terms: [
      'wheat', 'gluten', 'barley', 'rye', 'malt', 'spelt', 'semolina', 'triticale', 'durum', 'farina', 'seitan',
    ],
  },
  {
    id: 'fish',
    label: 'Fish',
    profileName: 'Fish',
    icon: 'set_meal',
    description: 'Fish and fish-derived ingredients such as anchovy or fish sauce.',
    defaultTier: 1,
    terms: [
      'fish', 'anchovy', 'anchovies', 'salmon', 'tuna', 'cod', 'pollock', 'tilapia', 'sardine', 'sardines',
      'mackerel', 'bangus', 'fish sauce', 'patis',
    ],
  },
  {
    id: 'shellfish',
    label: 'Shellfish',
    profileName: 'Shellfish',
    icon: 'restaurant',
    description: 'Crustaceans such as shrimp, crab and lobster, and molluscs such as squid, clams and oysters.',
    defaultTier: 1,
    terms: [
      'shellfish', 'shrimp', 'shrimps', 'prawn', 'prawns', 'crab', 'lobster', 'krill', 'crustacean', 'crustaceans',
      'squid', 'clam', 'clams', 'mussel', 'mussels', 'oyster', 'oysters', 'mollusc', 'molluscs', 'mollusk', 'mollusks',
    ],
  },
  {
    id: 'sesame',
    label: 'Sesame',
    profileName: 'Sesame',
    icon: 'grass',
    description: 'Sesame seeds, sesame oil and tahini.',
    defaultTier: 1,
    terms: ['sesame', 'tahini', 'benne'],
  },
  {
    id: 'mustard',
    label: 'Mustard',
    profileName: 'Mustard',
    icon: 'local_florist',
    description: 'Mustard seeds, mustard flour and prepared mustard.',
    defaultTier: 1,
    terms: ['mustard'],
  },
  {
    id: 'celery',
    label: 'Celery',
    profileName: 'Celery',
    icon: 'psychiatry',
    description: 'Celery stalks, seeds and celeriac.',
    defaultTier: 1,
    terms: ['celery', 'celeriac'],
  },
  {
    id: 'lupin',
    label: 'Lupin',
    profileName: 'Lupin',
    icon: 'yard',
    description: 'Lupin beans and lupin flour, sometimes used in gluten-free baking.',
    defaultTier: 1,
    terms: ['lupin', 'lupine', 'lupini'],
  },
  {
    id: 'sulfites',
    label: 'Sulfites',
    profileName: 'Sulfites (E220–E228)',
    icon: 'science',
    description: 'Sulfur dioxide and sulfite preservatives. Not an allergen for most people, but a known trigger for some.',
    defaultTier: 3,
    terms: [
      'sulfite', 'sulfites', 'sulphite', 'sulphites', 'metabisulfite', 'metabisulphite', 'bisulfite', 'bisulphite',
      'sulfur dioxide', 'sulphur dioxide', 'e220', 'e221', 'e222', 'e223', 'e224', 'e225', 'e226', 'e227', 'e228',
    ],
  },
];

/** Number of allergen terms the detector actually recognises (used wherever the UI states a count). */
export const MONITORED_TERM_COUNT = ALLERGEN_DEFS.reduce((sum, def) => sum + def.terms.length, 0);

const TIER_LABELS: Record<1 | 2 | 3, AllergenItem['tierLabel']> = {
  1: 'Anaphylactic',
  2: 'Intolerance',
  3: 'Sensitivity',
};
export const tierLabelFor = (tier: 1 | 2 | 3) => TIER_LABELS[tier];

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const DEF_REGEX = new Map(
  ALLERGEN_DEFS.map((def) => [
    def.id,
    new RegExp(`\\b(?:${def.terms.map((t) => escapeRegex(t).replace(/ /g, '\\s+')).join('|')})\\b`, 'i'),
  ])
);

/** Ids of saved profile entries that were renamed or merged in an earlier version. */
const LEGACY_ID_MAP: Record<string, string> = {};

/**
 * Removes wording that names an allergen without the product containing it:
 * plant "milks" and nut "butters" (keeping the plant/nut word), cream of tartar,
 * sunflower lecithin and "X-free" claims.
 */
function cleanForDetection(text: string): string {
  return text
    .replace(/\b[\w-]+[- ]free\b/gi, ' ')
    .replace(/\bcream\s+of\s+tartar\b/gi, ' ')
    .replace(/\b(cocoa|shea|peanut|almond|cashew|hazelnut|nut|seed|sunflower|apple|mango)\s+butter\b/gi, '$1')
    .replace(/\b(coconut|almond|oat|soy|soya|rice|cashew|hemp|pea)\s+(milk|cream|yogurt|yoghurt|cheese)\b/gi, '$1')
    .replace(/\bsunflower\s+lecithin\b/gi, 'sunflower');
}

/** Allergen ids found in free text. */
export function detectAllergenIds(text: string): string[] {
  const cleaned = cleanForDetection(text || '');
  return ALLERGEN_DEFS.filter((def) => DEF_REGEX.get(def.id)!.test(cleaned)).map((def) => def.id);
}

/** Allergen labels found in ingredient text and registry tags (used when importing products). */
export function detectAllergensFromText(text: string, tags: string[] = []): string[] {
  const combined = `${text} ${tags.map((t) => t.replace(/^[a-z]{2}:/i, '').replace(/-/g, ' ')).join(' ')}`;
  const ids = new Set(detectAllergenIds(combined));
  return ALLERGEN_DEFS.filter((def) => ids.has(def.id)).map((def) => def.label);
}

/** The allergen (if any) a single ingredient phrase belongs to. */
export function allergenForIngredient(text: string): AllergenDef | undefined {
  const id = detectAllergenIds(text)[0];
  return ALLERGEN_DEFS.find((def) => def.id === id);
}

// --- Profile defaults & migration -------------------------------------------

/** Fresh radar: every allergen listed, none switched on until the user chooses. */
export function defaultAllergenList(): AllergenItem[] {
  return ALLERGEN_DEFS.map((def) => ({
    id: def.id,
    name: def.profileName,
    tier: def.defaultTier,
    tierLabel: TIER_LABELS[def.defaultTier],
    active: false,
    icon: def.icon,
    description: def.description,
  }));
}

/**
 * Brings a saved radar up to date: keeps the user's on/off choice and severity,
 * refreshes names and descriptions, and adds allergens introduced later (fish, sulfites).
 */
export function normalizeAllergenList(saved?: AllergenItem[] | null): AllergenItem[] {
  const byId = new Map<string, AllergenItem>();
  for (const item of Array.isArray(saved) ? saved : []) {
    if (!item || typeof item.id !== 'string') continue;
    byId.set(LEGACY_ID_MAP[item.id] || item.id, item);
  }
  const known = defaultAllergenList().map((base) => {
    const prev = byId.get(base.id);
    if (!prev) return base;
    const tier: 1 | 2 | 3 = prev.tier === 1 || prev.tier === 2 || prev.tier === 3 ? prev.tier : base.tier;
    return { ...base, active: prev.active === true, tier, tierLabel: TIER_LABELS[tier] };
  });
  const knownIds = new Set(known.map((k) => k.id));
  const custom = Array.from(byId.values()).filter((item) => !knownIds.has(item.id));
  return [...known, ...custom];
}

// --- Product evaluation ------------------------------------------------------

const ADVISORY_SPLIT =
  /\b(may\s+contain|traces?\s+of|cross[- ]contact|cross[- ]contamination|produced\s+in\s+a\s+facility|made\s+in\s+a\s+facility|processed\s+in\s+a\s+facility|shared\s+(equipment|facility|lines?))\b/i;

/** Splits a statement into what the product contains and what it only may contain. */
function splitAdvisory(text: string): { direct: string; advisory: string } {
  const match = ADVISORY_SPLIT.exec(text);
  if (!match) return { direct: text, advisory: '' };
  return { direct: text.slice(0, match.index), advisory: text.slice(match.index) };
}

const E_CODE = /\bE\s?-?(\d{3}[a-z]?)\b/gi;
function extractECodes(text: string): string[] {
  return Array.from(text.matchAll(E_CODE), (m) => `E${m[1].toLowerCase()}`);
}

// --- Dietary preferences ------------------------------------------------------

const wordRegex = (terms: string[]) =>
  new RegExp(`\\b(?:${terms.map((t) => escapeRegex(t).replace(/ /g, '\\s+')).join('|')})\\b`, 'gi');

const MEAT_TERMS = [
  'beef', 'pork', 'chicken', 'turkey', 'lamb', 'mutton', 'veal', 'duck', 'bacon', 'ham', 'sausage', 'salami',
  'pepperoni', 'meat', 'lard', 'tallow', 'suet', 'gelatin', 'gelatine', 'collagen', 'rennet', 'carmine', 'cochineal',
];
const VEGAN_EXTRA_TERMS = ['honey', 'beeswax', 'shellac'];
const HALAL_CHECK_TERMS = [
  'pork', 'bacon', 'ham', 'lard', 'pepperoni', 'salami', 'gelatin', 'gelatine', 'alcohol', 'ethanol', 'wine', 'rum',
  'beer', 'brandy', 'whisky', 'whiskey',
];
/** FDA definition of a "low sodium" food: 140 mg or less per serving. */
const LOW_SODIUM_LIMIT_MG = 140;

export interface DietFlag {
  diet: string;
  reason: string;
}

const found = (regex: RegExp, text: string) =>
  Array.from(new Set(Array.from(text.matchAll(regex), (m) => m[0].toLowerCase())));

/**
 * Flags ingredients that conflict with the user's saved dietary preferences.
 * It only ever reports problems it can see; it never certifies a product as suitable.
 */
function dietFlagsFor(
  product: FoodProduct,
  preferences: string[],
  ingredientText: string,
  allergenIds: Set<string>
): DietFlag[] {
  const flags: DietFlag[] = [];
  const has = (keyword: string) => preferences.some((p) => p.toLowerCase().includes(keyword));
  const meat = found(wordRegex(MEAT_TERMS), ingredientText);
  const animalAllergens = (ids: string[]) =>
    ALLERGEN_DEFS.filter((d) => ids.includes(d.id) && allergenIds.has(d.id)).map((d) => d.label.toLowerCase());

  if (has('vegan')) {
    const hits = [
      ...meat,
      ...animalAllergens(['fish', 'shellfish', 'dairy', 'eggs']),
      ...found(wordRegex(VEGAN_EXTRA_TERMS), ingredientText),
    ];
    if (hits.length) flags.push({ diet: 'Vegan', reason: `contains ${hits.join(', ')}` });
  } else if (has('vegetarian')) {
    const hits = [...meat, ...animalAllergens(['fish', 'shellfish'])];
    if (hits.length) flags.push({ diet: 'Vegetarian', reason: `contains ${hits.join(', ')}` });
  } else if (has('pescatarian')) {
    if (meat.length) flags.push({ diet: 'Pescatarian', reason: `contains ${meat.join(', ')}` });
  }

  if (has('halal')) {
    const hits = found(wordRegex(HALAL_CHECK_TERMS), ingredientText);
    if (hits.length) flags.push({ diet: 'Halal', reason: `check the source of ${hits.join(', ')}` });
  }

  if (has('low sodium') && !(product.dataGaps || []).includes('nutrition')) {
    const sodiumMg = parseFloat(String(product.nutrients?.sodium || '').replace(/[^0-9.]/g, ''));
    if (Number.isFinite(sodiumMg) && sodiumMg > LOW_SODIUM_LIMIT_MG) {
      flags.push({
        diet: 'Low Sodium',
        reason: `${sodiumMg} mg sodium per ${product.nutrients.servingSize} (low-sodium limit is ${LOW_SODIUM_LIMIT_MG} mg)`,
      });
    }
  }
  return flags;
}

export interface ProductEvaluation {
  verdict: 'SAFE' | 'WARNING' | 'HAZARD';
  /** Short label for scan logs and badges. */
  label: string;
  /** Active profile allergens the product contains. */
  matched: AllergenItem[];
  /** Active profile allergens the product may contain (advisory statements). */
  mayContain: AllergenItem[];
  /** Watchlist entries found in the ingredients. */
  watchlistHits: string[];
  /** Enforced admin additive policies that apply to this product. */
  policyHits: AdditivePolicy[];
  /** Conflicts with the user's saved dietary preferences. */
  dietFlags: DietFlag[];
  /** True when there is no ingredient information to check against. */
  ingredientsUnknown: boolean;
}

/** Checks one product against a user's active allergens, watchlist and the enforced additive policies. */
export function evaluateProduct(
  product: FoodProduct,
  profile: Pick<UserAllergenProfile, 'activeAllergens' | 'watchlist' | 'dietaryPreferences'>,
  policies: AdditivePolicy[] = []
): ProductEvaluation {
  const directParts: string[] = [];
  const advisoryParts: string[] = [...(product.facilityWarnings || [])];
  // A declared-allergen entry is one statement: if it mentions cross-contact or "may contain"
  // anywhere (e.g. "Wheat (Gluten Cross-Contact)"), the whole entry is advisory.
  for (const entry of product.allergensDetected || []) {
    (ADVISORY_SPLIT.test(entry) ? advisoryParts : directParts).push(entry);
  }
  const sources = [product.mandatoryWarning || ''];
  const ingredientsUnknown = (product.dataGaps || []).includes('ingredients');
  if (!ingredientsUnknown) {
    sources.push(product.ingredientsVerbatim || '');
    sources.push((product.ingredientsAnalysis || []).map((i) => i.name).join(', '));
  }
  for (const source of sources) {
    const { direct, advisory } = splitAdvisory(source);
    directParts.push(direct);
    if (advisory) advisoryParts.push(advisory);
  }
  const directText = directParts.join(' ; ');
  const advisoryText = advisoryParts.join(' ; ');
  const directIds = new Set(detectAllergenIds(directText));
  const advisoryIds = new Set(detectAllergenIds(advisoryText));

  const active = (profile.activeAllergens || []).filter((a) => a.active);
  const isKnown = (id: string) => DEF_REGEX.has(id);
  const customHit = (item: AllergenItem, text: string) =>
    item.name.trim().length >= 3 && text.toLowerCase().includes(item.name.trim().toLowerCase());

  const matched = active.filter((a) => (isKnown(a.id) ? directIds.has(a.id) : customHit(a, directText)));
  const matchedIds = new Set(matched.map((a) => a.id));
  const mayContain = active.filter(
    (a) => !matchedIds.has(a.id) && (isKnown(a.id) ? advisoryIds.has(a.id) : customHit(a, advisoryText))
  );

  // Watchlist + additive policies are checked against the ingredient list and decoded additives.
  const additiveText = (product.additivesDecoded || []).map((a) => `${a.name} ${a.eCode}`).join(' ; ');
  const haystack = `${directText} ; ${additiveText}`.toLowerCase().replace(/#/g, '');
  const productCodes = new Set(extractECodes(`${directText} ; ${additiveText}`));

  const watchlistHits = (profile.watchlist || []).filter((entry) => {
    if (extractECodes(entry).some((code) => productCodes.has(code))) return true;
    const names = entry
      .replace(E_CODE, ' ')
      .split(/[()/,]/)
      .map((part) => part.replace(/#/g, '').trim().toLowerCase())
      .filter((part) => part.length >= 3);
    return names.some((name) => haystack.includes(name));
  });

  const policyHits = policies.filter(
    (policy) => policy.isEnforced && extractECodes(policy.eCode).some((code) => productCodes.has(code))
  );

  const dietFlags = dietFlagsFor(product, profile.dietaryPreferences || [], directText, directIds);

  const names = (items: AllergenItem[]) => items.map((a) => a.name).join(', ');
  let verdict: ProductEvaluation['verdict'] = 'SAFE';
  let label = (product.allergensDetected || []).length > 0 ? 'No conflict with your profile' : 'No allergens declared';

  // Severity chosen by the user decides how loud the result is:
  // tier 1 (anaphylactic) is a hazard; tier 2-3 (intolerance, sensitivity) is a warning.
  if (matched.some((a) => a.tier === 1)) {
    verdict = 'HAZARD';
    label = `Contains ${names(matched)}`;
  } else if (matched.length > 0) {
    verdict = 'WARNING';
    label = `Contains ${names(matched)} (${Array.from(new Set(matched.map((a) => a.tierLabel.toLowerCase()))).join(', ')})`;
  } else if (mayContain.length > 0) {
    verdict = 'WARNING';
    label = `May contain ${names(mayContain)}`;
  } else if (watchlistHits.length > 0) {
    verdict = 'WARNING';
    label = `Watchlist: ${watchlistHits.join(', ')}`;
  } else if (policyHits.length > 0) {
    verdict = 'WARNING';
    label = `Flagged additive: ${policyHits.map((p) => p.eCode).join(', ')}`;
  } else if (dietFlags.length > 0) {
    verdict = 'WARNING';
    label = `Diet conflict: ${dietFlags.map((f) => f.diet).join(', ')}`;
  } else if (ingredientsUnknown && (product.allergensDetected || []).length === 0) {
    verdict = 'WARNING';
    label = 'No ingredient data — check the package';
  }

  return { verdict, label, matched, mayContain, watchlistHits, policyHits, dietFlags, ingredientsUnknown };
}
