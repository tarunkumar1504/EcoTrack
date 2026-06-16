import { EMISSION_FACTORS } from '../data/emissionFactors';

/**
 * Calculates daily CO2 emissions (in kg) based on user inputs.
 * 
 * @param {Object} inputs - Daily activity inputs
 * @param {Object} inputs.travel - Distances in km
 * @param {number} inputs.travel.carPetrol - Petrol car km
 * @param {number} inputs.travel.carDiesel - Diesel car km
 * @param {number} inputs.travel.carHybrid - Hybrid car km
 * @param {number} inputs.travel.carElectric - Electric car km
 * @param {number} inputs.travel.motorcycle - Motorcycle km
 * @param {number} inputs.travel.bus - Bus km
 * @param {number} inputs.travel.train - Train km
 * @param {number} inputs.travel.flight - Flight km
 * 
 * @param {Object} inputs.electricity - Energy usage
 * @param {number} inputs.electricity.kwh - Grid electricity in kWh
 * @param {number} inputs.electricity.renewableKwh - Renewable electricity in kWh
 * 
 * @param {Object} inputs.food - Meals count (typically adds up to 3 per day, or custom)
 * @param {number} inputs.food.vegan - Vegan meals
 * @param {number} inputs.food.vegetarian - Vegetarian meals
 * @param {number} inputs.food.nonVegLight - Light meat/fish meals
 * @param {number} inputs.food.nonVegHeavy - Beef/lamb/pork heavy meals
 * 
 * @param {Object} inputs.waste - Waste details
 * @param {number} inputs.waste.landfill - Unsorted trash in kg
 * @param {number} inputs.waste.recycled - Recycled waste in kg
 * 
 * @returns {Object} Total CO2 and breakdown
 */
const toSafeNumber = (value) => Number(value) || 0;
const roundTo = (value, digits = 2) => parseFloat(Number(value).toFixed(digits));

export function calculateDailyEmissions(inputs) {
  const travelInputs = inputs?.travel || {};
  const energyInputs = inputs?.electricity || {};
  const foodInputs = inputs?.food || {};
  const wasteInputs = inputs?.waste || {};

  const travelBreakdown = {
    carPetrol: toSafeNumber(travelInputs.carPetrol) * EMISSION_FACTORS.travel.carPetrol,
    carDiesel: toSafeNumber(travelInputs.carDiesel) * EMISSION_FACTORS.travel.carDiesel,
    carHybrid: toSafeNumber(travelInputs.carHybrid) * EMISSION_FACTORS.travel.carHybrid,
    carElectric: toSafeNumber(travelInputs.carElectric) * EMISSION_FACTORS.travel.carElectric,
    motorcycle: toSafeNumber(travelInputs.motorcycle) * EMISSION_FACTORS.travel.motorcycle,
    bus: toSafeNumber(travelInputs.bus) * EMISSION_FACTORS.travel.bus,
    train: toSafeNumber(travelInputs.train) * EMISSION_FACTORS.travel.train,
    flight: toSafeNumber(travelInputs.flight) * EMISSION_FACTORS.travel.flight,
    bicycle: toSafeNumber(travelInputs.bicycle) * EMISSION_FACTORS.travel.bicycle,
    walking: toSafeNumber(travelInputs.walking) * EMISSION_FACTORS.travel.walking,
  };

  const travelTotal = Object.values(travelBreakdown).reduce((sum, val) => sum + val, 0);

  const electricityBreakdown = {
    grid: toSafeNumber(energyInputs.kwh) * EMISSION_FACTORS.electricity.gridAverage,
    renewable: toSafeNumber(energyInputs.renewableKwh) * EMISSION_FACTORS.electricity.renewable,
  };

  const electricityTotal = Object.values(electricityBreakdown).reduce((sum, val) => sum + val, 0);

  // 3. Food Emissions Calculation
  const foodBreakdown = {
    vegan: toSafeNumber(foodInputs.vegan) * EMISSION_FACTORS.food.vegan,
    vegetarian: toSafeNumber(foodInputs.vegetarian) * EMISSION_FACTORS.food.vegetarian,
    nonVegLight: toSafeNumber(foodInputs.nonVegLight) * EMISSION_FACTORS.food.nonVegLight,
    nonVegHeavy: toSafeNumber(foodInputs.nonVegHeavy) * EMISSION_FACTORS.food.nonVegHeavy,
  };

  const foodTotal = Object.values(foodBreakdown).reduce((sum, val) => sum + val, 0);

  const wasteBreakdown = {
    landfill: toSafeNumber(wasteInputs.landfill) * EMISSION_FACTORS.waste.landfill,
    recycle: toSafeNumber(wasteInputs.recycled) * EMISSION_FACTORS.waste.recycle,
  };

  const wasteTotal = Object.values(wasteBreakdown).reduce((sum, val) => sum + val, 0);

  // Totals
  const grandTotal = travelTotal + electricityTotal + foodTotal + wasteTotal;

  return {
    total: parseFloat(grandTotal.toFixed(2)),
    breakdown: {
      travel: parseFloat(travelTotal.toFixed(2)),
      electricity: parseFloat(electricityTotal.toFixed(2)),
      food: parseFloat(foodTotal.toFixed(2)),
      waste: parseFloat(wasteTotal.toFixed(2)),
    },
    detailedBreakdown: {
      travel: travelBreakdown,
      electricity: electricityBreakdown,
      food: foodBreakdown,
      waste: wasteBreakdown,
    }
  };
}

