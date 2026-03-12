import { ISLAND_INTERVAL_METERS } from "../constants/constants";

export type IslandState = {
  /** Distance at which the next island spawns */
  nextIslandAt: number;
  /** Whether the ship is currently stopped at an island */
  docked: boolean;
  /** Whether the chest on the current island has been opened */
  chestOpened: boolean;
  /** Total islands visited (for scaling rewards later) */
  islandsVisited: number;
};

export function getDefaultIslandState(): IslandState {
  return {
    nextIslandAt: ISLAND_INTERVAL_METERS,
    docked: false,
    chestOpened: false,
    islandsVisited: 0,
  };
}
