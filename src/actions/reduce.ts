import { ISLAND_INTERVAL_METERS } from "../constants/constants";
import { getDefaultCaptainState } from "../defaults/getDefaultCaptainState";
import type { GameState } from "../types/GameState";
import type { GameAction } from "./GameAction";
import { levelUpCaptain } from "./levelUpCaptain";
import { purchaseShipUpgrade } from "./purchaseShipUpgrade";

export function reduce(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ship/upgradePurchased":
      return purchaseShipUpgrade(state, action.upgradeId);
    case "captain/levelUp":
      if (!state.captain) return state;
      return { ...state, captain: levelUpCaptain(state.captain) };
    case "captain/select": {
      const initialCaptainState = getDefaultCaptainState(action.captainId);
      return { ...state, captain: initialCaptainState, event: null };
    }
    case "fish/collected":
      return {
        ...state,
        resources: {
          ...state.resources,
          gold: state.resources.gold + action.goldAmount,
          lifeTimeGoldEarned:
            state.resources.lifeTimeGoldEarned + action.goldAmount,
        },
      };
    case "gem/collected":
      return {
        ...state,
        resources: {
          ...state.resources,
          ascendencyGems: state.resources.ascendencyGems + 1,
        },
      };
    case "island/chestOpened":
      return {
        ...state,
        resources: {
          ...state.resources,
          gold: state.resources.gold + action.goldReward,
          lifeTimeGoldEarned: state.resources.lifeTimeGoldEarned + action.goldReward,
          ascendencyGems: state.resources.ascendencyGems + action.gemReward,
        },
        island: {
          ...state.island,
          chestOpened: true,
        },
      };
    case "island/continue": {
      // Ensure next island is always ISLAND_INTERVAL_METERS ahead of current distance
      const nextIsland = Math.max(
        state.island.nextIslandAt + ISLAND_INTERVAL_METERS,
        state.resources.distance + ISLAND_INTERVAL_METERS,
      );
      return {
        ...state,
        island: {
          ...state.island,
          docked: false,
          chestOpened: false,
          islandsVisited: state.island.islandsVisited + 1,
          nextIslandAt: nextIsland,
        },
      };
    }
    default:
      return state;
  }
}
