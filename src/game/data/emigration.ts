// Emigration system for "El Destino en tus Manos"

import type { GameState, CharacterStats } from "@/game/engine/GameState";
import type { Decision } from "@/game/data/decisions";

export interface EmigrationDestination {
  id: string;
  country: string;
  emoji: string;
  description: string;
  movingCost: number;
  incomeMultiplier: number; // multiplier to monthly salary
  costOfLiving: number; // monthly expense increase
  effects: Partial<CharacterStats>;
  requirements?: {
    minAge?: number;
    minEducation?: number;
    minIntelligence?: number;
    minMoney?: number;
  };
}

export const EMIGRATION_DESTINATIONS: EmigrationDestination[] = [
  {
    id: "alemania",
    country: "Alemania",
    emoji: "🇩🇪",
    description: "Potencia económica europea — trabajo estable y bien pagado.",
    movingCost: 5000,
    incomeMultiplier: 1.6,
    costOfLiving: 1200,
    effects: { money: 8, happiness: -3, relationships: -10, education: 3 },
  },
  {
    id: "uk",
    country: "Reino Unido",
    emoji: "🇬🇧",
    description: "Londres llama — oportunidades en finanzas y tecnología.",
    movingCost: 8000,
    incomeMultiplier: 1.8,
    costOfLiving: 1800,
    effects: { money: 10, happiness: -2, relationships: -10, charisma: 3 },
    requirements: { minEducation: 30 },
  },
  {
    id: "eeuu",
    country: "Estados Unidos",
    emoji: "🇺🇸",
    description: "El sueño americano — alto riesgo, alta recompensa.",
    movingCost: 12000,
    incomeMultiplier: 2.0,
    costOfLiving: 2000,
    effects: { money: 12, happiness: -5, relationships: -15, charisma: 5 },
    requirements: { minEducation: 40, minIntelligence: 40 },
  },
  {
    id: "suiza",
    country: "Suiza",
    emoji: "🇨🇭",
    description: "Sueldos altísimos, pero la vida es cara.",
    movingCost: 15000,
    incomeMultiplier: 2.5,
    costOfLiving: 3000,
    effects: { money: 15, happiness: -3, relationships: -10, health: 3 },
    requirements: { minEducation: 50, minIntelligence: 50 },
  },
  {
    id: "francia",
    country: "Francia",
    emoji: "🇫🇷",
    description: "Cultura, gastronomía y calidad de vida.",
    movingCost: 4000,
    incomeMultiplier: 1.4,
    costOfLiving: 1100,
    effects: { money: 5, happiness: 2, relationships: -8, charisma: 4 },
  },
  {
    id: "portugal",
    country: "Portugal",
    emoji: "🇵🇹",
    description: "Cerca de casa, buen clima y coste de vida bajo.",
    movingCost: 2000,
    incomeMultiplier: 1.0,
    costOfLiving: 700,
    effects: { money: 2, happiness: 3, relationships: -5, health: 2 },
  },
  {
    id: "holanda",
    country: "Países Bajos",
    emoji: "🇳🇱",
    description: "Hub tecnológico europeo con gran calidad de vida.",
    movingCost: 6000,
    incomeMultiplier: 1.7,
    costOfLiving: 1400,
    effects: { money: 8, happiness: 2, relationships: -8, intelligence: 3 },
    requirements: { minEducation: 35 },
  },
  {
    id: "australia",
    country: "Australia",
    emoji: "🇦🇺",
    description: "Al otro lado del mundo — aventura total.",
    movingCost: 10000,
    incomeMultiplier: 1.8,
    costOfLiving: 1600,
    effects: { money: 8, happiness: 5, relationships: -15, health: 5 },
    requirements: { minAge: 20 },
  },
  {
    id: "canada",
    country: "Canadá",
    emoji: "🇨🇦",
    description: "Multicultural, seguro y con buenas oportunidades.",
    movingCost: 8000,
    incomeMultiplier: 1.6,
    costOfLiving: 1400,
    effects: { money: 7, happiness: 3, relationships: -10, reputation: 3 },
    requirements: { minEducation: 30 },
  },
  {
    id: "japon",
    country: "Japón",
    emoji: "🇯🇵",
    description: "Cultura fascinante pero adaptación difícil.",
    movingCost: 10000,
    incomeMultiplier: 1.5,
    costOfLiving: 1300,
    effects: { money: 5, happiness: -5, relationships: -15, intelligence: 5, reputation: 5 },
    requirements: { minEducation: 40, minIntelligence: 45 },
  },
  {
    id: "mexico",
    country: "México",
    emoji: "🇲🇽",
    description: "Vida barata y cultura vibrante, pero menos seguridad.",
    movingCost: 3000,
    incomeMultiplier: 0.8,
    costOfLiving: 500,
    effects: { money: -2, happiness: 5, relationships: -8, charisma: 3 },
  },
  {
    id: "dubai",
    country: "Dubái",
    emoji: "🇦🇪",
    description: "Cero impuestos, lujo y oportunidades — si tienes dinero.",
    movingCost: 15000,
    incomeMultiplier: 2.2,
    costOfLiving: 2500,
    effects: { money: 15, happiness: 0, relationships: -12, reputation: 8 },
    requirements: { minEducation: 45, minMoney: 20000 },
  },
];

/** Check if player meets requirements for a destination */
function meetsRequirements(state: GameState, dest: EmigrationDestination): boolean {
  const req = dest.requirements;
  if (!req) return true;
  if (req.minAge !== undefined && state.currentAge < req.minAge) return false;
  if (req.minEducation !== undefined && state.stats.education < req.minEducation) return false;
  if (req.minIntelligence !== undefined && state.stats.intelligence < req.minIntelligence) return false;
  if (req.minMoney !== undefined && state.bankBalance < req.minMoney) return false;
  return true;
}

/** Get emigration decisions for the current state */
export function getEmigrationDecisions(state: GameState): Decision[] {
  // Only available for adults (18+)
  if (state.currentAge < 18) return [];

  // Don't offer too frequently
  const emigrationCount = state.emigrationCount ?? 0;
  if (emigrationCount > 0 && Math.random() > 0.3) return [];

  // Filter available destinations (exclude current country)
  const available = EMIGRATION_DESTINATIONS.filter(d => {
    if (d.country === state.countryName) return false;
    if (!meetsRequirements(state, d)) return false;
    if (state.bankBalance < d.movingCost) return false;
    return true;
  });

  if (available.length === 0) return [];

  // Pick 2-3 random destinations to offer
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  const options = shuffled.slice(0, 3);

  const agePhase = state.currentAge <= 30 ? "young_adult" as const : state.currentAge <= 55 ? "adult" as const : "elderly" as const;

  const decision: Decision = {
    id: "emigration_offer",
    text: `Vives en ${state.countryName}. ¿Te planteas emigrar a otro país?`,
    agePhase,
    category: "lifestyle",
    weight: 3,
    options: [
      ...options.map(dest => ({
        text: `${dest.emoji} Emigrar a ${dest.country} — ${dest.description} (Coste: ${dest.movingCost.toLocaleString("es-ES")}€)`,
        effects: dest.effects,
        narrative: `Te mudas a ${dest.country}. Una nueva vida te espera.`,
        _destinationId: dest.id,
      } as Decision["options"][0] & { _destinationId?: string })),
      { text: "Quedarme donde estoy", effects: { happiness: 1 } },
    ],
  };

  return [decision];
}

/** Get destination by id */
export function getDestinationById(id: string): EmigrationDestination | undefined {
  return EMIGRATION_DESTINATIONS.find(d => d.id === id);
}
