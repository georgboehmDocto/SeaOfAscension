// ui/canvas/input.ts
import type { GameState } from "../../types/GameState";
import type { GameAction } from "../../actions/GameAction";
import type { Entity, EntityId } from "./entities/types";
import { pickEntityTopMost } from "../../hitTest/pickEntityTopMost";
import { getCssPointFromMouseEvent } from "../../hitTest/getCanvasPointFromMouseEvent";
import { showFloatingText } from "../floatingText";

export type TooltipAnchor =
  | { entityId: string; entityTooltip?: string; x: number; y: number }
  | null;

function getCssPoint(e: MouseEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

export function attachCanvasInput(opts: {
  canvas: HTMLCanvasElement;
  getEntities: () => Entity[];
  getState: () => GameState;
  setState: (state: GameState) => void;
  dispatchAction: (state: GameState, nowMs: number, action: GameAction) => GameState;
  removeEntity: (id: EntityId) => void;
  getNowMs?: () => number;
  setTooltipAnchor: (a: TooltipAnchor) => void;
}) {
  let hoveredId: string | null = null;

  function clearHover() {
    if (!hoveredId) return;

    const entities = opts.getEntities();
    entities.find((e) => e.id === hoveredId)?.onHoverEnd?.();

    hoveredId = null;
    opts.canvas.style.cursor = "default";
    opts.setTooltipAnchor(null);
  }

  opts.canvas.addEventListener("mousemove", (event) => {
    const point = getCssPointFromMouseEvent(event, opts.canvas);
    const cssPoint = getCssPoint(event, opts.canvas);

    const entities = opts.getEntities();
    const state = opts.getState();
    const nowMs = opts.getNowMs ? opts.getNowMs() : Date.now();

    const picked = pickEntityTopMost({
      point,
      entities,
      canvas: opts.canvas,
      state,
      nowMs,
    });

    const nextHoveredId = picked?.id ?? null;

    if (nextHoveredId !== hoveredId) {
      if (hoveredId) {
        entities.find((e) => e.id === hoveredId)?.onHoverEnd?.();
      }
      picked?.onHoverStart?.();
      hoveredId = nextHoveredId;
    }

    opts.canvas.style.cursor = picked?.cursor ?? "default";

    if (picked?.tooltip) {
      opts.setTooltipAnchor({
        entityId: picked.id,
        entityTooltip: picked.tooltip,
        x: cssPoint.x + 12,
        y: cssPoint.y - 24,
      });
    } else {
      opts.setTooltipAnchor(null);
    }
  });

  opts.canvas.addEventListener("mouseleave", clearHover);

  opts.canvas.addEventListener("click", (event) => {
    const point = getCssPointFromMouseEvent(event, opts.canvas);
    const cssPoint = getCssPoint(event, opts.canvas);
    const entities = opts.getEntities();
    const state = opts.getState();
    const nowMs = opts.getNowMs ? opts.getNowMs() : Date.now();

    const picked = pickEntityTopMost({
      point,
      entities,
      canvas: opts.canvas,
      state,
      nowMs,
    });

    if (!picked) return;

    const action = picked.onClick?.(state, nowMs);
    if (!action) return;

    const next = opts.dispatchAction(state, nowMs, action);
    opts.setState(next);

    // Show floating text for collectibles
    const canvasRect = opts.canvas.getBoundingClientRect();
    const screenX = canvasRect.left + cssPoint.x;
    const screenY = canvasRect.top + cssPoint.y;

    if (action.type === "rudder/clicked") {
      const rudderLevel = state.ship.upgrades.rudder?.level ?? 0;
      const dist = 1 + rudderLevel * 0.5;
      showFloatingText(screenX, screenY, `+${dist}m`, "#87CEEB");
    } else if (action.type === "fish/collected") {
      showFloatingText(screenX, screenY, `+${action.goldAmount} gold`, "#FFD700");
    } else if (action.type === "gem/collected") {
      showFloatingText(screenX, screenY, "+1 gem", "#AA55FF");
    } else if (action.type === "island/chestOpened") {
      if (action.goldReward > 0) {
        showFloatingText(screenX, screenY - 20, `+${action.goldReward} gold`, "#FFD700");
      }
      if (action.gemReward > 0) {
        showFloatingText(screenX, screenY + 10, `+${action.gemReward} gems`, "#AA55FF");
      }
    }

    if (picked.selfDestructOnClick) {
      opts.removeEntity(picked.id);
      if (hoveredId === picked.id) {
        hoveredId = null;
        opts.setTooltipAnchor(null);
      }
    }
  });
}
