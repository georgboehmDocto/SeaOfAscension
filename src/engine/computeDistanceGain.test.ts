import { describe, it, expect } from "vitest";
import { computeDistanceGain } from "./computeDistanceGain";

describe("computeDistanceGain", () => {
  it("computes distance as baseSpeed * speedMultiplier * deltaSeconds", () => {
    const gain = computeDistanceGain(
      { baseSpeed: 2, speedMultiplier: 1.5 },
      10,
    );
    expect(gain).toBeCloseTo(30);
  });

  it("returns 0 when baseSpeed is 0", () => {
    const gain = computeDistanceGain({ baseSpeed: 0, speedMultiplier: 2 }, 10);
    expect(gain).toBe(0);
  });

  it("returns 0 when delta is 0", () => {
    const gain = computeDistanceGain({ baseSpeed: 5, speedMultiplier: 1 }, 0);
    expect(gain).toBe(0);
  });
});
