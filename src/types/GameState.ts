import { getDefaultResources } from "../defaults/getDefaultResources";
import { getDefaultShipUpgrades } from "../defaults/getDefaultShipUpgrades";
import { IslandState, getDefaultIslandState } from "./IslandState";
import { Resources } from "./Resources";
import { ShipState } from "./ShipState";
import { ActiveEffect } from "./ActiveEffect";

export type GameState = {
  version: number;
  resources: Resources;
  ship: ShipState;
  lastTick: number; // milliseconds
  island: IslandState;
  activeEffects: ActiveEffect[];
  crabs: number;
};

export const initialGameState: GameState = {
  version: 1,
  lastTick: Date.now(),
  resources: getDefaultResources(),
  ship: {
    base: { baseSpeed: 0 },
    upgrades: getDefaultShipUpgrades(),
  },
  island: getDefaultIslandState(),
  activeEffects: [],
  crabs: 0,
};
