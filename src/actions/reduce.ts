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
    case "captain/select":
      const initialCaptainState = getDefaultCaptainState(action.captainId)
      return {...state, captain: initialCaptainState, event: null}
    default: {
      return state;
    }
  }
}
