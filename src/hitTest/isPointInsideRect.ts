import type { Point, Rect } from "./types";

export function isPointInsideRect(point: Point, rect: Rect): boolean {
  const right = rect.left + rect.width;
  const bottom = rect.top + rect.height;

  return (
    point.x >= rect.left &&
    point.x <= right &&
    point.y >= rect.top &&
    point.y <= bottom
  );
}