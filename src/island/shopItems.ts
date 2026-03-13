import type { ActiveEffectKind } from "../types/ActiveEffect";

/**
 * Shop item effect types.
 *
 * To add a new effect kind:
 * 1. Add a new variant here
 * 2. Handle it in the reducer (reduce.ts, "shop/itemPurchased" case)
 * 3. If it's a timed effect, add the ActiveEffectKind in ActiveEffect.ts
 *    and handle it in getActiveEffectModifiers.ts
 */
export type ShopItemEffect =
  | { type: "exchange"; give: "gold"; giveAmount: number; receive: "gems"; receiveAmount: number }
  | { type: "exchange"; give: "gems"; giveAmount: number; receive: "gold"; receiveAmount: number }
  | { type: "timedBuff"; buffKind: ActiveEffectKind; magnitude: number; durationMs: number };

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  /** Gold cost to purchase */
  cost: number;
  /** Path to image asset (relative to public/) */
  iconPath: string;
  effect: ShopItemEffect;
};

const FIVE_MINUTES = 5 * 60 * 1000;
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const SHOP_ITEM_POOL: ShopItem[] = [
  // --- Exchange items ---
  {
    id: "banana-gems",
    name: "Golden Banana",
    description: "Trade gold for precious gems.",
    cost: 300,
    iconPath: "/fruits-banana1.png",
    effect: { type: "exchange", give: "gold", giveAmount: 300, receive: "gems", receiveAmount: 3 },
  },
  {
    id: "grapes-gold",
    name: "Merchant's Grapes",
    description: "Sell rare grapes for a pouch of gold.",
    cost: 0,
    iconPath: "/fruits-grapes1.png",
    effect: { type: "exchange", give: "gems", giveAmount: 2, receive: "gold", receiveAmount: 500 },
  },
  {
    id: "watermelon-gems",
    name: "Enchanted Melon",
    description: "A massive melon worth a fortune in gems.",
    cost: 600,
    iconPath: "/fruits-watermelon1.png",
    effect: { type: "exchange", give: "gold", giveAmount: 600, receive: "gems", receiveAmount: 7 },
  },
  {
    id: "pumpkin-gold",
    name: "Pumpkin of Plenty",
    description: "Trade gems for a haul of gold.",
    cost: 0,
    iconPath: "/fruits-pumpkin1.png",
    effect: { type: "exchange", give: "gems", giveAmount: 5, receive: "gold", receiveAmount: 1500 },
  },

  // --- Timed buff items ---
  {
    id: "apple-speed",
    name: "Swift Apple",
    description: "Double ship speed for 5 minutes.",
    cost: 200,
    iconPath: "/fruits-apple1.png",
    effect: { type: "timedBuff", buffKind: "speed", magnitude: 2, durationMs: FIVE_MINUTES },
  },
  {
    id: "orange-spawn",
    name: "Lucky Orange",
    description: "Fish appear twice as often for 15 minutes.",
    cost: 250,
    iconPath: "/fruits-orange1.png",
    effect: { type: "timedBuff", buffKind: "spawnRate", magnitude: 2, durationMs: FIFTEEN_MINUTES },
  },
  {
    id: "pineapple-gold",
    name: "Golden Pineapple",
    description: "Earn 50% more gold for 30 minutes.",
    cost: 400,
    iconPath: "/fruits-pineapple.png",
    effect: { type: "timedBuff", buffKind: "goldBoost", magnitude: 1.5, durationMs: THIRTY_MINUTES },
  },
  {
    id: "strawberry-speed",
    name: "Turbo Strawberry",
    description: "Triple ship speed for 5 minutes!",
    cost: 500,
    iconPath: "/fruits-strawberry.png",
    effect: { type: "timedBuff", buffKind: "speed", magnitude: 3, durationMs: FIVE_MINUTES },
  },
  {
    id: "lemon-spawn",
    name: "Zesty Lemon",
    description: "Fish appear 3× as often for 5 minutes.",
    cost: 350,
    iconPath: "/fruits-lemon1.png",
    effect: { type: "timedBuff", buffKind: "spawnRate", magnitude: 3, durationMs: FIVE_MINUTES },
  },
  {
    id: "pear-gold",
    name: "Gilded Pear",
    description: "Double gold earned for 1 hour.",
    cost: 800,
    iconPath: "/fruits-pear.png",
    effect: { type: "timedBuff", buffKind: "goldBoost", magnitude: 2, durationMs: ONE_HOUR },
  },
  {
    id: "papaya-speed",
    name: "Voyager's Papaya",
    description: "50% faster sailing for 30 minutes.",
    cost: 300,
    iconPath: "/fruits-papaya1.png",
    effect: { type: "timedBuff", buffKind: "speed", magnitude: 1.5, durationMs: THIRTY_MINUTES },
  },
  {
    id: "avocado-spawn",
    name: "Avocado of Fortune",
    description: "Double spawn rate for 30 minutes.",
    cost: 350,
    iconPath: "/fruits-avocado1.png",
    effect: { type: "timedBuff", buffKind: "spawnRate", magnitude: 2, durationMs: THIRTY_MINUTES },
  },
];

/** Pick 2 random distinct items from the pool */
export function pickShopItems(): [ShopItem, ShopItem] {
  const shuffled = [...SHOP_ITEM_POOL].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

/** Look up items by their IDs (for restoring from save) */
export function getShopItemsById(ids: [string, string]): [ShopItem, ShopItem] | null {
  const a = SHOP_ITEM_POOL.find((i) => i.id === ids[0]);
  const b = SHOP_ITEM_POOL.find((i) => i.id === ids[1]);
  if (!a || !b) return null;
  return [a, b];
}
