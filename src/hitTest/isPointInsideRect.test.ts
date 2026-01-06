import { describe, expect, it } from "vitest";
import { isPointInsideRect } from "./isPointInsideRect";

describe("isPointInsideRect", () => {
  it("detects inside point", () => {
    expect(isPointInsideRect({ x: 5, y: 5 }, { left: 0, top: 0, width: 10, height: 10 })).toBe(true);
  });

  it("detects outside point", () => {
    expect(isPointInsideRect({ x: 11, y: 5 }, { left: 0, top: 0, width: 10, height: 10 })).toBe(false);
  });

  it("is inclusive on edges", () => {
    expect(isPointInsideRect({ x: 10, y: 10 }, { left: 0, top: 0, width: 10, height: 10 })).toBe(true);
  });
});
