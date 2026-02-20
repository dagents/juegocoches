// Inheritance system — continue playing as a child after death

import type { GameState, RelationshipInfo } from './GameState';
import { clampStat } from './GameState';

/** Check if the player can inherit (must have at least one child aged 18+) */
export function canInherit(state: GameState): boolean {
  return state.children.some((c) => c.age >= 18);
}

/** Get eligible children for inheritance */
export function getEligibleChildren(state: GameState): RelationshipInfo[] {
  return state.children.filter((c) => c.age >= 18);
}

/** Alias for getEligibleChildren */
export const getInheritableChildren = getEligibleChildren;

/** Create a new GameState for the inherited child */
export function createInheritedCharacter(
  parentState: GameState,
  childIndex: number
): GameState {
  const eligibleChildren = getEligibleChildren(parentState);
  const child = eligibleChildren[childIndex];
  if (!child) throw new Error('Invalid child index for inheritance');

  // Inherit 70% of wealth
  const inheritedWealth = Math.round(parentState.bankBalance * 0.7);
  const inheritedInvestments = Math.round(parentState.investments * 0.5);

  // Inherit some properties (houses/land, not cars)
  const inheritedProperties = parentState.properties
    .filter((p) => p.type === 'house' || p.type === 'apartment' || p.type === 'land')
    .map((p) => ({ ...p, purchaseAge: child.age }));

  // Child gets partial stats based on parent (nature + nurture)
  const parentStats = parentState.stats;
  const baseStats = {
    money: clampStat(30 + (parentStats.money * 0.3)),
    education: clampStat(20 + (parentStats.education * 0.2)),
    health: clampStat(70 + Math.random() * 20),
    happiness: clampStat(40 + Math.random() * 30),
    relationships: clampStat(30 + (parentStats.relationships * 0.2)),
    reputation: clampStat(10 + (parentStats.reputation * 0.3)),
    intelligence: clampStat(25 + (parentStats.intelligence * 0.3) + Math.random() * 15),
    charisma: clampStat(20 + (parentStats.charisma * 0.2) + Math.random() * 15),
  };

  const newState: GameState = {
    characterName: child.name,
    countryCode: parentState.countryCode,
    countryName: parentState.countryName,
    city: parentState.city,
    birthYear: parentState.birthYear + (parentState.currentAge - child.age),
    currentAge: child.age,
    currentMonth: parentState.currentMonth,
    stats: baseStats,
    family: {
      wealthTier: Math.min(5, parentState.family.wealthTier + 1) as 1 | 2 | 3 | 4 | 5,
      siblings: Math.max(0, parentState.children.length - 1),
      familyStatus: 'united',
      parentEducation: parentState.stats.education,
    },
    talents: parentState.talents.length > 0
      ? [parentState.talents[Math.floor(Math.random() * parentState.talents.length)]]
      : [],
    career: null,
    relationships: [],
    partner: null,
    children: [],
    isMarried: false,
    lifeEvents: [
      {
        age: child.age,
        month: parentState.currentMonth,
        type: 'milestone',
        title: 'Herencia recibida',
        description: `Tras la muerte de ${parentState.characterName}, heredas su legado. Comienzas tu propia vida con $${inheritedWealth.toLocaleString('es-ES')} y ${inheritedProperties.length} propiedades.`,
        effects: {},
      },
    ],
    properties: inheritedProperties,
    achievements: ['Heredero/a — Continuar el legado familiar'],
    addictions: [],
    gameSpeed: parentState.gameSpeed,
    difficulty: parentState.difficulty,
    forococheroSurvived: false,
    takuEncounters: 0,
    isAlive: true,
    causeOfDeath: null,
    currentEducation: null,
    completedEducation: [],
    countriesLived: [parentState.countryCode],
    emigrationCount: 0,
    ownedBusinesses: [],
    statsHistory: [],
    bankBalance: inheritedWealth,
    monthlyIncome: 0,
    monthlyExpenses: parentState.monthlyExpenses * 0.5,
    debt: 0,
    investments: inheritedInvestments,
  };

  return newState;
}
