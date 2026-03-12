import type { TiledMap, ParsedTileset } from "./types";

/**
 * Render a TiledMap to a canvas context.
 *
 * @param ctx    Canvas 2D context
 * @param map    Loaded TiledMap
 * @param x      X offset to draw at (CSS pixels)
 * @param y      Y offset to draw at (CSS pixels)
 * @param scale  Render scale (e.g. 2 = double size)
 * @param nowMs  Current time for animations
 */
export function renderTiledMap(
  ctx: CanvasRenderingContext2D,
  map: TiledMap,
  x: number,
  y: number,
  scale: number,
  nowMs: number,
) {
  ctx.imageSmoothingEnabled = false;

  const drawW = map.tileWidth * scale;
  const drawH = map.tileHeight * scale;

  for (const layer of map.layers) {
    if (!layer.visible) continue;

    for (let row = 0; row < layer.height; row++) {
      for (let col = 0; col < layer.width; col++) {
        const rawGid = layer.data[row * layer.width + col];
        if (rawGid === 0) continue; // empty tile

        // Strip flip flags (bits 29-31)
        const gid = rawGid & 0x1FFFFFFF;

        // Find which tileset this gid belongs to
        const tileset = findTileset(map.tilesets, gid);
        if (!tileset) continue;

        const localId = gid - tileset.firstGid;

        // Resolve animation frame
        const resolvedId = resolveAnimation(tileset, localId, nowMs);

        // Compute source rect in the spritesheet
        const srcCol = resolvedId % tileset.columns;
        const srcRow = Math.floor(resolvedId / tileset.columns);
        const sx = srcCol * tileset.tileWidth;
        const sy = srcRow * tileset.tileHeight;

        ctx.drawImage(
          tileset.image,
          sx, sy, tileset.tileWidth, tileset.tileHeight,
          x + col * drawW, y + row * drawH,
          drawW, drawH,
        );
      }
    }
  }
}

/** Find the tileset that owns a given global tile ID */
function findTileset(tilesets: ParsedTileset[], gid: number): ParsedTileset | null {
  // Tilesets are ordered by firstGid; pick the last one where firstGid <= gid
  let result: ParsedTileset | null = null;
  for (const ts of tilesets) {
    if (ts.firstGid <= gid) result = ts;
    else break;
  }
  return result;
}

/** Resolve a tile's animation frame for the current time */
function resolveAnimation(
  tileset: ParsedTileset,
  localId: number,
  nowMs: number,
): number {
  const anim = tileset.animations.get(localId);
  if (!anim || anim.length === 0) return localId;

  // Total animation duration
  let totalDuration = 0;
  for (const f of anim) totalDuration += f.duration;

  // Find current frame
  let elapsed = nowMs % totalDuration;
  for (const f of anim) {
    elapsed -= f.duration;
    if (elapsed < 0) return f.tileId;
  }

  return anim[anim.length - 1].tileId;
}

/**
 * Get the pixel dimensions of a TiledMap at a given scale.
 */
export function getTiledMapSize(map: TiledMap, scale: number) {
  return {
    width: map.width * map.tileWidth * scale,
    height: map.height * map.tileHeight * scale,
  };
}
