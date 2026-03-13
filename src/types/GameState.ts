import { BattleState } from "..";
import { getDefaultResources } from "../defaults/getDefaultResources";
import { getDefaultShipUpgrades } from "../defaults/getDefaultShipUpgrades";
import { GameEvent } from "../events/GameEvent";
import { CaptainState } from "./CaptainState";
import { CrewMemberId, CrewMemberState } from "./CrewMember";
import { IslandState, getDefaultIslandState } from "./IslandState";
import { Resources } from "./Resources";
import { ShipState } from "./ShipState";
import { ActiveEffect } from "./ActiveEffect";

export type GameState = {
  version: number;
  resources: Resources;
  ship: ShipState;
  captain: CaptainState | null;
  battle: BattleState;
  event: GameEvent | null;
  lastTick: number; // milliseconds
  crew?: Record<CrewMemberId, CrewMemberState>;
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
  captain: null,
  battle: {} as BattleState, // Not yet implemented
  event: null,
  island: getDefaultIslandState(),
  activeEffects: [],
  crabs: 0,
};
