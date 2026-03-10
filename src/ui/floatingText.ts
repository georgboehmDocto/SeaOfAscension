/**
 * Shows a floating text that drifts upward and fades out.
 * Uses CSS animations on a DOM element, self-cleans after animation.
 */
export function showFloatingText(
  x: number,
  y: number,
  text: string,
  color: string = "#FFD700"
) {
  const el = document.createElement("div");
  el.className = "floating-text";
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.color = color;

  document.body.appendChild(el);

  el.addEventListener("animationend", () => {
    el.remove();
  });
}
