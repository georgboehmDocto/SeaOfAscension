import { ShipUpgradeId } from "../constants/shipUpgrades";
import type { ShopItemEffect } from "../island/shopItems";

export type GameAction =
  | { type: "ship/upgradePurchased"; upgradeId: ShipUpgradeId }
  | { type: "fish/collected"; goldAmount: number }
  | { type: "gem/collected" }
  | { type: "island/chestOpened"; goldReward: number; gemReward: number }
  | { type: "island/continue" }
  | { type: "rudder/clicked"; nowMs: number }
  | { type: "crabs/purchased"; quantity: number; totalCost: number }
  | {
      type: "shop/itemPurchased";
      itemId: string;
      itemName: string;
      iconPath: string;
      goldCost: number;
      effect: ShopItemEffect;
      nowMs: number;
    };
