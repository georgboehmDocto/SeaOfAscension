import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { GameState } from "../types/GameState";

const root = createRoot(document.getElementById("app")!);

export function renderReact(
  state: GameState,
  dispatch: (action: any) => void
) {
  root.render(<App state={state} dispatch={dispatch} />);
}
