// Entrepreneurship system — businesses the player can start/manage

import type { GameState, OwnedBusiness } from '@/game/engine/GameState';
import type { Decision } from './decisions';

export interface BusinessTemplate {
  id: string;
  name: string;
  description: string;
  startupCost: number;
  monthlyRevenueMin: number;
  monthlyRevenueMax: number;
  failureRisk: number; // 0-1 monthly chance of a bad event
  minEducation: number;
  minIntelligence: number;
  minAge: number;
  category: 'retail' | 'food' | 'tech' | 'services' | 'real_estate';
}

export const BUSINESSES: BusinessTemplate[] = [
  {
    id: 'tienda_ropa',
    name: 'Tienda de ropa',
    description: 'Una tienda de moda en el centro de la ciudad.',
    startupCost: 15000,
    monthlyRevenueMin: 800,
    monthlyRevenueMax: 2500,
    failureRisk: 0.04,
    minEducation: 10,
    minIntelligence: 20,
    minAge: 20,
    category: 'retail',
  },
  {
    id: 'restaurante',
    name: 'Restaurante',
    description: 'Un restaurante con cocina local y buen ambiente.',
    startupCost: 30000,
    monthlyRevenueMin: 1500,
    monthlyRevenueMax: 5000,
    failureRisk: 0.06,
    minEducation: 15,
    minIntelligence: 25,
    minAge: 22,
    category: 'food',
  },
  {
    id: 'startup_tech',
    name: 'Startup tecnológica',
    description: 'Una empresa de software con gran potencial... y gran riesgo.',
    startupCost: 50000,
    monthlyRevenueMin: 0,
    monthlyRevenueMax: 15000,
    failureRisk: 0.10,
    minEducation: 50,
    minIntelligence: 60,
    minAge: 22,
    category: 'tech',
  },
  {
    id: 'tienda_online',
    name: 'Tienda online',
    description: 'E-commerce desde casa. Bajo coste, alto potencial.',
    startupCost: 5000,
    monthlyRevenueMin: 300,
    monthlyRevenueMax: 4000,
    failureRisk: 0.05,
    minEducation: 30,
    minIntelligence: 35,
    minAge: 20,
    category: 'tech',
  },
  {
    id: 'franquicia',
    name: 'Franquicia',
    description: 'Abrir una franquicia conocida. Seguro pero caro.',
    startupCost: 80000,
    monthlyRevenueMin: 3000,
    monthlyRevenueMax: 8000,
    failureRisk: 0.02,
    minEducation: 20,
    minIntelligence: 30,
    minAge: 25,
    category: 'retail',
  },
  {
    id: 'bar',
    name: 'Bar / Pub',
    description: 'Un bar con buena música y cañas baratas.',
    startupCost: 12000,
    monthlyRevenueMin: 600,
    monthlyRevenueMax: 3000,
    failureRisk: 0.05,
    minEducation: 5,
    minIntelligence: 15,
    minAge: 20,
    category: 'food',
  },
  {
    id: 'academia',
    name: 'Academia / Centro de formación',
    description: 'Enseñar lo que sabes a los demás.',
    startupCost: 10000,
    monthlyRevenueMin: 500,
    monthlyRevenueMax: 3000,
    failureRisk: 0.03,
    minEducation: 60,
    minIntelligence: 50,
    minAge: 25,
    category: 'services',
  },
  {
    id: 'inmobiliaria',
    name: 'Agencia inmobiliaria',
    description: 'Compra-venta de propiedades. Comisiones jugosas.',
    startupCost: 25000,
    monthlyRevenueMin: 1000,
    monthlyRevenueMax: 7000,
    failureRisk: 0.04,
    minEducation: 30,
    minIntelligence: 40,
    minAge: 25,
    category: 'real_estate',
  },
  {
    id: 'app_movil',
    name: 'App móvil',
    description: 'Desarrollar una app y esperar que se viralice.',
    startupCost: 8000,
    monthlyRevenueMin: 0,
    monthlyRevenueMax: 10000,
    failureRisk: 0.08,
    minEducation: 40,
    minIntelligence: 55,
    minAge: 20,
    category: 'tech',
  },
  {
    id: 'gym',
    name: 'Gimnasio',
    description: 'Un gimnasio moderno con clases y máquinas.',
    startupCost: 40000,
    monthlyRevenueMin: 2000,
    monthlyRevenueMax: 6000,
    failureRisk: 0.03,
    minEducation: 10,
    minIntelligence: 20,
    minAge: 23,
    category: 'services',
  },
  {
    id: 'food_truck',
    name: 'Food truck',
    description: 'Comida callejera con estilo. Bajo coste, mucha personalidad.',
    startupCost: 8000,
    monthlyRevenueMin: 400,
    monthlyRevenueMax: 2500,
    failureRisk: 0.04,
    minEducation: 5,
    minIntelligence: 15,
    minAge: 20,
    category: 'food',
  },
];

