import { ShipUpgradeId } from "../constants/shipUpgrades";
import type { ShipState, ShipUpgradeState } from "../types/ShipState";

export function applyShipUpgrade(
  upgradeId: ShipUpgradeId,
  upgrade: ShipUpgradeState,
  shipState: ShipState
): Record<ShipUpgradeId, ShipUpgradeState> {
  return {
    ...shipState.upgrades,
    [upgradeId]: upgrade,
  };
}
