import {expect, it, describe} from 'vitest'
import { computeDeltaSeconds } from './computeDeltaSeconds';
import { MAX_ALLOWED_DELTA_SECONDS } from '../constants/constants';

describe("computeDeltaSeconds", () => {
  it("returns 0 when current time is equal to previous", () => {
    const previous = 1000
    const current = 1000

    expect(computeDeltaSeconds(previous, current)).toBe(0)
  });

  it("returns 0 when current time is before previous", () => {
    const previous = 2000
    const current = 1000

    expect(computeDeltaSeconds(previous, current)).toBe(0)
  });

  it("returns the delta in seconds when time moves forward", () => {
    const previous = 1000
    const current = 2000

    expect(computeDeltaSeconds(previous, current)).toBe(1)
  });

  it("clamps large deltas to the maximum allowed seconds", () => {
    const previous = 1000
    const current = 30000000

    expect(computeDeltaSeconds(previous, current)).toBe(MAX_ALLOWED_DELTA_SECONDS)
  });
});