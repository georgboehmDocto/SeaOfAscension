import type { GameState } from "../types/GameState";
import { formatResource } from "../helpers/formatResource";
import { getIslandSide } from "./canvas/entities/world/island";
import { getIslandType } from "../types/IslandState";

export type IslandApproachIndicator = {
  update: (state: GameState) => void;
};

export function createIslandApproachIndicator(): IslandApproachIndicator {
  const container = document.createElement("div");
  container.id = "island-approach";
  container.innerHTML = `
    <div class="island-approach-arrow" id="island-approach-arrow">▼</div>
    <div class="island-approach-distance" id="island-approach-distance">0m</div>
    <div class="island-approach-label" id="island-approach-label">Next Island</div>
  `;

  document.body.appendChild(container);

  const distanceEl = document.getElementById("island-approach-distance")!;
  const arrowEl = document.getElementById("island-approach-arrow")!;
  const labelEl = document.getElementById("island-approach-label")!;

  return {
    update(state: GameState) {
      if (state.island.docked) {
        container.style.display = "none";
        return;
      }

      container.style.display = "flex";

      // Position on the side where the next island will appear
      const side = getIslandSide(state.island.islandsVisited);
      if (side === "right") {
        container.style.left = "auto";
        container.style.right = "12.5%";
        arrowEl.textContent = "▶";
      } else {
        container.style.right = "auto";
        container.style.left = "12.5%";
        arrowEl.textContent = "◀";
      }

      const remaining = Math.max(
        0,
        Math.floor(state.island.nextIslandAt - state.resources.distance),
      );
      distanceEl.textContent = `${formatResource(remaining)}m`;

      // Show what type of island is coming
      const nextType = getIslandType(state.island.islandsVisited);
      labelEl.textContent = nextType === "shop" ? "Next: Shop Island" : "Next: Treasure Island";
    },
  };
}
