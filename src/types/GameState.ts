import { BattleState } from "..";
import { getDefaultResources } from "../defaults/getDefaultResources";
import { getDefaultShipUpgrades } from "../defaults/getDefaultShipUpgrades";
import { GameEvent } from "../events/GameEvent";
import { CaptainState } from "./CaptainState";
import { CrewMemberId, CrewMemberState } from "./CrewMember";
import { Resources } from "./Resources";
import { ShipState } from "./ShipState";

export type GameState = {
  version: number;
  resources: Resources;
  ship: ShipState;
  captain: CaptainState | null;
  battle: BattleState;
  event: GameEvent | null;
  lastTick: number; // milliseconds
  crew?: Record<CrewMemberId, CrewMemberState>;
};

export const initialGameState: GameState = {
  version: 1,
  lastTick: Date.now(),
  resources: getDefaultResources(),
  ship: {
    base: { baseSpeed: 1 },
    upgrades: getDefaultShipUpgrades(),
  },
  captain: null,
  battle: {} as BattleState, // Not yet implemented
  event: null // TODO
  // {
  //   type: "selectCaptain",
  //   options: ["black_beard", "joy_girl", "gwendolin"],
  // },
};
