import { ShipUpgradeId } from "../constants/shipUpgrades";
import { CaptainId } from "../types/CaptainState";
import { CrewMemberId } from "../types/CrewMember";
import type { ShopItemEffect } from "../island/shopItems";

export type GameAction =
  | { type: "ship/upgradePurchased"; upgradeId: ShipUpgradeId }
  | { type: "captain/levelUp" }
  | { type: "crew/levelUp"; crewMemberId: CrewMemberId }
  | { type: "captain/select"; captainId: CaptainId }
  | { type: "fish/collected"; goldAmount: number }
  | { type: "gem/collected" }
  | { type: "island/chestOpened"; goldReward: number; gemReward: number }
  | { type: "island/continue" }
  | { type: "rudder/clicked"; nowMs: number }
  | {
      type: "shop/itemPurchased";
      itemId: string;
      itemName: string;
      iconPath: string;
      goldCost: number;
      effect: ShopItemEffect;
      nowMs: number;
    };
