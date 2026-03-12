import type { Entity } from "../types";
import type { SpriteSheet } from "../../../../sprites/spritesheet";
import type { TiledMap } from "../../../../tmx/types";
import {
  renderTiledMap,
  getTiledMapSize,
} from "../../../../tmx/renderTiledMap";
import { rectAt } from "../../../../hitTest/rectHelpers";

const CHEST_DISPLAY_SIZE = 96;
const CHEST_ANIM_FRAME_MS = 100;
const ISLAND_SCALE = 1;
const SLIDE_DURATION_MS = 1500;

export type IslandAnimState = {
  animStartMs: number | null;
  animComplete: boolean;
  slideStartMs: number | null;
  slideOutStartMs: number | null;
};

/** Which side the next island appears on */
export function getIslandSide(islandsVisited: number): "left" | "right" {
  return islandsVisited % 2 === 0 ? "right" : "left";
}

export function createIslandEntity(opts: {
  islandMap: TiledMap;
  chestSheet: SpriteSheet;
  chestEmptySheet: SpriteSheet;
  animState: IslandAnimState;
}): Entity {
  const anim = opts.animState;
  const mapSize = getTiledMapSize(opts.islandMap, ISLAND_SCALE);

  /** Returns 0 (offscreen) to 1 (fully in) */
  function getSlideInProgress(nowMs: number): number {
    if (anim.slideStartMs === null) return 0;
    const elapsed = nowMs - anim.slideStartMs;
    const t = Math.min(elapsed / SLIDE_DURATION_MS, 1);
    return t * (2 - t); // ease-out quad
  }

  /** Returns 0 (still docked) to 1 (fully offscreen) */
  function getSlideOutProgress(nowMs: number): number {
    if (anim.slideOutStartMs === null) return 0;
    const elapsed = nowMs - anim.slideOutStartMs;
    const t = Math.min(elapsed / SLIDE_DURATION_MS, 1);
    return t * t; // ease-in quad
  }

  function getEffectiveProgress(nowMs: number): number {
    if (anim.slideOutStartMs !== null) {
      // Sliding out: go from 1 back to 0
      return 1 - getSlideOutProgress(nowMs);
    }
    return getSlideInProgress(nowMs);
  }

  function getIslandX(
    canvas: HTMLCanvasElement,
    side: "left" | "right",
    progress: number,
  ) {
    const css = canvas.getBoundingClientRect();
    if (side === "left") {
      const fullyOff = -mapSize.width;
      const finalX = -mapSize.width * 0.3;
      return fullyOff + (finalX - fullyOff) * progress;
    } else {
      const fullyOff = css.width;
      const finalX = css.width - mapSize.width * 0.7;
      return fullyOff + (finalX - fullyOff) * progress;
    }
  }

  function getIslandY(canvas: HTMLCanvasElement) {
    const css = canvas.getBoundingClientRect();
    return css.height / 2 - mapSize.height / 2;
  }

  function getChestPos(
    canvas: HTMLCanvasElement,
    side: "left" | "right",
    progress: number,
  ) {
    const ix = getIslandX(canvas, side, progress);
    const iy = getIslandY(canvas);
    // Place chest more toward the visible center of the island
    const cx = side === "left"
      ? ix + mapSize.width * 0.55
      : ix + mapSize.width * 0.45;
    const cy = iy + mapSize.height * 0.35;
    return { x: cx - CHEST_DISPLAY_SIZE / 2, y: cy - CHEST_DISPLAY_SIZE / 2 };
  }

  return {
    id: "island",
    zIndex: 3,
    cursor: "pointer",
    tooltip: "Treasure Island - Click the chest!",

    getPickRect: ({ canvas, state, nowMs }) => {
      if (!state.island.docked) {
        return rectAt(-9999, -9999, { width: 0, height: 0 });
      }
      if (anim.slideOutStartMs !== null) {
        return rectAt(-9999, -9999, { width: 0, height: 0 });
      }
      const side = getIslandSide(state.island.islandsVisited);
      const progress = getEffectiveProgress(nowMs);
      if (progress < 0.9) {
        return rectAt(-9999, -9999, { width: 0, height: 0 });
      }
      const chest = getChestPos(canvas, side, progress);
      return rectAt(chest.x, chest.y, {
        width: CHEST_DISPLAY_SIZE,
        height: CHEST_DISPLAY_SIZE,
      });
    },

    draw: ({ ctx, canvas, state, nowMs }) => {
      // Still drawing during slide-out even though docked may be false
      const isSliding = anim.slideOutStartMs !== null && getSlideOutProgress(nowMs) < 1;
      if (!state.island.docked && !isSliding) return;

      if (anim.slideStartMs === null) {
        anim.slideStartMs = nowMs;
      }

      const side = getIslandSide(
        // During slide-out, use the same side as the island that just left
        isSliding && !state.island.docked
          ? state.island.islandsVisited - 1
          : state.island.islandsVisited,
      );
      const progress = getEffectiveProgress(nowMs);
      const ix = getIslandX(canvas, side, progress);
      const iy = getIslandY(canvas);

      renderTiledMap(ctx, opts.islandMap, ix, iy, ISLAND_SCALE, nowMs);

      const chest = getChestPos(canvas, side, progress);
      ctx.imageSmoothingEnabled = false;

      if (state.island.chestOpened || isSliding) {
        const lastFrame = opts.chestEmptySheet.frameCount! - 1;
        const col = lastFrame % opts.chestEmptySheet.cols;
        const row = Math.floor(lastFrame / opts.chestEmptySheet.cols);
        ctx.drawImage(
          opts.chestEmptySheet.img,
          col * opts.chestEmptySheet.frameW,
          row * opts.chestEmptySheet.frameH,
          opts.chestEmptySheet.frameW,
          opts.chestEmptySheet.frameH,
          chest.x,
          chest.y,
          CHEST_DISPLAY_SIZE,
          CHEST_DISPLAY_SIZE,
        );
      } else if (anim.animStartMs !== null) {
        const elapsed = nowMs - anim.animStartMs;
        const frameIdx = Math.min(
          Math.floor(elapsed / CHEST_ANIM_FRAME_MS),
          opts.chestSheet.frameCount! - 1,
        );
        const col = frameIdx % opts.chestSheet.cols;
        const row = Math.floor(frameIdx / opts.chestSheet.cols);
        ctx.drawImage(
          opts.chestSheet.img,
          col * opts.chestSheet.frameW,
          row * opts.chestSheet.frameH,
          opts.chestSheet.frameW,
          opts.chestSheet.frameH,
          chest.x,
          chest.y,
          CHEST_DISPLAY_SIZE,
          CHEST_DISPLAY_SIZE,
        );

        if (frameIdx >= opts.chestSheet.frameCount! - 1) {
          anim.animComplete = true;
        }
      } else {
        ctx.drawImage(
          opts.chestSheet.img,
          0,
          0,
          opts.chestSheet.frameW,
          opts.chestSheet.frameH,
          chest.x,
          chest.y,
          CHEST_DISPLAY_SIZE,
          CHEST_DISPLAY_SIZE,
        );
      }
    },

    onClick: (_state, nowMs) => {
      if (!_state.island.docked) return null;
      if (_state.island.chestOpened) return null;

      if (anim.animStartMs === null) {
        anim.animStartMs = nowMs;
      }

      return null;
    },
  };
}
