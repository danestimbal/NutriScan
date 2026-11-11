import { DailyNutritionalIntake, IntakeLogItem, FoodProduct, ScanLog } from '../types';

/**
 * Generates a clean 30-day chronological nutritional intake timeline ending on today's date,
 * starting at 0 for unlogged days so a real user account only shows their actual logged/scanned foods.
 */
export function generate30DayIntakeHistory(): DailyNutritionalIntake[] {
  const result: DailyNutritionalIntake[] = [];
  const baseDate = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);

    const dayStr = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    result.push({
      date: dayStr,
      displayDate,
      dayIndex: 30 - i,
      sugar: 0,
      sodium: 0,
      protein: 0,
      calories: 0,
      items: [],
    });
  }

  return result;
}

/**
 * Checks whether an intakeHistory array contains the legacy auto-generated mock mealPool items (`log-YYYY-MM-DD-k`).
 */
export function isMockSeededIntakeHistory(history?: DailyNutritionalIntake[]): boolean {
  if (!Array.isArray(history) || history.length === 0) return false;
  return history.some((day) =>
    Array.isArray(day.items) && day.items.some((item) => String(item.id || '').startsWith('log-20'))
  );
}

/**
 * Builds a clean 30-day intake timeline and populates today's entry from the user's real scanLogs.
 */
export function buildCleanHistoryFromRealScans(
  scanLogs: ScanLog[],
  products: FoodProduct[]
): DailyNutritionalIntake[] {
  let timeline = generate30DayIntakeHistory();
  const realScans = scanLogs.filter((s) => !['scan-1', 'scan-2', 'scan-3', 'scan-4', 'scan-5'].includes(s.id));

  for (const log of realScans) {
    const matched = products.find((p) => p.barcode === log.barcode || p.name === log.productName);
    if (matched) {
      const item = productToIntakeItem(matched);
      item.id = `scan-intake-${log.id}`;
      item.time = log.timestamp;
      timeline = appendIntakeItemToHistory(timeline, item);
    }
  }
  return timeline;
}

export const WHO_RECOMMENDED_SUGAR_LIMIT = 25; // grams / day
export const FDA_MAX_SODIUM_LIMIT = 2300; // mg / day
export const RECOMMENDED_PROTEIN_TARGET = 55; // grams / day

/**
 * Appends a scanned or logged food item to today's intake entry in the 30-day history.
 */
export function appendIntakeItemToHistory(
  history: DailyNutritionalIntake[],
  newItem: IntakeLogItem
): DailyNutritionalIntake[] {
  const base = Array.isArray(history) && history.length > 0 ? [...history] : generate30DayIntakeHistory();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDisplay = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const lastIdx = base.length - 1;

  if (base[lastIdx] && base[lastIdx].date === todayStr) {
    const today = { ...base[lastIdx] };
    today.items = [newItem, ...(today.items || [])];
    today.sugar = Math.round((today.sugar + newItem.sugar) * 10) / 10;
    today.sodium = Math.round(today.sodium + newItem.sodium);
    today.protein = Math.round((today.protein + newItem.protein) * 10) / 10;
    today.calories = Math.round(today.calories + (newItem.calories || 0));
    base[lastIdx] = today;
    return base;
  }

  // If the last entry in history is from an earlier date, append a new day entry for today
  const nextEntry: DailyNutritionalIntake = {
    date: todayStr,
    displayDate: todayDisplay,
    dayIndex: base.length,
    sugar: Math.round(newItem.sugar * 10) / 10,
    sodium: Math.round(newItem.sodium),
    protein: Math.round(newItem.protein * 10) / 10,
    calories: Math.round(newItem.calories || 0),
    items: [newItem],
  };
  return [...base.slice(-29), nextEntry];
}

export function productToIntakeItem(product: FoodProduct): IntakeLogItem {
  const sugarNum = parseFloat(String(product.nutrients?.sugars || '0').replace(/[^0-9.]/g, '')) || 0;
  const sodiumNum = parseFloat(String(product.nutrients?.sodium || '0').replace(/[^0-9.]/g, '')) || 0;
  const proteinNum = parseFloat(String(product.nutrients?.protein || '0').replace(/[^0-9.]/g, '')) || 0;
  return {
    id: `intake-${Date.now()}`,
    name: `${product.brand} ${product.name}`.trim(),
    sugar: sugarNum,
    sodium: sodiumNum,
    protein: proteinNum,
    calories: product.nutrients?.calories || 0,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

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

  // Average over days that actually have logged/scanned intake (or return 0 if none yet)
  const activeDays = data.filter(
    (d) => d.sugar > 0 || d.sodium > 0 || d.protein > 0 || d.calories > 0 || (d.items && d.items.length > 0)
  );
  if (activeDays.length === 0) {
    return {
      avgSugar: 0,
      avgSodium: 0,
      avgProtein: 0,
      totalDays: data.length,
      sugarThresholdPct: 0,
      sodiumThresholdPct: 0,
      proteinGoalPct: 0
    };
  }

  const count = activeDays.length;
  const sumSugar = activeDays.reduce((acc, curr) => acc + curr.sugar, 0);
  const sumSodium = activeDays.reduce((acc, curr) => acc + curr.sodium, 0);
  const sumProtein = activeDays.reduce((acc, curr) => acc + curr.protein, 0);

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
