import { DailyNutritionalIntake, IntakeLogItem } from '../types';

/**
 * Generates 30 days of realistic chronological nutritional intake history
 * ending on the reference date (September 28, 2026).
 */
export function generate30DayIntakeHistory(): DailyNutritionalIntake[] {
  const result: DailyNutritionalIntake[] = [];
  const baseDate = new Date('2026-09-28T12:00:00Z');

  // Baseline templates for common meals
  const mealPool: IntakeLogItem[] = [
    { id: 'm1', name: 'Silk Almond Milk & Oats', sugar: 6.5, sodium: 170, protein: 7.2, calories: 210 },
    { id: 'm2', name: 'Organic Greek Yogurt & Blueberries', sugar: 9.0, sodium: 65, protein: 18.5, calories: 190 },
    { id: 'm3', name: 'Nordic Seed Crackers & Hummus', sugar: 1.2, sodium: 280, protein: 8.0, calories: 230 },
    { id: 'm4', name: 'Golden Harvest Granola Snack', sugar: 14.5, sodium: 190, protein: 4.5, calories: 260 },
    { id: 'm5', name: 'Grilled Wild Salmon & Quinoa', sugar: 2.0, sodium: 420, protein: 34.0, calories: 480 },
    { id: 'm6', name: 'Lentil Veggie Botanical Bowl', sugar: 4.5, sodium: 540, protein: 22.0, calories: 390 },
    { id: 'm7', name: 'Artisan Raw Cacao Almond Butter', sugar: 3.8, sodium: 85, protein: 9.5, calories: 250 },
    { id: 'm8', name: 'Matcha Green Tea Latte', sugar: 8.2, sodium: 110, protein: 4.0, calories: 140 },
    { id: 'm9', name: 'Avocado & Hemp Heart Toast', sugar: 1.5, sodium: 310, protein: 11.0, calories: 320 },
    { id: 'm10', name: 'Chia Seed Coconut Pudding', sugar: 5.0, sodium: 95, protein: 6.5, calories: 180 },
    { id: 'm11', name: 'Roasted Edamame & Sea Salt', sugar: 1.8, sodium: 380, protein: 16.0, calories: 190 },
    { id: 'm12', name: 'Dark Chocolate 85% Square', sugar: 4.0, sodium: 15, protein: 2.2, calories: 110 }
  ];

  // Specific 30-day realistic rhythm (simulating weekday health vs weekend variances)
  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);

    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const dayStr = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Deterministic pseudo-random generation based on day offset
    const pseudoSeed = (i * 17 + 23) % 100;
    
    // Select 3 to 4 items for this day
    const itemsCount = isWeekend ? 4 : 3;
    const items: IntakeLogItem[] = [];
    
    const startIndex = (i * 2) % mealPool.length;
    for (let k = 0; k < itemsCount; k++) {
      const item = mealPool[(startIndex + k) % mealPool.length];
      items.push({
        ...item,
        id: `log-${dayStr}-${k}`,
        time: k === 0 ? '08:30 AM' : k === 1 ? '01:15 PM' : k === 2 ? '07:45 PM' : '04:10 PM'
      });
    }

    // Weekend variance slightly increases sugar/sodium, decreases protein slightly
    let sugarFactor = isWeekend ? 1.25 : 0.95;
    let sodiumFactor = isWeekend ? 1.2 : 0.98;
    let proteinFactor = isWeekend ? 0.92 : 1.05;

    // A couple special spike days (e.g. social dinner or heavy workout)
    if (i === 18) {
      // Day 18 (Party/Celebration)
      sugarFactor = 1.7;
      sodiumFactor = 1.5;
    } else if (i === 7) {
      // Day 7 (Ultra clean training day)
      proteinFactor = 1.35;
      sugarFactor = 0.65;
    }

    const totalSugar = Math.round(items.reduce((sum, it) => sum + it.sugar, 0) * sugarFactor * 10) / 10;
    const totalSodium = Math.round(items.reduce((sum, it) => sum + it.sodium, 0) * sodiumFactor);
    const totalProtein = Math.round(items.reduce((sum, it) => sum + it.protein, 0) * proteinFactor * 10) / 10;
    const totalCalories = Math.round(items.reduce((sum, it) => sum + (it.calories || 200), 0) * 1.05);

    result.push({
      date: dayStr,
      displayDate,
      dayIndex: 30 - i,
      sugar: totalSugar,
      sodium: totalSodium,
      protein: totalProtein,
      calories: totalCalories,
      items
    });
  }

  return result;
}

export const WHO_RECOMMENDED_SUGAR_LIMIT = 25; // grams / day
export const FDA_MAX_SODIUM_LIMIT = 2300; // mg / day
export const RECOMMENDED_PROTEIN_TARGET = 55; // grams / day

export function calculateIntakeStats(data: DailyNutritionalIntake[]) {
  if (!data || data.length === 0) {
    return {
      avgSugar: 0,
      avgSodium: 0,
      avgProtein: 0,
      totalDays: 0,
      sugarThresholdPct: 0,
      sodiumThresholdPct: 0,
      proteinGoalPct: 0
    };
  }

  const count = data.length;
  const sumSugar = data.reduce((acc, curr) => acc + curr.sugar, 0);
  const sumSodium = data.reduce((acc, curr) => acc + curr.sodium, 0);
  const sumProtein = data.reduce((acc, curr) => acc + curr.protein, 0);

  const avgSugar = Math.round((sumSugar / count) * 10) / 10;
  const avgSodium = Math.round(sumSodium / count);
  const avgProtein = Math.round((sumProtein / count) * 10) / 10;

  return {
    avgSugar,
    avgSodium,
    avgProtein,
    totalDays: count,
    sugarThresholdPct: Math.round((avgSugar / WHO_RECOMMENDED_SUGAR_LIMIT) * 100),
    sodiumThresholdPct: Math.round((avgSodium / FDA_MAX_SODIUM_LIMIT) * 100),
    proteinGoalPct: Math.round((avgProtein / RECOMMENDED_PROTEIN_TARGET) * 100)
  };
}
