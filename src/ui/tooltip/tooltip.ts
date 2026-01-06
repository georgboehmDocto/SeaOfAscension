export type TooltipModel = {
  x: number;
  y: number;
  title: string;

  current?: { level: number; bonus: string };
  next?: { cost: number; bonus: string };
  details?: string
};

export class GameTooltip extends HTMLElement {
  static tag = "game-tooltip";

  #root: ShadowRoot;
  #wrap!: HTMLDivElement;
  #title!: HTMLDivElement;
  #current!: HTMLDivElement;
  #next!: HTMLDivElement;
  #details!: HTMLDivElement;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "open" });

    this.#root.innerHTML = `
      <style>
        .wrap { position: fixed; pointer-events:none; padding: 6px 8px; border-radius:6px;
                background: rgba(0,0,0,0.75); color:white; font:12px monospace; display:none; z-index:10; }
        .title { font-weight:700; margin-bottom:4px; }
        .row { opacity:0.95; }
        .muted { opacity:0.75; margin-top:4px; }
        #details { white-space: pre-line; }
      </style>

      <div class="wrap" id="wrap" role="tooltip">
        <div class="title" id="title"></div>
        <div class="row" id="current"></div>
        <div class="row muted" id="next"></div>
        <div class="row" id="details"></div>
      </div>
    `;
  }

  connectedCallback() {
    this.#wrap = this.#root.querySelector("#wrap") as HTMLDivElement;
    this.#title = this.#root.querySelector("#title") as HTMLDivElement;
    this.#current = this.#root.querySelector("#current") as HTMLDivElement;
    this.#next = this.#root.querySelector("#next") as HTMLDivElement;
    this.#details = this.#root.querySelector("#details") as HTMLDivElement;
  }

  show(m: TooltipModel) {
    this.#title.textContent = m.title;

    if (m.current) {
      this.#current.style.display = "block";
      this.#current.textContent = `Level ${m.current.level}; ${m.current.bonus}`;
    } else {
      this.#current.style.display = "none";
    }

    if (m.next) {
      this.#next.style.display = "block";
      this.#next.textContent = `Next: ${m.next.cost} gold; ${m.next.bonus}`;
    } else {
      this.#next.style.display = "none";
    }

      if (m.details) {
      this.#details.style.display = "block";
      this.#details.textContent = `${m.details}`;
    } else {
      this.#details.style.display = "none";
    }

    this.#wrap.style.left = `${m.x}px`;
    this.#wrap.style.top = `${m.y}px`;
    this.#wrap.style.display = "block";
  }

  hide() {
    this.#wrap.style.display = "none";
  }
}

export function registerTooltip() {
  if (!customElements.get(GameTooltip.tag)) {
    customElements.define(GameTooltip.tag, GameTooltip);
  }
}
``
