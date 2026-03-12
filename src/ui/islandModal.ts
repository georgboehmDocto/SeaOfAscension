import { formatResource } from "../helpers/formatResource";

export type IslandModal = {
  show: (gold: number, gems: number) => void;
  hide: () => void;
  onContinue: (callback: () => void) => void;
};

export function createIslandModal(): IslandModal {
  const overlay = document.createElement("div");
  overlay.className = "island-modal-overlay";
  overlay.style.display = "none";

  overlay.innerHTML = `
    <div class="island-modal">
      <div class="island-modal-frame">
        <div class="island-modal-header">
          <div class="island-modal-title">Treasure Found!</div>
        </div>
        <div class="island-modal-body">
          <div class="island-modal-subtitle">You opened a treasure chest!</div>
          <div class="island-modal-rewards" id="island-modal-rewards"></div>
        </div>
        <div class="island-modal-footer">
          <button class="island-modal-continue" id="island-modal-continue">Continue &gt;</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const rewardsEl = document.getElementById("island-modal-rewards")!;
  const continueBtn = document.getElementById("island-modal-continue")!;

  let continueCallback: (() => void) | null = null;

  continueBtn.addEventListener("click", () => {
    continueCallback?.();
  });

  return {
    show(gold: number, gems: number) {
      let rewardsHtml = "";

      if (gold > 0) {
        rewardsHtml += `
          <div class="island-reward-item">
            <div class="island-reward-icon island-reward-gold">&#x1FA99;</div>
            <div class="island-reward-amount gold">${formatResource(gold)}</div>
          </div>
        `;
      }

      if (gems > 0) {
        rewardsHtml += `
          <div class="island-reward-item">
            <div class="island-reward-icon island-reward-gem">&#x1F48E;</div>
            <div class="island-reward-amount gem">${gems}</div>
          </div>
        `;
      }

      rewardsEl.innerHTML = rewardsHtml;
      overlay.style.display = "flex";
    },
    hide() {
      overlay.style.display = "none";
    },
    onContinue(callback: () => void) {
      continueCallback = callback;
    },
  };
}
