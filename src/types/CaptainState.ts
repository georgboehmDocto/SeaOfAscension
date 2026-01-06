import { CrewMemberStats } from "./CrewMember";

export type CaptainId = 'black_beard' | 'joy_girl' | 'gwendolin';

export type CaptainState = {
  id: CaptainId;
  level: number;
  stats: CrewMemberStats;
  skills: Record<string, number>;
};
