import type { Rect } from "../../../../hitTest/types";

export type ShipLayout = {
  base: Rect;
  mast: Rect;
};

export function computeShipLayoutCss(args: {
  canvas: HTMLCanvasElement;
  shipWidth: number;
  shipHeight: number;
}): ShipLayout {
  const css = args.canvas.getBoundingClientRect();

  const base: Rect = {
    left: (css.width - args.shipWidth) / 2,
    top: (css.height - args.shipHeight) / 2,
    width: args.shipWidth,
    height: args.shipHeight,
  };

  const mast: Rect = {
    left: base.left + base.width * 0.48,
    top: base.top + base.height * 0.05,
    width: base.width * 0.12,
    height: base.height * 0.45,
  };

  return { base, mast };
}
