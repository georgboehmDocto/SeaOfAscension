import type { OpaqueBounds, Rect } from "./types";

export type Size = { width: number; height: number };

function getCanvasCssSize(canvas: HTMLCanvasElement) {
  const r = canvas.getBoundingClientRect();
  return { width: r.width, height: r.height };
}

export function centeredRect(canvas: HTMLCanvasElement, size: Size): Rect {
  const css = getCanvasCssSize(canvas);

  return {
    left: (css.width - size.width) / 2,
    top: (css.height - size.height) / 2,
    width: size.width,
    height: size.height,
  };
}

export function rectAt(left: number, top: number, size: Size): Rect {
  return { left, top, width: size.width, height: size.height };
}

export function rectWithOpaqueBounds(base: Rect, bounds: OpaqueBounds): Rect {
  return {
    left: base.left + bounds.x,
    top: base.top + bounds.y,
    width: bounds.width,
    height: bounds.height,
  };
}

export function centeredOpaqueRect(
  canvas: HTMLCanvasElement,
  frameSize: Size,
  bounds?: OpaqueBounds
): Rect {
  const base = centeredRect(canvas, frameSize);

  if (!bounds) return base;
  if (bounds.width === 0 || bounds.height === 0) return base;

  return rectWithOpaqueBounds(base, bounds);
}
