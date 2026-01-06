export type CssPoint = { x: number; y: number };

export function getCssPoint(e: MouseEvent, canvas: HTMLCanvasElement): CssPoint {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
