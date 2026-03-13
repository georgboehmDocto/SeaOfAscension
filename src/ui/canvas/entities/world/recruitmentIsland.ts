import type { Entity } from "../types";
import type { TiledMap } from "../../../../tmx/types";
import {
  renderTiledMap,
  getTiledMapSize,
} from "../../../../tmx/renderTiledMap";
import { rectAt } from "../../../../hitTest/rectHelpers";
import {
  type IslandAnimState,
  getIslandSide,
  getIslandX,
  getIslandY,
  getEffectiveProgress,
  getSlideOutProgress,
} from "./island";

const ISLAND_SCALE = 1;
const CRAB_DISPLAY_SIZE = 96;
const CRAB_FRAME_COUNT = 6;
const CRAB_FRAME_MS = 150;

export function createRecruitmentIslandEntity(opts: {
  islandMap: TiledMap;
  crabImg: HTMLImageElement;
  animState: IslandAnimState;
  onCrabClick: () => void;
}): Entity {
  const anim = opts.animState;
  const mapSize = getTiledMapSize(opts.islandMap, ISLAND_SCALE);

  const crabFrameW = opts.crabImg.width / CRAB_FRAME_COUNT;
  const crabFrameH = opts.crabImg.height;

  function getCrabPos(
    canvas: HTMLCanvasElement,
    side: "left" | "right",
    progress: number,
  ) {
    const ix = getIslandX(canvas, mapSize.width, side, progress);
    const iy = getIslandY(canvas, mapSize.height);
    const cx = side === "left"
      ? ix + mapSize.width * 0.55
      : ix + mapSize.width * 0.45;
    const cy = iy + mapSize.height * 0.5;
    return { x: cx - CRAB_DISPLAY_SIZE / 2, y: cy - CRAB_DISPLAY_SIZE / 2 };
  }

  return {
    id: "recruitment-island",
    zIndex: 3,
    cursor: "pointer",
    tooltip: "Recruitment Island - Click the crab!",

    getPickRect: ({ canvas, state, nowMs }) => {
      if (!state.island.docked || state.island.islandType !== "recruitment") {
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
      const crab = getCrabPos(canvas, side, progress);
      return rectAt(crab.x, crab.y, {
        width: CRAB_DISPLAY_SIZE,
        height: CRAB_DISPLAY_SIZE,
      });
    },

    draw: ({ ctx, canvas, state, nowMs }) => {
      if (state.island.islandType !== "recruitment") return;

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

      ctx.imageSmoothingEnabled = false;

      // Draw animated crab NPC
      const crab = getCrabPos(canvas, side, progress);
      const frameIdx = Math.floor(nowMs / CRAB_FRAME_MS) % CRAB_FRAME_COUNT;
      ctx.drawImage(
        opts.crabImg,
        frameIdx * crabFrameW,
        0,
        crabFrameW,
        crabFrameH,
        crab.x,
        crab.y,
        CRAB_DISPLAY_SIZE,
        CRAB_DISPLAY_SIZE,
      );
    },

    onClick: (_state, _nowMs) => {
      if (!_state.island.docked) return null;
      if (_state.island.islandType !== "recruitment") return null;
      opts.onCrabClick();
      return null;
    },
  };
}
