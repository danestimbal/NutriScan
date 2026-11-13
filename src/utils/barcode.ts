/**
 * Barcode decoding helpers (native BarcodeDetector + multi-pass ZXing fallback)
 * and product lookup (local catalog + RetailerAPI + Open Food Facts).
 */
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import { FoodProduct, IngredientAnalysisItem, ProductDataGap } from '../types';
import { allergenForIngredient, detectAllergensFromText } from './allergens';

/** Retail product barcode formats used on packaged food. */
const RETAIL_FORMATS = [
  BarcodeFormat.EAN_13,
  BarcodeFormat.UPC_A,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
];

const NATIVE_FORMATS = ['ean_13', 'upc_a', 'ean_8', 'upc_e', 'code_128', 'code_39'];

export function createBarcodeReader(): BrowserMultiFormatReader {
  const hints = new Map<DecodeHintType, unknown>();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, RETAIL_FORMATS);
  hints.set(DecodeHintType.TRY_HARDER, true);
  return new BrowserMultiFormatReader(hints);
}

// --- Native BarcodeDetector (Chrome on Android/macOS/ChromeOS, Safari 17+) ---

interface NativeBarcodeDetector {
  detect(source: CanvasImageSource): Promise<Array<{ rawValue: string }>>;
}
type NativeBarcodeDetectorCtor = {
  new (options?: { formats: string[] }): NativeBarcodeDetector;
  getSupportedFormats(): Promise<string[]>;
};

let nativeDetectorPromise: Promise<NativeBarcodeDetector | null> | null = null;

/** Returns a native detector if the browser supports retail formats, otherwise null. */
function getNativeDetector(): Promise<NativeBarcodeDetector | null> {
  if (!nativeDetectorPromise) {
    nativeDetectorPromise = (async () => {
      const Ctor = (window as unknown as { BarcodeDetector?: NativeBarcodeDetectorCtor }).BarcodeDetector;
      if (!Ctor) return null;
      try {
        const supported = await Ctor.getSupportedFormats();
        const formats = NATIVE_FORMATS.filter((f) => supported.includes(f));
        return formats.length ? new Ctor({ formats }) : null;
      } catch {
        return null;
      }
    })();
  }
  return nativeDetectorPromise;
}

const FRAME_PASSES: Array<{ crop: number; filter: string }> = [
  { crop: 0.7, filter: 'none' },
  { crop: 1.0, filter: 'none' },
  { crop: 0.7, filter: 'contrast(1.8) brightness(1.08) grayscale(1)' },
  { crop: 1.0, filter: 'contrast(2.2) brightness(1.05) grayscale(1)' },
];

/**
 * Decodes one frame from a playing <video>. Tries the native detector first, then
 * cycles through normal and contrast-boosted crops for low-contrast webcams.
 * Returns the barcode text or null. Never throws.
 */
export async function decodeVideoFrame(
  video: HTMLVideoElement,
  reader: BrowserMultiFormatReader,
  canvas: HTMLCanvasElement,
  attempt: number
): Promise<string | null> {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh || video.readyState < 2) return null;

  const native = await getNativeDetector();
  if (native) {
    try {
      const codes = await native.detect(video);
      if (codes.length && codes[0].rawValue) return codes[0].rawValue;
    } catch {
      // fall through to ZXing
    }
  }

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  const pass = FRAME_PASSES[attempt % FRAME_PASSES.length];
  const sw = Math.round(vw * pass.crop);
  const sh = Math.round(vh * (pass.crop < 1 ? 0.6 : 1));
  const sx = Math.round((vw - sw) / 2);
  const sy = Math.round((vh - sh) / 2);

  canvas.width = sw;
  canvas.height = sh;
  ctx.filter = pass.filter;
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);
  ctx.filter = 'none';

  try {
    return reader.decodeFromCanvas(canvas).getText();
  } catch {
    return null; // NotFound / checksum / format errors are expected on most frames
  }
}

/**
 * Decodes a still image file using native BarcodeDetector + multi-pass ZXing.
 */
export async function decodeImageUrl(
  url: string,
  reader: BrowserMultiFormatReader
): Promise<string | null> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = url;
  });

  const native = await getNativeDetector();
  if (native) {
    try {
      const codes = await native.detect(img);
      if (codes.length && codes[0].rawValue) return codes[0].rawValue;
    } catch {
      // fall through to ZXing
    }
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;

  for (const pass of FRAME_PASSES) {
    const sw = Math.round(iw * pass.crop);
    const sh = Math.round(ih * pass.crop);
    const sx = Math.round((iw - sw) / 2);
    const sy = Math.round((ih - sh) / 2);
    canvas.width = sw;
    canvas.height = sh;
    ctx.filter = pass.filter;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    ctx.filter = 'none';
    try {
      return reader.decodeFromCanvas(canvas).getText();
    } catch {
      // try next pass
    }
  }

  return null;
}

