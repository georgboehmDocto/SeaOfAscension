import type { Entity } from "./types";
import { createSeaEntity } from "./world/sea";
import { createShipEntity } from "./world/ship";
import type { SpriteSheet } from "../../../sprites/spritesheet";
import { createShipMastEntity } from "./world/mast";
import { createLuckBucketEntity } from "./world/luckBucket";
import { createRudderEntity } from "./world/rudder";

export function buildEntities(opts: {
  canvas: HTMLCanvasElement;
  waterImg: HTMLImageElement;
  mastSheet: SpriteSheet;
  shipSheet: SpriteSheet;
  bucketImg: HTMLImageElement;
  rudderLeftImg: HTMLImageElement;
  rudderRightImg: HTMLImageElement;
}): Entity[] {
  const entities: Entity[] = [
    createSeaEntity({ waterImg: opts.waterImg }),
    createRudderEntity({ side: "left", img: opts.rudderLeftImg, shipSheet: opts.shipSheet }),
    createRudderEntity({ side: "right", img: opts.rudderRightImg, shipSheet: opts.shipSheet }),
    createShipEntity({ sheet: opts.shipSheet }),
    createShipMastEntity({ sheet: opts.mastSheet, shipSheet: opts.shipSheet }),
    createLuckBucketEntity({ bucketImg: opts.bucketImg, shipSheet: opts.shipSheet }),
  ];

  entities.sort((a, b) => a.zIndex - b.zIndex);
  return entities;
}