/**
 * Summarize lists of daily emissions (e.g. for charts, analytics)
 * 
 * @param {Array} logs - List of logs, each containing date and inputs
 * @returns {Object} Aggregated statistics
 */
export function calculateAggregates(logs) {
  if (!logs || logs.length === 0) {
    return {
      average: 0,
      total: 0,
      byCategory: { travel: 0, electricity: 0, food: 0, waste: 0 },
      history: []
    };
  }

  const results = logs.map(log => {
    const emissions = calculateDailyEmissions(log.inputs);
    return {
      date: log.date,
      total: emissions.total,
      breakdown: emissions.breakdown
    };
  });

  const sumTotal = results.reduce((sum, r) => sum + r.total, 0);
  const avgTotal = sumTotal / logs.length;

  const categoryTotals = results.reduce(
    (acc, r) => {
      acc.travel += r.breakdown.travel;
      acc.electricity += r.breakdown.electricity;
      acc.food += r.breakdown.food;
      acc.waste += r.breakdown.waste;
      return acc;
    },
    { travel: 0, electricity: 0, food: 0, waste: 0 }
  );

  const normalizedCategoryTotals = Object.fromEntries(
    Object.entries(categoryTotals).map(([category, total]) => [category, roundTo(total)])
  );

  return {
    average: parseFloat(avgTotal.toFixed(2)),
    total: parseFloat(sumTotal.toFixed(2)),
    byCategory: normalizedCategoryTotals,
    history: results
  };
}

/**
 * Calculate a sustainability score based on the current footprint and target budget.
 * Higher is better; values are clamped to 0-100 for clear UI presentation.
 *
 * @param {number} emissions - Current daily emissions in kg CO₂
 * @param {number} target - User target budget in kg CO₂
 * @returns {number} Sustainability score from 0 to 100
 */
export function calculateSustainabilityScore(emissions = 0, target = 12) {
  const safeTarget = Math.max(1, Number(target) || 12);
  const safeEmissions = Math.max(0, Number(emissions) || 0);
  const score = 100 - (safeEmissions / safeTarget) * 100;

  return parseFloat(Math.min(100, Math.max(0, score)).toFixed(1));
}

export function calculateGoalBudgets(dailyTarget = 12) {
  const safeDaily = Math.max(1, Number(dailyTarget) || 12);
  return {
    weeklyBudget: parseFloat((safeDaily * 7).toFixed(1)),
    monthlyBudget: parseFloat((safeDaily * 30).toFixed(1))
  };
}

const CATEGORY_LABELS = {
  travel: 'Travel',
  electricity: 'Energy',
  food: 'Diet',
  waste: 'Waste'
};