/** Get available entrepreneurship decisions for the current state */
export function getEntrepreneurshipDecisions(state: GameState): Decision[] {
  if (state.currentAge < 20) return [];

  const ownedIds = new Set((state.ownedBusinesses ?? []).map((b) => b.businessId));
  const decisions: Decision[] = [];

  // Offer 1 random eligible business to start
  const eligible = BUSINESSES.filter(
    (b) =>
      !ownedIds.has(b.id) &&
      state.currentAge >= b.minAge &&
      state.stats.education >= b.minEducation &&
      state.stats.intelligence >= b.minIntelligence &&
      state.bankBalance >= b.startupCost * 0.5 // can start with some debt
  );

  if (eligible.length > 0) {
    const biz = eligible[Math.floor(Math.random() * eligible.length)];
    decisions.push({
      id: `start_biz_${biz.id}`,
      text: `Tienes la oportunidad de abrir: ${biz.name}. Coste: $${biz.startupCost.toLocaleString('es-ES')}.`,
      agePhase: state.currentAge <= 30 ? 'young_adult' : state.currentAge <= 55 ? 'adult' : 'elderly',
      category: 'finance',
      weight: 3,
      options: [
        {
          text: `Invertir en ${biz.name}`,
          effects: { money: -5, happiness: 3, reputation: 3 },
          narrative: `Abres "${biz.name}". ${biz.description}`,
        },
        {
          text: 'No es el momento',
          effects: {},
          narrative: 'Decides esperar a una mejor oportunidad.',
        },
      ],
    });
  }

  // Offer to sell/close an owned business
  const owned = state.ownedBusinesses ?? [];
  if (owned.length > 0) {
    const biz = owned[Math.floor(Math.random() * owned.length)];
    const saleValue = Math.round(biz.monthlyRevenue * 12 * 1.5);
    decisions.push({
      id: `close_biz_${biz.businessId}`,
      text: `¿Quieres vender "${biz.name}"? Ofrecen $${saleValue.toLocaleString('es-ES')}.`,
      agePhase: state.currentAge <= 30 ? 'young_adult' : state.currentAge <= 55 ? 'adult' : 'elderly',
      category: 'finance',
      weight: 2,
      options: [
        {
          text: 'Vender el negocio',
          effects: { money: 5, happiness: -2 },
          narrative: `Vendes "${biz.name}" y recibes $${saleValue.toLocaleString('es-ES')}.`,
        },
        {
          text: 'Seguir con el negocio',
          effects: {},
        },
      ],
    });
  }

  return decisions;
}

/** Process all owned businesses for one month — returns revenue and events */
export function processBusinesses(businesses: OwnedBusiness[]): {
  totalRevenue: number;
  updates: OwnedBusiness[];
  failedIds: string[];
} {
  let totalRevenue = 0;
  const updates: OwnedBusiness[] = [];
  const failedIds: string[] = [];

  for (const biz of businesses) {
    const template = BUSINESSES.find((b) => b.id === biz.businessId);
    if (!template) {
      updates.push(biz);
      continue;
    }

    const updated = { ...biz, monthsActive: biz.monthsActive + 1 };

    // Check for failure event
    if (Math.random() < template.failureRisk) {
      updated.health -= 15 + Math.floor(Math.random() * 20);
      updated.monthlyRevenue = Math.max(0, Math.round(updated.monthlyRevenue * 0.7));
    }

    // Revenue improves slightly over time (experience bonus)
    const expBonus = Math.min(updated.monthsActive / 120, 0.5); // up to 50% after 10 years
    const baseRevenue =
      template.monthlyRevenueMin +
      Math.random() * (template.monthlyRevenueMax - template.monthlyRevenueMin);
    updated.monthlyRevenue = Math.round(baseRevenue * (1 + expBonus));

    // Business dies if health reaches 0
    if (updated.health <= 0) {
      failedIds.push(biz.businessId);
    } else {
      totalRevenue += updated.monthlyRevenue;
      updates.push(updated);
    }
  }

  return { totalRevenue, updates, failedIds };
}
