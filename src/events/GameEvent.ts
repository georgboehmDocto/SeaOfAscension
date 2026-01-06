// import { CaptainId } from "../types/CaptainState";

export type SpawnEvent =
  | {
      id: "spawn";
      fishVariant: number;
      x: number;
      y: number;
      spawnedAt: number;
      lifetimeMs: number;
    }
  | null;


type DecisionEvent = {
  id: "decision"
}

export type GameEvent = SpawnEvent | DecisionEvent