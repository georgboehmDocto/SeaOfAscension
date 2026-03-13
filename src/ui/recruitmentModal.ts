import { formatResource } from "../helpers/formatResource";

const BASE_CRAB_COST = 10;
const COST_SCALE = 1.5;

/** Cost to buy `quantity` crabs starting from `owned` crabs already owned */
export function getCrabCost(owned: number, quantity: number): number {
  let total = 0;
  for (let i = 0; i < quantity; i++) {
    total += Math.floor(BASE_CRAB_COST * Math.pow(COST_SCALE, owned + i));
  }
  return total;
}

/** Cost of the next single crab */
export function getNextCrabCost(owned: number): number {
  return Math.floor(BASE_CRAB_COST * Math.pow(COST_SCALE, owned));
}

export type RecruitmentModal = {
  show: (playerGold: number, crabsOwned: number) => void;
  hide: () => void;
  onPurchase: (callback: (quantity: number, totalCost: number) => void) => void;
  onContinue: (callback: () => void) => void;
};

export function createRecruitmentModal(): RecruitmentModal {
  const overlay = document.createElement("div");
  overlay.className = "island-modal-overlay";
  overlay.style.display = "none";

  overlay.innerHTML = `
    <div class="island-modal">
      <div class="island-modal-frame recruitment-modal-frame">
        <div class="island-modal-header">
          <div class="island-modal-title">Recruit Crabs!</div>
        </div>
        <div class="island-modal-body">
          <div class="island-modal-subtitle">Crabs will auto-row your ship!</div>
          <div class="recruitment-content">
            <div class="recruitment-crab-preview">
              <img src="/crab.png" class="recruitment-crab-img" alt="Crab" />
              <div class="recruitment-crab-effect">+0.1 rows/sec each</div>
            </div>
            <div class="recruitment-controls">
              <div class="recruitment-quantity-row">
                <button class="recruitment-qty-btn" id="recruit-minus">-</button>
                <span class="recruitment-qty-value" id="recruit-qty">1</span>
                <button class="recruitment-qty-btn" id="recruit-plus">+</button>
              </div>
              <div class="recruitment-cost" id="recruit-cost">Cost: 10 gold</div>
              <div class="recruitment-owned" id="recruit-owned">Crabs owned: 0</div>
              <button class="recruitment-buy-btn" id="recruit-buy">Recruit!</button>
            </div>
          </div>
        </div>
        <div class="island-modal-footer">
          <button class="island-modal-continue" id="recruit-continue">Continue &gt;</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const qtyEl = document.getElementById("recruit-qty")!;
  const costEl = document.getElementById("recruit-cost")!;
  const ownedEl = document.getElementById("recruit-owned")!;
  const buyBtn = document.getElementById("recruit-buy") as HTMLButtonElement;
  const minusBtn = document.getElementById("recruit-minus")!;
  const plusBtn = document.getElementById("recruit-plus")!;
  const continueBtn = document.getElementById("recruit-continue")!;

  let purchaseCallback: ((quantity: number, totalCost: number) => void) | null = null;
  let continueCallback: (() => void) | null = null;

  let quantity = 1;
  let currentGold = 0;
  let currentOwned = 0;
  let purchased = false;

  function updateDisplay() {
    qtyEl.textContent = String(quantity);
    const cost = getCrabCost(currentOwned, quantity);
    costEl.textContent = `Cost: ${formatResource(cost)} gold`;
    ownedEl.textContent = `Crabs owned: ${currentOwned}`;
    const canAfford = currentGold >= cost;
    buyBtn.disabled = !canAfford || purchased;
    buyBtn.textContent = purchased ? "Recruited!" : "Recruit!";
    if (purchased) {
      buyBtn.classList.add("purchased");
    } else {
      buyBtn.classList.remove("purchased");
    }
  }

  minusBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      updateDisplay();
    }
  });

  plusBtn.addEventListener("click", () => {
    quantity++;
    const cost = getCrabCost(currentOwned, quantity);
    if (cost > currentGold) {
      quantity--;
    }
    updateDisplay();
  });

  buyBtn.addEventListener("click", () => {
    if (purchased) return;
    const cost = getCrabCost(currentOwned, quantity);
    if (currentGold < cost) return;
    purchased = true;
    currentGold -= cost;
    currentOwned += quantity;
    purchaseCallback?.(quantity, cost);
    updateDisplay();
  });

  continueBtn.addEventListener("click", () => {
    continueCallback?.();
  });

  return {
    show(playerGold: number, crabsOwned: number) {
      quantity = 1;
      currentGold = playerGold;
      currentOwned = crabsOwned;
      purchased = false;
      updateDisplay();
      overlay.style.display = "flex";
    },
    hide() {
      overlay.style.display = "none";
    },
    onPurchase(callback: (quantity: number, totalCost: number) => void) {
      purchaseCallback = callback;
    },
    onContinue(callback: () => void) {
      continueCallback = callback;
    },
  };
}
