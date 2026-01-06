import { GameTooltip, registerTooltip, type TooltipModel } from "./tooltip";

export function createTooltipController() {
  registerTooltip();
  const el = document.createElement(GameTooltip.tag) as GameTooltip;
  document.body.appendChild(el);

  return {
    show: (m: TooltipModel) => el.show(m),
    hide: () => el.hide(),
    el,
  };
}
