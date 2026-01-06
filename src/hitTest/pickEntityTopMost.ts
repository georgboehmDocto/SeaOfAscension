import { isPointInsideRect } from "./isPointInsideRect";
import type { Point } from "./types";
import type { Entity } from "../ui/canvas/entities/types";
import type { GameState } from "../types/GameState"

export function pickEntityTopMost(args: {
  point: Point;
  entities: Entity[];
  canvas: HTMLCanvasElement;
  state: GameState;
  nowMs: number;
}): Entity | null {
  const { point, entities, canvas, state, nowMs } = args;

  let best: Entity | null = null;

  for (const ent of entities) {
    const rect = ent.getPickRect({ canvas, state, nowMs });
    if (!isPointInsideRect(point, rect)) continue;

    if (!best || ent.zIndex >= best.zIndex) best = ent;
  }

  return best;
}