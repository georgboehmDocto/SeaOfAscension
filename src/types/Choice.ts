import { GameAction } from "../actions/GameAction";

export type Choice = {
  id: string;
  label: string;
  description?: string;
  action: GameAction;
};