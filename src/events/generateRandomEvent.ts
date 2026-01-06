import { GameEvent } from "./GameEvent";

const SPAWN_RATE_PER_SEC = 1 / 10;

export function generateRandomEvent(args: {
  eventOngoing: boolean;
  canvas: HTMLCanvasElement;
  fishImgCount: number;
  nowMs: number;
}): GameEvent | null {
  const { eventOngoing, canvas, fishImgCount, nowMs } = args;
  if (eventOngoing) return null;

  // Poisson process approximation
  const p = SPAWN_RATE_PER_SEC;
  if (Math.random() >= p) return null;

  const css = canvas.getBoundingClientRect();
  const fishVariant = Math.floor(Math.random() * fishImgCount);

  return {
    id: "spawn",
    fishVariant,
    x: 100,
    y: css.height - 32,
    spawnedAt: nowMs,
    lifetimeMs: 5000,
  };
}
