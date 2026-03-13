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
export const SLIDE_DURATION_MS = 1500;

export type IslandAnimState = {
  animStartMs: number | null;
  animComplete: boolean;
  slideStartMs: number | null;
  slideOutStartMs: number | null;
  /** Set true when loading into a docked state (skip slide-in) */
  skipSlideIn: boolean;
};

/** Which side the next island appears on */
export function getIslandSide(islandsVisited: number): "left" | "right" {
  return islandsVisited % 2 === 0 ? "right" : "left";
}

export function getIslandX(
  canvas: HTMLCanvasElement,
  mapWidth: number,
  side: "left" | "right",
  progress: number,
) {
  const css = canvas.getBoundingClientRect();
  if (side === "left") {
    const fullyOff = -mapWidth;
    const finalX = -mapWidth * 0.3;
    return fullyOff + (finalX - fullyOff) * progress;
  } else {
    const fullyOff = css.width;
    const finalX = css.width - mapWidth * 0.7;
    return fullyOff + (finalX - fullyOff) * progress;
  }
}

export function getIslandY(canvas: HTMLCanvasElement, mapHeight: number) {
  const css = canvas.getBoundingClientRect();
  return css.height / 2 - mapHeight / 2;
}

/** Returns 0 (offscreen) to 1 (fully in) */
export function getSlideInProgress(anim: IslandAnimState, nowMs: number): number {
  if (anim.skipSlideIn) return 1;
  if (anim.slideStartMs === null) return 0;
  const elapsed = nowMs - anim.slideStartMs;
  const t = Math.min(elapsed / SLIDE_DURATION_MS, 1);
  return t * (2 - t); // ease-out quad
}

/** Returns 0 (still docked) to 1 (fully offscreen) */
export function getSlideOutProgress(anim: IslandAnimState, nowMs: number): number {
  if (anim.slideOutStartMs === null) return 0;
  const elapsed = nowMs - anim.slideOutStartMs;
  const t = Math.min(elapsed / SLIDE_DURATION_MS, 1);
  return t * t; // ease-in quad
}

export function getEffectiveProgress(anim: IslandAnimState, nowMs: number): number {
  if (anim.slideOutStartMs !== null) {
    return 1 - getSlideOutProgress(anim, nowMs);
  }
  return getSlideInProgress(anim, nowMs);
}

export function createIslandEntity(opts: {
  islandMap: TiledMap;
  chestSheet: SpriteSheet;
  chestEmptySheet: SpriteSheet;
  animState: IslandAnimState;
}): Entity {
  const anim = opts.animState;
  const mapSize = getTiledMapSize(opts.islandMap, ISLAND_SCALE);

  function getChestPos(
    canvas: HTMLCanvasElement,
    side: "left" | "right",
    progress: number,
  ) {
    const ix = getIslandX(canvas, mapSize.width, side, progress);
    const iy = getIslandY(canvas, mapSize.height);
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
      if (!state.island.docked || state.island.islandType !== "treasure") {
        return rectAt(-9999, -9999, { width: 0, height: 0 });
      }
      if (anim.slideOutStartMs !== null) {
        return rectAt(-9999, -9999, { width: 0, height: 0 });
      }
      const side = getIslandSide(state.island.islandsVisited);
      const progress = getEffectiveProgress(anim, nowMs);
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
      // Only draw for treasure islands
      if (state.island.islandType !== "treasure") return;

      const isSliding = anim.slideOutStartMs !== null && getSlideOutProgress(anim, nowMs) < 1;
      if (!state.island.docked && !isSliding) return;

      if (anim.slideStartMs === null && !anim.skipSlideIn) {
        anim.slideStartMs = nowMs;
      }

      const side = getIslandSide(
        isSliding && !state.island.docked
          ? state.island.islandsVisited - 1
          : state.island.islandsVisited,
      );
      const progress = getEffectiveProgress(anim, nowMs);
      const ix = getIslandX(canvas, mapSize.width, side, progress);
      const iy = getIslandY(canvas, mapSize.height);

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
      if (_state.island.islandType !== "treasure") return null;
      if (_state.island.chestOpened) return null;

      if (anim.animStartMs === null) {
        anim.animStartMs = nowMs;
      }

      return null;
    },
  };
}
