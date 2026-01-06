import { GameState, initialGameState } from "../types/GameState";

export function createGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...initialGameState,
    ...overrides,
    resources: {
      ...initialGameState.resources,
      ...(overrides.resources ?? {}),
    },
    ship: {
      ...initialGameState.ship,
      ...(overrides.ship ?? {}),
      base: {
        ...initialGameState.ship.base,
        ...(overrides.ship?.base ?? {}),
      },
      upgrades: {
        ...initialGameState.ship.upgrades,
        ...(overrides.ship?.upgrades ?? {}),
      },
    },
  };
}
