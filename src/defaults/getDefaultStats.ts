import { CrewMemberStats } from "../types/CrewMember";

export function getDefaultStats(): CrewMemberStats {
    return {
      vitality: 1,
      strength: 1,
      magic: 1,
      precision: 1,
    }
}