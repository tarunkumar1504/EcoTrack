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
export function calculateDailyEmissions(inputs) {
  // Safe defaults
  const travelInputs = inputs?.travel || {};
  const energyInputs = inputs?.electricity || {};
  const foodInputs = inputs?.food || {};
  const wasteInputs = inputs?.waste || {};

  // 1. Travel Emissions Calculation
  const travelBreakdown = {
    carPetrol: (Number(travelInputs.carPetrol) || 0) * EMISSION_FACTORS.travel.carPetrol,
    carDiesel: (Number(travelInputs.carDiesel) || 0) * EMISSION_FACTORS.travel.carDiesel,
    carHybrid: (Number(travelInputs.carHybrid) || 0) * EMISSION_FACTORS.travel.carHybrid,
    carElectric: (Number(travelInputs.carElectric) || 0) * EMISSION_FACTORS.travel.carElectric,
    motorcycle: (Number(travelInputs.motorcycle) || 0) * EMISSION_FACTORS.travel.motorcycle,
    bus: (Number(travelInputs.bus) || 0) * EMISSION_FACTORS.travel.bus,
    train: (Number(travelInputs.train) || 0) * EMISSION_FACTORS.travel.train,
    flight: (Number(travelInputs.flight) || 0) * EMISSION_FACTORS.travel.flight,
  };

  const travelTotal = Object.values(travelBreakdown).reduce((sum, val) => sum + val, 0);

  // 2. Electricity Emissions Calculation
  const electricityBreakdown = {
    grid: (Number(energyInputs.kwh) || 0) * EMISSION_FACTORS.electricity.gridAverage,
    renewable: (Number(energyInputs.renewableKwh) || 0) * EMISSION_FACTORS.electricity.renewable,
  };

  const electricityTotal = Object.values(electricityBreakdown).reduce((sum, val) => sum + val, 0);

  // 3. Food Emissions Calculation
  const foodBreakdown = {
    vegan: (Number(foodInputs.vegan) || 0) * EMISSION_FACTORS.food.vegan,
    vegetarian: (Number(foodInputs.vegetarian) || 0) * EMISSION_FACTORS.food.vegetarian,
    nonVegLight: (Number(foodInputs.nonVegLight) || 0) * EMISSION_FACTORS.food.nonVegLight,
    nonVegHeavy: (Number(foodInputs.nonVegHeavy) || 0) * EMISSION_FACTORS.food.nonVegHeavy,
  };

  const foodTotal = Object.values(foodBreakdown).reduce((sum, val) => sum + val, 0);

  // 4. Waste Emissions Calculation
  const wasteBreakdown = {
    landfill: (Number(wasteInputs.landfill) || 0) * EMISSION_FACTORS.waste.landfill,
    recycle: (Number(wasteInputs.recycled) || 0) * EMISSION_FACTORS.waste.recycle,
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

  // Clean rounding
  Object.keys(categoryTotals).forEach(k => {
    categoryTotals[k] = parseFloat(categoryTotals[k].toFixed(2));
  });

  return {
    average: parseFloat(avgTotal.toFixed(2)),
    total: parseFloat(sumTotal.toFixed(2)),
    byCategory: categoryTotals,
    history: results
  };
}
