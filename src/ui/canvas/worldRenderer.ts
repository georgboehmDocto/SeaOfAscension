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
    mastSheet: SpriteSheet;
    bucketImg: HTMLImageElement;
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

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  let lastEntities: Entity[] = buildEntities({
    canvas,
    waterImg: deps.waterImg,
    shipSheet: deps.shipSheet,
    mastSheet: deps.mastSheet,
    bucketImg: deps.bucketImg,
  });

  function draw(state: GameState, nowMs: number, deltaInSeconds: number) {
    frame++;

    const deltaMs = deltaInSeconds * 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const ent of lastEntities) {
      ent.draw({ ctx, canvas, state, nowMs, deltaMs });
    }
  }

  function getEntities() {
    return lastEntities;
  }

  function addEntity(entity: Entity) {
    lastEntities.push(entity);
    lastEntities.sort((a, b) => a.zIndex - b.zIndex);
  }

  function removeEntity(id: EntityId) {
    lastEntities = lastEntities.filter((e) => e.id !== id);
  }

  function countEntitiesWithPrefix(prefix: string): number {
    return lastEntities.filter((e) => e.id.startsWith(prefix)).length;
  }

  return { draw, getEntities, addEntity, removeEntity, countEntitiesWithPrefix, canvas };
}
