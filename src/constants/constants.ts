export const MAX_ALLOWED_DELTA_SECONDS = 60 * 60;
export const ASCENDENCY_GEM_THRESHOLD = 10000;
export const COST_GROWTH_FACTOR = 1.15;
export const AUTOSAVE_INTERVAL_MS = 5_000;

export const BASE_SPAWN_INTERVAL_MS = 12_000;
export const MAX_COLLECTIBLES_ON_SCREEN = 1;
export const FISH_LIFETIME_MS = 10_000;
export const GEM_LIFETIME_MS = 14_000;
export const FISH_SPAWN_WEIGHT = 0.75;

export const SHIP_SCALE = 1.5;

/** Base distance gained per rudder click (before upgrades) */
export const BASE_RUDDER_DISTANCE = 1;

export const ISLAND_INTERVAL_METERS = 600; // every N meters of distance

export type SeaDefinition = {
  name: string;
  goldThreshold: number;
};

export const SEAS: SeaDefinition[] = [
  { name: "Tutorial Sea", goldThreshold: 0 },
  { name: "Coral Shallows", goldThreshold: 1_000 },
  { name: "Merchant's Strait", goldThreshold: 5_000 },
  { name: "Pirate's Cove", goldThreshold: 25_000 },
  { name: "Abyssal Deep", goldThreshold: 100_000 },
  { name: "Sea of Ascension", goldThreshold: 500_000 },
];

export function getCurrentSea(lifeTimeGoldEarned: number): SeaDefinition {
  for (let i = SEAS.length - 1; i >= 0; i--) {
    if (lifeTimeGoldEarned >= SEAS[i].goldThreshold) return SEAS[i];
  }
  return SEAS[0];
}

export function getNextSea(lifeTimeGoldEarned: number): SeaDefinition | null {
  for (const sea of SEAS) {
    if (lifeTimeGoldEarned < sea.goldThreshold) return sea;
  }
  return null;
}
