import { describe, it, expect } from 'vitest';

import {
  calculateDailyEmissions,
  calculateAggregates,
  calculateSustainabilityScore,
} from '../src/utils/calculations';

describe('carbon footprint calculations', () => {
  it('calculates transport emissions using the factor table', () => {
    const result = calculateDailyEmissions({
      travel: { carPetrol: 2, bus: 1, flight: 1 },
      electricity: {},
      food: {},
      waste: {},
    });

    expect(result.breakdown.travel).toBeCloseTo(2 * 0.18 + 1 * 0.08 + 1 * 0.25, 2);
  });

  it('calculates electricity and food emissions separately', () => {
    const result = calculateDailyEmissions({
      travel: {},
      electricity: { kwh: 2, renewableKwh: 1 },
      food: { vegan: 2, vegetarian: 1, nonVegLight: 1 },
      waste: {},
    });

    expect(result.breakdown.electricity).toBeCloseTo(2 * 0.38 + 1 * 0.02, 2);
    expect(result.breakdown.food).toBeCloseTo(2 * 0.35 + 1 * 0.60 + 1 * 1.40, 2);
  });

  it('calculates transport, energy, food, and waste emissions accurately', () => {
    const result = calculateDailyEmissions({
      travel: { carPetrol: 10, bus: 5 },
      electricity: { kwh: 20, renewableKwh: 5 },
      food: { vegan: 1, nonVegHeavy: 1 },
      waste: { landfill: 2, recycled: 1 },
    });

    expect(result.total).toBeCloseTo(14.15, 2);
    expect(result.breakdown.travel).toBeCloseTo(2.2, 2);
    expect(result.breakdown.electricity).toBeCloseTo(7.7, 2);
    expect(result.breakdown.food).toBeCloseTo(3.15, 2);
    expect(result.breakdown.waste).toBeCloseTo(1.1, 2);
  });

  it('aggregates historical logs for analytics summaries', () => {
    const result = calculateAggregates([
      { date: '2026-06-10', inputs: { travel: { carPetrol: 1 }, electricity: { kwh: 1 }, food: { vegan: 1 }, waste: { landfill: 1 } } },
      { date: '2026-06-11', inputs: { travel: { bus: 2 }, electricity: { renewableKwh: 1 }, food: { vegetarian: 1 }, waste: { recycled: 1 } } },
    ]);

    expect(result.total).toBeGreaterThan(0);
    expect(result.average).toBeGreaterThan(0);
    expect(result.byCategory.travel).toBeGreaterThanOrEqual(0);
    expect(result.byCategory.electricity).toBeGreaterThanOrEqual(0);
    expect(result.byCategory.food).toBeGreaterThanOrEqual(0);
    expect(result.byCategory.waste).toBeGreaterThanOrEqual(0);
    expect(result.history).toHaveLength(2);
  });

  it('computes a sustainability score from the current footprint and target', () => {
    expect(calculateSustainabilityScore(3.2, 12)).toBeCloseTo(73.3, 1);
    expect(calculateSustainabilityScore(0, 12)).toBe(100);
    expect(calculateSustainabilityScore(30, 12)).toBe(0);
  });
});
