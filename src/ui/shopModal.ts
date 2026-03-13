import type { ShopItem } from "../island/shopItems";
import { formatResource } from "../helpers/formatResource";

export type ShopModal = {
  show: (items: [ShopItem, ShopItem], playerGold: number, playerGems: number) => void;
  hide: () => void;
  onPurchase: (callback: (item: ShopItem) => void) => void;
  onContinue: (callback: () => void) => void;
  updateAfterPurchase: (purchasedItemId: string, playerGold: number, playerGems: number) => void;
};

export function createShopModal(): ShopModal {
  const overlay = document.createElement("div");
  overlay.className = "island-modal-overlay";
  overlay.style.display = "none";

  overlay.innerHTML = `
    <div class="island-modal">
      <div class="island-modal-frame shop-modal-frame">
        <div class="island-modal-header">
          <div class="island-modal-title">Trader's Wares</div>
        </div>
        <div class="island-modal-body">
          <div class="island-modal-subtitle">Choose one item to purchase:</div>
          <div class="shop-items-container" id="shop-items-container"></div>
        </div>
        <div class="island-modal-footer">
          <button class="island-modal-continue" id="shop-modal-continue">Continue &gt;</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const itemsContainer = document.getElementById("shop-items-container")!;
  const continueBtn = document.getElementById("shop-modal-continue")!;

  let purchaseCallback: ((item: ShopItem) => void) | null = null;
  let continueCallback: (() => void) | null = null;
  let currentItems: [ShopItem, ShopItem] | null = null;

  continueBtn.addEventListener("click", () => {
    continueCallback?.();
  });

  function canAffordItem(item: ShopItem, gold: number, gems: number): boolean {
    if (gold < item.cost) return false;
    const e = item.effect;
    if (e.type === "exchange") {
      if (e.give === "gold" && gold < item.cost + e.giveAmount) return false;
      if (e.give === "gems" && gems < e.giveAmount) return false;
    }
    return true;
  }

  function renderItems(
    items: [ShopItem, ShopItem],
    playerGold: number,
    playerGems: number,
    purchasedId: string | null,
  ) {
    currentItems = items;
    itemsContainer.innerHTML = items.map((item, i) => {
      const affordable = canAffordItem(item, playerGold, playerGems);
      const isPurchased = item.id === purchasedId;
      const isDisabled = purchasedId !== null && !isPurchased;
      const disabledClass = (isDisabled || (!affordable && !isPurchased)) ? "disabled" : "";
      const purchasedClass = isPurchased ? "purchased" : "";

      return `
        <div class="shop-item ${disabledClass} ${purchasedClass}" data-index="${i}">
          <img class="shop-item-icon" src="${item.iconPath}" alt="${item.name}" />
          <div class="shop-item-name">${item.name}</div>
          <div class="shop-item-desc">${item.description}</div>
          <div class="shop-item-effect">${getEffectText(item)}</div>
          <button class="shop-item-buy ${disabledClass} ${purchasedClass}"
                  data-index="${i}"
                  ${isPurchased || isDisabled || !affordable ? "disabled" : ""}>
            ${isPurchased ? "Purchased!" : getCostText(item)}
          </button>
        </div>
      `;
    }).join("");

    itemsContainer.querySelectorAll(".shop-item-buy").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt((e.currentTarget as HTMLElement).dataset.index!);
        const item = items[idx];
        purchaseCallback?.(item);
      });
    });
  }

  return {
    show(items: [ShopItem, ShopItem], playerGold: number, playerGems: number) {
      renderItems(items, playerGold, playerGems, null);
      overlay.style.display = "flex";
    },
    hide() {
      overlay.style.display = "none";
    },
    onPurchase(callback: (item: ShopItem) => void) {
      purchaseCallback = callback;
    },
    onContinue(callback: () => void) {
      continueCallback = callback;
    },
    updateAfterPurchase(purchasedItemId: string, playerGold: number, playerGems: number) {
      if (currentItems) {
        renderItems(currentItems, playerGold, playerGems, purchasedItemId);
      }
    },
  };
}

function getEffectText(item: ShopItem): string {
  const e = item.effect;
  switch (e.type) {
    case "exchange":
      if (e.give === "gold") {
        return `${formatResource(e.giveAmount)} gold → ${e.receiveAmount} gems`;
      } else {
        return `${e.giveAmount} gems → ${formatResource(e.receiveAmount)} gold`;
      }
    case "timedBuff": {
      const durText = formatDuration(e.durationMs);
      const buffDesc = getBuffDescription(e.buffKind, e.magnitude);
      return `${buffDesc} for ${durText}`;
    }
  }
}

function getCostText(item: ShopItem): string {
  if (item.cost > 0) return `Buy - ${formatResource(item.cost)} gold`;
  // Exchange items that cost gems instead
  const e = item.effect;
  if (e.type === "exchange" && e.give === "gems") {
    return `Trade ${e.giveAmount} gems`;
  }
  return "Buy - Free";
}

function getBuffDescription(kind: string, magnitude: number): string {
  const mult = magnitude === 2 ? "Double" : magnitude === 3 ? "Triple" : `${magnitude}×`;
  switch (kind) {
    case "speed": return `${mult} ship speed`;
    case "spawnRate": return `${mult} fish spawn rate`;
    case "goldBoost": return `${mult} gold earned`;
    default: return `${mult} ${kind}`;
  }
}

function formatDuration(ms: number): string {
  const totalMin = Math.round(ms / 60_000);
  if (totalMin >= 60) {
    const hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${totalMin}m`;
}
