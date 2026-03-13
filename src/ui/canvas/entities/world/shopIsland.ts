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
const NPC_DISPLAY_SIZE = 96;
const NPC_FRAME_COUNT = 7;
const NPC_FRAME_MS = 150;
const SHOP_DISPLAY_W = 128;
const SHOP_DISPLAY_H = 144;

export function createShopIslandEntity(opts: {
  shopMap: TiledMap;
  npcImg: HTMLImageElement;
  shopImg: HTMLImageElement;
  animState: IslandAnimState;
  onNpcClick: () => void;
}): Entity {
  const anim = opts.animState;
  const mapSize = getTiledMapSize(opts.shopMap, ISLAND_SCALE);

  // NPC sprite: 672x96, 7 frames → 96x96 each
  const npcFrameW = opts.npcImg.width / NPC_FRAME_COUNT;
  const npcFrameH = opts.npcImg.height;

  function getNpcPos(
    canvas: HTMLCanvasElement,
    side: "left" | "right",
    progress: number,
  ) {
    const ix = getIslandX(canvas, mapSize.width, side, progress);
    const iy = getIslandY(canvas, mapSize.height);
    const cx = side === "left"
      ? ix + mapSize.width * 0.55
      : ix + mapSize.width * 0.45;
    const cy = iy + mapSize.height * 0.55;
    return { x: cx - NPC_DISPLAY_SIZE / 2, y: cy - NPC_DISPLAY_SIZE / 2 };
  }

  function getShopPos(
    canvas: HTMLCanvasElement,
    side: "left" | "right",
    progress: number,
  ) {
    const ix = getIslandX(canvas, mapSize.width, side, progress);
    const iy = getIslandY(canvas, mapSize.height);
    const cx = side === "left"
      ? ix + mapSize.width * 0.55
      : ix + mapSize.width * 0.45;
    const cy = iy + mapSize.height * 0.3;
    return { x: cx - SHOP_DISPLAY_W / 2, y: cy - SHOP_DISPLAY_H / 2 };
  }

  return {
    id: "shop-island",
    zIndex: 3,
    cursor: "pointer",
    tooltip: "Shop Island - Click the shopkeeper!",

    getPickRect: ({ canvas, state, nowMs }) => {
      if (!state.island.docked || state.island.islandType !== "shop") {
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
      const npc = getNpcPos(canvas, side, progress);
      return rectAt(npc.x, npc.y, {
        width: NPC_DISPLAY_SIZE,
        height: NPC_DISPLAY_SIZE,
      });
    },

    draw: ({ ctx, canvas, state, nowMs }) => {
      if (state.island.islandType !== "shop") return;

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

      // Draw island terrain
      renderTiledMap(ctx, opts.shopMap, ix, iy, ISLAND_SCALE, nowMs);

      ctx.imageSmoothingEnabled = false;

      // Draw shop building
      const shop = getShopPos(canvas, side, progress);
      ctx.drawImage(
        opts.shopImg,
        shop.x,
        shop.y,
        SHOP_DISPLAY_W,
        SHOP_DISPLAY_H,
      );

      // Draw animated NPC
      const npc = getNpcPos(canvas, side, progress);
      const frameIdx = Math.floor(nowMs / NPC_FRAME_MS) % NPC_FRAME_COUNT;
      ctx.drawImage(
        opts.npcImg,
        frameIdx * npcFrameW,
        0,
        npcFrameW,
        npcFrameH,
        npc.x,
        npc.y,
        NPC_DISPLAY_SIZE,
        NPC_DISPLAY_SIZE,
      );
    },

    onClick: (_state, _nowMs) => {
      if (!_state.island.docked) return null;
      if (_state.island.islandType !== "shop") return null;
      opts.onNpcClick();
      return null;
    },
  };
}
