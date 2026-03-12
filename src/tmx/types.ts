/** A single animation frame */
export type TileAnimFrame = {
  tileId: number;
  duration: number;
};

/** Parsed tileset with animation data */
export type ParsedTileset = {
  firstGid: number;
  tileWidth: number;
  tileHeight: number;
  columns: number;
  tileCount: number;
  image: HTMLImageElement;
  /** Map of tile ID (local) → animation frames */
  animations: Map<number, TileAnimFrame[]>;
};

/** A loaded Tiled map ready for rendering */
export type TiledMap = {
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  layers: TileLayer[];
  tilesets: ParsedTileset[];
};

export type TileLayer = {
  name: string;
  data: number[];
  width: number;
  height: number;
  visible: boolean;
};
