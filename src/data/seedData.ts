import { FoodProduct, UserAllergenProfile, AdditivePolicy } from '../types';
import { defaultAllergenList } from '../utils/allergens';
import { comprehensiveSeedProducts } from './seedProducts50';

/** A brand-new profile: nothing is switched on until the user chooses. */
export const initialUserProfile: UserAllergenProfile = {
  uid: 'guest-user',
  displayName: 'Guest User',
  email: '',
  photoURL: '',
  activeAllergens: defaultAllergenList(),
  watchlist: [],
  sentrySettings: {
    pushTakeover: true,
    audibleTone: true,
    hapticPulse: true,
  },
  dietaryPreferences: [],
  healthGoals: [],
  profileCompleted: true,
};

// 52 Seeded Food Products across 8 Grocery Categories
/** Label shown on the built-in sample products, which nobody has checked against a real package. */
export const SAMPLE_SOURCE = 'Sample catalog';

export const seedProducts: FoodProduct[] = comprehensiveSeedProducts.map((product) => ({
  ...product,
  dataSource: SAMPLE_SOURCE,
}));

export const initialAdditivePolicies: AdditivePolicy[] = [
  {
    eCode: 'E150d',
    name: 'Sulphite Ammonia Caramel',
    description: 'Brown colouring used in colas, sauces and gravies. Flagged so users who avoid caramel colours can spot it.',
    isEnforced: true,
    enforcedCount: 0,
    badge: 'Additive Policy',
    statusText: '',
  },
  {
    eCode: 'E322',
    name: 'Lecithins Cross-Check',
    description: 'Emulsifier often made from soy. Flagged so users with a soy allergy can check the source.',
    isEnforced: true,
    enforcedCount: 0,
    badge: 'Soy Warning',
    statusText: '',
  },
  {
    eCode: 'E171',
    name: 'Titanium Dioxide Ban',
    description: 'White pigment. No longer authorised as a food additive in the EU (since 2022); still permitted in some other countries.',
    isEnforced: false,
    enforcedCount: 0,
    badge: 'EU Standard',
    statusText: '',
  },
  {
    eCode: 'E621',
    name: 'Monosodium Glutamate (MSG)',
    description: 'Flavour enhancer. Considered safe by food regulators; flagged for users who prefer to avoid it.',
    isEnforced: true,
    enforcedCount: 0,
    badge: 'Umami Enhancer',
    statusText: '',
  },
  {
    eCode: 'E250',
    name: 'Sodium Nitrite Preservative',
    description: 'Curing salt in processed meats. Health agencies advise limiting processed meat intake.',
    isEnforced: true,
    enforcedCount: 0,
    badge: 'High Nitrosamine Risk',
    statusText: '',
  },
  {
    eCode: 'E407',
    name: 'Carrageenan Thickener',
    description: 'Seaweed-based thickener in plant milks and creams. Approved by food regulators; some people prefer to avoid it.',
    isEnforced: true,
    enforcedCount: 0,
    badge: 'Gut Mucosa Risk',
    statusText: '',
  },
  {
    eCode: 'E129',
    name: 'Allura Red AC (Red #40)',
    description: 'Synthetic red dye. In the EU, foods containing it must carry a warning about possible effects on activity and attention in children.',
    isEnforced: true,
    enforcedCount: 0,
    badge: 'Azo Dye Alert',
    statusText: '',
  },
  {
    eCode: 'E951',
    name: 'Aspartame Artificial Sweetener',
    description: 'Artificial sweetener. Contains phenylalanine, so people with phenylketonuria (PKU) must avoid it.',
    isEnforced: true,
    enforcedCount: 0,
    badge: 'Non-Nutritive Sweetener',
    statusText: '',
  },
];
