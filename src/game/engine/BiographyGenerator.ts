// Template-based biography generator for end-of-life summaries.
// No AI or API calls — pure string templates with random selection.

import type { GameState } from '@/game/engine/GameState';

/** Return a letter grade for a numeric score. */
export function getScoreGrade(score: number): string {
  if (score >= 800) return 'S';
  if (score >= 600) return 'A';
  if (score >= 400) return 'B';
  if (score >= 250) return 'C';
  if (score >= 100) return 'D';
  return 'F';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatMoney(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M€`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K€`;
  return `${Math.round(amount)}€`;
}

function careerPhrase(state: GameState): string {
  if (!state.career) return 'sin una carrera definida';
  return `trabajando como ${state.career.name}`;
}

function relationshipPhrase(state: GameState): string {
  const count = state.relationships.length;
  if (count === 0) return 'sin lazos significativos';
  if (count === 1) return 'con una relación cercana';
  if (count <= 3) return `rodeado/a de ${count} personas cercanas`;
  return `con un amplio círculo de ${count} relaciones`;
}

function wealthPhrase(balance: number): string {
  if (balance >= 1_000_000) return 'una fortuna envidiable';
  if (balance >= 100_000) return 'una situación económica holgada';
  if (balance >= 10_000) return 'ahorros modestos';
  if (balance >= 0) return 'apenas unos céntimos en el banco';
  return 'una montaña de deudas';
}

function achievementPhrase(count: number): string {
  if (count === 0) return 'sin logros destacables';
  if (count === 1) return 'un logro notable';
  if (count <= 3) return `${count} logros notables`;
  return `${count} logros impresionantes`;
}

function deathPhrase(cause: string | null): string {
  if (!cause) return 'de causas desconocidas';
  return `de ${cause.toLowerCase()}`;
}

// ---------------------------------------------------------------------------
// Templates — each receives pre-computed fragments
// ---------------------------------------------------------------------------

interface Fragments {
  name: string;
  country: string;
  age: number;
  career: string;
  death: string;
  relationships: string;
  wealth: string;
  achievements: string;
  money: string;
  achievementCount: number;
  relCount: number;
}

type TemplateFunc = (f: Fragments) => string;

const templates: TemplateFunc[] = [
  // 1
  (f) =>
    `${f.name} nació en ${f.country} y vivió hasta los ${f.age} años, ${f.career}. Falleció ${f.death}, dejando ${f.wealth} y ${f.achievements}.`,
  // 2
  (f) =>
    `Nacido/a en ${f.country}, ${f.name} dedicó su vida ${f.career}. Murió a los ${f.age} años ${f.death}, ${f.relationships}.`,
  // 3
  (f) =>
    `La vida de ${f.name} en ${f.country} llegó a su fin a los ${f.age} años. ${f.career === 'sin una carrera definida' ? 'Nunca encontró su vocación' : `Se ganaba la vida ${f.career}`}, y dejó este mundo ${f.death}.`,
  // 4
  (f) =>
    `${f.name}, de ${f.country}, falleció a los ${f.age} años ${f.death}. Su legado incluye ${f.achievements} y ${f.wealth}.`,
  // 5
  (f) =>
    `A los ${f.age} años, ${f.name} dejó este mundo ${f.death}. Natural de ${f.country}, pasó su vida ${f.career}, acumulando ${f.money} y ${f.relationships}.`,
  // 6
  (f) =>
    `${f.country} vio nacer a ${f.name}, quien vivió ${f.age} años ${f.career}. Partió ${f.death}, con ${f.achievements} en su haber.`,
  // 7
  (f) =>
    `Tras ${f.age} años de vida en ${f.country}, ${f.name} falleció ${f.death}. Será recordado/a ${f.relationships} y por ${f.wealth}.`,
  // 8
  (f) =>
    `${f.name} vivió ${f.age} intensos años. Originario/a de ${f.country} y ${f.career}, dejó un patrimonio de ${f.money}. Causa de muerte: ${f.death}.`,
  // 9
  (f) =>
    `La historia de ${f.name} comenzó en ${f.country} y terminó ${f.age} años después, ${f.death}. ${f.achievementCount > 0 ? `Cosechó ${f.achievements} a lo largo del camino.` : 'No dejó logros destacables, pero vivió a su manera.'}`,
  // 10
  (f) =>
    `${f.name} (${f.country}) — ${f.age} años. ${f.career.charAt(0).toUpperCase() + f.career.slice(1)}, ${f.relationships}. Dejó ${f.wealth} y falleció ${f.death}.`,
  // 11
  (f) =>
    `De ${f.country}, ${f.name} recorrió la vida durante ${f.age} años, ${f.career}. Con ${f.money} en su cuenta y ${f.relCount} relaciones, su historia acabó ${f.death}.`,
  // 12
  (f) =>
    `${f.name} nació en ${f.country}, soñó en grande y vivió ${f.age} años. ${f.achievementCount > 3 ? 'Su vida fue un éxito rotundo.' : f.achievementCount > 0 ? 'Logró algunas metas importantes.' : 'Los logros le fueron esquivos.'} Murió ${f.death}.`,
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Generate a 2-3 sentence Spanish biography from the final game state. */
export function generateBiography(state: GameState): string {
  const fragments: Fragments = {
    name: state.characterName,
    country: state.countryName,
    age: state.currentAge,
    career: careerPhrase(state),
    death: deathPhrase(state.causeOfDeath),
    relationships: relationshipPhrase(state),
    wealth: wealthPhrase(state.bankBalance),
    achievements: achievementPhrase(state.achievements.length),
    money: formatMoney(state.bankBalance),
    achievementCount: state.achievements.length,
    relCount: state.relationships.length,
  };

  return pick(templates)(fragments);
}
