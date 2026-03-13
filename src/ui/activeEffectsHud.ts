import type { ActiveEffect } from "../types/ActiveEffect";
import { getEffectRemainingMs, isEffectActive } from "../types/ActiveEffect";

export type ActiveEffectsHud = {
  update: (effects: ActiveEffect[], nowMs: number) => void;
};

export function createActiveEffectsHud(): ActiveEffectsHud {
  const container = document.createElement("div");
  container.id = "active-effects-hud";
  document.body.appendChild(container);

  // Track which effect elements exist
  const effectElements = new Map<string, HTMLElement>();

  return {
    update(effects: ActiveEffect[], nowMs: number) {
      const activeIds = new Set<string>();

      for (const effect of effects) {
        if (!isEffectActive(effect, nowMs)) continue;
        activeIds.add(effect.id);

        const remainingMs = getEffectRemainingMs(effect, nowMs);

        let el = effectElements.get(effect.id);
        if (!el) {
          el = document.createElement("div");
          el.className = "effect-hud-item";
          el.innerHTML = `
            <img class="effect-hud-icon" src="${effect.iconPath}" alt="${effect.name}" />
            <span class="effect-hud-timer" data-timer></span>
          `;
          container.appendChild(el);
          effectElements.set(effect.id, el);
        }

        const timerEl = el.querySelector("[data-timer]")!;
        timerEl.textContent = formatTimer(remainingMs);
      }

      // Remove expired effects from DOM
      for (const [id, el] of effectElements) {
        if (!activeIds.has(id)) {
          el.remove();
          effectElements.delete(id);
        }
      }
    },
  };
}

function formatTimer(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${String(mins).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
