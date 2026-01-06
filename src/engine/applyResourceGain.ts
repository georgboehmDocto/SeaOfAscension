import { Resources, ResourceGain } from "../types/Resources";

export function applyResourceGain(
  resources: Resources,
  gain: ResourceGain
): Resources {

  return {
    gold: resources.gold + gain.gold,
    lifeTimeGoldEarned: resources.lifeTimeGoldEarned + gain.lifeTimeGoldEarned,
    ascendencyGems: resources.ascendencyGems + gain.ascendencyGems,
    distance: resources.distance + gain.distance,
  };
}