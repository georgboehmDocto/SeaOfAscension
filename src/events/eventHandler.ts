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
    const entityId = `fish-event-${event.spawnedAt}`;

    deps.addEntity(
      createFishEntity({
        entityId,
        fishImg: deps.fishImages[event.fishVariant],
        variant: event.fishVariant,
        x: event.x,
        y: event.y,
        spawnMs: event.spawnedAt,
      })
    );

    // expire
    if (deps.canvas && Date.now() - event.spawnedAt > event.lifetimeMs) {
      deps.removeEntity(entityId);
      state.event = null;
    }
  }
}
