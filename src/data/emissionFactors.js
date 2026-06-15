/**
 * Carbon emission factors (in kg CO2 equivalent)
 * Sources approximate global and regional averages (EPA, DEFRA, etc.)
 */
export const EMISSION_FACTORS = {
  // Travel emissions per kilometer (kg CO2 / km)
  travel: {
    carPetrol: 0.18,      // Petrol car
    carDiesel: 0.17,      // Diesel car
    carHybrid: 0.11,      // Hybrid car
    carElectric: 0.05,    // Electric car (based on average grid mix)
    motorcycle: 0.10,     // Motorbike
    bus: 0.08,            // Public transit bus (per passenger km)
    train: 0.04,          // Rail transit (per passenger km)
    flight: 0.25,         // Air travel (per passenger km)
    bicycle: 0.00,        // Zero emission
    walking: 0.00,        // Zero emission
  },

  // Electricity usage emissions per kilowatt-hour (kg CO2 / kWh)
  electricity: {
    gridAverage: 0.38,    // Typical grid mix (varies by region, average ~0.38kg)
    renewable: 0.02,      // Solar/wind installation lifecycle emissions
  },

  // Food habits emissions per meal (kg CO2 / meal)
  food: {
    vegan: 0.35,          // Vegan meal
    vegetarian: 0.60,     // Vegetarian meal (dairy/eggs included)
    nonVegLight: 1.40,    // Light meat / fish meal
    nonVegHeavy: 2.80,    // Beef / pork heavy meal
  },

  // Waste emissions per kg (kg CO2 / kg of waste)
  waste: {
    landfill: 0.50,       // Organic & mixed waste unsorted
    recycle: 0.10,        // Sorted / recycled waste lifecycle emissions
  }
};
