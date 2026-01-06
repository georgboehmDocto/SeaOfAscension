import { Resources } from "../types/Resources";

export function getDefaultResources(): Resources {
  return {
    gold: 0,
    ascendencyGems: 0,
    distance: 0,
    lifeTimeGoldEarned: 0,
  };
}
