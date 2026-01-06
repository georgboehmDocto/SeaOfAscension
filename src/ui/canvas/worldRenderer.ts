import type { GameState } from "../../types/GameState";
import type { SpriteSheet } from "../../sprites/spritesheet";
import { Entity, EntityId } from "./entities/types";
import { buildEntities } from "./entities/buildEntities";

let frame = 0;

export function createWorldRenderer(
  canvas: HTMLCanvasElement,
  deps: {
    waterImg: HTMLImageElement;
    shipSheet: SpriteSheet;
    goldChestImg: HTMLImageElement;
    mastSheet: SpriteSheet;
  }
) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas context not available");
  const ctx: CanvasRenderingContext2D = context;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    // ✅ draw in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  let lastEntities: Entity[] = buildEntities({
    canvas,
    waterImg: deps.waterImg,
    shipSheet: deps.shipSheet,
    goldChestImg: deps.goldChestImg,
    mastSheet: deps.mastSheet,
  });

  function draw(state: GameState, nowMs: number, deltaInSeconds: number) {
    frame++;

    // TODO: Always 0
    const deltaMs = deltaInSeconds * 1000;

    // Clear in CANVAS pixel space
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw entities
    for (const ent of lastEntities) {
      ent.draw({ ctx, canvas, state, nowMs, deltaMs });
    }

    // Debug frame counter (also in canvas pixel space)
    ctx.fillStyle = "#000";
    ctx.font = "16px monospace";
    ctx.fillText(`frame: ${frame}`, 0, 300);

   // Debug frame counter (also in canvas pixel space)
    ctx.fillStyle = "#000";
    ctx.font = "16px monospace";
    ctx.fillText(`Tutorial Sea: ${state.resources.distance.toFixed()}`, 10, 30);

     
  }

  function getEntities() {
    return lastEntities;
  }

  function addEntity(entity: Entity) {
    lastEntities.push(entity);
  }

  function removeEntity(id: EntityId) {
    lastEntities = lastEntities.filter((e) => e.id !== id);
  }

  return { draw, getEntities, addEntity, removeEntity, canvas };
}
