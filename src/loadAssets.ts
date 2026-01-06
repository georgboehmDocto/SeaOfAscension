export async function loadAssets<T extends string>(
  manifest: Record<T, string>
): Promise<Record<T, HTMLImageElement>> {
  const entries = await Promise.all(
    (Object.entries(manifest) as [T, string][]).map(
      async ([key, src]) => {
        const img = await loadImage(src);
        return [key, img] as const;
      }
    )
  );

  return Object.fromEntries(entries) as Record<T, HTMLImageElement>;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}
