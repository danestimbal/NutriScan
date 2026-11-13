/**
 * Front page (landing) content model + defaults.
 * Everything here can be overridden from Admin Console → Front Page Settings.
 */

export interface LandingItem {
  icon: string;
  title: string;
  desc: string;
}

export interface LandingTestimonial {
  quote: string;
  name: string;
  role: string;
}

export interface LandingSettings {
  theme: {
    pageTint: string;
  };
  hero: {
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    badgeLine1: string;
    badgeLine2: string;
    sealText: string;
    backgroundImage: string;
    overlayImage: string;
    showDecor: boolean;
  };
  why: {
    show: boolean;
    titleLead: string;
    titleAccent: string;
    lead: string;
    body: string;
    tagline: string;
    buttonLabel: string;
    imageOne: string;
    imageTwo: string;
  };
  join: {
    show: boolean;
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    buttonLabel: string;
    note: string;
  };
  steps: {
    show: boolean;
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    items: LandingItem[];
  };
  features: {
    show: boolean;
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    sideImage: string;
    items: LandingItem[];
  };
  /** Heading and button on the Product Catalog page. */
  catalog: {
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    buttonLabel: string;
  };
  decoder: {
    show: boolean;
    titleLead: string;
    titleAccent: string;
    subtitle: string;
  };
  testimonials: {
    show: boolean;
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    items: LandingTestimonial[];
  };
  about: {
    show: boolean;
    titleLead: string;
    titleAccent: string;
    body: string;
    tagline: string;
    buttonLabel: string;
    image: string;
  };
}

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=80`;

export const DEFAULT_LANDING_SETTINGS: LandingSettings = {
  theme: {
    pageTint: '#EEF2FF',
  },
  hero: {
    titleLead: 'Read every label, know every ingredient,',
    titleAccent: 'choose what’s right',
    subtitle:
      'Scan a barcode and IngreGuide turns E-numbers, hidden allergen names and nutrition figures into a plain-English breakdown matched to your own allergen profile.',
    primaryCta: 'Get Started',
    secondaryCta: 'Try as Guest',
    badgeLine1: 'Scan it',
    badgeLine2: 'Know it',
    sealText: '• INGREGUIDE • READ WITH SIGHT',
    backgroundImage: unsplash('1512621776951-a57141f2eefd', 1400),
    overlayImage: '',
    showDecor: true,
  },
  why: {
    show: true,
    titleLead: 'Why',
    titleAccent: 'IngreGuide?',
    lead: 'Food labels are written for compliance, not for the person holding the package.',
    body: 'Allergens hide behind names like caseinate and semolina, additives behind E-codes, and sugar behind a dozen aliases. IngreGuide reads the barcode, checks the product against your personal allergen profile, and explains each ingredient in words you already know.',
    tagline: 'Read with Sight, Choose What’s Right.',
    buttonLabel: 'See How It Works',
    imageOne: unsplash('1542838132-92c53300491e', 700),
    imageTwo: unsplash('1490645935967-10de6ba17061', 700),
  },
  join: {
    show: true,
    titleLead: 'Start your',
    titleAccent: 'free profile',
    subtitle: 'Save your allergens once and every scan is checked against them automatically.',
    buttonLabel: 'Create Account',
    note: 'Your allergen profile and scan history are visible only to you and the IngreGuide administrators.',
  },
  steps: {
    show: true,
    titleLead: 'How it',
    titleAccent: 'works?',
    subtitle: 'From the grocery shelf to a clear answer in four steps.',
    items: [
      {
        icon: 'tune',
        title: 'Set Your Profile',
        desc: 'Tell IngreGuide which allergens and ingredients you need to avoid. You only do this once.',
      },
      {
        icon: 'barcode_scanner',
        title: 'Scan The Barcode',
        desc: 'Point your camera at any UPC or EAN barcode, or type the number in by hand.',
      },
      {
        icon: 'translate',
        title: 'Read The Breakdown',
        desc: 'Every ingredient and E-code is explained in plain English, with allergens flagged against your profile.',
      },
      {
        icon: 'thumb_up',
        title: 'Choose With Confidence',
        desc: 'See the Nutri-Score grade and warnings at a glance, then decide what goes in your cart.',
      },
    ],
  },
  features: {
    show: true,
    titleLead: 'Having trouble reading',
    titleAccent: 'food labels?',
    subtitle: 'IngreGuide does the decoding so you can focus on choosing.',
    sideImage: unsplash('1498837167922-ddd27525d352', 500),
    items: [
      {
        icon: 'radar',
        title: 'Allergen Radar',
        desc: 'Products are checked against the allergens you switch on, including common alternate ingredient names.',
      },
      {
        icon: 'science',
        title: 'E-Code Decoder',
        desc: 'Additive numbers are translated into what they are and why they are in your food.',
      },
      {
        icon: 'grade',
        title: 'Nutri-Score At A Glance',
        desc: 'Every product carries an A-to-E grade so you can compare items quickly.',
      },
      {
        icon: 'water_drop',
        title: 'Sugar & Sodium Check',
        desc: 'See sugars, sodium and other nutrients per serving with their daily-value percentages.',
      },
      {
        icon: 'history',
        title: 'Scan History',
        desc: 'Your past scans and nutrient intake are kept in one place so you can look back.',
      },
      {
        icon: 'install_mobile',
        title: 'Installable App',
        desc: 'Add IngreGuide to your home screen and open it like any other app.',
      },
    ],
  },
  catalog: {
    titleLead: 'Browse the',
    titleAccent: 'product catalog',
    subtitle: 'Search every product in IngreGuide and tap one to open its full ingredient analysis.',
    buttonLabel: 'Open Scanner',
  },
  decoder: {
    show: true,
    titleLead: 'What the label',
    titleAccent: 'really says',
    subtitle: 'A few of the additive codes IngreGuide translates for you.',
  },
  testimonials: {
    show: true,
    titleLead: 'What our',
    titleAccent: 'users say',
    subtitle: 'Feedback from people who have tried IngreGuide.',
    items: [],
  },
  about: {
    show: true,
    titleLead: 'About the',
    titleAccent: 'project',
    body: 'IngreGuide is a Science Investigatory Project (2026–2027): a web-based personalized food ingredient information system that uses barcode scanning to give allergy alerts and make dietary information transparent for everyday shoppers.',
    tagline: 'Read with Sight, Choose What’s Right.',
    buttonLabel: 'Get Started',
    image: unsplash('1504674900247-0877df9cc836', 1200),
  },
};

/** Fill any missing section/field with defaults so older saved documents keep working. */
export function mergeLandingSettings(raw: unknown): LandingSettings {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const defaults = DEFAULT_LANDING_SETTINGS as unknown as Record<string, Record<string, unknown>>;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(defaults)) {
    const saved = source[key];
    out[key] =
      saved && typeof saved === 'object' ? { ...defaults[key], ...(saved as object) } : { ...defaults[key] };
  }
  return out as unknown as LandingSettings;
}