/**
 * UPC-A (12 digits) is the same code as EAN-13 with a leading 0, so compare
 * barcodes without leading zeros.
 */
function normalizeBarcode(code: string): string {
  return code.replace(/\D/g, '').replace(/^0+/, '');
}

export function findProductByBarcode(products: FoodProduct[], code: string): FoodProduct | undefined {
  const target = normalizeBarcode(code);
  if (!target) return undefined;
  return products.find((p) => normalizeBarcode(p.barcode) === target);
}

/** Camera access requires HTTPS (or localhost). */
export function cameraSupportStatus(): 'ok' | 'insecure' | 'unsupported' {
  if (typeof window !== 'undefined' && !window.isSecureContext) return 'insecure';
  if (!navigator.mediaDevices?.getUserMedia) return 'unsupported';
  return 'ok';
}

// --- External Barcode Product Lookup (RetailerAPI + Open Food Facts) ---

/** Turns an ingredient statement into a list of items, marking the ones that are allergen sources. */
export function buildIngredientsAnalysis(ingredientsText: string): IngredientAnalysisItem[] {
  if (!ingredientsText.trim()) return [];
  const rawParts = ingredientsText
    .split(/[,;()]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 70)
    .slice(0, 40);

  return rawParts.map((part) => {
    const matchedAllergen = allergenForIngredient(part);
    return {
      name: part.replace(/\.$/, ''),
      description: matchedAllergen
        ? `Source of ${matchedAllergen.label.toLowerCase()}.`
        : 'Listed on the package ingredient statement.',
      status: matchedAllergen ? 'Allergen' : 'Safe',
      category: matchedAllergen ? 'Allergen Source' : 'Ingredient',
      isAllergenMatch: Boolean(matchedAllergen),
    };
  });
}

async function fetchRetailerApi(barcode: string): Promise<Record<string, any> | null> {
  const path = `/v1/products/${encodeURIComponent(barcode)}?include_cross_retailer=true`;
  try {
    // 1. Try Vite dev proxy (/api/retailer -> https://api.retailerapi.com)
    const proxyRes = await fetch(`/api/retailer${path}`);
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (data && (data.title || data.name || data.item_id || data.product)) {
        return data.product || data;
      }
    }
  } catch {
    // Fall back to direct request if proxy unavailable
  }

  const clientKey = (import.meta as any).env?.VITE_RETAILER_API_KEY;
  if (!clientKey) return null;

  try {
    const directRes = await fetch(`https://api.retailerapi.com${path}`, {
      headers: { Authorization: `Bearer ${clientKey}` },
    });
    if (!directRes.ok) return null;
    const data = await directRes.json();
    return data && (data.title || data.name || data.item_id || data.product) ? data.product || data : null;
  } catch {
    return null;
  }
}

async function fetchOpenFoodFacts(barcode: string): Promise<Record<string, any> | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.status === 1 && data.product) return data.product;
    return null;
  } catch {
    return null;
  }
}

const PLACEHOLDER_IMAGE_FRAGMENTS = [
  'photo-1546069901-ba9599a7e63c', // old Admin salad bowl placeholder
  'photo-1542838132-92c53300491e', // generic grocery fallback
];

export function isPlaceholderProductImage(url?: string): boolean {
  if (!url) return true;
  return PLACEHOLDER_IMAGE_FRAGMENTS.some((frag) => url.includes(frag));
}

/** Category-appropriate product imagery when no barcode package photo exists online. */
export function getSmartProductFallbackImage(name: string, category = ''): string {
  const text = `${name} ${category}`.toLowerCase();
  if (/wafer|choco|biscuit|cookie|cracker|oreo|rebisco|cream/.test(text)) {
    return 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80';
  }
  if (/chip|crisp|pretzel|popcorn|snack|nachos/.test(text)) {
    return 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80';
  }
  if (/milk|yogurt|dairy|cheese|butter/.test(text)) {
    return 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80';
  }
  if (/drink|soda|cola|juice|water|tea|coffee|beverage/.test(text)) {
    return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=80';
  }
  if (/noodle|pasta|ramen|pancit|soup/.test(text)) {
    return 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&auto=format&fit=crop&q=80';
  }
  if (/bread|loaf|bakery|pastry|cake/.test(text)) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80';
  }
  if (/cereal|oat|granola|bar/.test(text)) {
    return 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=600&auto=format&fit=crop&q=80';
}

