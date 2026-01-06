// events/eventHandler.ts
import { GameState } from "../types/GameState";
import { Entity, EntityId } from "../ui/canvas/entities/types";
import { createFishEntity } from "../ui/canvas/entities/world/fish";
import { GameEvent } from "./GameEvent";

export function handleEvent(
  state: GameState,
  event: GameEvent | null,
  deps: {
    addEntity: (e: Entity) => void;
    removeEntity: (id: EntityId) => void;
    canvas: HTMLCanvasElement;
    fishImages: HTMLImageElement[];
  }
) {
  if (!event) return;

  if (event.id === "spawn") {

    deps.addEntity(
      createFishEntity({
        canvas: deps.canvas,
        fishImg: deps.fishImages[event.fishVariant],
        x: event.x,
        y: event.y,
      })
    );

    // expire
    if (deps.canvas && Date.now() - event.spawnedAt > event.lifetimeMs) {
      deps.removeEntity("fish");
      state.event = null;
    }
  }
}
