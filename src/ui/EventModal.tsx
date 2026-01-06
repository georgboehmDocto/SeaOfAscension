import React from "react";
import { GameAction } from "../actions/GameAction";
import { Choice } from "../types/Choice";

type Props = {
  headline: string;
  text?: string;
  choices: Choice[];
  onConfirm: (action: GameAction) => void;
};

export function ChoiceSelectionModal({ headline, text, choices, onConfirm }: Props) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const selected = choices[selectedIndex];

  return (
    <div>
      <h1>{headline}</h1>
      {text && <p>{text}</p>}

      {choices.map((choice, idx) => (
        <button
          key={choice.id + ":" + idx}
          className={idx === selectedIndex ? "selected" : ""}
          onClick={() => setSelectedIndex(idx)}
          type="button"
        >
          {choice.label}
        </button>
      ))}

      <button type="button" onClick={() => onConfirm(selected.action)}>
        Select
      </button>
    </div>
  );
}
