// Turn-by-turn game progression manager

import type { GameState, CharacterStats, LifeEvent } from "./GameState";
import { getAgePhase, applyEffects, clampStat } from "./GameState";
import { getRandomEvents } from "@/game/data/events";
import { getDecisionsForTurn } from "@/game/data/decisions";
import { getRandomCountry, type Country } from "@/game/data/countries";
import type { Decision } from "@/game/data/decisions";
import type { GameEvent } from "@/game/data/events";

export interface TurnResult {
  events: GameEvent[];
  decisions: Decision[];
  monthlyUpdate: {
    incomeChange: number;
    expenseChange: number;
    balanceChange: number;
    healthDelta: number;
    happinessDelta: number;
  };
  newAge: boolean; // did we advance a year?
  newPhase: boolean; // did we enter a new life phase?
  deathCheck: boolean; // did we survive?
}

/** Natural stat changes that happen every month based on age/lifestyle */
function getMonthlyDrift(state: GameState): Partial<CharacterStats> {
  const age = state.currentAge;
  const phase = getAgePhase(age);

  const drift: Partial<CharacterStats> = {};

  // Health naturally declines with age
  if (age > 40) drift.health = -0.3;
  if (age > 60) drift.health = -0.8;
  if (age > 75) drift.health = -1.5;

  // Education grows in youth
  if (phase === "childhood") drift.education = 0.5;
  if (phase === "teen") drift.education = 0.3;

  // Intelligence grows slightly with experience
  if (age < 50) drift.intelligence = 0.1;
  if (age > 65) drift.intelligence = -0.2;

  // Happiness fluctuates
  if (state.stats.relationships > 70) drift.happiness = 0.2;
  if (state.stats.relationships < 30) drift.happiness = -0.3;
  if (state.stats.health < 30) drift.happiness = (drift.happiness ?? 0) - 0.5;

  // Career effects
  if (state.career) {
    drift.money = 0.1 * state.career.level;
  }

  return drift;
}

/** Check if character dies this month */
function checkDeath(state: GameState): { dies: boolean; cause: string | null } {
  const { health } = state.stats;
  const age = state.currentAge;

  // Health-based death
  if (health <= 0) {
    return { dies: true, cause: "Salud deteriorada fatalmente" };
  }

  // Age-based death probability (increases exponentially after 60)
  if (age > 60) {
    const deathChance = Math.pow((age - 60) / 40, 2) * 0.02;
    if (Math.random() < deathChance) {
      const causes = [
        "Causas naturales",
        "Fallo cardíaco",
        "Enfermedad prolongada",
        "Mientras dormía, en paz",
      ];
      return { dies: true, cause: causes[Math.floor(Math.random() * causes.length)] };
    }
  }

  // Very low health increases death chance at any age
  if (health < 15) {
    const deathChance = (15 - health) * 0.005;
    if (Math.random() < deathChance) {
      return { dies: true, cause: "Complicaciones de salud graves" };
    }
  }

  // Maximum age
  if (age >= 100) {
    return { dies: true, cause: "Una vida larga y plena — 100 años" };
  }

  return { dies: false, cause: null };
}

/** Update economy for one month */
function processEconomy(state: GameState): { incomeChange: number; expenseChange: number; balanceChange: number } {
  const { monthlyIncome, monthlyExpenses, career } = state;

  // Career salary
  const income = career ? career.monthlySalary : monthlyIncome * 0.3; // unemployment = 30% of base

  // Expenses scale with lifestyle
  const lifestyleMultiplier = 0.6 + (state.stats.money / 100) * 0.8;
  const expenses = monthlyExpenses * lifestyleMultiplier;

  // Debt interest
  const debtInterest = state.debt * 0.005; // 0.5% monthly

  // Investment returns
  const investmentReturn = state.investments * 0.003; // 0.3% monthly avg

  const balanceChange = Math.round(income - expenses - debtInterest + investmentReturn);

  return { incomeChange: Math.round(income), expenseChange: Math.round(expenses), balanceChange };
}

/** Advance the game by one month */
export function processTurn(state: GameState): { newState: GameState; turnResult: TurnResult } {
  const newState = structuredClone(state);
  const previousPhase = getAgePhase(state.currentAge);

  // Advance month
  newState.currentMonth++;
  let newAge = false;
  if (newState.currentMonth > 12) {
    newState.currentMonth = 1;
    newState.currentAge++;
    newAge = true;
  }

  const currentPhase = getAgePhase(newState.currentAge);
  const newPhase = currentPhase !== previousPhase;

  // Apply monthly stat drift
  const drift = getMonthlyDrift(newState);
  newState.stats = applyEffects(newState.stats, drift);

  // Process economy
  const economy = processEconomy(newState);
  newState.bankBalance += economy.balanceChange;
  if (newState.bankBalance < 0) {
    newState.debt += Math.abs(newState.bankBalance);
    newState.bankBalance = 0;
    newState.stats.happiness = clampStat(newState.stats.happiness - 3);
  }

  // Get random events for this month
  const events = getRandomEvents(newState.currentAge, newState.stats);
  for (const event of events) {
    newState.stats = applyEffects(newState.stats, event.effects);
    newState.bankBalance += event.effects.money ? event.effects.money * 100 : 0;
    newState.lifeEvents.push({
      age: newState.currentAge,
      month: newState.currentMonth,
      type: "event",
      title: event.name,
      description: event.description,
      effects: event.effects,
    });
  }

  // Get available decisions
  const decisions = getDecisionsForTurn(currentPhase, newState.stats);

  // Phase milestone
  if (newPhase) {
    const phaseNames: Record<string, string> = {
      childhood: "Infancia",
      teen: "Adolescencia",
      young_adult: "Juventud",
      adult: "Madurez",
      elderly: "Vejez",
    };
    newState.lifeEvents.push({
      age: newState.currentAge,
      month: newState.currentMonth,
      type: "milestone",
      title: `Etapa: ${phaseNames[currentPhase]}`,
      description: `Comienza una nueva etapa de la vida a los ${newState.currentAge} años.`,
      effects: {},
    });
    newState.achievements.push(`Alcanzar la ${phaseNames[currentPhase]}`);
  }

  // Birthday milestone
  if (newAge && newState.currentAge % 10 === 0) {
    newState.achievements.push(`Cumplir ${newState.currentAge} años`);
  }

  // Death check
  const deathResult = checkDeath(newState);
  if (deathResult.dies) {
    newState.isAlive = false;
    newState.causeOfDeath = deathResult.cause;
    newState.lifeEvents.push({
      age: newState.currentAge,
      month: newState.currentMonth,
      type: "milestone",
      title: "Fin del camino",
      description: deathResult.cause ?? "El destino tenía otros planes.",
      effects: {},
    });
  }

  const turnResult: TurnResult = {
    events,
    decisions,
    monthlyUpdate: {
      ...economy,
      healthDelta: (drift.health ?? 0),
      happinessDelta: (drift.happiness ?? 0),
    },
    newAge,
    newPhase,
    deathCheck: deathResult.dies,
  };

  return { newState, turnResult };
}

