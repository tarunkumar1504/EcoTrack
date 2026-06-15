/**
 * Pre-populated logs for the last 7 days to showcase historical graphs immediately.
 * Dates are calculated dynamically relative to today's date so they stay relevant.
 */

// Helper to format date relative to today
const getRelativeDateString = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const INITIAL_LOGS = [
  {
    id: 'log-7',
    date: getRelativeDateString(7),
    inputs: {
      travel: {
        carPetrol: 45,     // Drove 45 km in petrol car
        carDiesel: 0,
        carHybrid: 0,
        carElectric: 0,
        motorcycle: 0,
        bus: 0,
        train: 0,
        flight: 0,
      },
      electricity: {
        kwh: 12,           // 12 kWh grid electricity
        renewableKwh: 0,
      },
      food: {
        vegan: 0,
        vegetarian: 1,     // 1 vegetarian meal
        nonVegLight: 1,    // 1 chicken meal
        nonVegHeavy: 1,    // 1 beef meal
      },
      waste: {
        landfill: 4.5,     // 4.5 kg trash
        recycled: 1.2,     // 1.2 kg recycled
      }
    }
  },
  {
    id: 'log-6',
    date: getRelativeDateString(6),
    inputs: {
      travel: {
        carPetrol: 0,
        carDiesel: 0,
        carHybrid: 0,
        carElectric: 0,
        motorcycle: 0,
        bus: 15,           // Commuted 15 km by bus
        train: 0,
        flight: 0,
      },
      electricity: {
        kwh: 9,
        renewableKwh: 2,   // Mixed source energy
      },
      food: {
        vegan: 1,
        vegetarian: 2,     // Fully vegetarian/vegan day
        nonVegLight: 0,
        nonVegHeavy: 0,
      },
      waste: {
        landfill: 2.0,
        recycled: 3.5,     // High recycling rate
      }
    }
  },
  {
    id: 'log-5',
    date: getRelativeDateString(5),
    inputs: {
      travel: {
        carPetrol: 20,
        carDiesel: 0,
        carHybrid: 0,
        carElectric: 0,
        motorcycle: 0,
        bus: 0,
        train: 0,
        flight: 0,
      },
      electricity: {
        kwh: 15,           // Laundry day, higher usage
        renewableKwh: 0,
      },
      food: {
        vegan: 0,
        vegetarian: 0,
        nonVegLight: 2,
        nonVegHeavy: 1,
      },
      waste: {
        landfill: 3.8,
        recycled: 1.0,
      }
    }
  },
  {
    id: 'log-4',
    date: getRelativeDateString(4),
    inputs: {
      travel: {
        carPetrol: 0,
        carDiesel: 0,
        carHybrid: 0,
        carElectric: 15,   // Drove electric car
        motorcycle: 0,
        bus: 0,
        train: 40,         // Took the train for 40 km
        flight: 0,
      },
      electricity: {
        kwh: 7,
        renewableKwh: 5,
      },
      food: {
        vegan: 2,
        vegetarian: 1,
        nonVegLight: 0,
        nonVegHeavy: 0,
      },
      waste: {
        landfill: 1.5,
        recycled: 2.8,
      }
    }
  },
  {
    id: 'log-3',
    date: getRelativeDateString(3),
    inputs: {
      travel: {
        carPetrol: 0,
        carDiesel: 0,
        carHybrid: 0,
        carElectric: 0,
        motorcycle: 0,
        bus: 0,
        train: 0,
        flight: 350,       // Took a short domestic flight (350 km)
      },
      electricity: {
        kwh: 10,
        renewableKwh: 0,
      },
      food: {
        vegan: 0,
        vegetarian: 1,
        nonVegLight: 2,
        nonVegHeavy: 0,
      },
      waste: {
        landfill: 5.0,
        recycled: 1.5,
      }
    }
  },
  {
    id: 'log-2',
    date: getRelativeDateString(2),
    inputs: {
      travel: {
        carPetrol: 15,
        carDiesel: 0,
        carHybrid: 10,
        carElectric: 0,
        motorcycle: 0,
        bus: 5,
        train: 0,
        flight: 0,
      },
      electricity: {
        kwh: 8,
        renewableKwh: 4,
      },
      food: {
        vegan: 1,
        vegetarian: 1,
        nonVegLight: 1,
        nonVegHeavy: 0,
      },
      waste: {
        landfill: 2.2,
        recycled: 2.2,
      }
    }
  },
  {
    id: 'log-1',
    date: getRelativeDateString(1),
    inputs: {
      travel: {
        carPetrol: 0,
        carDiesel: 0,
        carHybrid: 0,
        carElectric: 0,
        motorcycle: 0,
        bus: 0,
        train: 0,
        flight: 0,
        walking: 3,        // Active travel
        bicycle: 5,
      },
      electricity: {
        kwh: 5,
        renewableKwh: 8,   // High green energy usage
      },
      food: {
        vegan: 3,          // Strictly vegan day!
        vegetarian: 0,
        nonVegLight: 0,
        nonVegHeavy: 0,
      },
      waste: {
        landfill: 0.8,
        recycled: 4.0,
      }
    }
  }
];
