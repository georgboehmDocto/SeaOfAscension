import { GameAction } from "../../../actions/GameAction";
import { Rect } from "../../../hitTest/types";
import { GameState } from "../../../types/GameState";

export type EntityId = string;

export type Entity = {
  id: EntityId;
  zIndex: number;
  cursor: "default" | "pointer";
  tooltip?: string;
  selfDestructOnClick?: boolean;

  /** Rectangle in CSS coordinates. Used for hit testing. */
  getPickRect: (args: {
    canvas: HTMLCanvasElement;
    state: GameState;
    nowMs: number;
  }) => Rect;

  draw: (args: {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    state: GameState;
    nowMs: number;
    deltaMs: number;
  }) => void;

  onClick?: (state: GameState, nowMs: number) => GameAction | null;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
};
