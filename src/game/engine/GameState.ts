// Game state management for "El Destino en tus Manos"

export type AgePhase = "childhood" | "teen" | "young_adult" | "adult" | "elderly";

export interface CharacterStats {
  money: number;        // 0-100 normalized wealth
  education: number;    // 0-100
  health: number;       // 0-100
  happiness: number;    // 0-100
  relationships: number; // 0-100
  reputation: number;   // 0-100
  intelligence: number; // 0-100
  charisma: number;     // 0-100
}

export interface FamilyInfo {
  wealthTier: 1 | 2 | 3 | 4 | 5; // 1=poverty, 5=wealthy
  siblings: number;
  familyStatus: "united" | "divorced" | "single_parent" | "orphanage";
  parentEducation: number; // affects starting education
}

export interface CareerInfo {
  id: string;
  name: string;
  level: number;
  yearsExperience: number;
  monthlySalary: number;
}

export interface RelationshipInfo {
  id: string;
  name: string;
  type: "partner" | "friend" | "enemy" | "family";
  strength: number; // 0-100
  since: number; // age when met
}

export interface LifeEvent {
  age: number;
  month: number;
  type: "decision" | "event" | "career" | "relationship" | "milestone";
  title: string;
  description: string;
  effects: Partial<CharacterStats>;
}

export interface GameState {
  // Identity
  characterName: string;
  countryCode: string;
  countryName: string;
  city: string;
  birthYear: number;

  // Time
  currentAge: number;
  currentMonth: number; // 1-12

  // Core stats
  stats: CharacterStats;

  // Background
  family: FamilyInfo;
  talents: string[]; // natural abilities

  // Life
  career: CareerInfo | null;
  relationships: RelationshipInfo[];
  lifeEvents: LifeEvent[];
  properties: string[]; // owned properties
  achievements: string[];

  // Status
  isAlive: boolean;
  causeOfDeath: string | null;

  // Economy
  bankBalance: number; // actual money in currency units
  monthlyIncome: number;
  monthlyExpenses: number;
  debt: number;
  investments: number;
}

export function getAgePhase(age: number): AgePhase {
  if (age <= 12) return "childhood";
  if (age <= 17) return "teen";
  if (age <= 30) return "young_adult";
  if (age <= 55) return "adult";
  return "elderly";
}

export function getAgePhaseLabel(phase: AgePhase): string {
  const labels: Record<AgePhase, string> = {
    childhood: "Infancia",
    teen: "Adolescencia",
    young_adult: "Adulto joven",
    adult: "Adulto",
    elderly: "Vejez",
  };
  return labels[phase];
}

/** Clamp a stat value between 0 and 100 */
export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Apply stat effects, clamping all values */
export function applyEffects(
  stats: CharacterStats,
  effects: Partial<CharacterStats>
): CharacterStats {
  return {
    money: clampStat(stats.money + (effects.money ?? 0)),
    education: clampStat(stats.education + (effects.education ?? 0)),
    health: clampStat(stats.health + (effects.health ?? 0)),
    happiness: clampStat(stats.happiness + (effects.happiness ?? 0)),
    relationships: clampStat(stats.relationships + (effects.relationships ?? 0)),
    reputation: clampStat(stats.reputation + (effects.reputation ?? 0)),
    intelligence: clampStat(stats.intelligence + (effects.intelligence ?? 0)),
    charisma: clampStat(stats.charisma + (effects.charisma ?? 0)),
  };
}

/** Calculate final score based on all life factors */
export function calculateScore(state: GameState): number {
  const { stats } = state;
  const avgStats =
    (stats.money +
      stats.education +
      stats.health +
      stats.happiness +
      stats.relationships +
      stats.reputation +
      stats.intelligence +
      stats.charisma) /
    8;

  const longevityBonus = Math.min(state.currentAge, 90) * 2;
  const wealthBonus = Math.min(state.bankBalance / 1000, 100);
  const eventBonus = state.lifeEvents.length * 0.5;
  const achievementBonus = state.achievements.length * 10;
  const careerBonus = state.career ? state.career.level * 15 : 0;
  const relationshipBonus = state.relationships.length * 5;

  return Math.round(
    avgStats * 3 +
      longevityBonus +
      wealthBonus +
      eventBonus +
      achievementBonus +
      careerBonus +
      relationshipBonus
  );
}
