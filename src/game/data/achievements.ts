// Achievement system for "El Destino en tus Manos"

import type { GameState } from "@/game/engine/GameState";

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  check: (state: GameState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Wealth achievements
  { id: "millonario", name: "Millonario", emoji: "💰", description: "Tener más de 500.000€ en el banco", check: (s) => s.bankBalance > 500000 },
  { id: "primer_millon", name: "Primer Millón", emoji: "🤑", description: "Alcanzar 1.000.000€ en el banco", check: (s) => s.bankBalance > 1000000 },
  { id: "bancarrota", name: "Bancarrota", emoji: "📉", description: "Acumular más de 100.000€ de deuda", check: (s) => s.debt > 100000 },
  { id: "inversor", name: "Inversor Nato", emoji: "📈", description: "Tener más de 200.000€ en inversiones", check: (s) => s.investments > 200000 },
  { id: "sin_blanca", name: "Sin Blanca", emoji: "🪹", description: "Tener 0€ en el banco y deuda", check: (s) => s.bankBalance === 0 && s.debt > 0 },

  // Age achievements
  { id: "superviviente", name: "Superviviente", emoji: "🧓", description: "Llegar a los 80 años", check: (s) => s.currentAge >= 80 },
  { id: "centenario", name: "Centenario", emoji: "💯", description: "Llegar a los 100 años", check: (s) => s.currentAge >= 100 },
  { id: "adulto", name: "Mayoría de Edad", emoji: "🎂", description: "Cumplir 18 años", check: (s) => s.currentAge >= 18 },
  { id: "jubilado", name: "Jubilado", emoji: "🏖️", description: "Llegar a los 65 años", check: (s) => s.currentAge >= 65 },

  // Relationship achievements
  { id: "familia_numerosa", name: "Familia Numerosa", emoji: "👨‍👩‍👧‍👦", description: "Tener 3 o más hijos", check: (s) => s.children.length >= 3 },
  { id: "soltero_oro", name: "Soltero de Oro", emoji: "💍", description: "Llegar a los 50 sin casarse", check: (s) => s.currentAge >= 50 && !s.isMarried },
  { id: "casado", name: "Recién Casado", emoji: "💒", description: "Casarse", check: (s) => s.isMarried },
  { id: "popular", name: "Popular", emoji: "🌟", description: "Tener 10 o más relaciones", check: (s) => s.relationships.length >= 10 },
  { id: "ermitano", name: "Ermitaño", emoji: "🏔️", description: "Tener 0 relaciones a los 30+", check: (s) => s.currentAge >= 30 && s.relationships.length === 0 },
  { id: "don_juan", name: "Don Juan", emoji: "😏", description: "Haber tenido 5+ parejas a lo largo de la vida", check: (s) => s.lifeEvents.filter(e => e.title.includes("pareja") || e.title.includes("Crush") || e.title.includes("partner")).length >= 5 },

  // Property achievements
  { id: "magnate", name: "Magnate Inmobiliario", emoji: "🏘️", description: "Poseer 5 o más propiedades", check: (s) => s.properties.length >= 5 },
  { id: "emprendedor", name: "Emprendedor", emoji: "🏢", description: "Poseer un negocio", check: (s) => s.properties.some(p => p.type === "business") },
  { id: "propietario", name: "Propietario", emoji: "🏠", description: "Comprar tu primera propiedad", check: (s) => s.properties.length >= 1 },
  { id: "terrateniente", name: "Terrateniente", emoji: "🌾", description: "Poseer 3+ terrenos", check: (s) => s.properties.filter(p => p.type === "land").length >= 3 },

  // Stats achievements
  { id: "genio", name: "Genio", emoji: "🧠", description: "Inteligencia al máximo (100)", check: (s) => s.stats.intelligence >= 100 },
  { id: "atleta", name: "Atleta", emoji: "💪", description: "Salud al máximo (100)", check: (s) => s.stats.health >= 100 },
  { id: "famoso", name: "Famoso", emoji: "⭐", description: "Reputación al máximo (100)", check: (s) => s.stats.reputation >= 100 },
  { id: "feliz", name: "Plenitud Total", emoji: "😊", description: "Felicidad al máximo (100)", check: (s) => s.stats.happiness >= 100 },
  { id: "educado", name: "Erudito", emoji: "📚", description: "Educación al máximo (100)", check: (s) => s.stats.education >= 100 },
  { id: "carismatico", name: "Carismático", emoji: "🎭", description: "Carisma al máximo (100)", check: (s) => s.stats.charisma >= 100 },
  { id: "equilibrado", name: "Equilibrado", emoji: "⚖️", description: "Todas las stats por encima de 70", check: (s) => Object.values(s.stats).every(v => v >= 70) },

  // Career achievements
  { id: "jefe", name: "El Jefe", emoji: "👔", description: "Alcanzar nivel 5+ en tu carrera", check: (s) => s.career !== null && s.career.level >= 5 },
  { id: "veterano", name: "Veterano Laboral", emoji: "🏅", description: "20+ años de experiencia laboral", check: (s) => s.career !== null && s.career.yearsExperience >= 20 },

  // Difficulty achievements
  { id: "forocochero_hardcore", name: "Forocochero Hardcore", emoji: "💀", description: "Llegar a los 70 en modo Forocochero", check: (s) => s.difficulty === "forocochero" && s.currentAge >= 70 },
  { id: "forocochero_centenario", name: "Leyenda Forocochera", emoji: "👑", description: "Llegar a los 90 en modo Forocochero", check: (s) => s.difficulty === "forocochero" && s.currentAge >= 90 },

  // Special achievements
  { id: "taku_survivor", name: "Anti-Taku", emoji: "🛡️", description: "Sobrevivir 5+ encuentros con Taku", check: (s) => s.takuEncounters >= 5 },
  { id: "renacido", name: "Renacido", emoji: "🔥", description: "Recuperar salud a 80+ después de estar bajo 20", check: (s) => s.stats.health >= 80 && s.lifeEvents.some(e => e.effects.health !== undefined && e.effects.health < -5) },

  // Education achievements
  { id: "doctorado", name: "Doctor/a", emoji: "🎓", description: "Completar un Doctorado", check: (s) => (s.completedEducation ?? []).includes("doctorado") },
  { id: "eterno_estudiante", name: "Eterno Estudiante", emoji: "📖", description: "Completar 5+ formaciones", check: (s) => (s.completedEducation ?? []).length >= 5 },

  // Emigration achievements
  { id: "expatriado", name: "Expatriado", emoji: "✈️", description: "Emigrar a otro país", check: (s) => (s.emigrationCount ?? 0) >= 1 },
  { id: "ciudadano_mundo", name: "Ciudadano del Mundo", emoji: "🌍", description: "Vivir en 3+ países", check: (s) => (s.countriesLived ?? []).length >= 3 },
  { id: "nomada", name: "Nómada Digital", emoji: "🧳", description: "Emigrar 5+ veces", check: (s) => (s.emigrationCount ?? 0) >= 5 },
];

/** Check all achievements and return newly unlocked ones */
export function checkAchievements(state: GameState): string[] {
  const newAchievements: string[] = [];
  for (const achievement of ACHIEVEMENTS) {
    if (state.achievements.includes(achievement.id)) continue;
    try {
      if (achievement.check(state)) {
        newAchievements.push(achievement.id);
      }
    } catch {
      // Skip if check fails (e.g. missing fields)
    }
  }
  return newAchievements;
}

/** Get full achievement data by id */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}
