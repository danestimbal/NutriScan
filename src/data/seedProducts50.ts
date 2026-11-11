import { FoodProduct } from '../types';

export const comprehensiveSeedProducts: FoodProduct[] = [
  // 1
  {
    id: 'prod-roasted-granola',
    barcode: '016000275270',
    name: 'Roasted Granola Bar (Honey & Berry)',
    brand: "Nature's Crunch Co.",
    category: 'Snacks & Bars',
    netWeight: '42g',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'B',
    novaGroup: 3,
    transparencyScore: 78,
    allergensDetected: ['Soy', 'Wheat (Gluten)', 'Tree Nuts (Almonds)'],
    facilityWarnings: ['Shared line handles Peanuts, Cashews, Milk, and Sesame seeds.'],
    ingredientsVerbatim: 'Whole Grain Rolled Oats, Brown Rice Syrup, Wild Dried Berries (Cranberries, Blueberries), Cane Sugar, Whole Wheat Flour, Roasted Almonds, Organic Wildflower Honey, Canola Oil, Vegetable Glycerin, Soy Lecithin, Sea Salt, Natural Flavors, Baking Soda.',
    mandatoryWarning: 'CONTAINS: Rolled Oats (Gluten), Whole Wheat, Soy Lecithin, Almonds (Tree Nut). FACILITY: Manufactured on equipment handling Peanuts and Cashews.',
    isVerified: true,
    verdictSummary: 'Predominantly constructed from whole oats and honey. The processing aids (Tocopherols, Soy Lecithin) are natural plant fractions rather than harsh petrochemical preservatives.',
    dietaryRecommendation: 'Pre-Workout Fuel • Clean Snack',
    ingredientsAnalysis: [
      { name: 'Whole Grain Rolled Oats', description: 'Complex carbohydrates, rich in beta-glucan heart-healthy soluble fiber.', status: 'Safe', category: 'Safe Carbohydrate', percentage: '~35% of Total' },
      { name: 'Brown Rice Syrup & Cane Sugar', description: 'Nutritive caloric sweetener matrix. Moderate blood-glucose spike liability.', status: 'Moderate', category: 'High Glycemic', percentage: '~19% of Total' },
      { name: 'Roasted Almonds', description: 'Major botanical Tree Nut allergen (Prunus dulcis). Triggers IgE anaphylaxis protocol.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Soy Lecithin (E322)', description: 'Phospholipid emulsifier extracted from Glycine max. Conflict with Soy sensitivity profile.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [
      { eCode: 'E322', name: 'Soy Lecithin', translation: 'Soy-derived natural emulsifier', scientificRole: 'Fat-water phase stabilizer preventing cocoa butter separation', toxicityRisk: 'Low (Allergen Cross-React)', badge: 'Botanical Extract' },
      { eCode: 'E500ii', name: 'Sodium Bicarbonate', translation: 'Baking Soda Leavening agent', scientificRole: 'Releases carbon dioxide when heated for tender crumb texture', toxicityRisk: 'Very Low', badge: 'Mineral Salt' }
    ],
    sugarsBreakdown: {
      totalGrams: 11,
      percentDV: 22,
      glycemicIndex: 58,
      glycemicLabel: 'Moderate GI',
      items: [
        { name: 'Brown Rice Syrup', amount: '6.2g', sharePercent: 56, description: 'Maltose-dominant syrup fraction' },
        { name: 'Wildflower Honey', amount: '3.1g', sharePercent: 28, description: 'Natural fructose-glucose inverted matrix' },
        { name: 'Dried Cranberry Fructose', amount: '1.7g', sharePercent: 16, description: 'Intrinsically bound fruit sugar' }
      ]
    },
    nutrients: {
      calories: 190,
      servingSize: '1 bar (42g)',
      totalFat: '6g',
      totalFatDV: '8%',
      satFat: '0.5g',
      satFatDV: '3%',
      sodium: '115mg',
      sodiumDV: '5%',
      carbs: '29g',
      carbsDV: '11%',
      fiber: '3g',
      fiberDV: '11%',
      sugars: '11g',
      addedSugars: '9g',
      protein: '4g',
      proteinDV: '8%'
    },
    certifications: [
      { title: 'Non-GMO Project', details: 'Verified third-party identity preserved supply chain', verified: true, icon: 'verified' },
      { title: 'Whole Grain Council', details: '16g or more whole grain per serving stamp', verified: true, icon: 'eco' }
    ]
  },
  // 2
  {
    id: 'prod-silk-almond',
    barcode: '085239100421',
    name: 'Silk Pure Almond Unsweetened',
    brand: 'Danone Brands',
    category: 'Drinks & Beverages',
    netWeight: '946ml',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 3,
    transparencyScore: 92,
    allergensDetected: ['Tree Nuts (Almonds)'],
    facilityWarnings: ['Produced in a facility that also processes other tree nuts and soy.'],
    ingredientsVerbatim: 'Almondmilk (Filtered Water, Almonds), Calcium Carbonate, Sea Salt, Potassium Citrate, Sunflower Lecithin, Gellan Gum, Natural Flavor, Vitamin A Palmitate, Vitamin D2, D-Alpha-Tocopherol (Vitamin E).',
    mandatoryWarning: 'CONTAINS: Almonds (Tree Nut). Free of dairy, lactose, soy, and gluten.',
    isVerified: true,
    verdictSummary: 'Zero added sugar, highly fortified with bioavailable calcium and vitamin E. Free of carrageenan and dairy.',
    dietaryRecommendation: 'Low Glycemic • Celiac Safe • Dairy Alternative',
    ingredientsAnalysis: [
      { name: 'Filtered Almondmilk', description: 'Water and blanched almond suspension, low in calories and natural sugars.', status: 'Safe', category: 'Plant Base' },
      { name: 'Almonds', description: 'Tree nut botanical allergen. Strict flag for nut-sensitive profiles.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Gellan Gum (E418)', description: 'Microbial fermentation polysaccharide used as stabilizing suspension agent.', status: 'Safe', category: 'Stabilizer' }
    ],
    additivesDecoded: [
      { eCode: 'E418', name: 'Gellan Gum', translation: 'Fermented plant-based stabilizer', scientificRole: 'Prevents mineral settling and provides uniform suspension', toxicityRisk: 'Negligible', badge: 'Soluble Fiber' }
    ],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 15,
      glycemicLabel: 'Ultra-Low GI',
      items: [{ name: 'Natural Bound Sugars', amount: '0g', sharePercent: 0, description: 'Zero caloric sugars detected' }]
    },
    nutrients: {
      calories: 30,
      servingSize: '1 cup (240ml)',
      totalFat: '2.5g',
      totalFatDV: '3%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '170mg',
      sodiumDV: '7%',
      carbs: '1g',
      carbsDV: '0%',
      fiber: '1g',
      fiberDV: '4%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '1g',
      proteinDV: '2%'
    },
    certifications: [
      { title: 'Certified Vegan', details: 'No animal products or processing aids', verified: true, icon: 'spa' },
      { title: 'Gluten-Free Certified', details: 'Gluten content verified below 5 ppm', verified: true, icon: 'verified_user' }
    ]
  },
  // 3
  {
    id: 'prod-golden-oat-milk',
    barcode: '8934201002914',
    name: 'Cold-Pressed Golden Oat Milk',
    brand: 'Avena Pure Organics',
    category: 'Drinks & Beverages',
    netWeight: '1000ml',
    image: 'https://images.unsplash.com/photo-1568651318090-09349479e0a0?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 2,
    transparencyScore: 94,
    allergensDetected: ['Oats (Gluten Free Certified)'],
    facilityWarnings: ['100% Dedicated gluten-free and peanut-free facility.'],
    ingredientsVerbatim: 'Water, Organic Certified Gluten-Free Whole Oats, Cold-Pressed High-Oleic Sunflower Oil, Sea Salt, Dipotassium Phosphate, Calcium Carbonate.',
    mandatoryWarning: 'Contains Oats. Certified gluten-free under 5 ppm.',
    isVerified: true,
    verdictSummary: 'Clean ingredient matrix with zero synthetic emulsifiers, gums, or added sugars.',
    dietaryRecommendation: 'Barista Grade • Vegan Friendly • Allergen Safe',
    ingredientsAnalysis: [
      { name: 'Organic Whole Oats', description: 'Certified gluten-free rolled oats, enzymatically hydrolyzed for sweetness.', status: 'Safe', category: 'Whole Grain' },
      { name: 'High-Oleic Sunflower Oil', description: 'Monounsaturated fat providing barista microfoam texture.', status: 'Safe', category: 'Healthy Lipid' }
    ],
    additivesDecoded: [
      { eCode: 'E340', name: 'Dipotassium Phosphate', translation: 'Buffering mineral salt', scientificRole: 'Prevents milk curdling when added to acidic coffee brews', toxicityRisk: 'Very Low', badge: 'Mineral Salt' }
    ],
    sugarsBreakdown: {
      totalGrams: 5,
      percentDV: 10,
      glycemicIndex: 45,
      glycemicLabel: 'Moderate GI',
      items: [{ name: 'Enzymatic Oat Maltose', amount: '5g', sharePercent: 100, description: 'Naturally produced from whole oat starch conversion' }]
    },
    nutrients: {
      calories: 120,
      servingSize: '1 cup (240ml)',
      totalFat: '5g',
      totalFatDV: '6%',
      satFat: '0.5g',
      satFatDV: '3%',
      sodium: '100mg',
      sodiumDV: '4%',
      carbs: '16g',
      carbsDV: '6%',
      fiber: '2g',
      fiberDV: '7%',
      sugars: '5g',
      addedSugars: '0g',
      protein: '3g',
      proteinDV: '6%'
    },
    certifications: [
      { title: 'USDA Organic', details: '100% organic farm sourcing certified', verified: true, icon: 'eco' },
      { title: 'Non-GMO Verified', details: 'Zero GMO bioengineered inputs', verified: true, icon: 'verified' }
    ]
  },
  // 4
  {
    id: 'prod-coca-cola-original',
    barcode: '049000028904',
    name: 'Coca-Cola Original Taste',
    brand: 'The Coca-Cola Company',
    category: 'Drinks & Beverages',
    netWeight: '355ml',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'E',
    novaGroup: 4,
    transparencyScore: 42,
    allergensDetected: [],
    facilityWarnings: ['Standard bottling lines.'],
    ingredientsVerbatim: 'Carbonated Water, High Fructose Corn Syrup, Caramel Color (E150d), Phosphoric Acid, Natural Flavors, Caffeine.',
    mandatoryWarning: 'Contains high caloric added fructose sweetener and caffeine (34mg/can).',
    isVerified: true,
    verdictSummary: 'High ultra-processed index (NOVA 4) with 39 grams of added liquid sugars. Contains Ammonia Caramel (E150d) and Phosphoric Acid.',
    dietaryRecommendation: 'Extreme Glycemic Caution • Occasional Indulgence',
    ingredientsAnalysis: [
      { name: 'High Fructose Corn Syrup', description: 'Industrial corn-derived syrup. Direct hepatic fructose metabolism risk.', status: 'Moderate', category: 'Added Sugar', percentage: '~11%' },
      { name: 'Caramel Color (E150d)', description: 'Ammonia-sulfite caramel colorant with trace 4-MEI processing derivative.', status: 'Moderate', category: 'Colorant' },
      { name: 'Phosphoric Acid (E338)', description: 'Acidulant giving sharp tart bite; excess consumption correlated with bone calcium demineralization.', status: 'Moderate', category: 'Acidulant' }
    ],
    additivesDecoded: [
      { eCode: 'E150d', name: 'Sulphite Ammonia Caramel', translation: 'Dark brown food coloring', scientificRole: 'Provides trademark deep brown coloration', toxicityRisk: 'Moderate', badge: 'Synthetic Dye' },
      { eCode: 'E338', name: 'Phosphoric Acid', translation: 'Inorganic mineral acid', scientificRole: 'Lowers pH and delivers crisp tang', toxicityRisk: 'Moderate', badge: 'Acidulant' }
    ],
    sugarsBreakdown: {
      totalGrams: 39,
      percentDV: 78,
      glycemicIndex: 82,
      glycemicLabel: 'Ultra-High GI',
      items: [{ name: 'High Fructose Corn Syrup 55', amount: '39g', sharePercent: 100, description: '55% fructose, 45% glucose liquid sweetener' }]
    },
    nutrients: {
      calories: 140,
      servingSize: '1 can (355ml)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '45mg',
      sodiumDV: '2%',
      carbs: '39g',
      carbsDV: '14%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '39g',
      addedSugars: '39g',
      protein: '0g',
      proteinDV: '0%'
    },
    certifications: [
      { title: 'Kosher Certified', details: 'Orthodox Union Kosher certification', verified: true, icon: 'verified' }
    ]
  },
  // 5
  {
    id: 'prod-san-pellegrino-blood-orange',
    barcode: '041508800109',
    name: 'San Pellegrino Sparkling Blood Orange',
    brand: 'San Pellegrino S.p.A.',
    category: 'Drinks & Beverages',
    netWeight: '330ml',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'D',
    novaGroup: 4,
    transparencyScore: 65,
    allergensDetected: [],
    facilityWarnings: ['Bottled on dedicated citrus fruit lines.'],
    ingredientsVerbatim: 'Water, Blood Orange Juice from Concentrate (10%), Sugar, Carbon Dioxide, Natural Orange Flavor, Citric Acid, Anthocyanins (Natural Color).',
    mandatoryWarning: 'Contains real fruit juice and carbonated mineral water.',
    isVerified: true,
    verdictSummary: 'Contains authentic Italian blood orange juice with natural anthocyanin colorants, but carries high added sugar content.',
    dietaryRecommendation: 'Moderate Consumption • Gluten Free',
    ingredientsAnalysis: [
      { name: 'Blood Orange Juice Concentrate', description: 'Real Mediterranean blood orange juice rich in vitamin C and polyphenols.', status: 'Safe', category: 'Fruit Juice' },
      { name: 'Added Cane Sugar', description: 'Caloric sweetening agent delivering 33g sugars per can.', status: 'Moderate', category: 'Added Sugar' }
    ],
    additivesDecoded: [
      { eCode: 'E330', name: 'Citric Acid', translation: 'Natural citrus antioxidant', scientificRole: 'Balances sweetness and enhances tart flavor', toxicityRisk: 'Very Low', badge: 'Natural Organic Acid' },
      { eCode: 'E163', name: 'Anthocyanins', translation: 'Red plant pigment extract', scientificRole: 'Adds vibrant blood orange color from grape skin extracts', toxicityRisk: 'Negligible', badge: 'Plant Pigment' }
    ],
    sugarsBreakdown: {
      totalGrams: 33,
      percentDV: 66,
      glycemicIndex: 68,
      glycemicLabel: 'High GI',
      items: [{ name: 'Cane Sugar', amount: '28g', sharePercent: 85, description: 'Added crystalline sucrose' }]
    },
    nutrients: {
      calories: 140,
      servingSize: '1 can (330ml)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '5mg',
      sodiumDV: '0%',
      carbs: '34g',
      carbsDV: '12%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '33g',
      addedSugars: '28g',
      protein: '0g',
      proteinDV: '0%'
    },
    certifications: [
      { title: 'EU FIC Verified', details: 'Standard compliant European agricultural labelling', verified: true, icon: 'verified' }
    ]
  },
  // 6
  {
    id: 'prod-japanese-matcha',
    barcode: '810023490123',
    name: 'Pure Organic Japanese Ceremonial Matcha',
    brand: 'Uji Botanical Arts',
    category: 'Drinks & Beverages',
    netWeight: '30g',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 1,
    transparencyScore: 100,
    allergensDetected: [],
    facilityWarnings: ['100% Dedicated single-ingredient green tea facility in Kyoto, Japan.'],
    ingredientsVerbatim: '100% Pure First-Harvest Japanese Stone-Ground Green Tea Leaves (Camellia sinensis).',
    mandatoryWarning: 'Single ingredient whole botanical food. Zero additives or processing aids.',
    isVerified: true,
    verdictSummary: 'Pristine single-ingredient unadulterated botanical food. Abundant in EGCG catechins and L-theanine without additives.',
    dietaryRecommendation: 'Superfood Antioxidant • Keto • Vegan • Zero Allergen',
    ingredientsAnalysis: [
      { name: 'Ceremonial Grade Matcha', description: 'Whole shade-grown stone-ground tencha tea leaves packed with polyphenols.', status: 'Safe', category: 'Raw Botanical' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 0,
      glycemicLabel: 'Zero Glycemic',
      items: [{ name: 'Bound Leaf Polysaccharides', amount: '0g', sharePercent: 0, description: 'Zero caloric sugars' }]
    },
    nutrients: {
      calories: 5,
      servingSize: '1 tsp (2g)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '0mg',
      sodiumDV: '0%',
      carbs: '1g',
      carbsDV: '0%',
      fiber: '1g',
      fiberDV: '4%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '1g',
      proteinDV: '2%'
    },
    certifications: [
      { title: 'JAS Organic', details: 'Japanese Agricultural Standards Certified Organic', verified: true, icon: 'eco' },
      { title: 'Single-Origin Uji', details: 'Geographical origin authenticity certificate', verified: true, icon: 'verified' }
    ]
  },
  // 7
  {
    id: 'prod-vita-coco',
    barcode: '898999000010',
    name: 'Vita Coco Pure Coconut Water',
    brand: 'All Market Inc.',
    category: 'Drinks & Beverages',
    netWeight: '500ml',
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'B',
    novaGroup: 2,
    transparencyScore: 90,
    allergensDetected: ['Tree Nuts (Coconut)'],
    facilityWarnings: ['Pasteurized on aseptic fruit packaging lines.'],
    ingredientsVerbatim: 'Coconut Water, Less than 1% Fruit Sugar, Vitamin C (Ascorbic Acid).',
    mandatoryWarning: 'Contains Coconut (classified by FDA as a Tree Nut allergen).',
    isVerified: true,
    verdictSummary: 'Naturally rich in essential potassium electrolytes (470mg/serving). Vitamin C added to prevent enzymatic oxidation.',
    dietaryRecommendation: 'Natural Hydration • Post-Workout Rehydration',
    ingredientsAnalysis: [
      { name: 'Pure Coconut Water', description: 'Liquid endosperm from young green coconuts, naturally electrolyte-dense.', status: 'Safe', category: 'Botanical Fluid' },
      { name: 'Ascorbic Acid (Vitamin C)', description: 'Essential antioxidant vitamin protecting flavor and freshness.', status: 'Safe', category: 'Antioxidant' }
    ],
    additivesDecoded: [
      { eCode: 'E300', name: 'Ascorbic Acid', translation: 'Vitamin C', scientificRole: 'Scavenges free oxygen radicals to stop pink enzymatic browning', toxicityRisk: 'None (Essential Nutrient)', badge: 'Antioxidant' }
    ],
    sugarsBreakdown: {
      totalGrams: 9,
      percentDV: 18,
      glycemicIndex: 54,
      glycemicLabel: 'Low-Moderate GI',
      items: [{ name: 'Intrinsic Coconut Sugar', amount: '9g', sharePercent: 100, description: 'Naturally occurring glucose and fructose' }]
    },
    nutrients: {
      calories: 45,
      servingSize: '240ml',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '40mg',
      sodiumDV: '2%',
      carbs: '11g',
      carbsDV: '4%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '9g',
      addedSugars: '0g',
      protein: '0g',
      proteinDV: '0%',
      potassium: '470mg'
    },
    certifications: [
      { title: 'Non-GMO Project', details: 'Identity verified non-genetically engineered', verified: true, icon: 'verified' },
      { title: 'Gluten-Free', details: 'Tested and certified free of wheat protein', verified: true, icon: 'eco' }
    ]
  },
  // 8
  {
    id: 'prod-honest-tea-green',
    barcode: '852769001005',
    name: 'Honest Tea Organic Honey Green Tea',
    brand: 'Honest Tea / Coca-Cola',
    category: 'Drinks & Beverages',
    netWeight: '473ml',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'B',
    novaGroup: 3,
    transparencyScore: 88,
    allergensDetected: [],
    facilityWarnings: ['Aseptic brewing facility.'],
    ingredientsVerbatim: 'Brewed Tea (Filtered Water, Fair Trade Certified Organic Green Tea Leaves), Organic Cane Sugar, Organic Honey, Natural Flavor, Ascorbic Acid (Vitamin C), Citric Acid.',
    mandatoryWarning: 'Contains honey (not recommended for infants under 1 year).',
    isVerified: true,
    verdictSummary: 'Lightly sweetened with organic wildflower honey and real brewed fair trade leaves. Contains 19g sugar per bottle.',
    dietaryRecommendation: 'Organic Beverage • Clean Refreshment',
    ingredientsAnalysis: [
      { name: 'Fair Trade Organic Green Tea', description: 'Freshly brewed tea leaf infusion containing catechins and natural caffeine.', status: 'Safe', category: 'Brewed Herb' },
      { name: 'Organic Honey & Cane Sugar', description: 'Lightly sweetened whole food matrix with gentle floral honey notes.', status: 'Safe', category: 'Natural Sweetener' }
    ],
    additivesDecoded: [
      { eCode: 'E300', name: 'Ascorbic Acid', translation: 'Vitamin C', scientificRole: 'Preserves delicate tea leaf flavor profile', toxicityRisk: 'None', badge: 'Vitamin' },
      { eCode: 'E330', name: 'Citric Acid', translation: 'Citrus acid', scientificRole: 'Brightens tea notes and maintains stability', toxicityRisk: 'None', badge: 'Acidulant' }
    ],
    sugarsBreakdown: {
      totalGrams: 19,
      percentDV: 38,
      glycemicIndex: 56,
      glycemicLabel: 'Moderate GI',
      items: [
        { name: 'Organic Cane Sugar', amount: '13g', sharePercent: 68, description: 'Added sucrose' },
        { name: 'Wildflower Honey', amount: '6g', sharePercent: 32, description: 'Raw inverted honey' }
      ]
    },
    nutrients: {
      calories: 70,
      servingSize: '1 bottle (473ml)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '15mg',
      sodiumDV: '1%',
      carbs: '19g',
      carbsDV: '7%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '19g',
      addedSugars: '18g',
      protein: '0g',
      proteinDV: '0%'
    },
    certifications: [
      { title: 'USDA Organic', details: 'Certified by Pennsylvania Certified Organic', verified: true, icon: 'eco' },
      { title: 'Fair Trade Certified', details: 'Guaranteed living wages for tea pickers', verified: true, icon: 'verified' }
    ]
  },
  // 9
  {
    id: 'prod-red-bull',
    barcode: '611269085208',
    name: 'Red Bull Energy Drink',
    brand: 'Red Bull GmbH',
    category: 'Drinks & Beverages',
    netWeight: '250ml',
    image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'E',
    novaGroup: 4,
    transparencyScore: 48,
    allergensDetected: [],
    facilityWarnings: ['High-speed automated beverage canning.'],
    ingredientsVerbatim: 'Carbonated Water, Sucrose, Glucose, Citric Acid, Taurine, Sodium Bicarbonate, Magnesium Carbonate, Caffeine, Niacinamide (Vitamin B3), Calcium Pantothenate (Vitamin B5), Pyridoxine HCl (Vitamin B6), Vitamin B12, Natural and Artificial Flavors, Colors.',
    mandatoryWarning: 'High caffeine content (80mg/250ml). Not recommended for children, pregnant or nursing women.',
    isVerified: true,
    verdictSummary: 'High simple sucrose/glucose density (27g sugars per 250ml) combined with synthetic caffeine, taurine, and B-complex vitamins.',
    dietaryRecommendation: 'Strict Energy Limit • Not for Children or Heart Conditions',
    ingredientsAnalysis: [
      { name: 'Sucrose & Glucose', description: 'Dual mono/disaccharide charge causing rapid hyper-glycemic spikes.', status: 'Moderate', category: 'Simple Sugar' },
      { name: 'Taurine (1000mg)', description: 'Synthesized amino sulfonic acid involved in bile salt synthesis and cardiovascular regulation.', status: 'Safe', category: 'Amino Acid' },
      { name: 'Synthetic Caffeine (80mg)', description: 'Adenosine receptor antagonist stimulant.', status: 'Moderate', category: 'Stimulant' }
    ],
    additivesDecoded: [
      { eCode: 'E330', name: 'Citric Acid', translation: 'Acidulant', scientificRole: 'Delivers sharp punchy tartness', toxicityRisk: 'Low', badge: 'Acidulant' },
      { eCode: 'E500ii', name: 'Sodium Bicarbonate', translation: 'pH buffer', scientificRole: 'Stabilizes drink effervescence', toxicityRisk: 'Low', badge: 'Buffer' }
    ],
    sugarsBreakdown: {
      totalGrams: 27,
      percentDV: 54,
      glycemicIndex: 78,
      glycemicLabel: 'High GI',
      items: [
        { name: 'Refined Sucrose', amount: '17g', sharePercent: 63, description: 'Table sugar' },
        { name: 'Refined Glucose', amount: '10g', sharePercent: 37, description: 'Fast-uptake dextrose' }
      ]
    },
    nutrients: {
      calories: 110,
      servingSize: '1 can (250ml)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '105mg',
      sodiumDV: '5%',
      carbs: '28g',
      carbsDV: '10%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '27g',
      addedSugars: '27g',
      protein: '0g',
      proteinDV: '0%'
    },
    certifications: []
  },
  // 10
  {
    id: 'prod-lays-classic',
    barcode: '028400043816',
    name: "Lay's Classic Potato Chips",
    brand: 'Frito-Lay / PepsiCo',
    category: 'Snacks & Bars',
    netWeight: '226g',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'C',
    novaGroup: 3,
    transparencyScore: 82,
    allergensDetected: [],
    facilityWarnings: ['Gluten-free certified production.'],
    ingredientsVerbatim: 'Potatoes, Vegetable Oil (Canola, Corn, Soybean, and/or Sunflower Oil), Salt.',
    mandatoryWarning: 'Cooked in vegetable oil. Contains refined sodium.',
    isVerified: true,
    verdictSummary: 'Surprisingly simple 3-ingredient formulation. Primary nutritional concern is energy density, high fat fraction, and sodium.',
    dietaryRecommendation: 'Gluten Free • Vegan • Portion Control',
    ingredientsAnalysis: [
      { name: 'Fresh Farm Potatoes', description: 'Whole sliced Russet and chipping potatoes.', status: 'Safe', category: 'Vegetable' },
      { name: 'Refined Vegetable Oil Blend', description: 'Extracted high-temperature cooking oils with high linoleic/oleic fat profile.', status: 'Moderate', category: 'Frying Oil' },
      { name: 'Pure Sea Salt', description: '170mg sodium per 28g serving.', status: 'Safe', category: 'Mineral Seasoning' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 70,
      glycemicLabel: 'Moderate-High GI',
      items: [{ name: 'Residual Potato Sugars', amount: '0g', sharePercent: 0, description: 'Trace natural starches' }]
    },
    nutrients: {
      calories: 160,
      servingSize: '15 chips (28g)',
      totalFat: '10g',
      totalFatDV: '13%',
      satFat: '1.5g',
      satFatDV: '8%',
      sodium: '170mg',
      sodiumDV: '7%',
      carbs: '15g',
      carbsDV: '5%',
      fiber: '1g',
      fiberDV: '4%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '2g',
      proteinDV: '4%'
    },
    certifications: [
      { title: 'Gluten-Free Certified', details: 'Tested to contain under 10 ppm gluten', verified: true, icon: 'verified' }
    ]
  },
  // 11
  {
    id: 'prod-kind-dark-chocolate-nuts',
    barcode: '602652171420',
    name: 'KIND Dark Chocolate Nuts & Sea Salt Bar',
    brand: 'KIND Snacks',
    category: 'Snacks & Bars',
    netWeight: '40g',
    image: 'https://images.unsplash.com/photo-1622484216850-252a1d293815?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 3,
    transparencyScore: 91,
    allergensDetected: ['Tree Nuts (Almonds, Walnuts)', 'Peanuts', 'Soy', 'Milk'],
    facilityWarnings: ['Made in a facility that processes other tree nuts, peanuts, and sesame seeds.'],
    ingredientsVerbatim: 'Almonds, Dark Chocolate Coating (Sugar, Chocolate Liquor, Cocoa Butter, Soy Lecithin, Vanilla Extract), Peanuts, Chicory Root Fiber, Honey, Glucose Syrup, Rice Flour, Unsweetened Chocolate, Sea Salt, Soy Lecithin.',
    mandatoryWarning: 'CONTAINS: Almonds (Tree Nut), Peanuts, Soy, Milk traces. High botanical nut allergy trigger.',
    isVerified: true,
    verdictSummary: 'High fiber, low sugar (5g total), nutrient-dense real nuts are the first ingredient. Low glycemic load.',
    dietaryRecommendation: 'Low Glycemic • Heart Healthy Snack',
    ingredientsAnalysis: [
      { name: 'Whole Roasted Almonds & Peanuts', description: 'Heart-healthy monounsaturated fats and plant protein. Severe IgE allergen protocol.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Chicory Root Inulin Fiber', description: 'Prebiotic soluble inulin fiber supporting gastrointestinal microbiome.', status: 'Safe', category: 'Prebiotic Fiber' },
      { name: 'Dark Chocolate Coating', description: 'Cocoa polyphenol-rich chocolate coating with trace milk and soy lecithin.', status: 'Moderate', category: 'Confectionery' }
    ],
    additivesDecoded: [
      { eCode: 'E322', name: 'Soy Lecithin', translation: 'Soy emulsifier', scientificRole: 'Prevents cocoa fat bloom and stabilizes chocolate coating', toxicityRisk: 'Low', badge: 'Emulsifier' }
    ],
    sugarsBreakdown: {
      totalGrams: 5,
      percentDV: 10,
      glycemicIndex: 35,
      glycemicLabel: 'Low GI',
      items: [
        { name: 'Dark Chocolate Sugar', amount: '3.5g', sharePercent: 70, description: 'Cocoa blend sweetening' },
        { name: 'Wild Honey & Glucose', amount: '1.5g', sharePercent: 30, description: 'Binding glaze' }
      ]
    },
    nutrients: {
      calories: 200,
      servingSize: '1 bar (40g)',
      totalFat: '15g',
      totalFatDV: '19%',
      satFat: '3g',
      satFatDV: '15%',
      sodium: '140mg',
      sodiumDV: '6%',
      carbs: '16g',
      carbsDV: '6%',
      fiber: '7g',
      fiberDV: '25%',
      sugars: '5g',
      addedSugars: '4g',
      protein: '6g',
      proteinDV: '12%'
    },
    certifications: [
      { title: 'Non-GMO Project', details: 'Third-party supply chain verified', verified: true, icon: 'eco' },
      { title: 'Gluten-Free', details: 'Batch tested under 20 ppm gluten', verified: true, icon: 'verified' }
    ]
  },
  // 12
  {
    id: 'prod-rxbar-blueberry',
    barcode: '854767005018',
    name: 'RXBAR Blueberry Whole Food Protein Bar',
    brand: 'Kellogg Company / RXBAR',
    category: 'Snacks & Bars',
    netWeight: '52g',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 2,
    transparencyScore: 98,
    allergensDetected: ['Eggs', 'Tree Nuts (Almonds, Cashews)'],
    facilityWarnings: ['Manufactured in a plant that handles milk, peanuts, and other tree nuts.'],
    ingredientsVerbatim: 'Dates, Egg Whites, Almonds, Cashews, Blueberries, Natural Flavors.',
    mandatoryWarning: 'CONTAINS: Egg Whites, Almonds, Cashews. Manufactured on equipment that processes peanuts.',
    isVerified: true,
    verdictSummary: 'Zero added sugars, zero synthetic binders or preservatives. Protein sourced strictly from pasteurized egg whites.',
    dietaryRecommendation: 'Clean Label • Paleo Friendly • High Protein',
    ingredientsAnalysis: [
      { name: 'Medjool Dates', description: 'Whole dried dates providing complex binding fiber, potassium, and natural sweetness.', status: 'Safe', category: 'Whole Fruit' },
      { name: 'Dried Egg Whites', description: 'High biological value complete animal protein. Active egg allergen.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Almonds & Cashews', description: 'Botanical tree nuts delivering healthy lipids and crunch. Severe allergen alert.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 15,
      percentDV: 30,
      glycemicIndex: 48,
      glycemicLabel: 'Low-Moderate GI',
      items: [{ name: 'Whole Date Fructose & Glucose', amount: '15g', sharePercent: 100, description: '100% cellular fruit sugars bound to 4g fiber' }]
    },
    nutrients: {
      calories: 210,
      servingSize: '1 bar (52g)',
      totalFat: '7g',
      totalFatDV: '9%',
      satFat: '1g',
      satFatDV: '5%',
      sodium: '140mg',
      sodiumDV: '6%',
      carbs: '24g',
      carbsDV: '9%',
      fiber: '4g',
      fiberDV: '14%',
      sugars: '15g',
      addedSugars: '0g',
      protein: '12g',
      proteinDV: '24%'
    },
    certifications: [
      { title: 'Gluten-Free Certified', details: 'Guaranteed no cross-contact with gluten grains', verified: true, icon: 'verified' },
      { title: 'Kosher', details: 'OU-D Kosher certified', verified: true, icon: 'eco' }
    ]
  },
  // 13
  {
    id: 'prod-skinnypop-white-cheddar',
    barcode: '850251004068',
    name: 'SkinnyPop White Cheddar Popcorn',
    brand: 'Amplify Snack Brands',
    category: 'Snacks & Bars',
    netWeight: '125g',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'B',
    novaGroup: 3,
    transparencyScore: 89,
    allergensDetected: ['Dairy (Non-Dairy Natural Flavor)'],
    facilityWarnings: ['100% Free of peanuts, tree nuts, and soy on dedicated popcorn lines.'],
    ingredientsVerbatim: 'Popcorn, Sunflower Oil, Natural Non-Dairy White Cheddar Flavor, Salt, Rice Flour, Onion Powder, Garlic Powder.',
    mandatoryWarning: 'Dairy-free vegan white cheddar seasoning. Free of peanuts, tree nuts, and gluten.',
    isVerified: true,
    verdictSummary: 'Whole grain air-popped corn with sunflower oil and vegan dairy-free cheddar seasoning. Zero trans fat or artificial ingredients.',
    dietaryRecommendation: 'Vegan Snack • Nut Free Facility • Non-GMO',
    ingredientsAnalysis: [
      { name: 'Whole Grain Popcorn', description: 'Air-popped butterfly corn delivering insoluble fiber and polyphenols.', status: 'Safe', category: 'Whole Grain' },
      { name: 'Non-GMO Sunflower Oil', description: 'High-oleic expeller pressed plant oil.', status: 'Safe', category: 'Healthy Lipid' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 1,
      percentDV: 2,
      glycemicIndex: 55,
      glycemicLabel: 'Moderate GI',
      items: [{ name: 'Corn Starches', amount: '1g', sharePercent: 100, description: 'Trace naturally bound corn sugars' }]
    },
    nutrients: {
      calories: 150,
      servingSize: '3 cups (28g)',
      totalFat: '9g',
      totalFatDV: '12%',
      satFat: '1g',
      satFatDV: '5%',
      sodium: '120mg',
      sodiumDV: '5%',
      carbs: '15g',
      carbsDV: '5%',
      fiber: '3g',
      fiberDV: '11%',
      sugars: '1g',
      addedSugars: '0g',
      protein: '2g',
      proteinDV: '4%'
    },
    certifications: [
      { title: 'Non-GMO Project', details: 'Verified identity preserved corn kernels', verified: true, icon: 'eco' },
      { title: 'Certified Gluten Free', details: 'Safe for celiac consumers', verified: true, icon: 'verified' }
    ]
  },
  // 14
  {
    id: 'prod-doritos-nacho',
    barcode: '028400041737',
    name: 'Doritos Nacho Cheese Flavored Tortilla Chips',
    brand: 'Frito-Lay / PepsiCo',
    category: 'Snacks & Bars',
    netWeight: '262g',
    image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'D',
    novaGroup: 4,
    transparencyScore: 45,
    allergensDetected: ['Milk (Whey, Cheddar Cheese, Buttermilk)', 'Wheat (Gluten Cross-Contact)'],
    facilityWarnings: ['Processed on lines that also handle wheat components.'],
    ingredientsVerbatim: 'Corn, Vegetable Oil (Corn, Canola, and/or Sunflower Oil), Maltodextrin, Salt, Cheddar Cheese (Milk, Cheese Cultures, Salt, Enzymes), Whey, Monosodium Glutamate (E621), Buttermilk, Romano Cheese, Whey Protein Concentrate, Onion Powder, Corn Flour, Natural and Artificial Flavor, Dextrose, Tomato Powder, Lactose, Spices, Artificial Color (Yellow 6, Yellow 5, Red 40), Lactic Acid, Citric Acid, Sugar, Garlic Powder, Skim Milk, Red and Green Bell Pepper Powder, Disodium Inosinate, Disodium Guanylate.',
    mandatoryWarning: 'CONTAINS: Milk ingredients (Lactose, Whey, Casein). Highly engineered savory snack.',
    isVerified: true,
    verdictSummary: 'Ultra-processed formulation containing Monosodium Glutamate (E621), multiple synthetic azo-dyes (Red 40, Yellow 5, Yellow 6), and ribonucleotide enhancers.',
    dietaryRecommendation: 'High Allergen Risk (Dairy) • Avoid on Clean Diet',
    ingredientsAnalysis: [
      { name: 'Monosodium Glutamate (E621)', description: 'Flavor-enhancing sodium salt of glutamic acid. Potent umami trigger.', status: 'Moderate', category: 'Additive' },
      { name: 'Whey & Cheddar Cheese Fractions', description: 'Milk derivatives containing lactose and bovine casein proteins.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Synthetic Food Dyes (Yellow 5, Yellow 6, Red 40)', description: 'Petroleum-derived artificial azo-dyes flagged for pediatric attention warnings.', status: 'Moderate', category: 'Synthetic Color' }
    ],
    additivesDecoded: [
      { eCode: 'E621', name: 'Monosodium Glutamate (MSG)', translation: 'Umami flavor enhancer', scientificRole: 'Stimulates T1R1/T1R3 glutamate tongue receptors', toxicityRisk: 'Moderate (Headache/Flushing)', badge: 'Flavor Enhancer' },
      { eCode: 'E110', name: 'Sunset Yellow FCF (Yellow 6)', translation: 'Synthetic coal-tar dye', scientificRole: 'Imparts intense orange cheese hue', toxicityRisk: 'Moderate', badge: 'Azo Dye' },
      { eCode: 'E631', name: 'Disodium Inosinate', translation: 'Nucleotide enhancer', scientificRole: 'Synergistically multiplies MSG umami intensity by 8x', toxicityRisk: 'Low', badge: 'Enhancer' }
    ],
    sugarsBreakdown: {
      totalGrams: 1,
      percentDV: 2,
      glycemicIndex: 72,
      glycemicLabel: 'High GI',
      items: [{ name: 'Lactose & Dextrose', amount: '1g', sharePercent: 100, description: 'Milk sugar and refined dextrose powder' }]
    },
    nutrients: {
      calories: 150,
      servingSize: '12 chips (28g)',
      totalFat: '8g',
      totalFatDV: '10%',
      satFat: '1g',
      satFatDV: '5%',
      sodium: '210mg',
      sodiumDV: '9%',
      carbs: '18g',
      carbsDV: '7%',
      fiber: '1g',
      fiberDV: '4%',
      sugars: '1g',
      addedSugars: '0g',
      protein: '2g',
      proteinDV: '4%'
    },
    certifications: []
  },
  // 15
  {
    id: 'prod-simple-mills-crackers',
    barcode: '856069005131',
    name: 'Fine Ground Sea Salt Almond Flour Crackers',
    brand: 'Simple Mills',
    category: 'Snacks & Bars',
    netWeight: '120g',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 2,
    transparencyScore: 96,
    allergensDetected: ['Tree Nuts (Almonds)'],
    facilityWarnings: ['Dedicated gluten-free and peanut-free baking facility.'],
    ingredientsVerbatim: 'Nut & Seed Flour Blend (Almonds, Sunflower Seeds, Flax Seeds), Tapioca Starch, Cassava Flour, Organic Sunflower Oil, Sea Salt, Organic Rosemary Extract (For Freshness).',
    mandatoryWarning: 'CONTAINS: Almonds (Tree Nut). Certified Gluten-Free, Grain-Free, Corn-Free.',
    isVerified: true,
    verdictSummary: 'Exemplary clean-label formulation with nutrient-dense botanical flours. Low glycemic grain-free alternative.',
    dietaryRecommendation: 'Celiac Safe • Paleo • Grain-Free • Keto Friendly',
    ingredientsAnalysis: [
      { name: 'Almond, Sunflower & Flax Flour', description: 'Whole ground botanical seeds providing omega-3 ALA, vitamin E, and protein.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Cassava & Tapioca Starch', description: 'Easily digestible grain-free prebiotic root starches.', status: 'Safe', category: 'Root Starch' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 25,
      glycemicLabel: 'Ultra-Low GI',
      items: [{ name: 'Natural Seed Bound Starches', amount: '0g', sharePercent: 0, description: 'Zero added sugars' }]
    },
    nutrients: {
      calories: 150,
      servingSize: '17 crackers (30g)',
      totalFat: '8g',
      totalFatDV: '10%',
      satFat: '0.5g',
      satFatDV: '3%',
      sodium: '230mg',
      sodiumDV: '10%',
      carbs: '17g',
      carbsDV: '6%',
      fiber: '2g',
      fiberDV: '7%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '3g',
      proteinDV: '6%'
    },
    certifications: [
      { title: 'Non-GMO Project', details: 'Zero GMO bioengineered crops', verified: true, icon: 'eco' },
      { title: 'Certified Gluten Free', details: 'Gluten-Free Certification Organization (GFCO)', verified: true, icon: 'verified' }
    ]
  },
  // 16
  {
    id: 'prod-snyders-pretzels',
    barcode: '077975022067',
    name: "Snyder's of Hanover Mini Pretzels",
    brand: "Snyder's-Lance / Campbell Soup",
    category: 'Snacks & Bars',
    netWeight: '453g',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'C',
    novaGroup: 3,
    transparencyScore: 74,
    allergensDetected: ['Wheat (Gluten)'],
    facilityWarnings: ['Made in a facility that does not process peanuts.'],
    ingredientsVerbatim: 'Enriched Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Water, Salt, Malt (Tapioca Syrup, Malt Extract), Canola Oil, Yeast, Soda.',
    mandatoryWarning: 'CONTAINS: Wheat (Gluten).',
    isVerified: true,
    verdictSummary: 'Classic alkaline-dipped baked pretzel with fortified wheat flour. Fat-free snack with moderate sodium profile.',
    dietaryRecommendation: 'Low Fat • Peanut-Safe School Snack',
    ingredientsAnalysis: [
      { name: 'Enriched Wheat Flour', description: 'Milled wheat endosperm with synthetic B-vitamin fortification. Strict Celiac conflict.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Barley Malt Extract', description: 'Sprouted barley grain syrup providing traditional malty pretzel color.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [
      { eCode: 'E524', name: 'Sodium Hydroxide', translation: 'Food Grade Lye Bath', scientificRole: 'Alkaline dipping bath that gelatinizes outer starches for mahogany glaze', toxicityRisk: 'Neutralized in Oven', badge: 'Processing Aid' }
    ],
    sugarsBreakdown: {
      totalGrams: 1,
      percentDV: 2,
      glycemicIndex: 80,
      glycemicLabel: 'High GI',
      items: [{ name: 'Malt Extract Sugars', amount: '1g', sharePercent: 100, description: 'Maltose syrup from grain conversion' }]
    },
    nutrients: {
      calories: 110,
      servingSize: '20 mini pretzels (30g)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '250mg',
      sodiumDV: '11%',
      carbs: '24g',
      carbsDV: '9%',
      fiber: '1g',
      fiberDV: '4%',
      sugars: '1g',
      addedSugars: '0g',
      protein: '3g',
      proteinDV: '6%'
    },
    certifications: [
      { title: 'Non-GMO Verified', details: 'Preserved whole grain supply', verified: true, icon: 'eco' },
      { title: 'Peanut-Free Certified', details: 'Dedicated peanut-free production lines', verified: true, icon: 'verified' }
    ]
  },
  // 17
  {
    id: 'prod-chobani-plain-greek',
    barcode: '894700010045',
    name: 'Chobani Non-Fat Plain Greek Yogurt',
    brand: 'Chobani LLC',
    category: 'Dairy & Alternatives',
    netWeight: '907g',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 1,
    transparencyScore: 97,
    allergensDetected: ['Dairy / Milk (Casein & Lactose)'],
    facilityWarnings: ['Dedicated dairy processing lines.'],
    ingredientsVerbatim: 'Cultured Pasteurized Nonfat Milk. Live and Active Cultures: S. Thermophilus, L. Bulgaricus, L. Acidophilus, Bifidus, L. Casei, and L. Rhamnosus.',
    mandatoryWarning: 'CONTAINS: Cow Milk. Naturally low in lactose due to authentic straining.',
    isVerified: true,
    verdictSummary: 'Triple-strained cultured milk rich in bioavailable casein and whey protein (16g per serving). 6 live probiotic strains with zero added sugar.',
    dietaryRecommendation: 'High Protein • Probiotic Gut Health • Low Calorie',
    ingredientsAnalysis: [
      { name: 'Cultured Pasteurized Nonfat Milk', description: 'Fresh farm milk fermented with probiotic cultures.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: '6 Live Active Probiotics', description: 'Beneficial lactic acid bacteria that metabolize residual lactose.', status: 'Safe', category: 'Probiotic' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 4,
      percentDV: 8,
      glycemicIndex: 20,
      glycemicLabel: 'Ultra-Low GI',
      items: [{ name: 'Residual Milk Lactose', amount: '4g', sharePercent: 100, description: 'Natural dairy carbohydrate' }]
    },
    nutrients: {
      calories: 90,
      servingSize: '3/4 cup (170g)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '65mg',
      sodiumDV: '3%',
      carbs: '6g',
      carbsDV: '2%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '4g',
      addedSugars: '0g',
      protein: '16g',
      proteinDV: '32%'
    },
    certifications: [
      { title: 'Non-GMO Project', details: 'Sourced from cows fed non-GMO forage', verified: true, icon: 'eco' },
      { title: 'Gluten-Free Certified', details: 'Naturally gluten free', verified: true, icon: 'verified' }
    ]
  },
  // 18
  {
    id: 'prod-kerrygold-butter',
    barcode: '767707002149',
    name: 'Kerrygold Pure Irish Salted Butter',
    brand: 'Ornua Co-operative Limited',
    category: 'Dairy & Alternatives',
    netWeight: '227g',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'D',
    novaGroup: 2,
    transparencyScore: 95,
    allergensDetected: ['Dairy / Milk (Bovine Milk Fat)'],
    facilityWarnings: ['Traditional creamery processing.'],
    ingredientsVerbatim: 'Pasteurized Cream, Salt.',
    mandatoryWarning: 'CONTAINS: Milk. Trace lactose (<0.1g/serving).',
    isVerified: true,
    verdictSummary: 'Grass-fed Irish cow cream naturally high in beta-carotene and CLA (conjugated linoleic acid). Pristine 2-ingredient formulation.',
    dietaryRecommendation: 'Keto • Carnivore • Culinary Staple',
    ingredientsAnalysis: [
      { name: 'Grass-Fed Sweet Cream', description: 'Churned butterfat from pasture-raised Irish dairy herds.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Natural Sea Salt', description: 'Cured seasoning preserving fresh cream flavor.', status: 'Safe', category: 'Mineral Seasoning' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 0,
      glycemicLabel: 'Zero Glycemic',
      items: [{ name: 'Lactose Traces', amount: '0g', sharePercent: 0, description: 'Practically zero dairy sugars remaining' }]
    },
    nutrients: {
      calories: 100,
      servingSize: '1 tbsp (14g)',
      totalFat: '11g',
      totalFatDV: '14%',
      satFat: '7g',
      satFatDV: '35%',
      sodium: '100mg',
      sodiumDV: '4%',
      carbs: '0g',
      carbsDV: '0%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '0g',
      proteinDV: '0%'
    },
    certifications: [
      { title: 'Irish Grass-Fed', details: 'Bord Bia Sustainable Dairy Assurance Scheme', verified: true, icon: 'verified' }
    ]
  },
  // 19
  {
    id: 'prod-oatly-original',
    barcode: '853637007604',
    name: 'Oatly The Original Oat Milk',
    brand: 'Oatly AB',
    category: 'Dairy & Alternatives',
    netWeight: '1890ml',
    image: 'https://images.unsplash.com/photo-1568651318090-09349479e0a0?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'B',
    novaGroup: 3,
    transparencyScore: 92,
    allergensDetected: ['Oats (Gluten Free)'],
    facilityWarnings: ['Dedicated non-dairy vegan packaging lines.'],
    ingredientsVerbatim: 'Oat Base (Water, Oats 10%), Rapeseed Oil, Calcium Carbonate, Calcium Phosphates, Sea Salt, Vitamins (D2, Riboflavin, B12), Potassium Iodide.',
    mandatoryWarning: 'Contains Oats. Free of dairy, soy, nuts, and lactose.',
    isVerified: true,
    verdictSummary: 'Swedish patented whole-grain oat liquefaction using natural enzymes. Beta-glucan soluble fiber enriched.',
    dietaryRecommendation: '100% Plant-Based • Lactose Free • Vegan Choice',
    ingredientsAnalysis: [
      { name: 'Enzymatically Liquefied Oats', description: 'Whole oats broken down into sweet maltose and soluble dietary fiber.', status: 'Safe', category: 'Whole Grain' },
      { name: 'Cold-Pressed Rapeseed Oil', description: 'Source of monounsaturated fatty acids providing body and mouthfeel.', status: 'Safe', category: 'Healthy Lipid' }
    ],
    additivesDecoded: [
      { eCode: 'E341', name: 'Calcium Phosphate', translation: 'Fortification mineral', scientificRole: 'Fortifies plant milk to match standard cow milk calcium density', toxicityRisk: 'None', badge: 'Nutrient' }
    ],
    sugarsBreakdown: {
      totalGrams: 7,
      percentDV: 14,
      glycemicIndex: 50,
      glycemicLabel: 'Moderate GI',
      items: [{ name: 'Enzymatic Maltose', amount: '7g', sharePercent: 100, description: 'Formed from natural oat starch breakdown' }]
    },
    nutrients: {
      calories: 120,
      servingSize: '1 cup (240ml)',
      totalFat: '5g',
      totalFatDV: '6%',
      satFat: '0.5g',
      satFatDV: '3%',
      sodium: '100mg',
      sodiumDV: '4%',
      carbs: '16g',
      carbsDV: '6%',
      fiber: '2g',
      fiberDV: '7%',
      sugars: '7g',
      addedSugars: '0g',
      protein: '3g',
      proteinDV: '6%'
    },
    certifications: [
      { title: 'Certified Vegan', details: 'The Vegan Society verified', verified: true, icon: 'spa' }
    ]
  },
  // 20
  {
    id: 'prod-organic-valley-milk',
    barcode: '093966000146',
    name: 'Organic Valley Whole Milk',
    brand: 'Organic Valley Cooperative',
    category: 'Dairy & Alternatives',
    netWeight: '1890ml',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'B',
    novaGroup: 1,
    transparencyScore: 98,
    allergensDetected: ['Dairy / Milk (Casein, Whey, Lactose)'],
    facilityWarnings: ['Organic cooperative dairy bottling.'],
    ingredientsVerbatim: 'Organic Grade A Milk, Vitamin D3.',
    mandatoryWarning: 'CONTAINS: Milk. Full fat whole bovine milk.',
    isVerified: true,
    verdictSummary: 'Pasture-raised organic whole milk sourced without synthetic hormones, toxic pesticides, or antibiotics.',
    dietaryRecommendation: 'Whole Nutrient Source • Calcium Rich',
    ingredientsAnalysis: [
      { name: 'Organic Grade A Whole Milk', description: 'Unadulterated whole milk containing 8g complete protein per cup.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 12,
      percentDV: 24,
      glycemicIndex: 27,
      glycemicLabel: 'Low GI',
      items: [{ name: 'Natural Milk Lactose', amount: '12g', sharePercent: 100, description: 'Inherent milk disaccharide' }]
    },
    nutrients: {
      calories: 150,
      servingSize: '1 cup (240ml)',
      totalFat: '8g',
      totalFatDV: '10%',
      satFat: '5g',
      satFatDV: '25%',
      sodium: '125mg',
      sodiumDV: '5%',
      carbs: '12g',
      carbsDV: '4%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '12g',
      addedSugars: '0g',
      protein: '8g',
      proteinDV: '16%'
    },
    certifications: [
      { title: 'USDA Organic', details: '100% pasture-raised certified organic', verified: true, icon: 'eco' }
    ]
  },
  // 21
  {
    id: 'prod-violife-cheddar',
    barcode: '810006700018',
    name: 'Violife Just Like Cheddar Slices',
    brand: 'Upfield / Violife',
    category: 'Dairy & Alternatives',
    netWeight: '200g',
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'D',
    novaGroup: 4,
    transparencyScore: 78,
    allergensDetected: [],
    facilityWarnings: ['100% Free of dairy, lactose, soy, gluten, nuts, and preservatives.'],
    ingredientsVerbatim: 'Filtered Water, Coconut Oil (23%), Modified Potato and Corn Starch, Sea Salt, Cheddar Flavor (Vegan Sources), Olive Extract, Paprika and Beta-Carotene (Color), Vitamin B12.',
    mandatoryWarning: '100% Vegan non-dairy cheese alternative. Zero major common allergens.',
    isVerified: true,
    verdictSummary: 'Formulated with sustainable coconut oil and modified potato starches. Enriched with vital vegan Vitamin B12.',
    dietaryRecommendation: 'Allergy-Free Cheese Alternative • Strict Vegan',
    ingredientsAnalysis: [
      { name: 'Cold-Pressed Coconut Oil', description: 'Solid lipid base mimicking dairy cheese melting behavior.', status: 'Safe', category: 'Plant Lipid' },
      { name: 'Modified Plant Starch', description: 'Functional starch providing elasticity and sliceable structure.', status: 'Safe', category: 'Functional Starch' }
    ],
    additivesDecoded: [
      { eCode: 'E160a', name: 'Beta-Carotene', translation: 'Pro-vitamin A plant pigment', scientificRole: 'Gives authentic golden cheddar cheese shade', toxicityRisk: 'None', badge: 'Natural Color' }
    ],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 30,
      glycemicLabel: 'Low GI',
      items: [{ name: 'Starch Carbohydrate', amount: '0g', sharePercent: 0, description: 'Zero sugars' }]
    },
    nutrients: {
      calories: 60,
      servingSize: '1 slice (20g)',
      totalFat: '5g',
      totalFatDV: '6%',
      satFat: '4.5g',
      satFatDV: '23%',
      sodium: '170mg',
      sodiumDV: '7%',
      carbs: '4g',
      carbsDV: '1%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '0g',
      proteinDV: '0%'
    },
    certifications: [
      { title: 'The Vegan Society', details: 'Certified 100% vegan without animal testing', verified: true, icon: 'spa' }
    ]
  },
  // 22
  {
    id: 'prod-fage-greek-yogurt',
    barcode: '689544082006',
    name: 'Fage Total 2% Low Fat Greek Yogurt',
    brand: 'FAGE International S.A.',
    category: 'Dairy & Alternatives',
    netWeight: '500g',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 1,
    transparencyScore: 98,
    allergensDetected: ['Dairy / Milk (Casein & Lactose)'],
    facilityWarnings: ['Dedicated Greek yogurt manufacturing.'],
    ingredientsVerbatim: 'Grade A Pasteurized Skimmed Milk and Cream, Live Active Yogurt Cultures (L. Bulgaricus, S. Thermophilus, L. Acidophilus, Bifidus, L. Casei).',
    mandatoryWarning: 'CONTAINS: Milk.',
    isVerified: true,
    verdictSummary: 'Authentically strained European yogurt with 15g protein per 170g serving. No added starches or thickeners.',
    dietaryRecommendation: 'Low Carb • Clean Protein • Diabetic Friendly',
    ingredientsAnalysis: [
      { name: 'Pasteurized Milk and Cream', description: 'Fresh farm milk strained 4:1 to concentrate natural protein.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 5,
      percentDV: 10,
      glycemicIndex: 22,
      glycemicLabel: 'Ultra-Low GI',
      items: [{ name: 'Lactose', amount: '5g', sharePercent: 100, description: 'Natural dairy sugars' }]
    },
    nutrients: {
      calories: 140,
      servingSize: '3/4 cup (170g)',
      totalFat: '3.5g',
      totalFatDV: '4%',
      satFat: '2.5g',
      satFatDV: '13%',
      sodium: '60mg',
      sodiumDV: '3%',
      carbs: '6g',
      carbsDV: '2%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '5g',
      addedSugars: '0g',
      protein: '15g',
      proteinDV: '30%'
    },
    certifications: [
      { title: 'Non-GMO Project', details: 'Cows raised without rBGH growth hormone', verified: true, icon: 'eco' }
    ]
  },
  // 23
  {
    id: 'prod-horizon-string-cheese',
    barcode: '742365204481',
    name: 'Horizon Organic Mozzarella String Cheese',
    brand: 'Horizon Organic / Danone',
    category: 'Dairy & Alternatives',
    netWeight: '226g',
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'B',
    novaGroup: 2,
    transparencyScore: 94,
    allergensDetected: ['Dairy / Milk (Casein)'],
    facilityWarnings: ['USDA Certified organic cheese facility.'],
    ingredientsVerbatim: 'Organic Pasteurized Part-Skim Milk, Salt, Vegetarian Enzymes, Microbial Cultures.',
    mandatoryWarning: 'CONTAINS: Milk.',
    isVerified: true,
    verdictSummary: 'Organic mozzarella sticks with 7g protein and 20% DV calcium per serving. Vegetarian rennet used.',
    dietaryRecommendation: 'Kids Snack • Calcium Rich • Low Carb',
    ingredientsAnalysis: [
      { name: 'Organic Part-Skim Milk', description: 'Nutrient-rich organic dairy base.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 0,
      glycemicLabel: 'Zero Glycemic',
      items: [{ name: 'Lactose', amount: '0g', sharePercent: 0, description: 'Zero sugar per serving' }]
    },
    nutrients: {
      calories: 80,
      servingSize: '1 stick (28g)',
      totalFat: '6g',
      totalFatDV: '8%',
      satFat: '3.5g',
      satFatDV: '18%',
      sodium: '180mg',
      sodiumDV: '8%',
      carbs: '1g',
      carbsDV: '0%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '7g',
      proteinDV: '14%'
    },
    certifications: [
      { title: 'USDA Organic', details: 'Certified organic dairy', verified: true, icon: 'eco' }
    ]
  },
  // 24
  {
    id: 'prod-daves-killer-bread',
    barcode: '013764027053',
    name: "Dave's Killer Bread 21 Whole Grains and Seeds",
    brand: 'Flowers Foods',
    category: 'Bakery & Bread',
    netWeight: '680g',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 3,
    transparencyScore: 96,
    allergensDetected: ['Wheat (Gluten)', 'Sesame'],
    facilityWarnings: ['Manufactured in a facility that uses wheat, soy, and tree nuts.'],
    ingredientsVerbatim: 'Organic Whole Wheat Flour, Filtered Water, Organic 21 Whole Grains and Seeds Mix (Organic Whole Flax Seeds, Organic Sunflower Seeds, Organic Ground Whole Flax Seeds, Organic Brown Sesame Seeds, Organic Black Sesame Seeds, Organic Rolled Oats, Organic Steel Cut Oats, Organic Rolled Barley, Organic Rolled Rye, Organic Blue Cornmeal, Organic Millet, Organic Rolled Triticale), Organic Cane Sugar, Organic Wheat Gluten, Organic Oat Fiber, Sea Salt, Cultured Organic Wheat Flour, Yeast, Organic Vinegar.',
    mandatoryWarning: 'CONTAINS: Wheat (Gluten), Sesame Seeds.',
    isVerified: true,
    verdictSummary: 'Outstanding nutrient density: 5g protein and 5g dietary fiber per slice. Milled with 21 organic sprouted grains and whole seeds.',
    dietaryRecommendation: 'High Fiber • Heart Healthy Whole Grain',
    ingredientsAnalysis: [
      { name: 'Organic 21 Whole Grains & Seeds Mix', description: 'Botanical seed blend high in alpha-linolenic omega-3 and lignans.', status: 'Safe', category: 'Whole Seed' },
      { name: 'Organic Whole Wheat & Vital Wheat Gluten', description: 'Grain protein source. Active Celiac conflict.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Organic Sesame Seeds', description: 'FDA FALCPA 9th declared major allergen.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 5,
      percentDV: 10,
      glycemicIndex: 52,
      glycemicLabel: 'Low-Moderate GI',
      items: [{ name: 'Organic Cane Sugar', amount: '5g', sharePercent: 100, description: 'Added organic unrefined cane sugar' }]
    },
    nutrients: {
      calories: 110,
      servingSize: '1 slice (45g)',
      totalFat: '1.5g',
      totalFatDV: '2%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '170mg',
      sodiumDV: '7%',
      carbs: '22g',
      carbsDV: '8%',
      fiber: '5g',
      fiberDV: '18%',
      sugars: '5g',
      addedSugars: '5g',
      protein: '5g',
      proteinDV: '10%'
    },
    certifications: [
      { title: 'USDA Organic', details: 'Quality Assurance International certified', verified: true, icon: 'eco' },
      { title: 'Non-GMO Project', details: 'Third-party supply chain verified', verified: true, icon: 'verified' }
    ]
  },
  // 25
  {
    id: 'prod-wonder-bread-white',
    barcode: '072250011388',
    name: 'Wonder Bread Classic White',
    brand: 'Flowers Foods',
    category: 'Bakery & Bread',
    netWeight: '567g',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'D',
    novaGroup: 4,
    transparencyScore: 48,
    allergensDetected: ['Wheat (Gluten)', 'Soy (Soybean Oil)'],
    facilityWarnings: ['Manufactured on shared bakery equipment.'],
    ingredientsVerbatim: 'Unbleached Enriched Flour (Wheat Flour, Malted Barley Flour, Niacin, Reduced Iron, Thiamin Mononitrate, Riboflavin, Folic Acid), Water, High Fructose Corn Syrup, Yeast, Contains 2% or Less of: Soybean Oil, Salt, Dough Conditioners (Monoglycerides, Sodium Stearoyl Lactylate, Ascorbic Acid), Calcium Propionate (Preservative), Monocalcium Phosphate, Soy Lecithin.',
    mandatoryWarning: 'CONTAINS: Wheat (Gluten), Soy. Processed industrial white bread.',
    isVerified: true,
    verdictSummary: 'Highly refined endosperm flour sweetened with High Fructose Corn Syrup and preserved with Calcium Propionate (E282). Low in whole fiber.',
    dietaryRecommendation: 'Low Satiety • Rapid Glycemic Absorption',
    ingredientsAnalysis: [
      { name: 'Refined Enriched Wheat Flour', description: 'De-germed white flour depleted of whole grain fiber and minerals.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'High Fructose Corn Syrup', description: 'Caloric liquid corn sweetener.', status: 'Moderate', category: 'Added Sugar' },
      { name: 'Calcium Propionate (E282)', description: 'Chemical mold-inhibiting anti-fungal preservative.', status: 'Moderate', category: 'Preservative' }
    ],
    additivesDecoded: [
      { eCode: 'E282', name: 'Calcium Propionate', translation: 'Mold inhibitor preservative', scientificRole: 'Prevents bacillus mesentericus rope formation and fungal molds', toxicityRisk: 'Moderate (Headaches/Hyperactivity in kids)', badge: 'Chemical Preservative' },
      { eCode: 'E481', name: 'Sodium Stearoyl Lactylate (SSL)', translation: 'Dough conditioner', scientificRole: 'Strengthens gluten matrix for pillowy soft crumb elasticity', toxicityRisk: 'Low', badge: 'Conditioner' }
    ],
    sugarsBreakdown: {
      totalGrams: 5,
      percentDV: 10,
      glycemicIndex: 75,
      glycemicLabel: 'High GI',
      items: [{ name: 'High Fructose Corn Syrup', amount: '5g', sharePercent: 100, description: 'Liquid corn sugar' }]
    },
    nutrients: {
      calories: 140,
      servingSize: '2 slices (50g)',
      totalFat: '1.5g',
      totalFatDV: '2%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '230mg',
      sodiumDV: '10%',
      carbs: '29g',
      carbsDV: '11%',
      fiber: '1g',
      fiberDV: '4%',
      sugars: '5g',
      addedSugars: '5g',
      protein: '4g',
      proteinDV: '8%'
    },
    certifications: []
  },
  // 26
  {
    id: 'prod-canyon-bakehouse-white',
    barcode: '853351003018',
    name: 'Canyon Bakehouse Gluten-Free Mountain White Bread',
    brand: 'Flowers Foods / Canyon Bakehouse',
    category: 'Bakery & Bread',
    netWeight: '510g',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'B',
    novaGroup: 3,
    transparencyScore: 92,
    allergensDetected: ['Eggs'],
    facilityWarnings: ['100% Dedicated certified gluten-free, peanut-free, dairy-free, and soy-free facility.'],
    ingredientsVerbatim: 'Water, Brown Rice Flour, Tapioca Flour, Whole Grain Sorghum Flour, Cane Sugar, Extra Virgin Olive Oil, Egg Whites, Cultured Brown Rice Flour, Xanthan Gum, Yeast, Sea Salt, Baking Powder, Enzymes.',
    mandatoryWarning: 'CONTAINS: Egg Whites. 100% Free of Wheat, Dairy, Soy, Peanuts, Tree Nuts.',
    isVerified: true,
    verdictSummary: 'Safe whole-grain gluten-free sandwich bread baked in a dedicated certified allergen facility.',
    dietaryRecommendation: 'Celiac Gold Standard • Nut-Free School Safe',
    ingredientsAnalysis: [
      { name: 'Whole Grain Sorghum & Brown Rice Flour', description: 'Ancient grains providing essential minerals without gliadin proteins.', status: 'Safe', category: 'Gluten-Free Grain' },
      { name: 'Egg Whites', description: 'Protein binder creating bread structure without gluten.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [
      { eCode: 'E415', name: 'Xanthan Gum', translation: 'Fermented plant polysaccharide', scientificRole: 'Replaces missing gluten elasticity to trap carbon dioxide during bake', toxicityRisk: 'Very Low', badge: 'Soluble Fiber' }
    ],
    sugarsBreakdown: {
      totalGrams: 2,
      percentDV: 4,
      glycemicIndex: 58,
      glycemicLabel: 'Moderate GI',
      items: [{ name: 'Cane Sugar', amount: '2g', sharePercent: 100, description: 'Added to proof yeast' }]
    },
    nutrients: {
      calories: 90,
      servingSize: '1 slice (34g)',
      totalFat: '1.5g',
      totalFatDV: '2%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '130mg',
      sodiumDV: '6%',
      carbs: '17g',
      carbsDV: '6%',
      fiber: '2g',
      fiberDV: '7%',
      sugars: '2g',
      addedSugars: '2g',
      protein: '2g',
      proteinDV: '4%'
    },
    certifications: [
      { title: 'Certified Gluten-Free', details: 'GFCO certified under 10 ppm', verified: true, icon: 'verified' }
    ]
  },
  // 27
  {
    id: 'prod-thomas-english-muffins',
    barcode: '048121102088',
    name: "Thomas' Original English Muffins",
    brand: 'Bimbo Bakeries USA',
    category: 'Bakery & Bread',
    netWeight: '340g',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'B',
    novaGroup: 3,
    transparencyScore: 78,
    allergensDetected: ['Wheat (Gluten)', 'Soy'],
    facilityWarnings: ['Produced on equipment that also processes sesame seeds and milk.'],
    ingredientsVerbatim: 'Unbleached Enriched Wheat Flour (Flour, Niacin, Reduced Iron, Thiamin Mononitrate, Riboflavin, Folic Acid), Water, Farina, Yeast, Sugar, Salt, Soybean Oil, Calcium Propionate (Preservative), Nonfat Milk, Whey, Soy Lecithin.',
    mandatoryWarning: 'CONTAINS: Wheat (Gluten), Soy, Milk.',
    isVerified: true,
    verdictSummary: 'Classic griddled muffin with trademark nooks and crannies. Low fat formulation with farina dusting.',
    dietaryRecommendation: 'Breakfast Staple • Contains Wheat & Dairy',
    ingredientsAnalysis: [
      { name: 'Enriched Wheat Flour', description: 'Milled wheat flour. Strict Celiac allergen.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [
      { eCode: 'E282', name: 'Calcium Propionate', translation: 'Mold inhibitor', scientificRole: 'Inhibits fungal spores', toxicityRisk: 'Low', badge: 'Preservative' }
    ],
    sugarsBreakdown: {
      totalGrams: 1,
      percentDV: 2,
      glycemicIndex: 70,
      glycemicLabel: 'Moderate-High GI',
      items: [{ name: 'Cane Sugar', amount: '1g', sharePercent: 100, description: 'Added sugar' }]
    },
    nutrients: {
      calories: 130,
      servingSize: '1 muffin (57g)',
      totalFat: '1g',
      totalFatDV: '1%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '230mg',
      sodiumDV: '10%',
      carbs: '25g',
      carbsDV: '9%',
      fiber: '1g',
      fiberDV: '4%',
      sugars: '1g',
      addedSugars: '1g',
      protein: '4g',
      proteinDV: '8%'
    },
    certifications: [
      { title: 'Kosher', details: 'OU-Dairy Kosher certified', verified: true, icon: 'verified' }
    ]
  },
  // 28
  {
    id: 'prod-mission-corn-tortillas',
    barcode: '073731000115',
    name: 'Mission Super Soft Yellow Corn Tortillas',
    brand: 'Gruma Corporation',
    category: 'Bakery & Bread',
    netWeight: '708g',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 2,
    transparencyScore: 92,
    allergensDetected: ['Corn'],
    facilityWarnings: ['Gluten-free certified manufacturing facility.'],
    ingredientsVerbatim: 'Whole Grain Corn, Water, Contains 2% or Less of: Cellulose Gum, Guar Gum, Enzymes, and Preservatives (Propionic Acid, Benzoic Acid, Phosphoric Acid).',
    mandatoryWarning: 'CONTAINS: Corn. Naturally gluten-free grain alternative.',
    isVerified: true,
    verdictSummary: 'Traditional nixtamalized whole yellow corn masa with zero wheat gluten or trans fats.',
    dietaryRecommendation: 'Celiac Safe • Gluten Free Taco Night • Low Calorie',
    ingredientsAnalysis: [
      { name: 'Ground Nixtamalized Corn', description: 'Lime-treated whole corn releasing bound niacin (Vitamin B3).', status: 'Safe', category: 'Ancient Grain' }
    ],
    additivesDecoded: [
      { eCode: 'E466', name: 'Cellulose Gum', translation: 'Plant fiber binder', scientificRole: 'Maintains soft rollability without tearing', toxicityRisk: 'Very Low', badge: 'Fiber' }
    ],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 52,
      glycemicLabel: 'Low-Moderate GI',
      items: [{ name: 'Corn Sugars', amount: '0g', sharePercent: 0, description: 'Zero sugars' }]
    },
    nutrients: {
      calories: 100,
      servingSize: '2 tortillas (50g)',
      totalFat: '1.5g',
      totalFatDV: '2%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '15mg',
      sodiumDV: '1%',
      carbs: '22g',
      carbsDV: '8%',
      fiber: '3g',
      fiberDV: '11%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '2g',
      proteinDV: '4%'
    },
    certifications: [
      { title: 'Gluten Free Certified', details: 'Celiac Association approved', verified: true, icon: 'verified' }
    ]
  },
  // 29
  {
    id: 'prod-natures-own-whole-wheat',
    barcode: '072250037128',
    name: "Nature's Own 100% Whole Wheat Bread",
    brand: 'Flowers Foods',
    category: 'Bakery & Bread',
    netWeight: '567g',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 3,
    transparencyScore: 90,
    allergensDetected: ['Wheat (Gluten)', 'Soy'],
    facilityWarnings: ['Produced in a bakery that handles milk and sesame.'],
    ingredientsVerbatim: 'Whole Wheat Flour, Water, Brown Sugar, Yeast, Wheat Gluten, Contains 2% or Less of: Soybean Oil, Salt, Cultured Wheat Flour, Monoglycerides, Ascorbic Acid.',
    mandatoryWarning: 'CONTAINS: Wheat (Gluten), Soy. Zero high fructose corn syrup.',
    isVerified: true,
    verdictSummary: 'Breads made with 100% whole grain wheat flour with 4g fiber and zero artificial preservatives or colors.',
    dietaryRecommendation: 'Daily Whole Grain Choice • Heart Healthy',
    ingredientsAnalysis: [
      { name: '100% Whole Wheat Flour', description: 'Complete milled wheat kernel including bran, germ, and endosperm.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 2,
      percentDV: 4,
      glycemicIndex: 54,
      glycemicLabel: 'Moderate GI',
      items: [{ name: 'Brown Sugar', amount: '2g', sharePercent: 100, description: 'Added unrefined sugar' }]
    },
    nutrients: {
      calories: 60,
      servingSize: '1 slice (28g)',
      totalFat: '1g',
      totalFatDV: '1%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '110mg',
      sodiumDV: '5%',
      carbs: '12g',
      carbsDV: '4%',
      fiber: '2g',
      fiberDV: '7%',
      sugars: '2g',
      addedSugars: '1g',
      protein: '4g',
      proteinDV: '8%'
    },
    certifications: [
      { title: 'Heart-Check Certified', details: 'American Heart Association certified', verified: true, icon: 'eco' }
    ]
  },
  // 30
  {
    id: 'prod-barilla-spaghetti',
    barcode: '076808500854',
    name: 'Barilla Spaghetti No. 5',
    brand: 'Barilla G. e R. Fratelli S.p.A.',
    category: 'Pantry & Grains',
    netWeight: '454g',
    image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 1,
    transparencyScore: 98,
    allergensDetected: ['Wheat (Gluten)'],
    facilityWarnings: ['Shared line handles eggs.'],
    ingredientsVerbatim: 'Semolina (Wheat), Durum Wheat Flour. Fortified with: Niacin, Iron (Ferrous Sulfate), Thiamine Mononitrate, Riboflavin, Folic Acid.',
    mandatoryWarning: 'CONTAINS: Wheat (Gluten). May contain traces of eggs.',
    isVerified: true,
    verdictSummary: 'Classic Italian durum wheat semolina pasta extruded with non-GMO amber durum grains. Naturally low glycemic index when cooked al dente.',
    dietaryRecommendation: 'Sustained Energy • Mediterranean Diet Staple',
    ingredientsAnalysis: [
      { name: '100% Durum Wheat Semolina', description: 'Coarse grind of high-protein durum wheat (Triticum durum). High in gluten protein.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 1,
      percentDV: 2,
      glycemicIndex: 45,
      glycemicLabel: 'Low GI (Al Dente)',
      items: [{ name: 'Intrinsic Grain Sugars', amount: '1g', sharePercent: 100, description: 'Bound carbohydrate' }]
    },
    nutrients: {
      calories: 200,
      servingSize: '56g dry (makes 1 cup)',
      totalFat: '1g',
      totalFatDV: '1%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '0mg',
      sodiumDV: '0%',
      carbs: '42g',
      carbsDV: '15%',
      fiber: '3g',
      fiberDV: '11%',
      sugars: '1g',
      addedSugars: '0g',
      protein: '7g',
      proteinDV: '14%'
    },
    certifications: [
      { title: 'Non-GMO Project', details: 'Sourced from identity verified wheat', verified: true, icon: 'eco' },
      { title: 'Kosher', details: 'Union of Orthodox Jewish Congregations', verified: true, icon: 'verified' }
    ]
  },
  // 31
  {
    id: 'prod-lundberg-basmati-rice',
    barcode: '073416000419',
    name: 'Lundberg Organic California White Basmati Rice',
    brand: 'Lundberg Family Farms',
    category: 'Pantry & Grains',
    netWeight: '907g',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 1,
    transparencyScore: 100,
    allergensDetected: [],
    facilityWarnings: ['Dedicated allergen-free rice milling lines.'],
    ingredientsVerbatim: '100% Organic White Basmati Rice.',
    mandatoryWarning: 'Single ingredient raw whole grain. Certified gluten-free.',
    isVerified: true,
    verdictSummary: 'Aromatic long-grain California rice grown with eco-positive farming. Tested rigorously for low heavy metal and arsenic levels.',
    dietaryRecommendation: 'Celiac Safe • Hypoallergenic • Easy Digestion',
    ingredientsAnalysis: [
      { name: 'Organic White Basmati Rice', description: 'Long slender aromatic rice kernel delivering light fluffy grains.', status: 'Safe', category: 'Whole Grain' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 58,
      glycemicLabel: 'Moderate GI',
      items: [{ name: 'Rice Starch', amount: '0g', sharePercent: 0, description: 'Zero sugars' }]
    },
    nutrients: {
      calories: 160,
      servingSize: '1/4 cup dry (45g)',
      totalFat: '0.5g',
      totalFatDV: '1%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '0mg',
      sodiumDV: '0%',
      carbs: '36g',
      carbsDV: '13%',
      fiber: '1g',
      fiberDV: '4%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '3g',
      proteinDV: '6%'
    },
    certifications: [
      { title: 'USDA Organic', details: 'California Certified Organic Farmers (CCOF)', verified: true, icon: 'eco' },
      { title: 'Certified Gluten-Free', details: 'Safe for celiac patients', verified: true, icon: 'verified' }
    ]
  },
  // 32
  {
    id: 'prod-quaker-quick-oats',
    barcode: '030000010403',
    name: 'Quaker Quick 1-Minute Oats',
    brand: 'The Quaker Oats Company / PepsiCo',
    category: 'Pantry & Grains',
    netWeight: '510g',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 1,
    transparencyScore: 98,
    allergensDetected: ['Oats (May contain trace wheat)'],
    facilityWarnings: ['Milled on equipment handling wheat grains.'],
    ingredientsVerbatim: '100% Whole Grain Rolled Oats.',
    mandatoryWarning: 'Contains oats. Trace wheat/gluten possible due to agricultural crop rotation.',
    isVerified: true,
    verdictSummary: 'Single-ingredient whole grain rolled oats rich in beta-glucan soluble fiber known to lower LDL cholesterol.',
    dietaryRecommendation: 'Cardiovascular Health • Diabetic Friendly • High Fiber',
    ingredientsAnalysis: [
      { name: '100% Whole Grain Rolled Oats', description: 'Steam-rolled groats rich in avenanthramides and beta-glucan.', status: 'Safe', category: 'Whole Grain' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 1,
      percentDV: 2,
      glycemicIndex: 55,
      glycemicLabel: 'Moderate GI',
      items: [{ name: 'Inherent Oat Sugars', amount: '1g', sharePercent: 100, description: 'Bound naturally' }]
    },
    nutrients: {
      calories: 150,
      servingSize: '1/2 cup dry (40g)',
      totalFat: '3g',
      totalFatDV: '4%',
      satFat: '0.5g',
      satFatDV: '3%',
      sodium: '0mg',
      sodiumDV: '0%',
      carbs: '27g',
      carbsDV: '10%',
      fiber: '4g',
      fiberDV: '14%',
      sugars: '1g',
      addedSugars: '0g',
      protein: '5g',
      proteinDV: '10%'
    },
    certifications: [
      { title: 'Heart-Check Certified', details: 'AHA certified for cholesterol management', verified: true, icon: 'eco' }
    ]
  },
  // 33
  {
    id: 'prod-heinz-ketchup',
    barcode: '013000006057',
    name: 'Heinz Tomato Ketchup',
    brand: 'Kraft Heinz',
    category: 'Pantry & Grains',
    netWeight: '567g',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'D',
    novaGroup: 4,
    transparencyScore: 68,
    allergensDetected: [],
    facilityWarnings: ['Dedicated condiment bottling lines.'],
    ingredientsVerbatim: 'Tomato Concentrate from Red Ripe Tomatoes, Distilled Vinegar, High Fructose Corn Syrup, Corn Syrup, Salt, Spice, Onion Powder, Natural Flavoring.',
    mandatoryWarning: 'Contains High Fructose Corn Syrup (4g added sugar per tablespoon).',
    isVerified: true,
    verdictSummary: 'Rich in tomato lycopene antioxidant, but heavily loaded with dual liquid corn sweeteners (HFCS and corn syrup).',
    dietaryRecommendation: 'Limit Added Sugars • Gluten Free',
    ingredientsAnalysis: [
      { name: 'Red Ripe Tomato Concentrate', description: 'Sun-ripened tomatoes concentrated for intense savory acidity and lycopene.', status: 'Safe', category: 'Vegetable' },
      { name: 'High Fructose Corn Syrup', description: 'Primary added caloric sweetener.', status: 'Moderate', category: 'Added Sugar' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 4,
      percentDV: 8,
      glycemicIndex: 65,
      glycemicLabel: 'Moderate-High GI',
      items: [{ name: 'High Fructose Corn Syrup', amount: '4g', sharePercent: 100, description: 'Added sweetener per 17g tablespoon' }]
    },
    nutrients: {
      calories: 20,
      servingSize: '1 tbsp (17g)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '160mg',
      sodiumDV: '7%',
      carbs: '5g',
      carbsDV: '2%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '4g',
      addedSugars: '4g',
      protein: '0g',
      proteinDV: '0%'
    },
    certifications: [
      { title: 'Kosher Certified', details: 'OU Pareve certification', verified: true, icon: 'verified' }
    ]
  },
  // 34
  {
    id: 'prod-bragg-apple-cider-vinegar',
    barcode: '074305001161',
    name: 'Bragg Organic Apple Cider Vinegar Raw-Unfiltered',
    brand: 'Bragg Live Food Products',
    category: 'Pantry & Grains',
    netWeight: '473ml',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 1,
    transparencyScore: 100,
    allergensDetected: [],
    facilityWarnings: ['Dedicated organic vinegar bottling plant.'],
    ingredientsVerbatim: 'Certified Organic Raw Apple Cider Vinegar, Purified Water. Diluted to 5% Acidity.',
    mandatoryWarning: 'Contains "The Mother" of vinegar (natural symbiotic culture).',
    isVerified: true,
    verdictSummary: 'Raw, unpasteurized, unheated and unfiltered vinegar containing probiotic strands of proteins, enzymes, and beneficial acetic acid.',
    dietaryRecommendation: 'Gut Health • Fasting Friendly • Zero Calorie',
    ingredientsAnalysis: [
      { name: 'Organic Raw Apple Cider Vinegar', description: 'Naturally fermented whole organic apples with live acetic acid bacteria.', status: 'Safe', category: 'Raw Ferment' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 0,
      glycemicLabel: 'Zero Glycemic',
      items: [{ name: 'Zero Sugar', amount: '0g', sharePercent: 0, description: 'All apple sugars consumed during fermentation' }]
    },
    nutrients: {
      calories: 0,
      servingSize: '1 tbsp (15ml)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '0mg',
      sodiumDV: '0%',
      carbs: '0g',
      carbsDV: '0%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '0g',
      proteinDV: '0%'
    },
    certifications: [
      { title: 'USDA Organic', details: 'Oregon Tilth Certified Organic', verified: true, icon: 'eco' },
      { title: 'Non-GMO Project', details: 'Verified non-GMO apples', verified: true, icon: 'verified' }
    ]
  },
  // 35
  {
    id: 'prod-banza-chickpea-pasta',
    barcode: '857467005006',
    name: 'Banza Chickpea Rotini Pasta',
    brand: 'Banza LLC',
    category: 'Pantry & Grains',
    netWeight: '227g',
    image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 2,
    transparencyScore: 97,
    allergensDetected: ['Chickpeas / Legumes'],
    facilityWarnings: ['100% Dedicated gluten-free, wheat-free, nut-free facility.'],
    ingredientsVerbatim: 'Chickpeas, Tapioca, Pea Starch, Xanthan Gum.',
    mandatoryWarning: 'Contains Legumes (Chickpea). 100% Gluten Free, Vegan, Non-GMO.',
    isVerified: true,
    verdictSummary: 'Powerhouse legume pasta packing 20g plant protein and 8g dietary fiber per 3.5oz serving. Nearly half the net carbs of traditional wheat pasta.',
    dietaryRecommendation: 'Celiac Safe • High Protein • Diabetic Choice',
    ingredientsAnalysis: [
      { name: 'Ground Garbanzo Chickpeas', description: 'Whole legumes rich in folate, iron, magnesium, and resistant starch.', status: 'Safe', category: 'Legume' }
    ],
    additivesDecoded: [
      { eCode: 'E415', name: 'Xanthan Gum', translation: 'Natural food gum', scientificRole: 'Prevents pasta boiling water from turning cloudy and keeps al dente bite', toxicityRisk: 'Very Low', badge: 'Binder' }
    ],
    sugarsBreakdown: {
      totalGrams: 2,
      percentDV: 4,
      glycemicIndex: 32,
      glycemicLabel: 'Low GI',
      items: [{ name: 'Chickpea Legume Sugars', amount: '2g', sharePercent: 100, description: 'Bound oligosaccharides' }]
    },
    nutrients: {
      calories: 190,
      servingSize: '2 oz dry (56g)',
      totalFat: '3g',
      totalFatDV: '4%',
      satFat: '0.5g',
      satFatDV: '3%',
      sodium: '20mg',
      sodiumDV: '1%',
      carbs: '32g',
      carbsDV: '12%',
      fiber: '5g',
      fiberDV: '18%',
      sugars: '2g',
      addedSugars: '0g',
      protein: '11g',
      proteinDV: '22%'
    },
    certifications: [
      { title: 'Certified Gluten Free', details: 'GFCO certified under 10 ppm', verified: true, icon: 'verified' },
      { title: 'Non-GMO Project', details: 'Non-GMO Project verified chickpeas', verified: true, icon: 'eco' }
    ]
  },
  // 36
  {
    id: 'prod-cheerios-original',
    barcode: '016000275287',
    name: 'Cheerios Original Whole Grain Toasted Oat Cereal',
    brand: 'General Mills',
    category: 'Breakfast & Cereals',
    netWeight: '510g',
    image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 3,
    transparencyScore: 92,
    allergensDetected: ['Oats (Gluten-Free Sorted)'],
    facilityWarnings: ['Optical sorting used to remove wheat and barley grains.'],
    ingredientsVerbatim: 'Whole Grain Oats, Corn Starch, Sugar, Salt, Tripotassium Phosphate, Vitamin E (Mixed Tocopherols) Added to Preserve Freshness. Fortified with Iron and Zinc, Vitamin C, Niacinamide, Vitamin B6, Vitamin A, Vitamin B1, Folic Acid, Vitamin B12, Vitamin D3.',
    mandatoryWarning: 'Contains oats. Tested and sorted to meet FDA gluten-free regulations under 20 ppm.',
    isVerified: true,
    verdictSummary: 'Whole grain oats are the 1st ingredient with only 1g added sugar per bowl. Low saturated fat and high soluble fiber support heart health.',
    dietaryRecommendation: 'Low Sugar Breakfast • Heart Healthy',
    ingredientsAnalysis: [
      { name: 'Whole Grain Oats', description: 'De-hulled whole oats toasted and shaped into rings.', status: 'Safe', category: 'Whole Grain' }
    ],
    additivesDecoded: [
      { eCode: 'E340', name: 'Tripotassium Phosphate', translation: 'Mineral buffering salt', scientificRole: 'Adjusts pH during extrusion puffing', toxicityRisk: 'Very Low', badge: 'Buffer' }
    ],
    sugarsBreakdown: {
      totalGrams: 1,
      percentDV: 2,
      glycemicIndex: 60,
      glycemicLabel: 'Moderate GI',
      items: [{ name: 'Cane Sugar', amount: '1g', sharePercent: 100, description: 'Trace sweetening' }]
    },
    nutrients: {
      calories: 140,
      servingSize: '1.5 cups (39g)',
      totalFat: '2.5g',
      totalFatDV: '3%',
      satFat: '0.5g',
      satFatDV: '3%',
      sodium: '190mg',
      sodiumDV: '8%',
      carbs: '29g',
      carbsDV: '11%',
      fiber: '4g',
      fiberDV: '14%',
      sugars: '1g',
      addedSugars: '1g',
      protein: '5g',
      proteinDV: '10%'
    },
    certifications: [
      { title: 'Gluten-Free Certified', details: 'FDA compliant under 20 ppm', verified: true, icon: 'verified' }
    ]
  },
  // 37
  {
    id: 'prod-frosted-flakes',
    barcode: '038000198642',
    name: "Kellogg's Frosted Flakes Cereal",
    brand: 'WK Kellogg Co',
    category: 'Breakfast & Cereals',
    netWeight: '382g',
    image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'D',
    novaGroup: 4,
    transparencyScore: 52,
    allergensDetected: ['Barley (Malt Aroma)'],
    facilityWarnings: ['Contains barley malt gluten.'],
    ingredientsVerbatim: 'Milled Corn, Sugar, Malt Flavor, Contains 2% or Less of Salt. Fortified with Iron (Ferric Phosphate), Niacinamide, Vitamin B6, Vitamin B2, Vitamin B1, Folic Acid, Vitamin D3, Vitamin B12.',
    mandatoryWarning: 'Contains wheat/barley derivatives. 12g added sugar per serving (over 30% by weight).',
    isVerified: true,
    verdictSummary: 'High glycemic processed corn flakes coated with crystallized sugar. Over 30% of the product weight is refined sugar.',
    dietaryRecommendation: 'Sugar Spike Alert • Not for Diabetics',
    ingredientsAnalysis: [
      { name: 'Milled Corn Endosperm', description: 'De-germed corn flour causing fast enzymatic starch conversion.', status: 'Safe', category: 'Grain Starch' },
      { name: 'Added Refined Sugar', description: 'Crystalline white sugar coating delivering rapid blood glucose surge.', status: 'Moderate', category: 'Added Sugar' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 12,
      percentDV: 24,
      glycemicIndex: 82,
      glycemicLabel: 'Ultra-High GI',
      items: [{ name: 'Refined Sucrose', amount: '12g', sharePercent: 100, description: 'Crystallized sugar coating' }]
    },
    nutrients: {
      calories: 140,
      servingSize: '1 cup (37g)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '190mg',
      sodiumDV: '8%',
      carbs: '33g',
      carbsDV: '12%',
      fiber: '1g',
      fiberDV: '4%',
      sugars: '12g',
      addedSugars: '12g',
      protein: '2g',
      proteinDV: '4%'
    },
    certifications: []
  },
  // 38
  {
    id: 'prod-kashi-go-original',
    barcode: '018627103444',
    name: 'Kashi GO Original High Protein Cereal',
    brand: 'Kashi Company',
    category: 'Breakfast & Cereals',
    netWeight: '399g',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 3,
    transparencyScore: 90,
    allergensDetected: ['Soy', 'Wheat (Gluten)', 'Barley', 'Sesame'],
    facilityWarnings: ['Contains soy and wheat.'],
    ingredientsVerbatim: 'Seven Whole Grains and Sesame Flour (Whole: Hard Red Wheat, Brown Rice, Barley, Roasted Soybeans, Oats, Rye, Black Sesame Seeds, Yellow Corn), Soy Flakes, Brown Rice Syrup, Dried Cane Syrup, Chicory Root Fiber, Whole Flax Seeds, Honey, Salt, Defatted Wheat Germ, Natural Flavors.',
    mandatoryWarning: 'CONTAINS: Wheat (Gluten), Soy, Sesame. High botanical fiber charge.',
    isVerified: true,
    verdictSummary: 'Powerhouse cereal with 12g plant protein and 13g dietary fiber per serving from seven whole grains, roasted soybeans, and chicory inulin.',
    dietaryRecommendation: 'High Satiety • Athletic Breakfast • Digestive Fiber',
    ingredientsAnalysis: [
      { name: 'Kashi Seven Whole Grains', description: 'Diverse heritage grains delivering micronutrients and intact bran.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Soy Protein Flakes', description: 'De-fatted soy flakes providing complete branched-chain amino acids.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 8,
      percentDV: 16,
      glycemicIndex: 42,
      glycemicLabel: 'Low GI',
      items: [
        { name: 'Brown Rice Syrup', amount: '5g', sharePercent: 62, description: 'Complex maltose' },
        { name: 'Cane Syrup & Honey', amount: '3g', sharePercent: 38, description: 'Natural sweetening' }
      ]
    },
    nutrients: {
      calories: 180,
      servingSize: '1 1/4 cups (58g)',
      totalFat: '2g',
      totalFatDV: '3%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '140mg',
      sodiumDV: '6%',
      carbs: '40g',
      carbsDV: '15%',
      fiber: '13g',
      fiberDV: '46%',
      sugars: '8g',
      addedSugars: '7g',
      protein: '12g',
      proteinDV: '24%'
    },
    certifications: [
      { title: 'Non-GMO Project', details: 'Verified non-GMO grain supply chain', verified: true, icon: 'eco' }
    ]
  },
  // 39
  {
    id: 'prod-bobs-red-mill-oats',
    barcode: '039978009081',
    name: "Bob's Red Mill Organic Rolled Oats",
    brand: "Bob's Red Mill Natural Foods",
    category: 'Breakfast & Cereals',
    netWeight: '907g',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 1,
    transparencyScore: 100,
    allergensDetected: ['Oats (Certified Gluten Free)'],
    facilityWarnings: ['100% Dedicated gluten-free facility tested to 19 ppm.'],
    ingredientsVerbatim: 'Organic Whole Grain Rolled Oats.',
    mandatoryWarning: 'Contains Oats. Certified Organic and Gluten-Free.',
    isVerified: true,
    verdictSummary: 'Pure, kiln-toasted organic oat groats rolled flat for creamy breakfast porridge. Pristine zero-additive botanical whole food.',
    dietaryRecommendation: 'Celiac Safe • Clean Eating • High Soluble Fiber',
    ingredientsAnalysis: [
      { name: 'Organic Whole Grain Oats', description: 'Whole oat groats retaining endosperm, bran, and germ.', status: 'Safe', category: 'Whole Grain' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 1,
      percentDV: 2,
      glycemicIndex: 52,
      glycemicLabel: 'Low-Moderate GI',
      items: [{ name: 'Bound Oat Sugars', amount: '1g', sharePercent: 100, description: 'Natural carbohydrate' }]
    },
    nutrients: {
      calories: 190,
      servingSize: '1/2 cup (48g)',
      totalFat: '3.5g',
      totalFatDV: '4%',
      satFat: '0.5g',
      satFatDV: '3%',
      sodium: '0mg',
      sodiumDV: '0%',
      carbs: '32g',
      carbsDV: '12%',
      fiber: '5g',
      fiberDV: '18%',
      sugars: '1g',
      addedSugars: '0g',
      protein: '7g',
      proteinDV: '14%'
    },
    certifications: [
      { title: 'USDA Organic', details: 'Certified by QAI', verified: true, icon: 'eco' },
      { title: 'Certified Gluten Free', details: 'Batch tested under 19 ppm', verified: true, icon: 'verified' }
    ]
  },
  // 40
  {
    id: 'prod-hersheys-milk-chocolate',
    barcode: '034000002405',
    name: "Hershey's Milk Chocolate Bar",
    brand: 'The Hershey Company',
    category: 'Confectionery & Treats',
    netWeight: '43g',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'E',
    novaGroup: 4,
    transparencyScore: 50,
    allergensDetected: ['Dairy / Milk', 'Soy'],
    facilityWarnings: ['Produced on equipment that also processes almonds and peanuts.'],
    ingredientsVerbatim: 'Milk Chocolate (Sugar, Milk, Chocolate, Cocoa Butter, Milk Fat, Lecithin (Soy), PGPR, Natural Flavor).',
    mandatoryWarning: 'CONTAINS: Milk, Soy. Manufactured on equipment that processes Peanuts and Almonds.',
    isVerified: true,
    verdictSummary: 'High sugar confectionery bar (25g sugar in a 43g bar). Contains PGPR (E476) emulsifier to reduce expensive cocoa butter requirements.',
    dietaryRecommendation: 'Occasional Treat • Avoid on Low-Sugar Diet',
    ingredientsAnalysis: [
      { name: 'Refined White Sugar', description: 'Predominant ingredient by weight.', status: 'Moderate', category: 'Refined Sugar' },
      { name: 'Milk & Milk Fat', description: 'Cow milk solids providing creamy melt. Active dairy allergen.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [
      { eCode: 'E476', name: 'Polyglycerol Polyricinoleate (PGPR)', translation: 'Synthetic castor oil emulsifier', scientificRole: 'Lowers chocolate viscosity during molding, reducing cocoa butter needs', toxicityRisk: 'Low', badge: 'Emulsifier' },
      { eCode: 'E322', name: 'Soy Lecithin', translation: 'Soy emulsifier', scientificRole: 'Prevents fat crystallization bloom', toxicityRisk: 'Low', badge: 'Emulsifier' }
    ],
    sugarsBreakdown: {
      totalGrams: 25,
      percentDV: 50,
      glycemicIndex: 70,
      glycemicLabel: 'High GI',
      items: [{ name: 'Refined Sucrose & Lactose', amount: '25g', sharePercent: 100, description: 'Added sucrose and dairy milk sugar' }]
    },
    nutrients: {
      calories: 220,
      servingSize: '1 bar (43g)',
      totalFat: '13g',
      totalFatDV: '17%',
      satFat: '8g',
      satFatDV: '40%',
      sodium: '35mg',
      sodiumDV: '2%',
      carbs: '26g',
      carbsDV: '9%',
      fiber: '1g',
      fiberDV: '4%',
      sugars: '25g',
      addedSugars: '21g',
      protein: '3g',
      proteinDV: '6%'
    },
    certifications: [
      { title: 'Kosher', details: 'OU-D Kosher certified', verified: true, icon: 'verified' }
    ]
  },
  // 41
  {
    id: 'prod-lindt-85-dark-chocolate',
    barcode: '037466016450',
    name: 'Lindt Excellence 85% Cocoa Extra Dark Chocolate',
    brand: 'Chocoladefabriken Lindt & Sprüngli AG',
    category: 'Confectionery & Treats',
    netWeight: '100g',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'C',
    novaGroup: 3,
    transparencyScore: 92,
    allergensDetected: ['Tree Nuts (May Contain Traces)', 'Milk (Trace Line Cross-Contact)'],
    facilityWarnings: ['May contain trace peanuts, tree nuts, milk, and soy.'],
    ingredientsVerbatim: 'Chocolate, Cocoa Powder, Cocoa Butter, Demerara Sugar, Bourbon Vanilla Beans.',
    mandatoryWarning: 'May contain trace tree nuts, milk, soy. High cocoa polyphenol density.',
    isVerified: true,
    verdictSummary: 'Excellence grade 85% dark chocolate rich in flavanols and magnesium. Only 5g sugar per 40g serving.',
    dietaryRecommendation: 'Keto Friendly • High Polyphenol • Low Sugar',
    ingredientsAnalysis: [
      { name: 'Cocoa Mass & Cocoa Butter', description: '85% pure unadulterated cocoa bean fraction rich in stearic acid.', status: 'Safe', category: 'Raw Botanical' },
      { name: 'Bourbon Vanilla Pods', description: 'Authentic ground Madagascar vanilla beans.', status: 'Safe', category: 'Natural Spice' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 5,
      percentDV: 10,
      glycemicIndex: 25,
      glycemicLabel: 'Ultra-Low GI',
      items: [{ name: 'Demerara Raw Sugar', amount: '5g', sharePercent: 100, description: 'Unrefined brown cane crystals' }]
    },
    nutrients: {
      calories: 230,
      servingSize: '4 squares (40g)',
      totalFat: '19g',
      totalFatDV: '24%',
      satFat: '11g',
      satFatDV: '55%',
      sodium: '10mg',
      sodiumDV: '0%',
      carbs: '15g',
      carbsDV: '5%',
      fiber: '6g',
      fiberDV: '21%',
      sugars: '5g',
      addedSugars: '5g',
      protein: '4g',
      proteinDV: '8%'
    },
    certifications: [
      { title: 'Lindt Farming Program', details: 'Traceable sustainable cocoa sourcing', verified: true, icon: 'eco' }
    ]
  },
  // 42
  {
    id: 'prod-haribo-goldbears',
    barcode: '042238303030',
    name: 'Haribo Goldbears Gummi Candy',
    brand: 'Haribo GmbH & Co. KG',
    category: 'Confectionery & Treats',
    netWeight: '142g',
    image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'E',
    novaGroup: 4,
    transparencyScore: 40,
    allergensDetected: ['Wheat (Trace Processing Aid)', 'Pork/Beef Gelatin'],
    facilityWarnings: ['Produced in a plant that handles wheat derivatives.'],
    ingredientsVerbatim: 'Glucose Syrup, Sugar, Gelatin, Dextrose, Citric Acid, Corn Starch, Fruit and Vegetable Juices for Color, Natural and Artificial Flavors, Palm Kernel Oil, White and Yellow Beeswax, Carnauba Wax.',
    mandatoryWarning: 'CONTAINS: Animal Gelatin (Porcine/Bovine collagen). Not vegetarian or vegan.',
    isVerified: true,
    verdictSummary: 'Pure confection confectionery consisting entirely of refined sugars (glucose, sucrose, dextrose) bound with animal gelatin and confectioner waxes.',
    dietaryRecommendation: 'Not Vegetarian • High Added Sugar Alert',
    ingredientsAnalysis: [
      { name: 'Animal Collagen Gelatin', description: 'Boiled mammalian connective tissue giving chewiness. Contraindicated for vegans and vegetarians.', status: 'Moderate', category: 'Animal Derivative' },
      { name: 'Triple Refined Sugar Blend', description: 'Glucose syrup, sugar, and dextrose delivering zero micronutrients.', status: 'Moderate', category: 'Simple Sugar' }
    ],
    additivesDecoded: [
      { eCode: 'E901', name: 'Beeswax', translation: 'Natural insect wax', scientificRole: 'Prevents gummies from sticking together in packaging', toxicityRisk: 'None', badge: 'Glazing Agent' },
      { eCode: 'E903', name: 'Carnauba Wax', translation: 'Palm leaf wax', scientificRole: 'Polishes glossy outer shell', toxicityRisk: 'None', badge: 'Glazing Agent' }
    ],
    sugarsBreakdown: {
      totalGrams: 18,
      percentDV: 36,
      glycemicIndex: 85,
      glycemicLabel: 'Ultra-High GI',
      items: [{ name: 'Glucose & Dextrose', amount: '18g', sharePercent: 100, description: 'Added confectionery sugars' }]
    },
    nutrients: {
      calories: 100,
      servingSize: '13 pieces (30g)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '5mg',
      sodiumDV: '0%',
      carbs: '23g',
      carbsDV: '8%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '18g',
      addedSugars: '18g',
      protein: '2g',
      proteinDV: '4%'
    },
    certifications: []
  },
  // 43
  {
    id: 'prod-oreo-double-stuf',
    barcode: '044000032029',
    name: 'Oreo Double Stuf Chocolate Sandwich Cookies',
    brand: 'Mondelēz International / Nabisco',
    category: 'Confectionery & Treats',
    netWeight: '432g',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'E',
    novaGroup: 4,
    transparencyScore: 44,
    allergensDetected: ['Wheat (Gluten)', 'Soy (Soy Lecithin)'],
    facilityWarnings: ['Made in a bakery handling milk traces.'],
    ingredientsVerbatim: 'Sugar, Unbleached Enriched Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Palm Oil, Soybean and/or Canola Oil, Cocoa (Processed with Alkali), High Fructose Corn Syrup, Baking Soda, Salt, Soy Lecithin, Vanillin (Artificial Flavor), Chocolate.',
    mandatoryWarning: 'CONTAINS: Wheat (Gluten), Soy. High trans/saturated fat and added sugar.',
    isVerified: true,
    verdictSummary: 'Ultra-processed sandwich cookie loaded with palm oil and high fructose corn syrup. Interestingly dairy-free / vegan by formulation.',
    dietaryRecommendation: 'Strict Limit • Contains Palm Oil & HFCS',
    ingredientsAnalysis: [
      { name: 'Refined White Cane Sugar', description: 'Primary ingredient by mass.', status: 'Moderate', category: 'Refined Sugar' },
      { name: 'Alkalized Dutch Cocoa', description: 'Cocoa powder treated with potassium carbonate to reduce bitterness.', status: 'Safe', category: 'Cocoa' },
      { name: 'Palm Oil & HFCS', description: 'Saturated palm lipid and liquid fructose syrup.', status: 'Moderate', category: 'Refined Lipid' }
    ],
    additivesDecoded: [
      { eCode: 'E322', name: 'Soy Lecithin', translation: 'Soy emulsifier', scientificRole: 'Blends palm oil and cocoa solids', toxicityRisk: 'Low', badge: 'Emulsifier' },
      { eCode: 'E500ii', name: 'Sodium Bicarbonate', translation: 'Baking Soda', scientificRole: 'Crisp biscuit leavener', toxicityRisk: 'None', badge: 'Leavener' }
    ],
    sugarsBreakdown: {
      totalGrams: 13,
      percentDV: 26,
      glycemicIndex: 74,
      glycemicLabel: 'High GI',
      items: [{ name: 'Sugar & HFCS', amount: '13g', sharePercent: 100, description: 'Refined sugars per 2 cookie serving' }]
    },
    nutrients: {
      calories: 140,
      servingSize: '2 cookies (29g)',
      totalFat: '7g',
      totalFatDV: '9%',
      satFat: '2g',
      satFatDV: '10%',
      sodium: '90mg',
      sodiumDV: '4%',
      carbs: '21g',
      carbsDV: '8%',
      fiber: '1g',
      fiberDV: '4%',
      sugars: '13g',
      addedSugars: '13g',
      protein: '1g',
      proteinDV: '2%'
    },
    certifications: [
      { title: 'Kosher', details: 'OU-D Kosher certified (dairy equipment)', verified: true, icon: 'verified' }
    ]
  },
  // 44
  {
    id: 'prod-justins-peanut-butter-cups',
    barcode: '855188003004',
    name: "Justin's Organic Dark Chocolate Peanut Butter Cups",
    brand: "Justin's / Hormel Foods",
    category: 'Confectionery & Treats',
    netWeight: '40g',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'C',
    novaGroup: 3,
    transparencyScore: 91,
    allergensDetected: ['Peanuts', 'Tree Nuts (Traces)', 'Soy'],
    facilityWarnings: ['Manufactured on shared equipment with tree nuts and milk.'],
    ingredientsVerbatim: 'Organic Dark Chocolate (Organic Evaporated Cane Sugar, Organic Cacao Beans, Organic Cocoa Butter, Organic Soy Lecithin), Organic Peanuts, Organic Powdered Evaporated Cane Sugar, Organic Palm Oil, Sea Salt.',
    mandatoryWarning: 'CONTAINS: Peanuts, Soy. Extreme Anaphylactic Hazard for peanut-allergic individuals.',
    isVerified: true,
    verdictSummary: 'Rainforest Alliance Certified cacao and 100% USDA organic peanuts. Strict IgE anaphylaxis alert for peanut allergy profiles.',
    dietaryRecommendation: 'Organic Indulgence • PEANUT ALLERGY ALERT',
    ingredientsAnalysis: [
      { name: 'Organic Peanuts', description: 'Freshly roasted whole peanuts. Anaphylactic IgE allergen match.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Fair Trade Organic Dark Chocolate', description: 'Cacao beans and cocoa butter.', status: 'Safe', category: 'Organic Cacao' }
    ],
    additivesDecoded: [
      { eCode: 'E322', name: 'Organic Soy Lecithin', translation: 'Soy emulsifier', scientificRole: 'Maintains silky dark chocolate texture', toxicityRisk: 'Low', badge: 'Organic Emulsifier' }
    ],
    sugarsBreakdown: {
      totalGrams: 16,
      percentDV: 32,
      glycemicIndex: 48,
      glycemicLabel: 'Moderate GI',
      items: [{ name: 'Organic Cane Sugar', amount: '16g', sharePercent: 100, description: 'Added organic sugar' }]
    },
    nutrients: {
      calories: 220,
      servingSize: '2 cups (40g)',
      totalFat: '14g',
      totalFatDV: '18%',
      satFat: '7g',
      satFatDV: '35%',
      sodium: '135mg',
      sodiumDV: '6%',
      carbs: '20g',
      carbsDV: '7%',
      fiber: '2g',
      fiberDV: '7%',
      sugars: '16g',
      addedSugars: '15g',
      protein: '4g',
      proteinDV: '8%'
    },
    certifications: [
      { title: 'USDA Organic', details: 'Oregon Tilth certified', verified: true, icon: 'eco' },
      { title: 'Rainforest Alliance', details: '100% sustainable certified cocoa', verified: true, icon: 'verified' }
    ]
  },
  // 45
  {
    id: 'prod-jif-peanut-butter',
    barcode: '051500255162',
    name: 'Jif Creamy Peanut Butter',
    brand: 'The J.M. Smucker Company',
    category: 'Condiments & Spreads',
    netWeight: '454g',
    image: 'https://images.unsplash.com/photo-1590080876351-941da357bde6?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'C',
    novaGroup: 3,
    transparencyScore: 78,
    allergensDetected: ['Peanuts'],
    facilityWarnings: ['Dedicated peanut roasting and grinding lines.'],
    ingredientsVerbatim: 'Roasted Peanuts, Sugar, Contains 2% or Less of: Molasses, Fully Hydrogenated Vegetable Oils (Rapeseed and Soybean), Mono and Diglycerides, Salt.',
    mandatoryWarning: 'CONTAINS: Peanuts. Extreme life-threatening allergen risk for sensitized individuals.',
    isVerified: true,
    verdictSummary: 'Contains 7g plant protein per serving, but includes hydrogenated vegetable oils and added sugars to prevent natural oil separation.',
    dietaryRecommendation: 'PEANUT ALLERGEN VETO • High Protein Staple',
    ingredientsAnalysis: [
      { name: 'Roasted Peanuts', description: 'Freshly roasted whole peanuts. Immediate anaphylaxis trigger for Tier 1 allergen profiles.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Hydrogenated Vegetable Oils', description: 'Fully saturated plant fats added as oil-separation stabilizers.', status: 'Moderate', category: 'Stabilizing Fat' }
    ],
    additivesDecoded: [
      { eCode: 'E471', name: 'Mono- and Diglycerides of Fatty Acids', translation: 'Fatty acid stabilizer', scientificRole: 'Prevents natural peanut oil layer from floating to top of jar', toxicityRisk: 'Low', badge: 'Stabilizer' }
    ],
    sugarsBreakdown: {
      totalGrams: 3,
      percentDV: 6,
      glycemicIndex: 14,
      glycemicLabel: 'Ultra-Low GI',
      items: [{ name: 'Added Cane Sugar & Molasses', amount: '2g', sharePercent: 67, description: 'Added sweetness' }]
    },
    nutrients: {
      calories: 190,
      servingSize: '2 tbsp (33g)',
      totalFat: '16g',
      totalFatDV: '21%',
      satFat: '3.5g',
      satFatDV: '18%',
      sodium: '140mg',
      sodiumDV: '6%',
      carbs: '8g',
      carbsDV: '3%',
      fiber: '2g',
      fiberDV: '7%',
      sugars: '3g',
      addedSugars: '2g',
      protein: '7g',
      proteinDV: '14%'
    },
    certifications: [
      { title: 'Gluten-Free Certified', details: 'Contains zero wheat or gluten', verified: true, icon: 'verified' },
      { title: 'Kosher', details: 'OU Kosher certified', verified: true, icon: 'eco' }
    ]
  },
  // 46
  {
    id: 'prod-nutella-spread',
    barcode: '009800895007',
    name: 'Nutella Hazelnut Spread with Cocoa',
    brand: 'Ferrero S.p.A.',
    category: 'Condiments & Spreads',
    netWeight: '371g',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'E',
    novaGroup: 4,
    transparencyScore: 45,
    allergensDetected: ['Tree Nuts (Hazelnuts)', 'Dairy / Milk (Skim Milk, Whey)', 'Soy (Lecithin)'],
    facilityWarnings: ['Contains hazelnuts, milk, soy.'],
    ingredientsVerbatim: 'Sugar, Modified Palm Oil, Hazelnuts, Skim Milk Powder, Cocoa, Soy and/or Sunflower Lecithin, Vanillin.',
    mandatoryWarning: 'CONTAINS: Tree Nuts (Hazelnuts), Milk, Soy. Sugar is the #1 ingredient (>55% by weight).',
    isVerified: true,
    verdictSummary: 'More than 55% of each jar consists of pure refined white sugar combined with modified palm oil. High saturated fat and sugar load.',
    dietaryRecommendation: 'Strict Glycemic Warning • Severe Nut & Dairy Allergen',
    ingredientsAnalysis: [
      { name: 'Refined White Sugar', description: 'Over 55% of total product mass.', status: 'Moderate', category: 'Refined Sugar' },
      { name: 'Modified Palm Oil', description: 'Industrial high-saturated lipid delivering smooth room-temperature spreadability.', status: 'Moderate', category: 'Palm Lipid' },
      { name: 'Roasted Hazelnuts (13%)', description: 'Botanical tree nut. IgE anaphylactic allergen match.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Skim Milk Powder', description: 'Bovine milk solids rich in casein and lactose.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [
      { eCode: 'E322', name: 'Soy Lecithin', translation: 'Soy emulsifier', scientificRole: 'Prevents hazelnut paste and palm oil separation', toxicityRisk: 'Low', badge: 'Emulsifier' }
    ],
    sugarsBreakdown: {
      totalGrams: 21,
      percentDV: 42,
      glycemicIndex: 68,
      glycemicLabel: 'High GI',
      items: [{ name: 'Refined Cane/Beet Sugar', amount: '21g', sharePercent: 100, description: 'Added sugars in 2 tablespoons' }]
    },
    nutrients: {
      calories: 200,
      servingSize: '2 tbsp (37g)',
      totalFat: '12g',
      totalFatDV: '15%',
      satFat: '4g',
      satFatDV: '20%',
      sodium: '15mg',
      sodiumDV: '1%',
      carbs: '23g',
      carbsDV: '8%',
      fiber: '1g',
      fiberDV: '4%',
      sugars: '21g',
      addedSugars: '19g',
      protein: '2g',
      proteinDV: '4%'
    },
    certifications: [
      { title: 'Gluten-Free', details: 'Contains zero gluten grains', verified: true, icon: 'verified' }
    ]
  },
  // 47
  {
    id: 'prod-kikkoman-soy-sauce',
    barcode: '041390001037',
    name: 'Kikkoman Less Sodium Soy Sauce',
    brand: 'Kikkoman Corporation',
    category: 'Condiments & Spreads',
    netWeight: '296ml',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'C',
    novaGroup: 2,
    transparencyScore: 92,
    allergensDetected: ['Soy', 'Wheat (Gluten)'],
    facilityWarnings: ['Traditional Japanese koji fermentation brewery.'],
    ingredientsVerbatim: 'Water, Soybeans, Wheat, Salt, Lactic Acid, Sodium Benzoate: Less than 1/10 of 1% as a Preservative.',
    mandatoryWarning: 'CONTAINS: Soy, Wheat (Gluten).',
    isVerified: true,
    verdictSummary: 'Naturally brewed traditional shoyu with 37% less sodium than regular soy sauce. Contains wheat and soy allergens from koji mold fermentation.',
    dietaryRecommendation: 'Low-Sodium Alternative • Strict Gluten Warning',
    ingredientsAnalysis: [
      { name: 'Brewed Whole Soybeans', description: 'Rich in amino acid umami peptides from Aspergillus oryzae fermentation.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Roasted Wheat', description: 'Delivers sweet aroma notes in traditional Honjozo brewing. Gluten allergen match.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [
      { eCode: 'E211', name: 'Sodium Benzoate', translation: 'Preservative salt', scientificRole: 'Inhibits yeast bloom in reduced sodium formulation', toxicityRisk: 'Moderate', badge: 'Preservative' },
      { eCode: 'E270', name: 'Lactic Acid', translation: 'Natural food acid', scientificRole: 'Maintains crisp tangy acidity', toxicityRisk: 'None', badge: 'Acidulant' }
    ],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 15,
      glycemicLabel: 'Ultra-Low GI',
      items: [{ name: 'Zero Sugars', amount: '0g', sharePercent: 0, description: 'Completely fermented' }]
    },
    nutrients: {
      calories: 10,
      servingSize: '1 tbsp (15ml)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '575mg',
      sodiumDV: '25%',
      carbs: '1g',
      carbsDV: '0%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '1g',
      proteinDV: '2%'
    },
    certifications: [
      { title: 'Non-GMO Soybeans', details: 'Identity preserved soybeans', verified: true, icon: 'eco' }
    ]
  },
  // 48
  {
    id: 'prod-primal-kitchen-mayo',
    barcode: '855232007010',
    name: 'Primal Kitchen Avocado Oil Mayo',
    brand: 'Primal Kitchen / Kraft Heinz',
    category: 'Condiments & Spreads',
    netWeight: '355ml',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'C',
    novaGroup: 2,
    transparencyScore: 98,
    allergensDetected: ['Eggs'],
    facilityWarnings: ['Made in a certified gluten-free, soy-free facility.'],
    ingredientsVerbatim: 'Avocado Oil, Organic Eggs, Organic Egg Yolks, Organic Vinegar, Sea Salt, Organic Rosemary Extract.',
    mandatoryWarning: 'CONTAINS: Eggs. 100% Free of Canola, Soybean, and Seed Oils.',
    isVerified: true,
    verdictSummary: 'Crafted exclusively with pure monounsaturated avocado oil and cage-free organic eggs. Zero added sugar or industrial seed oils.',
    dietaryRecommendation: 'Keto • Paleo • Whole30 Approved • Clean Condiment',
    ingredientsAnalysis: [
      { name: 'Pure Expeller Pressed Avocado Oil', description: 'Monounsaturated oleic acid lipid extracted from fresh avocado pulp.', status: 'Safe', category: 'Heart Healthy Fat' },
      { name: 'Organic Cage-Free Eggs & Yolks', description: 'Natural lecithin emulsifier creating thick silky mayo texture. Active egg allergen.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 0,
      glycemicLabel: 'Zero Glycemic',
      items: [{ name: 'Zero Sugar', amount: '0g', sharePercent: 0, description: 'Zero added sugar' }]
    },
    nutrients: {
      calories: 100,
      servingSize: '1 tbsp (14g)',
      totalFat: '12g',
      totalFatDV: '15%',
      satFat: '1.5g',
      satFatDV: '8%',
      sodium: '125mg',
      sodiumDV: '5%',
      carbs: '0g',
      carbsDV: '0%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '0g',
      proteinDV: '0%'
    },
    certifications: [
      { title: 'Non-GMO Project', details: '100% Non-GMO ingredients', verified: true, icon: 'eco' },
      { title: 'Certified Gluten Free', details: 'Safe for celiac consumers', verified: true, icon: 'verified' }
    ]
  },
  // 49
  {
    id: 'prod-sriracha-huy-fong',
    barcode: '024463061163',
    name: 'Sriracha Hot Chili Sauce',
    brand: 'Huy Fong Foods',
    category: 'Condiments & Spreads',
    netWeight: '482g',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'C',
    novaGroup: 3,
    transparencyScore: 82,
    allergensDetected: ['Sulfites (E222)'],
    facilityWarnings: ['Dedicated pepper processing plant in Irwindale, CA.'],
    ingredientsVerbatim: 'Chili, Sugar, Salt, Garlic, Distilled Vinegar, Potassium Sorbate, Sodium Bisulfite as Preservatives, Xanthan Gum.',
    mandatoryWarning: 'Contains Sulfites (Sodium Bisulfite). Extreme spicy capsaicin profile.',
    isVerified: true,
    verdictSummary: 'World-famous rooster hot sauce made from sun-ripened red jalapeño peppers. Contains Sodium Bisulfite preservative (sulfite allergen).',
    dietaryRecommendation: 'Low Calorie Flavor • Sulfite Sensitive Warning',
    ingredientsAnalysis: [
      { name: 'Fresh Sun-Ripened Red Jalapeño Chilis', description: 'Rich in capsaicin, stimulating thermogenesis and metabolic rate.', status: 'Safe', category: 'Raw Botanical' },
      { name: 'Sodium Bisulfite (E222)', description: 'Sulfite preservative preventing chili darkening. Active asthmatic/sulfite allergy trigger.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true }
    ],
    additivesDecoded: [
      { eCode: 'E222', name: 'Sodium Hydrogen Sulphite', translation: 'Sulfite preservative', scientificRole: 'Protects natural chili red carotenoid pigments from oxidation', toxicityRisk: 'Moderate (Sulfite Sensitivity)', badge: 'Sulfite Allergen' },
      { eCode: 'E202', name: 'Potassium Sorbate', translation: 'Antimicrobial salt', scientificRole: 'Inhibits mold growth in ambient stored condiment bottles', toxicityRisk: 'Low', badge: 'Preservative' }
    ],
    sugarsBreakdown: {
      totalGrams: 1,
      percentDV: 2,
      glycemicIndex: 50,
      glycemicLabel: 'Low GI',
      items: [{ name: 'Cane Sugar', amount: '1g', sharePercent: 100, description: 'Added sweetness to balance heat' }]
    },
    nutrients: {
      calories: 5,
      servingSize: '1 tsp (5g)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '100mg',
      sodiumDV: '4%',
      carbs: '1g',
      carbsDV: '0%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '1g',
      addedSugars: '1g',
      protein: '0g',
      proteinDV: '0%'
    },
    certifications: [
      { title: 'Gluten Free', details: 'Contains zero wheat or barley gluten', verified: true, icon: 'verified' }
    ]
  },
  // 50
  {
    id: 'prod-frenchs-yellow-mustard',
    barcode: '041500000251',
    name: "French's Classic Yellow Mustard",
    brand: 'McCormick & Company',
    category: 'Condiments & Spreads',
    netWeight: '396g',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 2,
    transparencyScore: 98,
    allergensDetected: ['Mustard (EU 14 Allergen)'],
    facilityWarnings: ['Dedicated condiment processing.'],
    ingredientsVerbatim: 'Distilled Vinegar, Water, 1 Grade Mustard Seed, Salt, Turmeric, Paprika, Spice, Natural Flavors, Garlic Powder.',
    mandatoryWarning: 'CONTAINS: Mustard Seed (Mandatory allergen under EU FIC 14 standards). Zero calories or fat.',
    isVerified: true,
    verdictSummary: 'Stone-ground #1 grade mustard seeds colored naturally with pure turmeric root. Zero added sugars, artificial dyes, or preservatives.',
    dietaryRecommendation: 'Zero Calorie • Anti-Inflammatory Turmeric • Keto',
    ingredientsAnalysis: [
      { name: '#1 Grade Yellow Mustard Seed', description: 'Sinapis alba seeds rich in glucosinolates. EU FIC major allergen match.', status: 'Allergen', category: 'Allergen Match', isAllergenMatch: true },
      { name: 'Ground Turmeric Root', description: 'Potent natural curcuminoid pigment delivering signature vivid yellow color.', status: 'Safe', category: 'Botanical Spice' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 0,
      glycemicLabel: 'Zero Glycemic',
      items: [{ name: 'Zero Sugar', amount: '0g', sharePercent: 0, description: 'Zero sugar' }]
    },
    nutrients: {
      calories: 0,
      servingSize: '1 tsp (5g)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '55mg',
      sodiumDV: '2%',
      carbs: '0g',
      carbsDV: '0%',
      fiber: '0g',
      fiberDV: '0%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '0g',
      proteinDV: '0%'
    },
    certifications: [
      { title: 'Gluten Free Certified', details: 'Tested and verified free of gluten', verified: true, icon: 'verified' },
      { title: 'Kosher', details: 'OU Kosher certified', verified: true, icon: 'eco' }
    ]
  },
  // 51
  {
    id: 'prod-gerber-organic-baby-puree',
    barcode: '015000045012',
    name: 'Gerber Organic 1st Foods Sweet Potato Puree',
    brand: 'Nestlé / Gerber',
    category: 'Pantry & Grains',
    netWeight: '113g',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'A',
    novaGroup: 1,
    transparencyScore: 100,
    allergensDetected: [],
    facilityWarnings: ['100% Dedicated allergen-tested baby food facility.'],
    ingredientsVerbatim: 'Organic Sweet Potatoes, Water, Vitamin C (Ascorbic Acid).',
    mandatoryWarning: 'Single ingredient whole food baby puree. Non-GMO, no added salt or sugar.',
    isVerified: true,
    verdictSummary: 'Clean, simple whole organic sweet potato puree for infant nutrition. Rich in natural provitamin A (Beta-Carotene).',
    dietaryRecommendation: 'Infant Safe • Whole Vegetable • Clean Label',
    ingredientsAnalysis: [
      { name: 'Organic Sweet Potatoes', description: 'Steam-pureed whole sweet potatoes rich in beta-carotene and dietary fiber.', status: 'Safe', category: 'Organic Root' }
    ],
    additivesDecoded: [],
    sugarsBreakdown: {
      totalGrams: 5,
      percentDV: 0,
      glycemicIndex: 45,
      glycemicLabel: 'Low GI',
      items: [{ name: 'Natural Sweet Potato Sugars', amount: '5g', sharePercent: 100, description: 'Bound unrefined vegetable sugars' }]
    },
    nutrients: {
      calories: 50,
      servingSize: '1 tub (113g)',
      totalFat: '0g',
      totalFatDV: '0%',
      satFat: '0g',
      satFatDV: '0%',
      sodium: '30mg',
      sodiumDV: '1%',
      carbs: '12g',
      carbsDV: '4%',
      fiber: '2g',
      fiberDV: '7%',
      sugars: '5g',
      addedSugars: '0g',
      protein: '1g',
      proteinDV: '2%'
    },
    certifications: [
      { title: 'USDA Organic', details: 'Clean Field Farming certified', verified: true, icon: 'eco' },
      { title: 'Non-GMO Project', details: 'Verified non-GMO produce', verified: true, icon: 'verified' }
    ]
  },
  // 52
  {
    id: 'prod-beyond-burger-plant-meat',
    barcode: '852629004555',
    name: 'Beyond Meat Beyond Burger Plant-Based Patties',
    brand: 'Beyond Meat Inc.',
    category: 'Dairy & Alternatives',
    netWeight: '227g',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    nutriScore: 'B',
    novaGroup: 4,
    transparencyScore: 84,
    allergensDetected: ['Legumes (Pea Protein)'],
    facilityWarnings: ['Peas are legumes. People with severe allergies to legumes like peanuts should be cautious.'],
    ingredientsVerbatim: 'Water, Pea Protein, Expeller-Pressed Canola Oil, Refined Coconut Oil, Rice Protein, Natural Flavors, Dried Yeast, Methylcellulose, Potato Starch, Apple Extract, Pomegranate Extract, Salt, Potassium Chloride, Vinegar, Lemon Juice Concentrate, Sunflower Lecithin, Beet Juice Extract (for Color).',
    mandatoryWarning: 'Contains Pea Protein (Legume). 100% Free of Soy, Gluten, and GMOs.',
    isVerified: true,
    verdictSummary: 'Provides 20g of complete plant protein per patty using pea and brown rice isolates. Free of soy and gluten.',
    dietaryRecommendation: '100% Vegan • Cholesterol Free • High Protein',
    ingredientsAnalysis: [
      { name: 'Pea & Rice Protein Isolate', description: 'Complementary amino acid blend matching beef protein profile.', status: 'Safe', category: 'Plant Protein' },
      { name: 'Beet Juice & Apple Extract', description: 'Natural botanical pigments that sizzle and change color when cooked.', status: 'Safe', category: 'Plant Color' }
    ],
    additivesDecoded: [
      { eCode: 'E461', name: 'Methylcellulose', translation: 'Plant fiber binder', scientificRole: 'Thermal gelling agent keeping patties juicy during grilling', toxicityRisk: 'Very Low', badge: 'Binder' }
    ],
    sugarsBreakdown: {
      totalGrams: 0,
      percentDV: 0,
      glycemicIndex: 15,
      glycemicLabel: 'Ultra-Low GI',
      items: [{ name: 'Zero Sugar', amount: '0g', sharePercent: 0, description: 'Zero sugar' }]
    },
    nutrients: {
      calories: 230,
      servingSize: '1 patty (113g)',
      totalFat: '14g',
      totalFatDV: '18%',
      satFat: '5g',
      satFatDV: '25%',
      sodium: '390mg',
      sodiumDV: '17%',
      carbs: '7g',
      carbsDV: '3%',
      fiber: '2g',
      fiberDV: '7%',
      sugars: '0g',
      addedSugars: '0g',
      protein: '20g',
      proteinDV: '40%'
    },
    certifications: [
      { title: 'Non-GMO Project', details: 'Certified non-GMO plant ingredients', verified: true, icon: 'eco' },
      { title: 'Certified Vegan', details: 'Vegan Action certified', verified: true, icon: 'spa' }
    ]
  }
];
