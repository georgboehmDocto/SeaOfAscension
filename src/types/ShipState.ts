import { ShipUpgradeId } from "../constants/shipUpgrades";

export type ResourceId = "gold" | "ascendencyGems" | "distance" | "lifeTimeGoldEarned";

export type ShipBaseStats = {
  baseSpeed: number;
};

export type ShipStatsState = {
  baseSpeed: number;
  speedMultiplier: number;
}

export type ShipUpgradeState = {
  level: number;
  cost: number;
  resource: ResourceId;
};

export type ShipState = {
  base: ShipBaseStats;
  upgrades: Record<ShipUpgradeId, ShipUpgradeState>
};

export type ShipDerivedStats = ShipStatsState
