import { ShipUpgradeId } from "../constants/shipUpgrades";
import { ShipUpgradeState } from "../types/ShipState";

export function getDefaultShipUpgrades(): Record<
  ShipUpgradeId,
  ShipUpgradeState
> {
  return {
    sail: {
      level: 0,
      cost: 10,
      resource: "gold",
    },
    engine: {
      level: 0,
      cost: 50,
      resource: "gold",
    },
    nets: {
      level: 0,
      cost: 100,
      resource: "gold",
    },
    refinery: {
      level: 0,
      cost: 1000,
      resource: "gold",
    },
    luckBucket: {
      level: 0,
      cost: 200,
      resource: "gold",
    },
    rudder: {
      level: 0,
      cost: 15,
      resource: "gold",
    },
  };
}