async function searchOpenFoodFactsImageByName(name: string, brand = ''): Promise<string | null> {
  const query = `${brand} ${name}`.trim();
  if (!query) return null;
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      query
    )}&search_simple=1&action=process&json=1&page_size=5`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const products: Array<Record<string, any>> = Array.isArray(data?.products) ? data.products : [];
    const withImage = products.find((p) => p?.image_front_url || p?.image_url);
    return withImage?.image_front_url || withImage?.image_url || null;
  } catch {
    return null;
  }
}

/**
 * Resolves the best available product photo for an item (checking RetailerAPI,
 * Open Food Facts by barcode, Open Food Facts by brand+name, then category photo).
 */
export async function resolveBestProductImage(item: {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
}): Promise<string> {
  const cleanCode = item.barcode.replace(/\D/g, '');
  if (cleanCode) {
    const [retailerRes, offRes] = await Promise.allSettled([
      fetchRetailerApi(cleanCode),
      fetchOpenFoodFacts(cleanCode),
    ]);
    const retailer = retailerRes.status === 'fulfilled' ? retailerRes.value : null;
    const off = offRes.status === 'fulfilled' ? offRes.value : null;
    const directImg =
      retailer?.image_url || retailer?.image || off?.image_front_url || off?.image_url;
    if (directImg) return directImg;
  }

  const byNameImg = await searchOpenFoodFactsImageByName(item.name, item.brand);
  if (byNameImg) return byNameImg;

  return getSmartProductFallbackImage(item.name, item.category);
}

/** Formats a nutrient amount, or "—" when the source has no value. */
const amount = (value: number | null, unit: string) => (value === null ? '—' : `${value}${unit}`);
const percentDV = (value: number | null, dailyValue: number) =>
  value === null ? '—' : `${Math.round((value / dailyValue) * 100)}%`;

/**
 * Queries RetailerAPI (`api.retailerapi.com`) and Open Food Facts in parallel
 * to resolve any barcode not present in the catalog.
 *
 * Nothing is invented: any field the sources do not provide is left empty and
 * listed in `dataGaps`, and the record is saved as unverified for admin review.
 */
export async function fetchExternalProductByBarcode(barcode: string): Promise<FoodProduct | null> {
  const cleanCode = barcode.replace(/\D/g, '');
  if (!cleanCode) return null;

  const [retailerRes, offRes] = await Promise.allSettled([
    fetchRetailerApi(cleanCode),
    fetchOpenFoodFacts(cleanCode),
  ]);

  const retailer = retailerRes.status === 'fulfilled' ? retailerRes.value : null;
  const off = offRes.status === 'fulfilled' ? offRes.value : null;

  if (!retailer && !off) return null;

  const name =
    retailer?.title ||
    retailer?.name ||
    off?.product_name_en ||
    off?.product_name ||
    `Unnamed product (${cleanCode})`;

  const brand =
    retailer?.brand ||
    (typeof off?.brands === 'string' ? off.brands.split(',')[0].trim() : '') ||
    'Brand not listed';

  const category =
    retailer?.category ||
    (typeof off?.categories === 'string' ? off.categories.split(',')[0].trim() : '') ||
    'Uncategorized';

  const netWeight = off?.quantity || retailer?.size || retailer?.weight || 'Not listed';

  const image =
    retailer?.image_url ||
    retailer?.image ||
    off?.image_front_url ||
    off?.image_url ||
    (await searchOpenFoodFactsImageByName(name, brand)) ||
    getSmartProductFallbackImage(name, category);

  const dataGaps: ProductDataGap[] = ['transparency'];
  const sourceLabel = retailer && off ? 'RetailerAPI + Open Food Facts' : retailer ? 'RetailerAPI' : 'Open Food Facts';

  // Ingredients: only a real ingredient list counts (a retailer marketing description does not).
  const ingredientsText: string = off?.ingredients_text_en || off?.ingredients_text || retailer?.ingredients || '';
  if (!ingredientsText.trim()) dataGaps.push('ingredients');
  const ingredientsVerbatim =
    ingredientsText.trim() ||
    'No ingredient list is available online for this barcode. Read the package label before eating.';

  const allergensDetected = detectAllergensFromText(
    ingredientsText,
    Array.isArray(off?.allergens_tags) ? off.allergens_tags : []
  );

  const traceTags: string[] = Array.isArray(off?.traces_tags)
    ? off.traces_tags.map((t: string) => t.replace(/^[a-z]{2}:/i, '').replace(/-/g, ' '))
    : [];
  const facilityWarnings = traceTags.length ? [`May contain traces of ${traceTags.join(', ')}`] : [];

  const rawGrade = String(off?.nutriscore_grade || '').toUpperCase();
  const gradeKnown = ['A', 'B', 'C', 'D', 'E'].includes(rawGrade);
  if (!gradeKnown) dataGaps.push('nutriScore');
  const nutriScore = (gradeKnown ? rawGrade : 'C') as FoodProduct['nutriScore'];

  const rawNova = Number(off?.nova_group);
  const novaKnown = rawNova === 1 || rawNova === 2 || rawNova === 3 || rawNova === 4;
  if (!novaKnown) dataGaps.push('nova');
  const novaGroup = (novaKnown ? rawNova : 4) as FoodProduct['novaGroup'];

  // Nutrition: use per-serving values when the source has them, otherwise per 100 g. Never mix the two.
  const nutriments: Record<string, unknown> = off?.nutriments || {};
  const basis = nutriments['energy-kcal_serving'] !== undefined && off?.serving_size ? 'serving' : '100g';
  const read = (key: string): number | null => {
    const raw = nutriments[`${key}_${basis}`];
    const n = typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : NaN;
    return Number.isFinite(n) ? Math.round(n * 10) / 10 : null;
  };
  const kcal = read('energy-kcal');
  const sugarsG = read('sugars');
  const addedSugarsG = read('added-sugars');
  const fatG = read('fat');
  const satFatG = read('saturated-fat');
  const sodiumG = read('sodium');
  const sodiumMg = sodiumG === null ? null : Math.round(sodiumG * 1000);
  const carbsG = read('carbohydrates');
  const fiberG = read('fiber');
  const proteinG = read('proteins');
  const nutritionKnown = kcal !== null && (sugarsG !== null || carbsG !== null || fatG !== null);
  if (!nutritionKnown) dataGaps.push('nutrition');

  return {
    id: `ext-${cleanCode}`,
    barcode: cleanCode,
    name,
    brand,
    category,
    netWeight,
    image,
    nutriScore,
    novaGroup,
    transparencyScore: 0,
    allergensDetected,
    facilityWarnings,
    ingredientsVerbatim,
    mandatoryWarning: allergensDetected.length
      ? `CONTAINS: ${allergensDetected.join(', ').toUpperCase()}.`
      : ingredientsText.trim()
        ? 'No major allergens were found in the online ingredient list. Always check the physical package.'
        : 'Allergens could not be checked because no ingredient list is available. Check the physical package.',
    isVerified: false,
    moderationStatus: 'needs_review',
    dataSource: sourceLabel,
    dataGaps,
    verdictSummary: `Imported automatically from ${sourceLabel}. An administrator has not reviewed this record yet.`,
    dietaryRecommendation: allergensDetected.length
      ? `Avoid if you react to ${allergensDetected.join(' or ')}.`
      : ingredientsText.trim()
        ? 'No major allergens found in the online ingredient list.'
        : 'Not enough data to give a recommendation.',
    ingredientsAnalysis: buildIngredientsAnalysis(ingredientsText),
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: sugarsG ?? 0,
      percentDV: addedSugarsG === null ? 0 : Math.min(100, Math.round((addedSugarsG / 50) * 100)),
      glycemicIndex: 0,
      glycemicLabel: 'Not available',
      items:
        sugarsG === null
          ? []
          : [
              {
                name: 'Total Sugars',
                amount: `${sugarsG}g`,
                sharePercent: 100,
                description: `From ${sourceLabel} nutrition data.`,
              },
            ],
    },
    nutrients: {
      calories: kcal === null ? 0 : Math.round(kcal),
      servingSize: basis === 'serving' ? String(off?.serving_size) : 'per 100 g',
      totalFat: amount(fatG, 'g'),
      totalFatDV: percentDV(fatG, 78),
      satFat: amount(satFatG, 'g'),
      satFatDV: percentDV(satFatG, 20),
      sodium: amount(sodiumMg, 'mg'),
      sodiumDV: percentDV(sodiumMg, 2300),
      carbs: amount(carbsG, 'g'),
      carbsDV: percentDV(carbsG, 275),
      fiber: amount(fiberG, 'g'),
      fiberDV: percentDV(fiberG, 28),
      sugars: amount(sugarsG, 'g'),
      addedSugars: amount(addedSugarsG, 'g'),
      protein: amount(proteinG, 'g'),
      proteinDV: percentDV(proteinG, 50),
    },
    certifications: [],
  };
}

/** True when the product has no real data for the given field. */
export const hasGap = (product: Pick<FoodProduct, 'dataGaps'>, gap: ProductDataGap) =>
  (product.dataGaps || []).includes(gap);
