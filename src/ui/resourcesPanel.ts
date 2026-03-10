import type { GameState } from "../types/GameState";
import { formatResource } from "../helpers/formatResource";
import { getCurrentSea } from "../constants/constants";

export type ResourcesPanel = {
  update: (state: GameState) => void;
  setImages: (goldChestImg: HTMLImageElement, gemImg: HTMLImageElement) => void;
};

export function createResourcesPanel(): ResourcesPanel {
  const panel = document.createElement("div");
  panel.id = "resources-panel";
  panel.innerHTML = `
    <div class="sea-title" id="sea-title">Tutorial Sea</div>
    <div class="resource-row">
      <canvas class="resource-img" id="gold-icon"></canvas>
      <span class="resource-text" id="gold-value">0</span>
    </div>
    <div class="resource-row">
      <canvas class="resource-img" id="gem-icon"></canvas>
      <span class="resource-text" id="gems-value">0</span>
    </div>
  `;

  document.body.appendChild(panel);

  const seaTitleEl = document.getElementById("sea-title")!;
  const goldEl = document.getElementById("gold-value")!;
  const gemsEl = document.getElementById("gems-value")!;

  const goldIconCanvas = document.getElementById(
    "gold-icon"
  ) as HTMLCanvasElement;
  const gemIconCanvas = document.getElementById(
    "gem-icon"
  ) as HTMLCanvasElement;

  goldIconCanvas.width = 80;
  goldIconCanvas.height = 80;
  gemIconCanvas.width = 80;
  gemIconCanvas.height = 80;

  const goldCtx = goldIconCanvas.getContext("2d")!;
  const gemCtx = gemIconCanvas.getContext("2d")!;

  let goldChestSpriteSheet: HTMLImageElement | null = null;
  let gemSpriteSheet: HTMLImageElement | null = null;

  let goldAnimating = false;
  let gemAnimating = false;

  const GOLD_CHEST_FRAMES = 10;
  const GOLD_CHEST_FRAME_WIDTH = 128;
  const GOLD_CHEST_FRAME_HEIGHT = 128;
  const GEM_FRAMES = 8;
  const GEM_FRAME_WIDTH = 32;
  const GEM_FRAME_HEIGHT = 32;
  const ANIMATION_FRAME_DURATION = 50;

  function drawGoldIcon(frame: number = 0) {
    if (!goldChestSpriteSheet) return;
    goldCtx.imageSmoothingEnabled = false;
    goldCtx.clearRect(0, 0, 80, 80);
    goldCtx.drawImage(
      goldChestSpriteSheet,
      frame * GOLD_CHEST_FRAME_WIDTH,
      0,
      GOLD_CHEST_FRAME_WIDTH,
      GOLD_CHEST_FRAME_HEIGHT,
      0,
      0,
      80,
      80
    );
  }

  function drawGemIcon(frame: number = 0) {
    if (!gemSpriteSheet) return;
    gemCtx.imageSmoothingEnabled = false;
    gemCtx.clearRect(0, 0, 80, 80);
    gemCtx.drawImage(
      gemSpriteSheet,
      frame * GEM_FRAME_WIDTH,
      0,
      GEM_FRAME_WIDTH,
      GEM_FRAME_HEIGHT,
      0,
      0,
      80,
      80
    );
  }

  function animateGoldChest() {
    if (goldAnimating) return;
    goldAnimating = true;
    let frame = 0;
    const interval = setInterval(() => {
      drawGoldIcon(frame);
      frame++;
      if (frame >= GOLD_CHEST_FRAMES) {
        clearInterval(interval);
        goldAnimating = false;
        drawGoldIcon(GOLD_CHEST_FRAMES - 1);
      }
    }, ANIMATION_FRAME_DURATION);
  }

  function animateGem() {
    if (gemAnimating) return;
    gemAnimating = true;
    let frame = 0;
    const interval = setInterval(() => {
      drawGemIcon(frame);
      frame++;
      if (frame >= GEM_FRAMES) {
        clearInterval(interval);
        gemAnimating = false;
        drawGemIcon(0);
      }
    }, ANIMATION_FRAME_DURATION);
  }

  goldIconCanvas.addEventListener("mouseenter", animateGoldChest);
  goldIconCanvas.addEventListener("mouseleave", () => drawGoldIcon(0));
  gemIconCanvas.addEventListener("mouseenter", animateGem);

  function setImages(goldChestImg: HTMLImageElement, gemImg: HTMLImageElement) {
    goldChestSpriteSheet = goldChestImg;
    gemSpriteSheet = gemImg;
    drawGoldIcon(0);
    drawGemIcon(0);
  }

  function update(state: GameState) {
    goldEl.textContent = formatResource(Math.floor(state.resources.gold));
    gemsEl.textContent = formatResource(
      Math.floor(state.resources.ascendencyGems)
    );

    const currentSea = getCurrentSea(state.resources.lifeTimeGoldEarned);
    seaTitleEl.textContent = currentSea.name;
  }

  return { update, setImages };
}
