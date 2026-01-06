import { ASCENDENCY_GEM_THRESHOLD } from "../constants/constants";
import { EconomyStats } from "../types/EconomyStats";
import { ResourceGain } from "../types/Resources";
import { ShipDerivedStats } from "../types/ShipState";

export function computeResourceGain(
  shipStats: EconomyStats,
  lifeTimeGoldEarned: number,
  deltaInSeconds: number
): ResourceGain {
  const distanceGain = computeDistanceGain(shipStats, deltaInSeconds);
  const goldGain = computeGoldGain(
    distanceGain,
    shipStats.goldMultiplier,
    shipStats.goldPerMeter
  );
  const ascendencyGemsGain = computeAscendencyGemsGain(
    goldGain,
    lifeTimeGoldEarned
  );

  return {
    gold: goldGain,
    lifeTimeGoldEarned: goldGain,
    ascendencyGems: ascendencyGemsGain,
    distance: distanceGain,
  };
}

function computeDistanceGain(
  shipStats: ShipDerivedStats,
  deltaInSeconds: number
) {
  const baseSpeed = shipStats.baseSpeed;
  const speedMultipler = shipStats.speedMultiplier;

  const speed = baseSpeed * speedMultipler;
  const distanceGained = speed * deltaInSeconds;

  return distanceGained;
}

function computeGoldGain(
  distanceGain: number,
  goldMultiplier: number,
  goldPerMeter: number
) {
  const goldEarnedPerMeter = goldPerMeter * goldMultiplier;
  const goldGain = distanceGain * goldEarnedPerMeter;

  return goldGain;
}

function computeAscendencyGemsGain(
  goldGain: number,
  lifeTimeGoldEarned: number
) {
  const previousGemTotal = Math.floor(
    lifeTimeGoldEarned / ASCENDENCY_GEM_THRESHOLD
  );

  const newLifeTimeGoldEarned = lifeTimeGoldEarned + goldGain;
  const newGemTotal = Math.floor(
    newLifeTimeGoldEarned / ASCENDENCY_GEM_THRESHOLD
  );

  return newGemTotal - previousGemTotal;
}
