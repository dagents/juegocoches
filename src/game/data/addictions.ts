// Addiction system for life simulation game

import type { GameState } from "@/game/engine/GameState";
import type { GameEvent } from "@/game/data/events";
import type { Decision } from "@/game/data/decisions";
import { getAgePhase } from "@/game/engine/GameState";

export type AddictionType = "alcohol" | "gambling" | "drugs" | "social_media";

export interface AddictionEntry {
  type: AddictionType;
  severity: number; // 0-100
  monthsActive: number;
}

export interface AddictionConfig {
  type: AddictionType;
  label: string;
  healthDrain: number; // per month at severity 100
  happinessEffect: number; // per month at severity 100 (can be positive early)
  monthlyCost: number; // $ per month at severity 100
  rehabCost: number;
  rehabSuccessBase: number; // base chance of rehab working
}

export const ADDICTION_CONFIGS: Record<AddictionType, AddictionConfig> = {
  alcohol: {
    type: "alcohol",
    label: "Alcohol",
    healthDrain: -2.0,
    happinessEffect: -1.5,
    monthlyCost: 300,
    rehabCost: 5000,
    rehabSuccessBase: 0.5,
  },
  gambling: {
    type: "gambling",
    label: "Juego",
    healthDrain: -0.5,
    happinessEffect: -2.0,
    monthlyCost: 800,
    rehabCost: 3000,
    rehabSuccessBase: 0.4,
  },
  drugs: {
    type: "drugs",
    label: "Drogas",
    healthDrain: -3.0,
    happinessEffect: -2.5,
    monthlyCost: 500,
    rehabCost: 8000,
    rehabSuccessBase: 0.35,
  },
  social_media: {
    type: "social_media",
    label: "Redes sociales",
    healthDrain: -0.3,
    happinessEffect: -1.0,
    monthlyCost: 0,
    rehabCost: 500,
    rehabSuccessBase: 0.6,
  },
};

/** Process monthly addiction effects: health drain, happiness, cost */
export function processAddictions(state: GameState): { healthDelta: number; happinessDelta: number; costDelta: number } {
  let healthDelta = 0;
  let happinessDelta = 0;
  let costDelta = 0;

  for (const addiction of state.addictions) {
    const config = ADDICTION_CONFIGS[addiction.type];
    const factor = addiction.severity / 100;

    healthDelta += config.healthDrain * factor;
    happinessDelta += config.happinessEffect * factor;
    costDelta += config.monthlyCost * factor;
    
    // Severity creeps up over time
    addiction.severity = Math.min(100, addiction.severity + 0.5);
    addiction.monthsActive++;
  }

  return { healthDelta, happinessDelta, costDelta };
}

/** Trigger addiction events based on state (low happiness, teen pressure, etc.) */
export function getAddictionEvents(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];
  const phase = getAgePhase(state.currentAge);
  const hasAddict = (t: AddictionType) => state.addictions.some(a => a.type === t);

  // Teen peer pressure — alcohol/drugs/social media
  if (phase === "teen" && Math.random() < 0.04) {
    if (!hasAddict("alcohol") && state.stats.happiness < 40) {
      events.push({
        id: "addiction_start_alcohol_teen",
        name: "Presión de grupo",
        description: "Tus amigos beben los fines de semana. Empiezas a unirte por encajar. Poco a poco se convierte en costumbre.",
        category: "health",
        probability: 1,
        minAge: 13,
        maxAge: 17,
        effects: { health: -3, happiness: 3, relationships: 2 },
      });
    }
    if (!hasAddict("social_media")) {
      events.push({
        id: "addiction_start_social_media_teen",
        name: "Enganchado a las redes",
        description: "Pasas horas y horas scrolleando. Los likes se convierten en tu dosis de dopamina diaria.",
        category: "health",
        probability: 1,
        minAge: 13,
        maxAge: 17,
        effects: { happiness: 2, health: -1, education: -2 },
      });
    }
  }

  // Adult low happiness — alcohol/drugs
  if ((phase === "young_adult" || phase === "adult") && state.stats.happiness < 30 && Math.random() < 0.05) {
    if (!hasAddict("alcohol")) {
      events.push({
        id: "addiction_start_alcohol_adult",
        name: "Refugio en la botella",
        description: "La vida pesa demasiado. El alcohol te ofrece un escape temporal que se convierte en rutina.",
        category: "health",
        probability: 1,
        minAge: 18,
        maxAge: 70,
        effects: { health: -5, happiness: 2 },
      });
    }
    if (!hasAddict("drugs") && Math.random() < 0.03) {
      events.push({
        id: "addiction_start_drugs_adult",
        name: "Espiral descendente",
        description: "Alguien te ofrece algo para olvidar los problemas. Funciona... demasiado bien.",
        category: "health",
        probability: 1,
        minAge: 18,
        maxAge: 55,
        effects: { health: -5, happiness: 3, money: -5 },
      });
    }
  }

  return events;
}

/** Get addiction-related decisions: rehab, escalate, etc. */
export function getAddictionDecisions(state: GameState): Decision[] {
  const decisions: Decision[] = [];

  for (const addiction of state.addictions) {
    const config = ADDICTION_CONFIGS[addiction.type];

    // Only show rehab decision occasionally and when severity is notable
    if (addiction.severity >= 30 && addiction.monthsActive >= 3 && Math.random() < 0.08) {
      const rehabChance = config.rehabSuccessBase - (addiction.severity / 200);

      decisions.push({
        id: `rehab_${addiction.type}_${Date.now()}`,
        text: `Tu adicción a ${config.label.toLowerCase()} está afectando tu vida. (Severidad: ${Math.round(addiction.severity)}%)`,
        agePhase: getAgePhase(state.currentAge),
        category: "health",
        weight: 5,
        options: [
          {
            text: `Ir a rehabilitación ($${config.rehabCost.toLocaleString("es-ES")})`,
            effects: { health: 10, happiness: 5, reputation: 3 },
            successChance: Math.max(0.15, rehabChance),
            failEffects: { happiness: -8, money: -5 },
            narrative: "La rehabilitación es un camino largo pero posible.",
          },
          {
            text: "Intentar dejarlo por tu cuenta",
            effects: { health: 3, happiness: -2 },
            successChance: Math.max(0.1, rehabChance * 0.5),
            failEffects: { happiness: -5, health: -3 },
            narrative: "Sin ayuda profesional, es más difícil.",
          },
          {
            text: "Seguir como estás",
            effects: { happiness: -3, health: -5, reputation: -2 },
            narrative: "La adicción se hace más fuerte cada día.",
          },
        ],
      });
    }
  }

  return decisions;
}
