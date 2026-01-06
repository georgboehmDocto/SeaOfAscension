// hitTest/getCssPointFromMouseEvent.ts
import type { Point } from "./types";

export function getCssPointFromMouseEvent(e: MouseEvent, canvas: HTMLCanvasElement): Point {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
