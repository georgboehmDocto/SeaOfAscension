import { BASE_RUDDER_DISTANCE, ISLAND_INTERVAL_METERS } from "../constants/constants";
import { getActiveRudderBoost } from "../economy/getActiveEffectModifiers";
import type { GameState } from "../types/GameState";
import type { GameAction } from "./GameAction";
import { purchaseShipUpgrade } from "./purchaseShipUpgrade";
import { getIslandType } from "../types/IslandState";

export function reduce(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ship/upgradePurchased":
      return purchaseShipUpgrade(state, action.upgradeId);
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
    case "rudder/clicked": {
      if (state.island.docked) return state;
      const rudderLevel = state.ship.upgrades.rudder?.level ?? 0;
      const baseDistPerClick = BASE_RUDDER_DISTANCE + rudderLevel * 0.5;
      const rudderMult = getActiveRudderBoost(state.activeEffects ?? [], action.nowMs);
      const distPerClick = baseDistPerClick * rudderMult;
      const newDist = state.resources.distance + distPerClick;
      const hitIsland = newDist >= state.island.nextIslandAt;
      return {
        ...state,
        resources: {
          ...state.resources,
          distance: hitIsland ? state.island.nextIslandAt : newDist,
        },
        island: hitIsland
          ? { ...state.island, docked: true, chestOpened: false, shopItemPurchased: false }
          : state.island,
      };
    }
    case "crabs/purchased":
      return {
        ...state,
        resources: {
          ...state.resources,
          gold: state.resources.gold - action.totalCost,
        },
        crabs: (state.crabs ?? 0) + action.quantity,
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
      const nextVisited = state.island.islandsVisited + 1;
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
          shopItemPurchased: false,
          purchasedShopItemId: null,
          shopItemIds: null,
          islandsVisited: nextVisited,
          nextIslandAt: nextIsland,
          islandType: getIslandType(nextVisited),
        },
      };
    }
    case "shop/itemPurchased": {
      const effect = action.effect;
      const nowMs = action.nowMs;
      let newResources = { ...state.resources };
      let newEffects = [...(state.activeEffects ?? [])];

      // Deduct gold cost
      newResources.gold -= action.goldCost;

      if (effect.type === "exchange") {
        if (effect.give === "gold") {
          newResources.gold -= effect.giveAmount;
          newResources.ascendencyGems += effect.receiveAmount;
        } else {
          newResources.ascendencyGems -= effect.giveAmount;
          newResources.gold += effect.receiveAmount;
          newResources.lifeTimeGoldEarned += effect.receiveAmount;
        }
      } else if (effect.type === "timedBuff") {
        newEffects.push({
          id: `${action.itemId}-${nowMs}`,
          kind: effect.buffKind,
          magnitude: effect.magnitude,
          startMs: nowMs,
          durationMs: effect.durationMs,
          name: action.itemName,
          iconPath: action.iconPath,
        });
      }

      return {
        ...state,
        resources: newResources,
        activeEffects: newEffects,
        island: {
          ...state.island,
          shopItemPurchased: true,
          purchasedShopItemId: action.itemId,
        },
      };
    }
    default:
      return state;
  }
}
