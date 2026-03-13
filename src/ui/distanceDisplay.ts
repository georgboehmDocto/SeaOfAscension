import type { GameState } from "../types/GameState";
import { formatResource } from "../helpers/formatResource";
import { getNextSea } from "../constants/constants";

export type DistanceDisplay = {
  update: (state: GameState) => void;
  setImage: (compassImg: HTMLImageElement) => void;
};

export function createDistanceDisplay(): DistanceDisplay {
  const display = document.createElement("div");
  display.id = "distance-display";
  display.innerHTML = `
    <canvas class="distance-icon" id="compass-icon"></canvas>
    <div class="distance-value" id="distance-value">0</div>
    <div class="next-sea-label" id="next-sea-label"></div>
  `;

  document.body.appendChild(display);

  const distanceEl = document.getElementById("distance-value")!;
  const nextSeaEl = document.getElementById("next-sea-label")!;
  const compassCanvas = document.getElementById(
    "compass-icon"
  ) as HTMLCanvasElement;

  compassCanvas.width = 80;
  compassCanvas.height = 80;

  const compassCtx = compassCanvas.getContext("2d")!;

  let compassSpriteSheet: HTMLImageElement | null = null;

  const COMPASS_FRAME_SIZE = 185;

  function drawCompass() {
    if (!compassSpriteSheet) return;
    compassCtx.imageSmoothingEnabled = false;
    compassCtx.clearRect(0, 0, 80, 80);

    // Draw frame 0 (top-left sprite) statically
    compassCtx.drawImage(
      compassSpriteSheet,
      0,
      0,
      COMPASS_FRAME_SIZE,
      COMPASS_FRAME_SIZE,
      0,
      0,
      80,
      80
    );
  }

  function setImage(compassImg: HTMLImageElement) {
    compassSpriteSheet = compassImg;
    drawCompass();
  }

  function update(state: GameState) {
    const nextSea = getNextSea(state.resources.distance);
    if (nextSea) {
      const remaining = nextSea.distanceThreshold - state.resources.distance;
      distanceEl.textContent = `${formatResource(Math.max(0, Math.floor(remaining)))}m`;
      nextSeaEl.textContent = nextSea.name;
    } else {
      distanceEl.textContent = "MAX";
      nextSeaEl.textContent = "";
    }
  }

  return { update, setImage };
}
