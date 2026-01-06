import { describe, expect, it } from "vitest";
import type { Entity, EntityId } from "../ui/canvas/entities/types";
import type { GameState } from "../types/GameState";
import type { Rect } from "./types";
import { pickEntityTopMost } from "./pickEntityTopMost";

describe("pickEntityTopMost", () => {
  const canvas = {
    width: 100,
    height: 100,
  } as HTMLCanvasElement;

  const state = {} as GameState;
  const nowMs = 0;

  function entity(
    id: EntityId,
    zIndex: number,
    rect: Rect
  ): Entity {
    return {
      id,
      zIndex,
      cursor: "pointer",
      tooltip: undefined,

      getPickRect() {
        return rect;
      },

      draw() {
        /* noop */
      },
    };
  }

  it("returns null when nothing is hit", () => {
    const hit = pickEntityTopMost({
      point: { x: 1, y: 1 },
      entities: [
        entity("sea", 1, { left: 10, top: 10, width: 5, height: 5 }),
      ],
      canvas,
      state,
      nowMs,
    });

    expect(hit).toBeNull();
  });

  it("returns the entity with the highest zIndex when multiple are hit", () => {
    const hit = pickEntityTopMost({
      point: { x: 1, y: 1 },
      entities: [
        entity("sea", 1, { left: 0, top: 0, width: 10, height: 10 }),
        entity("mast", 10, { left: 0, top: 0, width: 10, height: 10 }),
      ],
      canvas,
      state,
      nowMs,
    });

    expect(hit?.id).toBe("mast");
  });
});
