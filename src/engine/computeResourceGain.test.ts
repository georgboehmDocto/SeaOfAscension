import { describe, it, expect } from "vitest";
import { computeResourceGain } from "./computeResourceGain";
import { ASCENDENCY_GEM_THRESHOLD } from "../constants/constants";
import { ShipStatsState } from "../types/ShipState";

describe("computeResourceGain", () => {
  const baseShipStats: ShipStatsState = {
    baseSpeed: 1,
    speedMultiplier: 1,
    goldPerMeter: 1,
    goldMultiplier: 1,
  };

  it("computes distance as baseSpeed * speedMultiplier * deltaSeconds", () => {
    const shipStats = { ...baseShipStats, baseSpeed: 2, speedMultiplier: 1.5 };
    const deltaSeconds = 10;

    const gain = computeResourceGain(shipStats, 0, deltaSeconds);

    // distance = 2 * 1.5 * 10 = 30
    expect(gain.distance).toBeCloseTo(30);
  });

  it("computes gold from distance, goldPerMeter and goldMultiplier", () => {
    const shipStats = {
      ...baseShipStats,
      baseSpeed: 1,
      speedMultiplier: 1,
      goldPerMeter: 2,
      goldMultiplier: 3,
    };
    const deltaSeconds = 5; // distance = 1 * 1 * 5 = 5m

    const gain = computeResourceGain(shipStats, 0, deltaSeconds);

    // goldGain = 5m * (2 * 3) = 30
    expect(gain.gold).toBeCloseTo(30);
    expect(gain.lifeTimeGoldEarned).toBeCloseTo(30);
  });

  it("does not award ascendency gems if lifetime gold stays below threshold", () => {
    const threshold = ASCENDENCY_GEM_THRESHOLD;

    const shipStats = {
      ...baseShipStats,
      baseSpeed: 1,
      speedMultiplier: 1,
      goldPerMeter: threshold - 1,
      goldMultiplier: 1,
    };
    const deltaSeconds = 1; // goldGain = threshold - 1

    const gain = computeResourceGain(shipStats, 0, deltaSeconds);

    expect(gain.ascendencyGems).toBe(0);
  });

  it("awards ascendency gems when lifetime gold crosses the threshold", () => {
    const threshold = ASCENDENCY_GEM_THRESHOLD;

    const shipStats = {
      ...baseShipStats,
      baseSpeed: 1,
      speedMultiplier: 1,
      goldPerMeter: threshold,
      goldMultiplier: 1,
    };
    const deltaSeconds = 1; // goldGain = threshold

    const gain = computeResourceGain(shipStats, 0, deltaSeconds);

    // 0 -> threshold => 1 gem
    expect(gain.ascendencyGems).toBe(1);
  });

  it("can award multiple gems if multiple thresholds are crossed at once", () => {
    const threshold = ASCENDENCY_GEM_THRESHOLD;

    const shipStats = {
      ...baseShipStats,
      baseSpeed: 1,
      speedMultiplier: 1,
      goldPerMeter: threshold * 3,
      goldMultiplier: 1,
    };
    const deltaSeconds = 1; // goldGain = 3 * threshold

    const gain = computeResourceGain(shipStats, 0, deltaSeconds);

    expect(gain.ascendencyGems).toBe(3);
  });
});
