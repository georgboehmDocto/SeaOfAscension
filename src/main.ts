import { dispatch } from "./actions/dispatch";
import { AUTOSAVE_INTERVAL_MS } from "./constants/constants";
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
import { GameState, initialGameState } from "./types/GameState";
import { attachCanvasInput, type TooltipAnchor } from "./ui/canvas/input";
import { SpriteSheet } from "./sprites/spritesheet";
import { createWorldRenderer } from "./ui/canvas/worldRenderer";
import { computeOpaqueBounds } from "./ui/canvas/computeOpaqueBounds";
import { createTooltipController } from "./ui/tooltip";
import { getTooltipModel } from "./ui/canvas/getTooltipModel";
import { generateRandomEvent } from "./events/generateRandomEvent";
import { handleEvent } from "./events/eventHandler";

/**
 * LESS IMPORTANT THINGS - DEBUGGING & TESTING PURPOSES
 */
const captainBtn = document.getElementById("captain") as HTMLButtonElement;
const upgradeBtn = document.getElementById("upgrade") as HTMLButtonElement;
const saveGameButton = document.getElementById("saveGame") as HTMLButtonElement;
const exportGameButton = document.getElementById(
  "exportGame"
) as HTMLButtonElement;
const resetGameButton = document.getElementById(
  "resetGame"
) as HTMLButtonElement;
const importGameButton = document.getElementById(
  "importGame"
) as HTMLButtonElement;

let state = loadFromLocalStorage() ?? initialGameState;
let lastSaveAt = Date.now();

// Keep a "last rendered timestamp" so input and render can share time if needed
let lastNowMs = Date.now();

// Tooltip anchor is set by input; tooltip content is derived from (state + anchor)
let tooltipAnchor: TooltipAnchor = null;

// Create tooltip component/controller (replaces the raw tooltip div)
const tooltip = createTooltipController();

const canvas = document.getElementById("world") as HTMLCanvasElement;

const assets = await loadAssets({
  waterTile: "/water-tile.png",
  ship: "/boat-sailing-up.png",
  goldChest: "/chest_0.png",
  mast: "/flag-pirate2.png",
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
  goldChestImg,
  mastSheet,
});

// TODO: Move to some start up function
computeOpaqueBounds(mastSheet);
computeOpaqueBounds(shipSheet);

attachCanvasInput({
  canvas,
  getEntities: world.getEntities,
  getState: () => state,
  setState: (s) => (state = s),
  dispatchAction: dispatch,
  getNowMs: () => lastNowMs,
  setTooltipAnchor: (a) => (tooltipAnchor = a),
});

function start() {
  function loop() {
    const nowMs = Date.now();
    lastNowMs = nowMs;

    // Advance simulation only when running
    state = tick(state, nowMs);

    if (nowMs - lastSaveAt > AUTOSAVE_INTERVAL_MS) {
      saveToLocalStorage(state);
      lastSaveAt = nowMs;
    }

    // Draw ALWAYS so UI still renders when paused
    const deltaInSeconds = computeDeltaSeconds(state.lastTick, nowMs);
    world.draw(state, nowMs, deltaInSeconds);

    // TODO: EVENT HANDLING
    // const eventOngoing = state.event !== null;
    // const newEvent = generateRandomEvent({
    //   eventOngoing,
    //   canvas,
    //   fishImgCount: 7,
    //   nowMs,
    // });

    // // TODO
    // if (newEvent) {
    //   state.event = newEvent;
    // }

    // handleEvent(state, state.event, {
    //   addEntity: world.addEntity,
    //   removeEntity: world.removeEntity,
    //   canvas,
    //   fishImages: [
    //     // TODO
    //     assets.fish0,
    //     assets.fish1,
    //     assets.fish2,
    //     assets.fish3,
    //     assets.fish4,
    //     assets.fish5,
    //     assets.fish6,
    //   ],
    // });

    // eventHandler.handle()

    // Tooltip render = derived view from (state + anchor)
    if (!tooltipAnchor) {
      tooltip.hide();
    } else {
      const model = getTooltipModel(
        state,
        tooltipAnchor.entityId,
        tooltipAnchor.x,
        tooltipAnchor.y,
        nowMs
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

// // action
// captainBtn.addEventListener("click", () => {
//   const now = Date.now();
//   state = dispatch(state, now, { type: "captain/levelUp" });
// });

// // action
// upgradeBtn.addEventListener("click", () => {
//   const now = Date.now();
//   state = dispatch(state, now, {
//     type: "ship/upgradePurchased",
//     upgradeId: "sail",
//   });
// });

// action
saveGameButton.addEventListener("click", () => {
  saveToLocalStorage(state);
});

// action
exportGameButton.addEventListener("click", () => {
  console.log("exportSave: ", exportSave(state));
});

// action
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
      lastTick: Date.now(), // IMPORTANT
    };
    saveToLocalStorage(state);
  } else {
    console.error("[import] failed:", result);
    alert("Import failed: " + ("reason" in result ? result.reason : "unknown"));
  }
});
