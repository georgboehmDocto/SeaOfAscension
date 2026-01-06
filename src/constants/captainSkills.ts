import { CaptainId } from "../types/CaptainState";
import {  SkillId } from "./skills";

export const CAPTAIN_CLASS_SKILLSETS: Record<CaptainId, SkillId[]> = {
  joy_girl: ["lightweight", "magnetism"],
  black_beard: ["goldPunch"],
  gwendolin: ["magnetism"],
};