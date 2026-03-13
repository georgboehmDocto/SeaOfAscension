import { dispatch } from "./actions/dispatch";
import {
  AUTOSAVE_INTERVAL_MS,
  BASE_SPAWN_INTERVAL_MS,
  MAX_COLLECTIBLES_ON_SCREEN,
  FISH_LIFETIME_MS,
  GEM_LIFETIME_MS,
  FISH_SPAWN_WEIGHT,
  ISLAND_INTERVAL_METERS,
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
import { getIslandType } from "./types/IslandState";
import { getActiveEffects } from "./types/ActiveEffect";
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
import {
  createIslandEntity,
  type IslandAnimState,
  SLIDE_DURATION_MS,
} from "./ui/canvas/entities/world/island";
import { createShopIslandEntity } from "./ui/canvas/entities/world/shopIsland";
import { createRudderEntity } from "./ui/canvas/entities/world/rudder";
import { createIslandModal } from "./ui/islandModal";
import { createShopModal } from "./ui/shopModal";
import { createRecruitmentModal } from "./ui/recruitmentModal";
import { createRecruitmentIslandEntity } from "./ui/canvas/entities/world/recruitmentIsland";
import { createCrabOnShipEntity } from "./ui/canvas/entities/world/crabOnShip";
import { createIslandApproachIndicator } from "./ui/islandApproachIndicator";
import { createActiveEffectsHud } from "./ui/activeEffectsHud";
import { loadTmjMap } from "./tmx/loadTmjMap";
import { generateIslandReward } from "./island/generateReward";
import {
  pickShopItems,
  getShopItemsById,
  type ShopItem,
} from "./island/shopItems";
import { getActiveSpawnRateMultiplier } from "./economy/getActiveEffectModifiers";

// --- DOM Elements ---
const controlsPanel = document.getElementById("controls-panel")!;
const settingsToggle = document.getElementById("settings-toggle")!;
const saveGameButton = document.getElementById("saveGame") as HTMLButtonElement;
const exportGameButton = document.getElementById(
  "exportGame",
) as HTMLButtonElement;
const resetGameButton = document.getElementById(
  "resetGame",
) as HTMLButtonElement;
const importGameButton = document.getElementById(
  "importGame",
) as HTMLButtonElement;

// Settings panel toggle
settingsToggle.addEventListener("click", () => {
  controlsPanel.classList.toggle("open");
});

let state = loadFromLocalStorage() ?? initialGameState;

// Migrate: ensure island state exists for old saves
if (!state.island) {
  const currentDistance = state.resources?.distance ?? 0;
  const interval = ISLAND_INTERVAL_METERS;
  const nextIslandAt = Math.ceil(currentDistance / interval + 1) * interval;
  state = {
    ...state,
    island: {
      nextIslandAt,
      docked: false,
      chestOpened: false,
      islandsVisited: 0,
      islandType: "treasure",
      shopItemPurchased: false,
      purchasedShopItemId: null,
      shopItemIds: null,
    },
  };
}

// Migrate: ensure new island fields exist for saves from before shop update
if (state.island.islandType === undefined) {
  state = {
    ...state,
    island: {
      ...state.island,
      islandType: getIslandType(state.island.islandsVisited),
      shopItemPurchased: state.island.shopItemPurchased ?? false,
    },
  };
}

// Migrate: ensure activeEffects exists
if (!state.activeEffects) {
  state = { ...state, activeEffects: [] };
}

// Migrate: ensure crabs field exists
if (state.crabs === undefined) {
  state = { ...state, crabs: 0 };
}

// If we reload while docked with chest already opened (treasure) or shop/recruitment visited, re-show modal
const pendingTreasureModal =
  state.island.docked &&
  state.island.islandType === "treasure" &&
  state.island.chestOpened;
const pendingShopModal =
  state.island.docked && state.island.islandType === "shop";
const pendingRecruitmentModal =
  state.island.docked && state.island.islandType === "recruitment";

let lastSaveAt = Date.now();
let lastNowMs = Date.now();
let tooltipAnchor: TooltipAnchor = null;

const tooltip = createTooltipController();
const resourcesPanel = createResourcesPanel();
const distanceDisplay = createDistanceDisplay();
const islandModal = createIslandModal();
const shopModal = createShopModal();
const recruitmentModal = createRecruitmentModal();
const islandApproach = createIslandApproachIndicator();
const activeEffectsHud = createActiveEffectsHud();

const canvas = document.getElementById("world") as HTMLCanvasElement;

const assets = await loadAssets({
  waterTile: "/water-tile.png",
  ship: "/boat-sailing-up.png",
  goldChest: "/buried chest-opening-gold.png",
  mast: "/flag-pirate2.png",
  gem: "/gems-3.png",
  compass: "/compass.png",
  bucket: "/bucket_1.png",
  chestGold: "/buried chest-opening-half buried-gold.png",
  chestEmpty: "/buried chest-opening-half buried.png",
  beach: "/beach - standard - with thick foam - spritesheet.png",
  rudderLeft: "/rudder_left.png",
  rudderRight: "/rudder_right.png",
  npcIdle: "/npc-idle.png",
  shopBuilding: "/house-fisherman house.png",
  crab: "/crab.png",
  crabAvatar: "/crab_avatar.png",
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
  assets.fish0,
  assets.fish1,
  assets.fish2,
  assets.fish3,
  assets.fish4,
  assets.fish5,
  assets.fish6,
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

const CHEST_FRAME_W = 128;
const CHEST_FRAME_H = 128;
const CHEST_FRAME_COUNT = 11;

const chestGoldSheet: SpriteSheet = {
  img: assets.chestGold,
  cols: CHEST_FRAME_COUNT,
  rows: 1,
  frameW: CHEST_FRAME_W,
  frameH: CHEST_FRAME_H,
  frameCount: CHEST_FRAME_COUNT,
};

const chestEmptySheet: SpriteSheet = {
  img: assets.chestEmpty,
  cols: CHEST_FRAME_COUNT,
  rows: 1,
  frameW: CHEST_FRAME_W,
  frameH: CHEST_FRAME_H,
  frameCount: CHEST_FRAME_COUNT,
};

// --- Island Maps ---
const beachImages = {
  "beach - standard - with thick foam - spritesheet.png": assets.beach,
};

const islandMap = await loadTmjMap("/island_treasure.tmj", beachImages);
const shopIslandMap = await loadTmjMap("/shop_island.tmj", beachImages);

// Shared animation state for both island types (only one shows at a time)
const islandAnimState: IslandAnimState = {
  animStartMs: null,
  animComplete: false,
  slideStartMs: null,
  slideOutStartMs: null,
  skipSlideIn: state.island.docked, // skip slide-in if loading into docked state
};

const islandEntity = createIslandEntity({
  islandMap,
  chestSheet: chestGoldSheet,
  chestEmptySheet: chestEmptySheet,
  animState: islandAnimState,
});

// --- Shop NPC click state ---
let shopModalShowing = false;
let shopNpcClicked = false;
let currentShopItems: [ShopItem, ShopItem] | null = null;

const shopIslandEntity = createShopIslandEntity({
  shopMap: shopIslandMap,
  npcImg: assets.npcIdle,
  shopImg: assets.shopBuilding,
  animState: islandAnimState,
  onNpcClick: () => {
    if (shopNpcClicked || shopModalShowing) return;
    shopNpcClicked = true;
    shopModalShowing = true;
    currentShopItems = pickShopItems();
    // Persist selected items so they survive page refresh
    state = {
      ...state,
      island: {
        ...state.island,
        shopItemIds: [currentShopItems[0].id, currentShopItems[1].id],
      },
    };
    saveToLocalStorage(state);
    shopModal.show(
      currentShopItems,
      state.resources.gold,
      state.resources.ascendencyGems,
    );
  },
});

// --- Recruitment Island ---
let recruitmentModalShowing = false;
let recruitmentNpcClicked = false;

const recruitmentIslandEntity = createRecruitmentIslandEntity({
  islandMap: islandMap, // reuse treasure island map for now
  crabImg: assets.crab,
  animState: islandAnimState,
  onCrabClick: () => {
    if (recruitmentNpcClicked || recruitmentModalShowing) return;
    recruitmentNpcClicked = true;
    recruitmentModalShowing = true;
    recruitmentModal.show(state.resources.gold, state.crabs ?? 0);
  },
});

const world = createWorldRenderer(canvas, {
  waterImg,
  shipSheet,
  mastSheet,
  bucketImg,
  rudderLeftImg: assets.rudderLeft,
  rudderRightImg: assets.rudderRight,
});

// Add island entities to the world
world.addEntity(islandEntity);
world.addEntity(shopIslandEntity);
world.addEntity(recruitmentIslandEntity);

// Single crab entity on ship (renders only when crabs > 0)
const crabOnShipEntity = createCrabOnShipEntity({
  crabImg: assets.crab,
  shipSheet,
});
world.addEntity(crabOnShipEntity);

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

// --- Island Modal (treasure) ---
let modalShowing = false;

if (pendingTreasureModal) {
  const reward = generateIslandReward(state.island.islandsVisited);
  modalShowing = true;
  setTimeout(() => islandModal.show(reward.gold, reward.gems), 300);
}

islandModal.onContinue(() => {
  islandModal.hide();
  modalShowing = false;
  startIslandDeparture();
});

// --- Shop Modal ---
if (pendingShopModal) {
  shopModalShowing = true;
  shopNpcClicked = true;
  // Restore persisted items, or pick fresh ones if missing
  if (state.island.shopItemIds) {
    currentShopItems =
      getShopItemsById(state.island.shopItemIds) ?? pickShopItems();
  } else {
    currentShopItems = pickShopItems();
    state = {
      ...state,
      island: {
        ...state.island,
        shopItemIds: [currentShopItems[0].id, currentShopItems[1].id],
      },
    };
  }
  const items = currentShopItems;
  const purchasedId = state.island.purchasedShopItemId;
  setTimeout(() => {
    shopModal.show(items, state.resources.gold, state.resources.ascendencyGems);
    if (purchasedId) {
      shopModal.updateAfterPurchase(
        purchasedId,
        state.resources.gold,
        state.resources.ascendencyGems,
      );
    }
  }, 300);
}

shopModal.onPurchase((item) => {
  const nowMs = Date.now();
  state = dispatch(state, nowMs, {
    type: "shop/itemPurchased",
    itemId: item.id,
    itemName: item.name,
    iconPath: item.iconPath,
    goldCost: item.cost,
    effect: item.effect,
    nowMs,
  });
  shopModal.updateAfterPurchase(
    item.id,
    state.resources.gold,
    state.resources.ascendencyGems,
  );
});

shopModal.onContinue(() => {
  shopModal.hide();
  shopModalShowing = false;
  startIslandDeparture();
});

// --- Recruitment Modal ---
if (pendingRecruitmentModal) {
  recruitmentModalShowing = true;
  recruitmentNpcClicked = true;
  setTimeout(
    () => recruitmentModal.show(state.resources.gold, state.crabs ?? 0),
    300,
  );
}

recruitmentModal.onPurchase((totalCost) => {
  state = dispatch(state, Date.now(), {
    type: "crabs/purchased",
    quantity: 1,
    totalCost,
  });
});

recruitmentModal.onContinue(() => {
  recruitmentModal.hide();
  recruitmentModalShowing = false;
  startIslandDeparture();
});

function startIslandDeparture() {
  // Start slide-out animation
  islandAnimState.slideOutStartMs = Date.now();

  // After slide-out completes, dispatch continue and reset
  setTimeout(() => {
    state = dispatch(state, Date.now(), { type: "island/continue" });
    islandAnimState.animStartMs = null;
    islandAnimState.animComplete = false;
    islandAnimState.slideStartMs = null;
    islandAnimState.slideOutStartMs = null;
    islandAnimState.skipSlideIn = false;
    shopNpcClicked = false;
    currentShopItems = null;
    recruitmentNpcClicked = false;
  }, SLIDE_DURATION_MS);
}

// --- Crab Auto-Click System ---
const CRAB_CLICKS_PER_SEC = 1;
let crabClickAccumulator = 0;

// --- Spawn Manager ---
let nextSpawnId = 0;
let lastSpawnAttemptMs = Date.now();

function getSpawnRateMultiplier(nowMs: number): number {
  const luckBucketLevel = state.ship.upgrades.luckBucket?.level ?? 0;
  const upgradeMultiplier = Math.pow(1.2, luckBucketLevel);
  const effectMultiplier = getActiveSpawnRateMultiplier(
    state.activeEffects ?? [],
    nowMs,
  );
  return upgradeMultiplier * effectMultiplier;
}

function totalCollectiblesOnScreen(): number {
  return (
    world.countEntitiesWithPrefix("fish-") +
    world.countEntitiesWithPrefix("gem-")
  );
}

function trySpawn(nowMs: number) {
  // Don't spawn collectibles while docked at an island
  if (state.island.docked) return;

  const spawnMultiplier = getSpawnRateMultiplier(nowMs);
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

    // Prune expired effects from state (they persist in save until cleaned up)
    const activeEffects = getActiveEffects(state.activeEffects ?? [], nowMs);
    if (activeEffects.length !== (state.activeEffects ?? []).length) {
      state = { ...state, activeEffects };
    }

    // Crab auto-clicking (compute delta BEFORE tick updates lastTick)
    const crabCount = state.crabs ?? 0;
    if (crabCount > 0 && !state.island.docked) {
      const deltaS = computeDeltaSeconds(state.lastTick, nowMs);
      crabClickAccumulator += crabCount * CRAB_CLICKS_PER_SEC * deltaS;
      while (crabClickAccumulator >= 1) {
        crabClickAccumulator -= 1;
        state = dispatch(state, nowMs, { type: "rudder/clicked", nowMs });
      }
    }

    state = tick(state, nowMs);

    if (nowMs - lastSaveAt > AUTOSAVE_INTERVAL_MS) {
      saveToLocalStorage(state);
      lastSaveAt = nowMs;
    }

    const deltaInSeconds = computeDeltaSeconds(state.lastTick, nowMs);
    world.draw(state, nowMs, deltaInSeconds);

    resourcesPanel.update(state);
    distanceDisplay.update(state);
    islandApproach.update(state);
    activeEffectsHud.update(state.activeEffects ?? [], nowMs);

    // --- Treasure island: auto-dispatch chest opened when animation completes ---
    if (
      state.island.islandType === "treasure" &&
      islandAnimState.animComplete &&
      state.island.docked &&
      !state.island.chestOpened &&
      !modalShowing
    ) {
      const reward = generateIslandReward(state.island.islandsVisited);
      state = dispatch(state, nowMs, {
        type: "island/chestOpened",
        goldReward: reward.gold,
        gemReward: reward.gems,
      });
      modalShowing = true;
      islandModal.show(reward.gold, reward.gems);
    }

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
        tooltipAnchor.entityTooltip,
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
