export type IslandReward = {
  gold: number;
  gems: number;
};

/**
 * Generate a random treasure island reward.
 * Rewards scale with the number of islands visited.
 */
export function generateIslandReward(islandsVisited: number): IslandReward {
  const tier = Math.floor(islandsVisited / 3); // every 3 islands, rewards scale up

  // Gold: base 100-500, scaling with tier
  const goldBase = 100 + tier * 150;
  const goldRange = 400 + tier * 200;
  const gold = Math.floor(goldBase + Math.random() * goldRange);

  // Gems: 1-5, with higher chance of more at higher tiers
  const gemMin = 1 + Math.floor(tier / 2);
  const gemMax = Math.min(3 + tier, 10);
  const gems = gemMin + Math.floor(Math.random() * (gemMax - gemMin + 1));

  return { gold, gems };
}
