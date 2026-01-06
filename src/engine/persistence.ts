// persistence.ts
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
  const gameState: GameState | null = raw ? JSON.parse(raw) : null;
  
  return gameState;
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
  // V0: accept only version 1 for now
  // Later: detect older versions and transform.
  return input;
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
