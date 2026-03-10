import type { Rect, OpaqueBounds } from "../../../../hitTest/types";
import { centeredRect } from "../../../../hitTest/rectHelpers";
import { SHIP_SCALE } from "../../../../constants/constants";
import type { SpriteSheet } from "../../../../sprites/spritesheet";

/**
 * Compute the union of all frames' opaque bounds.
 * This gives a stable rect that covers the visible pixels
 * across the entire animation cycle.
 */
function getUnionBounds(sheet: SpriteSheet): OpaqueBounds | null {
  const all = sheet.opaqueBounds;
  if (!all || all.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const b of all) {
    if (b.width === 0 || b.height === 0) continue;
    minX = Math.min(minX, b.x);
    minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.width);
    maxY = Math.max(maxY, b.y + b.height);
  }

  if (maxX <= minX || maxY <= minY) return null;

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/**
 * Returns the on-screen rect of the visible (opaque) ship pixels.
 */
export function getVisibleShipRect(
  canvas: HTMLCanvasElement,
  shipSheet: SpriteSheet
): Rect {
  const scaledFrameSize = {
    width: shipSheet.frameW * SHIP_SCALE,
    height: shipSheet.frameH * SHIP_SCALE,
  };
  const frameRect = centeredRect(canvas, scaledFrameSize);

  const bounds = getUnionBounds(shipSheet);
  if (!bounds) return frameRect;

  return {
    left: frameRect.left + bounds.x * SHIP_SCALE,
    top: frameRect.top + bounds.y * SHIP_SCALE,
    width: bounds.width * SHIP_SCALE,
    height: bounds.height * SHIP_SCALE,
  };
}

/**
 * Compute the offset needed so that the visible center of a sprite
 * aligns with a target point, rather than the frame center.
 *
 * Returns { dx, dy } in scaled (CSS) pixels to add to the frame position.
 */
export function getVisibleCenterOffset(sheet: SpriteSheet): { dx: number; dy: number } {
  const bounds = getUnionBounds(sheet);
  if (!bounds) return { dx: 0, dy: 0 };

  // Center of visible pixels in native space
  const visibleCenterX = bounds.x + bounds.width / 2;
  const visibleCenterY = bounds.y + bounds.height / 2;

  // Center of full frame in native space
  const frameCenterX = sheet.frameW / 2;
  const frameCenterY = sheet.frameH / 2;

  // How much to shift the frame so visible center aligns with target
  return {
    dx: (frameCenterX - visibleCenterX) * SHIP_SCALE,
    dy: (frameCenterY - visibleCenterY) * SHIP_SCALE,
  };
}
