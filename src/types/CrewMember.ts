export type CrewMemberId = 'gunner' | 'swordsman' | 'brawler';

export type CrewMemberStats = {
  vitality: number
  strength: number
  magic: number
  precision: number
}

// magnetism -> Passive Economy modifier (gold per meter)
// lightweight -> Passive Economy modifier (base speed)
// goldPunch -> Active Economy modifier (one-time gold increase, 30 minute cooldown)
export type CrewMemberSkillId = 'magnetism' | 'lightweight' | 'goldPunch'

export type CrewMemberSkillState = {
  level: number;
}

export type CrewMemberState = {
  id: CrewMemberId
  level: number
  stats: CrewMemberStats
  skills: Record<CrewMemberSkillId, CrewMemberSkillState>
}
