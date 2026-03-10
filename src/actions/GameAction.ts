import { ShipUpgradeId } from "../constants/shipUpgrades";
import { CaptainId } from "../types/CaptainState";
import { CrewMemberId } from "../types/CrewMember";

export type GameAction =
  | { type: "ship/upgradePurchased"; upgradeId: ShipUpgradeId }
  | { type: "captain/levelUp" }
  | { type: "crew/levelUp"; crewMemberId: CrewMemberId }
  | { type: "captain/select"; captainId: CaptainId }
  | { type: "fish/collected"; goldAmount: number }
  | { type: "gem/collected" };
