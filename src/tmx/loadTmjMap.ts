import type { TiledMap, TileLayer, ParsedTileset, TileAnimFrame } from "./types";

/**
 * Load a Tiled JSON map (.tmj) and its tileset definitions (.tsx).
 *
 * @param tmjUrl  URL to the .tmj file (e.g. "/island_treasure.tmj")
 * @param images  Map of image filename → already-loaded HTMLImageElement.
 *                The loader matches tileset image sources against these keys.
 */
export async function loadTmjMap(
  tmjUrl: string,
  images: Record<string, HTMLImageElement>,
): Promise<TiledMap> {
  const res = await fetch(tmjUrl);
  const json = await res.json();

  const tilesets: ParsedTileset[] = [];

  for (const tsRef of json.tilesets) {
    const firstGid: number = tsRef.firstgid;

    // Resolve tsx URL relative to the tmj
    const base = tmjUrl.substring(0, tmjUrl.lastIndexOf("/") + 1);
    const tsxUrl = base + tsRef.source;

    const tsxRes = await fetch(tsxUrl);
    const tsxText = await tsxRes.text();
    const tsxDoc = new DOMParser().parseFromString(tsxText, "text/xml");
    const tilesetEl = tsxDoc.querySelector("tileset")!;

    const tileWidth = parseInt(tilesetEl.getAttribute("tilewidth")!);
    const tileHeight = parseInt(tilesetEl.getAttribute("tileheight")!);
    const columns = parseInt(tilesetEl.getAttribute("columns")!);
    const tileCount = parseInt(tilesetEl.getAttribute("tilecount")!);

    // Find the matching image from pre-loaded assets
    const imgEl = tilesetEl.querySelector("image")!;
    const imgSource = imgEl.getAttribute("source")!;
    const imgFilename = imgSource.substring(imgSource.lastIndexOf("/") + 1);

    const image = findImage(images, imgFilename);
    if (!image) {
      throw new Error(
        `TMX loader: no pre-loaded image matching "${imgFilename}". ` +
        `Available: ${Object.keys(images).join(", ")}`,
      );
    }

    // Parse tile animations
    const animations = new Map<number, TileAnimFrame[]>();
    for (const tileEl of tilesetEl.querySelectorAll("tile")) {
      const animEl = tileEl.querySelector("animation");
      if (!animEl) continue;

      const localId = parseInt(tileEl.getAttribute("id")!);
      const frames: TileAnimFrame[] = [];

      for (const frameEl of animEl.querySelectorAll("frame")) {
        frames.push({
          tileId: parseInt(frameEl.getAttribute("tileid")!),
          duration: parseInt(frameEl.getAttribute("duration")!),
        });
      }

      animations.set(localId, frames);
    }

    tilesets.push({ firstGid, tileWidth, tileHeight, columns, tileCount, image, animations });
  }

  // Parse layers
  const layers: TileLayer[] = [];
  for (const layerJson of json.layers) {
    if (layerJson.type !== "tilelayer") continue;
    layers.push({
      name: layerJson.name,
      data: layerJson.data,
      width: layerJson.width,
      height: layerJson.height,
      visible: layerJson.visible,
    });
  }

  return {
    width: json.width,
    height: json.height,
    tileWidth: json.tilewidth,
    tileHeight: json.tileheight,
    layers,
    tilesets,
  };
}

/** Fuzzy-match a pre-loaded image by filename */
function findImage(
  images: Record<string, HTMLImageElement>,
  filename: string,
): HTMLImageElement | null {
  // Try exact key match first
  if (images[filename]) return images[filename];

  // Try matching by the end of the key (handles path differences)
  const lower = filename.toLowerCase();
  for (const [key, img] of Object.entries(images)) {
    if (key.toLowerCase().endsWith(lower) || lower.endsWith(key.toLowerCase())) {
      return img;
    }
  }

  // Try partial match (beach spritesheet has a long name)
  for (const [, img] of Object.entries(images)) {
    if (img.src.toLowerCase().includes(lower.replace(/\s+/g, "%20"))) {
      return img;
    }
  }

  return null;
}