const CATEGORY_RECOMMENDATIONS = {
  travel: {
    title: 'Lower transport emissions through choice and route.',
    steps: [
      'Swap short car trips for biking, walking, or public transit.',
      'Combine errands and avoid single-purpose drives.',
      'Choose carpooling or rideshare for longer commutes.'
    ]
  },
  electricity: {
    title: 'Reduce home energy use with smart habits.',
    steps: [
      'Turn off standby electronics and unplug chargers.',
      'Use cold water for laundry and energy-efficient appliances.',
      'Switch to LED lighting and adjust thermostat settings.'
    ]
  },
  food: {
    title: 'Cut diet emissions by shifting meal choices.',
    steps: [
      'Choose plant-based meals for at least one meal per day.',
      'Replace red meat with beans, fish, or vegetarian options.',
      'Plan meals to reduce food waste and over-purchasing.'
    ]
  },
  waste: {
    title: 'Manage waste to reduce methane and recycling emissions.',
    steps: [
      'Sort recyclables and compost organic scraps.',
      'Avoid single-use plastics with reusable containers.',
      'Buy products with minimal packaging or bulk options.'
    ]
  }
};

export function generateReductionPlan(latestEmissions = { total: 0, breakdown: { travel: 0, electricity: 0, food: 0, waste: 0 } }, target = 12) {
  const safeEmissions = latestEmissions.breakdown || { travel: 0, electricity: 0, food: 0, waste: 0 };
  const [topCategory] = Object.entries(safeEmissions).reduce(
    (best, [category, value]) => (value > best[1] ? [category, value] : best),
    ['travel', 0]
  );

  const recommendation = CATEGORY_RECOMMENDATIONS[topCategory] || CATEGORY_RECOMMENDATIONS.travel;
  const dailyGap = Math.max(0, latestEmissions.total - Number(target));
  const weeklyOpportunity = parseFloat((safeEmissions[topCategory] * 0.2 * 7).toFixed(1));

  return {
    category: topCategory,
    categoryLabel: CATEGORY_LABELS[topCategory] || 'General',
    title: recommendation.title,
    steps: recommendation.steps,
    dailyGap: parseFloat(dailyGap.toFixed(1)),
    weeklyOpportunity,
    summary: dailyGap > 0
      ? `Reduce your daily output by ${dailyGap.toFixed(1)} kg CO₂ to meet your target today.`
      : 'You are at or below your daily goal — keep the momentum and extend it across the week.'
  };
}

export function calculateProgressSummary(logs = []) {
  const entries = Array.isArray(logs) ? logs : [];
  const now = new Date();

  const toDateOnly = (value) => {
    const safeDate = new Date(value);
    return new Date(safeDate.getFullYear(), safeDate.getMonth(), safeDate.getDate());
  };

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - 6);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const previousWeekStart = new Date(startOfWeek);
  previousWeekStart.setDate(startOfWeek.getDate() - 7);
  const previousWeekEnd = new Date(startOfWeek);
  previousWeekEnd.setDate(startOfWeek.getDate() - 1);

  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const sumForRange = (start, end) => entries
    .filter((entry) => {
      const entryDate = toDateOnly(entry.date);
      return entryDate >= start && entryDate <= end;
    })
    .reduce((sum, entry) => sum + calculateDailyEmissions(entry.inputs).total, 0);

  const weekTotal = sumForRange(startOfWeek, startOfToday);
  const monthTotal = sumForRange(startOfMonth, startOfToday);
  const previousWeekTotal = sumForRange(previousWeekStart, previousWeekEnd);
  const previousMonthTotal = sumForRange(previousMonthStart, previousMonthEnd);

  const countRange = (start, end) => entries.filter((entry) => {
    const entryDate = toDateOnly(entry.date);
    return entryDate >= start && entryDate <= end;
  }).length;

  const weekCount = Math.max(countRange(startOfWeek, startOfToday), 1);
  const monthCount = Math.max(countRange(startOfMonth, startOfToday), 1);

  const weekChange = previousWeekTotal > 0 ? ((weekTotal - previousWeekTotal) / previousWeekTotal) * 100 : 0;
  const monthChange = previousMonthTotal > 0 ? ((monthTotal - previousMonthTotal) / previousMonthTotal) * 100 : 0;

  return {
    weekTotal: roundTo(weekTotal),
    weekAverage: roundTo(weekTotal / weekCount),
    monthTotal: roundTo(monthTotal),
    monthAverage: roundTo(monthTotal / monthCount),
    weekChange: parseFloat(weekChange.toFixed(1)),
    monthChange: parseFloat(monthChange.toFixed(1)),
  };
}
