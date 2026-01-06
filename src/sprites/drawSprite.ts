import type { SpriteSheet } from "./spritesheet";
import { drawSpriteFrame } from "./spritesheet";
import type { Rect } from "../hitTest/types";

export type SpriteSource =
  | { kind: "image"; img: HTMLImageElement }
  | { kind: "sheet"; sheet: SpriteSheet; frameIndex: (nowMs: number) => number };

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  source: SpriteSource,
  rect: Rect,
  nowMs: number
) {
  if (source.kind === "image") {
    ctx.drawImage(source.img, rect.left, rect.top, rect.width, rect.height);
    return;
  }

  const frame = source.frameIndex(nowMs);

  // V0: draw at native sheet frame size. Ensure rect matches frameW/frameH.
  drawSpriteFrame(ctx, source.sheet, frame, rect.left, rect.top);
}
