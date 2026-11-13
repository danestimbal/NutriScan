/**
 * Checks the allergen engine against the seed catalog and known edge cases.
 * Run with: npx tsx scripts/test-allergens.ts
 */
import { comprehensiveSeedProducts } from '../src/data/seedProducts50';
import {
  ALLERGEN_DEFS,
  defaultAllergenList,
  detectAllergenIds,
  evaluateProduct,
  normalizeAllergenList,
} from '../src/utils/allergens';
import { AdditivePolicy, AllergenItem, FoodProduct } from '../src/types';

let failures = 0;
const check = (name: string, actual: unknown, expected: unknown) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n      got      ${JSON.stringify(actual)}\n      expected ${JSON.stringify(expected)}`}`);
};

const radar = (...on: string[]): AllergenItem[] =>
  defaultAllergenList().map((a) => ({ ...a, active: on.includes(a.id) }));
const profile = (on: string[], watchlist: string[] = [], dietaryPreferences: string[] = []) => ({
  activeAllergens: radar(...on),
  watchlist,
  dietaryPreferences,
});
const byName = (fragment: string): FoodProduct => {
  const p = comprehensiveSeedProducts.find((x) => x.name.includes(fragment));
  if (!p) throw new Error(`seed product not found: ${fragment}`);
  return p;
};
const verdict = (p: FoodProduct, on: string[], watch: string[] = [], diets: string[] = [], policies: AdditivePolicy[] = []) =>
  evaluateProduct(p, profile(on, watch, diets), policies).verdict;

// --- text detection ---
check('cocoa butter is not dairy', detectAllergenIds('sugar, cocoa butter, cocoa mass'), []);
check('peanut butter is peanuts, not dairy', detectAllergenIds('peanut butter, salt'), ['peanuts']);
check('almond milk is tree nuts, not dairy', detectAllergenIds('almond milk, water'), ['tree-nuts']);
check('coconut cream is not dairy', detectAllergenIds('coconut cream, sugar'), []);
check('cream of tartar is not dairy', detectAllergenIds('cream of tartar, baking soda'), []);
check('sunflower lecithin is not soy', detectAllergenIds('sunflower lecithin'), []);
check('unspecified lecithin is flagged as soy', detectAllergenIds('lecithin'), ['soy']);
check('gluten-free claim is not gluten', detectAllergenIds('certified gluten-free oats'), []);
check('eggplant is not egg', detectAllergenIds('eggplant, tomato'), []);
check('buckwheat is not wheat', detectAllergenIds('buckwheat flour'), []);
check('maltodextrin is not malt', detectAllergenIds('maltodextrin'), []);
check('whey + casein are dairy', detectAllergenIds('whey protein, sodium caseinate'), ['dairy']);
check('shrimp paste is shellfish', detectAllergenIds('shrimp paste, salt'), ['shellfish']);
check('fish sauce is fish', detectAllergenIds('fish sauce (anchovy, salt)'), ['fish']);
check('tahini is sesame', detectAllergenIds('tahini, lemon'), ['sesame']);
check('E223 is sulfites', detectAllergenIds('preservative (E223)'), ['sulfites']);

// --- the four toggles that never fired before ---
const nutella = byName('Nutella');
check('Nutella + tree-nut radar => HAZARD', verdict(nutella, ['tree-nuts']), 'HAZARD');
check('Nutella + dairy radar => HAZARD', verdict(nutella, ['dairy']), 'HAZARD');
check('Nutella + soy radar => HAZARD', verdict(nutella, ['soy']), 'HAZARD');
check('Nutella + peanut radar only => not HAZARD', verdict(nutella, ['peanuts']) !== 'HAZARD', true);
check('Nutella + nothing on => SAFE', verdict(nutella, []), 'SAFE');

const eggProduct = comprehensiveSeedProducts.find((p) => detectAllergenIds(p.allergensDetected.join(' ; ')).includes('eggs'));
if (eggProduct) check(`${eggProduct.name} + egg radar => HAZARD`, verdict(eggProduct, ['eggs']), 'HAZARD');
const sesameProduct = comprehensiveSeedProducts.find((p) => detectAllergenIds(`${p.allergensDetected.join(' ; ')} ${p.ingredientsVerbatim}`).includes('sesame'));
if (sesameProduct) check(`${sesameProduct.name} + sesame radar => HAZARD`, verdict(sesameProduct, ['sesame']), 'HAZARD');
const shellfishProduct = comprehensiveSeedProducts.find((p) => detectAllergenIds(`${p.allergensDetected.join(' ; ')} ${p.ingredientsVerbatim}`).includes('shellfish'));
if (shellfishProduct) check(`${shellfishProduct.name} + shellfish radar => HAZARD`, verdict(shellfishProduct, ['shellfish']), 'HAZARD');

