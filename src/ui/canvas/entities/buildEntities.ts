import type { Entity } from "./types";
import { createGoldChestEntity } from "./ui/goldChest";
import { createSeaEntity } from "./world/sea";
import { createShipEntity } from "./world/ship";
import type { SpriteSheet } from "../../../sprites/spritesheet";
import { createShipMastEntity } from "./world/mast";

// TODO: Refactor image providing
export function buildEntities(opts: {
  canvas: HTMLCanvasElement;
  waterImg: HTMLImageElement;
  goldChestImg: HTMLImageElement;
  mastSheet: SpriteSheet;
  shipSheet: SpriteSheet;
}): Entity[] {
  const entities: Entity[] = [
    createSeaEntity({ waterImg: opts.waterImg }),
    createShipEntity({ sheet: opts.shipSheet }),
    createShipMastEntity({sheet: opts.mastSheet}),
    createGoldChestEntity({
      canvas: opts.canvas,
      goldChestImg: opts.goldChestImg,
    }),
  ];

  entities.sort((a, b) => a.zIndex - b.zIndex);
  return entities;
}
