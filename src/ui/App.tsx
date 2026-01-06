import React from "react";
import { GameState } from "../types/GameState";
import { ChoiceSelectionModal } from "./EventModal";

type Props = {
  state: GameState;
  dispatch: (action: any) => void;
};

export function App({ state, dispatch }: Props) {
  if (state.event?.type === "selectCaptain") {
    
    return (
      <ChoiceSelectionModal
        headline={"Choose your captain"}
        text="Each captain changes your run."
        choices={[
          {
            action: { type: "captain/select", captainId: "black_beard" },
            id: "black_beard",
            label: "Black Beard",
          },
          {
            action: { type: "captain/select", captainId: "joy_girl" },
            id: "joy_girl",
            label: "Joy Girl",
          },
          {
            action: { type: "captain/select", captainId: "gwendolin" },
            id: "gwendolin",
            label: "Gwendolin",
          },
        ]}
        onConfirm={dispatch}
      />
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Sea of Ascension</h1>

      <button
        onClick={() =>
          dispatch({ type: "ship/upgradePurchased", upgradeId: "sail" })
        }
      >
        Upgrade Sail
      </button>

      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}
