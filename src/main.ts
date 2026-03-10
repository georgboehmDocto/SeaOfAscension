import { dispatch } from "./actions/dispatch";
import {
  AUTOSAVE_INTERVAL_MS,
  BASE_SPAWN_INTERVAL_MS,
  MAX_COLLECTIBLES_ON_SCREEN,
  FISH_LIFETIME_MS,
  GEM_LIFETIME_MS,
  FISH_SPAWN_WEIGHT,
} from "./constants/constants";
import { computeDeltaSeconds } from "./engine/computeDeltaSeconds";
import {
  exportSave,
  importSave,
  loadFromLocalStorage,
  resetLocalStorage,
  saveToLocalStorage,
} from "./engine/persistence";
import { tick } from "./engine/tick";
import { loadAssets } from "./loadAssets";
import { initialGameState } from "./types/GameState";
import { attachCanvasInput, type TooltipAnchor } from "./ui/canvas/input";
import { SpriteSheet } from "./sprites/spritesheet";
import { createWorldRenderer } from "./ui/canvas/worldRenderer";
import { computeOpaqueBounds } from "./ui/canvas/computeOpaqueBounds";
import { createTooltipController } from "./ui/tooltip";
import { getTooltipModel } from "./ui/canvas/getTooltipModel";
import { createResourcesPanel } from "./ui/resourcesPanel";
import { createDistanceDisplay } from "./ui/distanceDisplay";
import { createFishEntity } from "./ui/canvas/entities/world/fish";
import { createGemEntity } from "./ui/canvas/entities/world/gem";

// --- DOM Elements ---
const controlsPanel = document.getElementById("controls-panel")!;
const settingsToggle = document.getElementById("settings-toggle")!;
const saveGameButton = document.getElementById("saveGame") as HTMLButtonElement;
const exportGameButton = document.getElementById("exportGame") as HTMLButtonElement;
const resetGameButton = document.getElementById("resetGame") as HTMLButtonElement;
const importGameButton = document.getElementById("importGame") as HTMLButtonElement;

// Settings panel toggle
settingsToggle.addEventListener("click", () => {
  controlsPanel.classList.toggle("open");
});

let state = loadFromLocalStorage() ?? initialGameState;
let lastSaveAt = Date.now();
let lastNowMs = Date.now();
let tooltipAnchor: TooltipAnchor = null;

const tooltip = createTooltipController();
const resourcesPanel = createResourcesPanel();
const distanceDisplay = createDistanceDisplay();

const canvas = document.getElementById("world") as HTMLCanvasElement;

const assets = await loadAssets({
  waterTile: "/water-tile.png",
  ship: "/boat-sailing-up.png",
  goldChest: "/buried chest-opening-gold.png",
  mast: "/flag-pirate2.png",
  gem: "/gems-3.png",
  compass: "/compass.png",
  bucket: "/bucket_1.png",
  fish0: "/fish/fish_0.png",
  fish1: "/fish/fish_1.png",
  fish2: "/fish/fish_2.png",
  fish3: "/fish/fish_3.png",
  fish4: "/fish/fish_4.png",
  fish5: "/fish/fish_5.png",
  fish6: "/fish/fish_6.png",
});

const waterImg = assets.waterTile;
const shipImg = assets.ship;
const goldChestImg = assets.goldChest;
const mastImg = assets.mast;
const gemImg = assets.gem;
const compassImg = assets.compass;
const bucketImg = assets.bucket;

const fishImages = [
  assets.fish0, assets.fish1, assets.fish2, assets.fish3,
  assets.fish4, assets.fish5, assets.fish6,
];

// Set images for UI panels
resourcesPanel.setImages(goldChestImg, gemImg);
distanceDisplay.setImage(compassImg);

const shipSheet: SpriteSheet = {
  img: shipImg,
  cols: 4,
  rows: 4,
  frameW: shipImg.width / 4,
  frameH: shipImg.height / 4,
  frameCount: 14,
};

const mastSheet: SpriteSheet = {
  img: mastImg,
  cols: 8,
  rows: 1,
  frameW: mastImg.width / 8,
  frameH: mastImg.height,
  frameCount: 8,
};

const world = createWorldRenderer(canvas, {
  waterImg,
  shipSheet,
  mastSheet,
  bucketImg,
});

computeOpaqueBounds(mastSheet);
computeOpaqueBounds(shipSheet);

