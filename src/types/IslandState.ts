import { ISLAND_INTERVAL_METERS } from "../constants/constants";

export type IslandType = "treasure" | "shop";

export type IslandState = {
  /** Distance at which the next island spawns */
  nextIslandAt: number;
  /** Whether the ship is currently stopped at an island */
  docked: boolean;
  /** Whether the chest on the current island has been opened */
  chestOpened: boolean;
  /** Total islands visited (for scaling rewards later) */
  islandsVisited: number;
  /** Type of the current island (treasure or shop) */
  islandType: IslandType;
  /** Whether a shop item has been purchased at the current shop island */
  shopItemPurchased: boolean;
  /** ID of the purchased shop item (null if none purchased yet) */
  purchasedShopItemId: string | null;
  /** Persisted shop item IDs for the current shop visit (survives reload) */
  shopItemIds: [string, string] | null;
};

/** Determine island type based on visit count: every 3rd island is a shop */
export function getIslandType(islandsVisited: number): IslandType {
  return islandsVisited > 0 && islandsVisited % 3 === 0 ? "shop" : "treasure";
}

export function getDefaultIslandState(): IslandState {
  return {
    nextIslandAt: ISLAND_INTERVAL_METERS,
    docked: false,
    chestOpened: false,
    islandsVisited: 0,
    islandType: "treasure",
    shopItemPurchased: false,
    purchasedShopItemId: null,
    shopItemIds: null,
  };
}
