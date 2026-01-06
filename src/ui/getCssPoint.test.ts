import { describe, expect, it } from "vitest";
import { getCssPoint } from "./getCssPoint";

describe("getCssPoint", () => {
  it("returns mouse position relative to the canvas' bounding rect", () => {
    const canvas = {
      getBoundingClientRect: () =>
        ({
          left: 100,
          top: 50,
          width: 200,
          height: 100,
        } as DOMRect),
    } as unknown as HTMLCanvasElement;

    const event = {
      clientX: 130,
      clientY: 90,
    } as MouseEvent;

    const p = getCssPoint(event, canvas);

    expect(p).toEqual({ x: 30, y: 40 });
  });

  it("handles negative offsets when mouse is outside canvas (left/top)", () => {
    const canvas = {
      getBoundingClientRect: () =>
        ({
          left: 100,
          top: 100,
          width: 200,
          height: 200,
        } as DOMRect),
    } as unknown as HTMLCanvasElement;

    const event = {
      clientX: 90,
      clientY: 80,
    } as MouseEvent;

    const p = getCssPoint(event, canvas);

    expect(p).toEqual({ x: -10, y: -20 });
  });
});
