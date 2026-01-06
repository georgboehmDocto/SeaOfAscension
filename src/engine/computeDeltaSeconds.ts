import { MAX_ALLOWED_DELTA_SECONDS } from "../constants/constants";

export function computeDeltaSeconds(previousMs: number, currentMs: number): number {
  if (currentMs <= previousMs) return 0;

  const deltaMs = currentMs - previousMs;
  const deltaSeconds = deltaMs / 1000;

  return Math.min(deltaSeconds, MAX_ALLOWED_DELTA_SECONDS);
}