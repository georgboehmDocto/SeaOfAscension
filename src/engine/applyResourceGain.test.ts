import { describe, it, expect } from "vitest";
import { applyResourceGain } from "./applyResourceGain";
import type { Resources, ResourceGain } from "../types/Resources";

describe("applyResourceGain", () => {
  const baseResources: Resources = {
    gold: 100,
    lifeTimeGoldEarned: 1000,
    ascendencyGems: 2,
    distance: 500,
  };

  it("adds all gains to the existing resources", () => {
    const gain: ResourceGain = {
      gold: 50,
      lifeTimeGoldEarned: 50,
      ascendencyGems: 1,
      distance: 25,
    };

    const updated = applyResourceGain(baseResources, gain);

    expect(updated.gold).toBe(150);
    expect(updated.lifeTimeGoldEarned).toBe(1050);
    expect(updated.ascendencyGems).toBe(3);
    expect(updated.distance).toBe(525);
  });

  it("does not mutate the original resources object", () => {
    const gain: ResourceGain = {
      gold: 10,
      lifeTimeGoldEarned: 10,
      ascendencyGems: 0,
      distance: 0,
    };

    const snapshot = { ...baseResources };
    applyResourceGain(baseResources, gain);

    expect(baseResources).toEqual(snapshot);
  });
});