/** Apply a decision choice to the game state */
export function applyDecision(
  state: GameState,
  decision: Decision,
  choiceIndex: number
): GameState {
  const newState = structuredClone(state);
  const choice = decision.options[choiceIndex];
  if (!choice) return newState;

  // Check success/failure
  let effects = choice.effects;
  let narrative = choice.narrative ?? "";

  if (choice.successChance !== undefined && choice.successChance < 1) {
    const success = Math.random() < choice.successChance;
    if (!success && choice.failEffects) {
      effects = choice.failEffects;
      narrative = `No salió como esperabas... ${narrative}`;
    }
  }

  newState.stats = applyEffects(newState.stats, effects);

  // Apply money effects to bank balance
  if (effects.money) {
    newState.bankBalance += effects.money * 50;
    if (newState.bankBalance < 0) {
      newState.debt += Math.abs(newState.bankBalance);
      newState.bankBalance = 0;
    }
  }

  newState.lifeEvents.push({
    age: newState.currentAge,
    month: newState.currentMonth,
    type: "decision",
    title: decision.text,
    description: `${choice.text}${narrative ? ` — ${narrative}` : ""}`,
    effects,
  });

  return newState;
}

/** Generate initial game state for a new character */
export function generateNewCharacter(name: string, country?: Country): GameState {
  const selectedCountry = country ?? getRandomCountry();

  const wealthTier = (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5;
  const familyStatuses: GameState["family"]["familyStatus"][] = [
    "united", "united", "united", "divorced", "single_parent", "orphanage",
  ];
  const familyStatus = familyStatuses[Math.floor(Math.random() * familyStatuses.length)];
  const family = {
    wealthTier,
    siblings: Math.floor(Math.random() * 4),
    familyStatus,
    parentEducation: 20 + wealthTier * 12 + Math.random() * 15,
  };

  const countryBonus = selectedCountry.educationIndex * 20;
  const wealthBonus = wealthTier * 5;

  const allTalents = [
    "Artístico", "Musical", "Atlético", "Científico", "Social",
    "Mecánico", "Literario", "Matemático", "Lingüístico", "Emprendedor",
  ];
  const numTalents = 1 + Math.floor(Math.random() * 3);
  const talents: string[] = [];
  const talentPool = [...allTalents];
  for (let i = 0; i < numTalents; i++) {
    const idx = Math.floor(Math.random() * talentPool.length);
    talents.push(talentPool.splice(idx, 1)[0]);
  }

  const characterName = name.trim();

  const { min, max } = selectedCountry.startingWealth;
  const startingMoney = min + Math.random() * (max - min);

  const state: GameState = {
    characterName,
    countryCode: selectedCountry.code,
    countryName: selectedCountry.name,
    city: selectedCountry.name,
    birthYear: 2026 - Math.floor(Math.random() * 3),
    currentAge: 0,
    currentMonth: 1,
    stats: {
      money: clampStat(20 + wealthBonus),
      education: clampStat(5 + countryBonus * 0.3),
      health: clampStat(70 + Math.random() * 30),
      happiness: clampStat(50 + wealthBonus + Math.random() * 20),
      relationships: clampStat(30 + (familyStatus === "united" ? 20 : 0)),
      reputation: clampStat(10 + wealthBonus),
      intelligence: clampStat(30 + Math.random() * 40),
      charisma: clampStat(20 + Math.random() * 40),
    },
    family,
    talents,
    career: null,
    relationships: [],
    lifeEvents: [{
      age: 0, month: 1, type: "milestone",
      title: "Nacimiento",
      description: `Naces en ${selectedCountry.name}. Familia ${
        familyStatus === "united" ? "unida" :
        familyStatus === "divorced" ? "divorciada" :
        familyStatus === "single_parent" ? "monoparental" : "en orfanato"
      }, nivel económico ${wealthTier}/5. ${
        family.siblings > 0 ? `Tienes ${family.siblings} hermano${family.siblings > 1 ? "s" : ""}.` : "Eres hijo/a único/a."
      }`,
      effects: {},
    }],
    properties: [],
    achievements: [],
    isAlive: true,
    causeOfDeath: null,
    bankBalance: Math.round(startingMoney),
    monthlyIncome: 0,
    monthlyExpenses: 0,
    debt: 0,
    investments: 0,
  };

  return state;
}