attachCanvasInput({
  canvas,
  getEntities: world.getEntities,
  getState: () => state,
  setState: (s) => (state = s),
  dispatchAction: dispatch,
  removeEntity: world.removeEntity,
  getNowMs: () => lastNowMs,
  setTooltipAnchor: (a) => (tooltipAnchor = a),
});

// --- Spawn Manager ---
let nextSpawnId = 0;
let lastSpawnAttemptMs = Date.now();

function getSpawnRateMultiplier(): number {
  const luckBucketLevel = state.ship.upgrades.luckBucket?.level ?? 0;
  return Math.pow(1.2, luckBucketLevel);
}

function totalCollectiblesOnScreen(): number {
  return (
    world.countEntitiesWithPrefix("fish-") +
    world.countEntitiesWithPrefix("gem-")
  );
}

function trySpawn(nowMs: number) {
  const spawnMultiplier = getSpawnRateMultiplier();
  const effectiveInterval = BASE_SPAWN_INTERVAL_MS / spawnMultiplier;

  if (nowMs - lastSpawnAttemptMs < effectiveInterval) return;
  lastSpawnAttemptMs = nowMs;

  // Random chance to spawn (50% per interval)
  if (Math.random() > 0.5) return;

  // Only 1 collectible at a time
  if (totalCollectiblesOnScreen() >= MAX_COLLECTIBLES_ON_SCREEN) return;

  const css = canvas.getBoundingClientRect();
  const margin = 80;
  const x = margin + Math.random() * (css.width - margin * 2);
  const y = margin + Math.random() * (css.height - margin * 2);

  const isFish = Math.random() < FISH_SPAWN_WEIGHT;

  if (isFish) {
    const variant = pickFishVariant();
    const entityId = `fish-${nextSpawnId++}`;
    const entity = createFishEntity({
      entityId,
      fishImg: fishImages[variant],
      variant,
      x,
      y,
      spawnMs: nowMs,
    });
    world.addEntity(entity);

    setTimeout(() => {
      world.removeEntity(entityId);
    }, FISH_LIFETIME_MS);
  } else {
    const entityId = `gem-${nextSpawnId++}`;
    const entity = createGemEntity({
      entityId,
      gemImg: gemImg,
      x,
      y,
      spawnMs: nowMs,
    });
    world.addEntity(entity);

    setTimeout(() => {
      world.removeEntity(entityId);
    }, GEM_LIFETIME_MS);
  }
}

function pickFishVariant(): number {
  const weights = [30, 25, 18, 12, 8, 5, 2];
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (roll < cumulative) return i;
  }
  return 0;
}

function start() {
  function loop() {
    const nowMs = Date.now();
    lastNowMs = nowMs;

    state = tick(state, nowMs);

    if (nowMs - lastSaveAt > AUTOSAVE_INTERVAL_MS) {
      saveToLocalStorage(state);
      lastSaveAt = nowMs;
    }

    const deltaInSeconds = computeDeltaSeconds(state.lastTick, nowMs);
    world.draw(state, nowMs, deltaInSeconds);

    resourcesPanel.update(state);
    distanceDisplay.update(state);

    trySpawn(nowMs);

    // Tooltip
    if (!tooltipAnchor) {
      tooltip.hide();
    } else {
      const model = getTooltipModel(
        state,
        tooltipAnchor.entityId,
        tooltipAnchor.x,
        tooltipAnchor.y,
        nowMs,
        tooltipAnchor.entityTooltip
      );
      if (!model) tooltip.hide();
      else tooltip.show(model);
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

start();

window.addEventListener("beforeunload", () => {
  saveToLocalStorage(state);
});

saveGameButton.addEventListener("click", () => {
  saveToLocalStorage(state);
});

exportGameButton.addEventListener("click", () => {
  console.log("exportSave: ", exportSave(state));
});

resetGameButton.addEventListener("click", () => {
  resetLocalStorage();
  state = {
    ...initialGameState,
    lastTick: Date.now(),
  };
});

importGameButton.addEventListener("click", () => {
  const input = prompt("Paste exported save string:");
  if (!input) {
    console.log("[import] cancelled or empty input");
    return;
  }

  const result = importSave(input);

  if (result.kind === "ok") {
    console.log("[import] success", result.state);
    state = {
      ...result.state,
      lastTick: Date.now(),
    };
    saveToLocalStorage(state);
  } else {
    console.error("[import] failed:", result);
    alert("Import failed: " + ("reason" in result ? result.reason : "unknown"));
  }
});
