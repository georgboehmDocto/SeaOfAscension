import { ShipState, ShipUpgrade, ShipUpgradeId } from "../types/ShipState";

export function applyShipUpgrade(
  upgrade: ShipUpgrade,
  shipState: ShipState
): Record<ShipUpgradeId, ShipUpgrade> {
  return {
    ...shipState.upgrades,
    [upgrade.id]: upgrade 
  }
}