// --- severity: only tier 1 raises the full hazard alarm ---
const dairyAs = (tier: 1 | 2 | 3) => ({
  activeAllergens: radar('dairy').map((a) => (a.id === 'dairy' ? { ...a, tier } : a)),
  watchlist: [],
});
check('Nutella + dairy as intolerance (tier 2) => WARNING', evaluateProduct(nutella, dairyAs(2)).verdict, 'WARNING');
check('Nutella + dairy as anaphylactic (tier 1) => HAZARD', evaluateProduct(nutella, dairyAs(1)).verdict, 'HAZARD');

// --- advisory ("may contain") is a warning, not a hazard ---
const doritos = byName('Doritos');
check('Doritos + dairy radar => HAZARD', verdict(doritos, ['dairy']), 'HAZARD');
check('Doritos (wheat cross-contact) + gluten radar => WARNING', verdict(doritos, ['gluten']), 'WARNING');

// --- watchlist, policies, diets ---
const coke = byName('Coca-Cola');
check('Coke + nothing => SAFE', verdict(coke, []), 'SAFE');
check('Coke + HFCS on watchlist => WARNING', verdict(coke, [], ['High Fructose Corn Syrup']), 'WARNING');
check('Coke + unrelated watchlist => SAFE', verdict(coke, [], ['Aspartame (E951)']), 'SAFE');
const e150d: AdditivePolicy = { eCode: 'E150d', name: 'x', description: '', isEnforced: true, enforcedCount: 0, badge: '', statusText: '' };
check('Coke + enforced E150d policy => WARNING', verdict(coke, [], [], [], [e150d]), 'WARNING');
check('Coke + switched-off E150d policy => SAFE', verdict(coke, [], [], [], [{ ...e150d, isEnforced: false }]), 'SAFE');
check('Doritos + MSG (E621) on watchlist => WARNING', verdict(doritos, [], ['Monosodium Glutamate (E621)']), 'WARNING');
check('Nutella + vegan => WARNING', verdict(nutella, [], [], ['Vegan']), 'WARNING');
check('Nutella + vegetarian => SAFE', verdict(nutella, [], [], ['Vegetarian']), 'SAFE');
check('Doritos (210 mg) + low sodium => WARNING', verdict(doritos, [], [], ['Low Sodium (DASH)']), 'WARNING');

// --- unknown ingredients never read as safe ---
const blank: FoodProduct = { ...coke, allergensDetected: [], ingredientsVerbatim: 'placeholder', ingredientsAnalysis: [], additivesDecoded: [], mandatoryWarning: '', dataGaps: ['ingredients'] };
check('No ingredient data => WARNING', verdict(blank, ['peanuts']), 'WARNING');

// --- profile migration ---
const legacy = [
  { id: 'peanuts', name: 'Peanuts', tier: 1, tierLabel: 'Anaphylactic', active: true, icon: 'x', description: 'old' },
  { id: 'sesame', name: 'Sesame & Sulfites (E220-228)', tier: 3, tierLabel: 'Sensitivity', active: true, icon: 'x', description: 'old' },
  { id: 'tree-nuts', name: 'Tree Nuts (Almonds, Cashews)', tier: 2, tierLabel: 'Intolerance', active: false, icon: 'x', description: 'old' },
] as AllergenItem[];
const migrated = normalizeAllergenList(legacy);
check('migration lists every allergen', migrated.length, ALLERGEN_DEFS.length);
check('migration keeps active choices', migrated.filter((a) => a.active).map((a) => a.id), ['peanuts', 'sesame']);
check('migration keeps chosen severity', migrated.find((a) => a.id === 'tree-nuts')?.tier, 2);
check('migration adds fish (off)', migrated.find((a) => a.id === 'fish')?.active, false);

// --- no seed product with declared allergens goes undetected ---
// Oats, corn and legumes are listed on some products for information but are not regulated allergens.
const NOT_REGULATED = /^(oats|corn|legumes|chickpeas)\b/i;
const undetected = comprehensiveSeedProducts.filter(
  (p) =>
    p.allergensDetected.some((entry) => !NOT_REGULATED.test(entry)) &&
    detectAllergenIds(p.allergensDetected.join(' ; ')).length === 0
);
check('every regulated allergen declared in the seed catalog is recognised', undetected.map((p) => `${p.name}: ${p.allergensDetected.join(' | ')}`), []);
check('mustard is recognised', verdict(byName("French's"), ['mustard']), 'HAZARD');

console.log(failures === 0 ? '\nAll checks passed' : `\n${failures} check(s) FAILED`);
process.exit(failures === 0 ? 0 : 1);
