// persistence.ts
import { ISLAND_INTERVAL_METERS } from "../constants/constants";
import { GameState } from "../types/GameState";

const STORAGE_KEY = "sea-of-ascension:save";

export type SaveResult =
  | { kind: "ok"; state: GameState }
  | { kind: "empty" }
  | { kind: "invalid"; reason: string };

export function saveToLocalStorage(state: GameState): void {
  const payload = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, payload);
}

export function loadFromLocalStorage(): GameState | null {
  const raw = localStorage.getItem("sea-of-ascension:save");
  if (!raw) return null;

  const parsed = JSON.parse(raw);
  const migrated = migrate(parsed);
  return migrated as GameState;
}

export function resetLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportSave(state: GameState): string {
  // V0: plain JSON base64 so user can copy/paste
  const json = JSON.stringify(state);
  return btoa(unescape(encodeURIComponent(json))); // handles unicode safely
}

export function importSave(encoded: string): SaveResult {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(json) as unknown;
    const migrated = migrate(parsed);
    const validated = validate(migrated);
    if (!validated.ok) return { kind: "invalid", reason: validated.reason };
    return { kind: "ok", state: validated.state };
  } catch {
    return { kind: "invalid", reason: "Import decode/parse failed" };
  }
}

/** Migration: unknown -> unknown -> GameState-ish */
function migrate(input: unknown): unknown {
  if (!input || typeof input !== "object") return input;
  const s = input as any;

  // Migrate crowsNest -> luckBucket and ensure it exists
  if (s.ship?.upgrades) {
    if (s.ship.upgrades.crowsNest) {
      s.ship.upgrades.luckBucket = s.ship.upgrades.crowsNest;
      delete s.ship.upgrades.crowsNest;
    }
    if (!s.ship.upgrades.luckBucket) {
      s.ship.upgrades.luckBucket = { level: 0, cost: 200, resource: "gold" };
    }
    if (!s.ship.upgrades.rudder) {
      s.ship.upgrades.rudder = { level: 0, cost: 15, resource: "gold" };
    }
  }

  // Ensure island state exists for old saves
  if (!s.island) {
    // Compute next island threshold ahead of current distance
    const currentDistance = s.resources?.distance ?? 0;
    const interval = ISLAND_INTERVAL_METERS;
    const nextIslandAt = Math.ceil(currentDistance / interval + 1) * interval;
    s.island = {
      nextIslandAt,
      docked: false,
      chestOpened: false,
      islandsVisited: 0,
    };
  }
  // Fix stuck saves: if docked but nextIslandAt is way behind, unstick
  if (s.island?.docked && s.resources?.distance > s.island.nextIslandAt + 10) {
    const interval = ISLAND_INTERVAL_METERS;
    const currentDistance = s.resources.distance;
    s.island.nextIslandAt = Math.ceil(currentDistance / interval + 1) * interval;
    s.island.docked = false;
    s.island.chestOpened = false;
  }

  // Ensure new island fields exist (shop island migration)
  if (s.island && s.island.islandType === undefined) {
    s.island.islandType = "treasure";
    s.island.shopItemPurchased = false;
    s.island.purchasedShopItemId = null;
    s.island.shopItemIds = null;
  }
  if (s.island && s.island.shopItemIds === undefined) {
    s.island.shopItemIds = null;
    s.island.purchasedShopItemId = null;
  }

  // Ensure activeEffects exists
  if (!s.activeEffects) {
    s.activeEffects = [];
  }

  // Ensure crabs field exists
  if (s.crabs === undefined) {
    s.crabs = 0;
  }

  return s;
}

function validate(
  input: unknown
): { ok: true; state: GameState } | { ok: false; reason: string } {
  if (!input || typeof input !== "object")
    return { ok: false, reason: "Not an object" };
  const s = input as any;

  if (typeof s.version !== "number")
    return { ok: false, reason: "Missing version" };

  if (typeof s.lastTick !== "number")
    return { ok: false, reason: "Missing lastTick" };
  if (!s.resources) return { ok: false, reason: "Missing resources" };
  if (!s.ship) return { ok: false, reason: "Missing ship" };
  // captain can be null in V0
  if (s.captain !== null && typeof s.captain !== "object")
    return { ok: false, reason: "Invalid captain" };

  // Minimal: trust the rest for now.
  return { ok: true, state: s as GameState };
}
