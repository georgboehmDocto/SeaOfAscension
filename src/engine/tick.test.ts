import { describe, it, expect } from "vitest";
import { createGameState } from "../test-utils/createGameState";
import { initialGameState } from "../types/GameState";
import { tick } from "./tick";

describe("tick", () => {
  it("returns the same state when no time has passed", () => {
    const state = createGameState({ lastTick: 1000 });
    const result = tick(state, 1000);

    expect(result).toBe(state);
  });

  it("increases distance when time has passed", () => {
    const lastTick = 0;
    const now = 10_000; // 10 seconds

    const state = createGameState({
      lastTick,
      ship: {
        base: {baseSpeed: 1},
        upgrades: { ...initialGameState.ship.upgrades},
      }
    });

    const result = tick(state, now);

    expect(result.resources.distance).toBe(10);
    // Gold is no longer earned from distance
    expect(result.resources.gold).toBe(0);
  });

  it("updates lastTick to the new timestamp", () => {
    const lastTick = 0;
    const now = 5_000;

    const state = createGameState({ lastTick });
    const result = tick(state, now);

    expect(result.lastTick).toBe(now);
  });
});
