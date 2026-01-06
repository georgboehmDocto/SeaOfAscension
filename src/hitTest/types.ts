export type Point = { x: number; y: number };

export type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type Cursor = "default" | "pointer";

export type Pickable = {
  id: string;
  zIndex: number;
  cursor: Cursor;
  tooltip?: string;
  rect: Rect;
};

export type HitTestResult = {
  targetId: string;
  zIndex: number;
  cursor: Cursor;
  tooltip?: string;
};

export type OpaqueBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};