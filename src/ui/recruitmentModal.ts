import { formatResource } from "../helpers/formatResource";

const BASE_CRAB_COST = 10;
const COST_SCALE = 1.5;

/** Cost of the next single crab */
export function getNextCrabCost(owned: number): number {
  return Math.floor(BASE_CRAB_COST * Math.pow(COST_SCALE, owned));
}

export type RecruitmentModal = {
  show: (playerGold: number, crabsOwned: number) => void;
  hide: () => void;
  onPurchase: (callback: (totalCost: number) => void) => void;
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
          <div class="island-modal-title">Recruit a Crab!</div>
        </div>
        <div class="island-modal-body">
          <div class="island-modal-subtitle">A crab wants to join your crew!</div>
          <div class="recruitment-content">
            <div class="recruitment-crab-preview">
              <img src="/crab_avatar.png" class="recruitment-crab-img" alt="Crab" />
              <div class="recruitment-crab-effect">+1 auto-row/sec</div>
            </div>
            <div class="recruitment-controls">
              <div class="recruitment-cost" id="recruit-cost">Cost: 10 gold</div>
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

  const costEl = document.getElementById("recruit-cost")!;
  const buyBtn = document.getElementById("recruit-buy") as HTMLButtonElement;
  const continueBtn = document.getElementById("recruit-continue")!;

  let purchaseCallback: ((totalCost: number) => void) | null = null;
  let continueCallback: (() => void) | null = null;

  let currentGold = 0;
  let currentOwned = 0;
  let purchased = false;

  function updateDisplay() {
    const cost = getNextCrabCost(currentOwned);
    costEl.textContent = `Cost: ${formatResource(cost)} gold`;
    const canAfford = currentGold >= cost;
    buyBtn.disabled = !canAfford || purchased;
    buyBtn.textContent = purchased ? "Recruited!" : "Recruit!";
    if (purchased) {
      buyBtn.classList.add("purchased");
    } else {
      buyBtn.classList.remove("purchased");
    }
  }

  buyBtn.addEventListener("click", () => {
    if (purchased) return;
    const cost = getNextCrabCost(currentOwned);
    if (currentGold < cost) return;
    purchased = true;
    currentGold -= cost;
    currentOwned += 1;
    purchaseCallback?.(cost);
    updateDisplay();
  });

  continueBtn.addEventListener("click", () => {
    continueCallback?.();
  });

  return {
    show(playerGold: number, crabsOwned: number) {
      currentGold = playerGold;
      currentOwned = crabsOwned;
      purchased = false;
      updateDisplay();
      overlay.style.display = "flex";
    },
    hide() {
      overlay.style.display = "none";
    },
    onPurchase(callback: (totalCost: number) => void) {
      purchaseCallback = callback;
    },
    onContinue(callback: () => void) {
      continueCallback = callback;
    },
  };
}
