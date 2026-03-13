import { EconomyStats } from "../types/EconomyStats";

/** Compute distance gained this tick from ship speed stats */
export function computeDistanceGain(
  shipStats: EconomyStats,
  deltaInSeconds: number
): number {
  const speed = shipStats.baseSpeed * shipStats.speedMultiplier;
  return speed * deltaInSeconds;
}
