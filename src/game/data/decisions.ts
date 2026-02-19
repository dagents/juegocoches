// Decision trees per age phase for "El Destino en tus Manos"

import type { CharacterStats } from "@/game/engine/GameState";

export interface Decision {
  id: string;
  text: string;
  agePhase: "childhood" | "teen" | "young_adult" | "adult" | "elderly";
  category: "education" | "career" | "relationships" | "finance" | "health" | "lifestyle" | "risk";
  weight: number;
  conditions?: (stats: CharacterStats) => boolean;
  options: {
    text: string;
    effects: Partial<CharacterStats>;
    successChance?: number;
    failEffects?: Partial<CharacterStats>;
    narrative?: string;
  }[];
}

export const DECISIONS: Decision[] = [
  // ===== CHILDHOOD (0-12) =====
  {
    id: "child_school_bully",
    text: "Un compañero de clase te está molestando en el recreo.",
    agePhase: "childhood",
    category: "relationships",
    weight: 3,
    options: [
      { text: "Plantarle cara", effects: { charisma: 3, reputation: 2, health: -2 }, narrative: "Te ganas el respeto de la clase." },
      { text: "Decírselo a un profesor", effects: { reputation: -1, relationships: 2, happiness: 1 }, narrative: "El profesor interviene." },
      { text: "Ignorarlo y seguir a lo tuyo", effects: { intelligence: 1, happiness: -2 }, narrative: "Aprendes a aguantar." },
    ],
  },
  {
    id: "child_hobby",
    text: "Tus padres te dejan elegir una actividad extraescolar.",
    agePhase: "childhood",
    category: "education",
    weight: 4,
    options: [
      { text: "Deportes", effects: { health: 5, charisma: 2, happiness: 3 } },
      { text: "Música o arte", effects: { intelligence: 3, happiness: 4, charisma: 2 } },
      { text: "Idiomas", effects: { education: 5, intelligence: 3 } },
      { text: "Nada, quiero jugar", effects: { happiness: 4, relationships: 3, education: -2 } },
    ],
  },
  {
    id: "child_pet",
    text: "Encuentras un gato abandonado en la calle.",
    agePhase: "childhood",
    category: "lifestyle",
    weight: 2,
    options: [
      { text: "Llevarlo a casa", effects: { happiness: 5, relationships: 2, money: -2 }, narrative: "Tus padres acceden a quedárselo." },
      { text: "Dejarlo donde está", effects: { happiness: -2 }, narrative: "No puedes dejar de pensar en él." },
    ],
  },
  {
    id: "child_grades",
    text: "Se acercan los exámenes finales del colegio.",
    agePhase: "childhood",
    category: "education",
    weight: 5,
    options: [
      { text: "Estudiar mucho", effects: { education: 6, intelligence: 2, happiness: -2, health: -1 } },
      { text: "Estudiar lo justo", effects: { education: 2, happiness: 1 } },
      { text: "Copiar del compañero", effects: { education: 1, reputation: -3 }, successChance: 0.6, failEffects: { reputation: -8, education: -3 } },
    ],
  },
  {
    id: "child_fight",
    text: "Ves a un niño más pequeño siendo acosado.",
    agePhase: "childhood",
    category: "relationships",
    weight: 2,
    options: [
      { text: "Defender al pequeño", effects: { reputation: 5, charisma: 3, health: -3 }, narrative: "Te conviertes en su héroe." },
      { text: "Buscar a un adulto", effects: { reputation: 1, relationships: 1 } },
      { text: "No meterte", effects: { happiness: -3 } },
    ],
  },
  {
    id: "child_money_found",
    text: "Encuentras un billete de 20€ en el suelo del colegio.",
    agePhase: "childhood",
    category: "finance",
    weight: 2,
    options: [
      { text: "Entregarlo en dirección", effects: { reputation: 4, happiness: 1 } },
      { text: "Quedártelo y comprar chuches", effects: { money: 2, happiness: 3, reputation: -1 } },
      { text: "Repartirlo con tus amigos", effects: { relationships: 4, charisma: 2 } },
    ],
  },
  {
    id: "child_talent_show",
    text: "El colegio organiza un concurso de talentos.",
    agePhase: "childhood",
    category: "lifestyle",
    weight: 2,
    options: [
      { text: "Participar con todo", effects: { charisma: 4, reputation: 3 }, successChance: 0.5, failEffects: { charisma: 1, happiness: -2 } },
      { text: "Ayudar desde detrás del escenario", effects: { relationships: 3, intelligence: 1 } },
      { text: "No participar", effects: { happiness: -1 } },
    ],
  },
  {
    id: "child_divorce",
    text: "Tus padres están discutiendo mucho últimamente.",
    agePhase: "childhood",
    category: "relationships",
    weight: 2,
    options: [
      { text: "Intentar hablar con ellos", effects: { charisma: 2, happiness: -3, relationships: 2 } },
      { text: "Refugiarte en los estudios", effects: { education: 4, happiness: -2, intelligence: 2 } },
      { text: "Pasar más tiempo con amigos", effects: { relationships: 4, happiness: 1 } },
    ],
  },

  // ===== TEEN (13-17) =====
  {
    id: "teen_first_love",
    text: "Te gusta alguien de clase y crees que tú también le gustas.",
    agePhase: "teen",
    category: "relationships",
    weight: 4,
    options: [
      { text: "Declararte", effects: { charisma: 3, happiness: 5, relationships: 5 }, successChance: 0.6, failEffects: { happiness: -5, charisma: 1 } },
      { text: "Esperar a que dé el primer paso", effects: { happiness: -1 } },
      { text: "Hacerte el/la interesante", effects: { charisma: 2, reputation: 1 }, successChance: 0.4, failEffects: { happiness: -3 } },
    ],
  },
  {
    id: "teen_party",
    text: "Te invitan a una fiesta donde habrá alcohol y otras cosas.",
    agePhase: "teen",
    category: "risk",
    weight: 4,
    options: [
      { text: "Ir y pasarlo bien sin excesos", effects: { relationships: 4, happiness: 3, charisma: 2 } },
      { text: "Ir a tope, YOLO", effects: { happiness: 5, health: -5, reputation: -2, relationships: 3 }, successChance: 0.7, failEffects: { health: -10, reputation: -8, happiness: -3 } },
      { text: "No ir, quedarte estudiando", effects: { education: 3, relationships: -3, happiness: -2 } },
    ],
  },
  {
    id: "teen_career_path",
    text: "Es hora de elegir qué estudiar después del instituto.",
    agePhase: "teen",
    category: "education",
    weight: 5,
    options: [
      { text: "Ciencias y tecnología", effects: { education: 6, intelligence: 5, happiness: -1 } },
      { text: "Artes y humanidades", effects: { education: 4, charisma: 3, happiness: 3 } },
      { text: "Formación profesional", effects: { education: 3, money: 3, health: 1 } },
      { text: "Dejar los estudios", effects: { education: -5, money: 2, happiness: 2, reputation: -3 } },
    ],
  },
  {
    id: "teen_social_media",
    text: "Un vídeo tuyo se hace semi-viral en redes sociales.",
    agePhase: "teen",
    category: "lifestyle",
    weight: 2,
    options: [
      { text: "Aprovechar y crear más contenido", effects: { charisma: 5, reputation: 4, education: -2 } },
      { text: "Ignorarlo y seguir con tu vida", effects: { happiness: 1 } },
      { text: "Borrarlo, no quieres atención", effects: { reputation: -1, happiness: 2 } },
    ],
  },
  {
    id: "teen_drugs",
    text: "Un amigo te ofrece probar marihuana.",
    agePhase: "teen",
    category: "risk",
    weight: 3,
    options: [
      { text: "Probar por curiosidad", effects: { happiness: 2, health: -3, relationships: 2 }, successChance: 0.8, failEffects: { health: -8, happiness: -5, education: -3 } },
      { text: "Rechazar educadamente", effects: { health: 1, reputation: 1 } },
      { text: "Rechazar y criticarlo", effects: { health: 2, relationships: -4, reputation: 2 } },
    ],
  },
  {
    id: "teen_part_time_job",
    text: "Te ofrecen un trabajo de fin de semana en una tienda.",
    agePhase: "teen",
    category: "career",
    weight: 3,
    options: [
      { text: "Aceptar, quiero mi propio dinero", effects: { money: 5, charisma: 2, education: -2, health: -1 } },
      { text: "Rechazar, prefiero centrarme en estudiar", effects: { education: 3, intelligence: 1 } },
    ],
  },
  {
    id: "teen_bullying_online",
    text: "Alguien está difundiendo rumores sobre ti en redes.",
    agePhase: "teen",
    category: "relationships",
    weight: 2,
    options: [
      { text: "Confrontar públicamente", effects: { charisma: 3, reputation: 2, happiness: -2 }, successChance: 0.5, failEffects: { reputation: -5, happiness: -5 } },
      { text: "Denunciar y bloquear", effects: { reputation: 1, happiness: -1 } },
      { text: "Ignorarlo completamente", effects: { happiness: -3, intelligence: 1 } },
    ],
  },
  {
    id: "teen_sports_team",
    text: "Tienes la oportunidad de entrar en el equipo del instituto.",
    agePhase: "teen",
    category: "health",
    weight: 3,
    options: [
      { text: "Entrenar duro para entrar", effects: { health: 5, charisma: 3, relationships: 3, education: -2 } },
      { text: "Intentarlo sin mucho esfuerzo", effects: { health: 2 }, successChance: 0.3, failEffects: { happiness: -2 } },
      { text: "Pasar, no es lo mío", effects: { happiness: -1 } },
    ],
  },

  // ===== YOUNG ADULT (18-30) =====
  {
    id: "ya_university",
    text: "Has sido aceptado en la universidad, pero es cara.",
    agePhase: "young_adult",
    category: "education",
    weight: 5,
    conditions: (stats) => stats.education >= 40,
    options: [
      { text: "Ir aunque te endeudes", effects: { education: 8, intelligence: 5, money: -10, happiness: 2 } },
      { text: "Trabajar y estudiar a la vez", effects: { education: 5, money: -3, health: -4, intelligence: 3 } },
      { text: "Buscar una beca", effects: { education: 7, intelligence: 4 }, successChance: 0.4, failEffects: { education: 2, happiness: -3 } },
      { text: "No ir, buscar trabajo directamente", effects: { money: 5, education: -2 } },
    ],
  },
  {
    id: "ya_first_apartment",
    text: "Es hora de independizarte. ¿Qué haces?",
    agePhase: "young_adult",
    category: "lifestyle",
    weight: 4,
    options: [
      { text: "Alquilar solo/a", effects: { happiness: 5, money: -6, reputation: 2 } },
      { text: "Compartir piso", effects: { happiness: 2, money: -3, relationships: 3 } },
      { text: "Quedarte en casa de tus padres", effects: { money: 3, happiness: -2, reputation: -2 } },
    ],
  },
  {
    id: "ya_startup",
    text: "Se te ocurre una idea de negocio que podría funcionar.",
    agePhase: "young_adult",
    category: "finance",
    weight: 3,
    conditions: (stats) => stats.intelligence >= 50,
    options: [
      { text: "Lanzarte con todo", effects: { money: 15, reputation: 8, charisma: 5, health: -5, happiness: -3 }, successChance: 0.25, failEffects: { money: -15, happiness: -8, reputation: -3 } },
      { text: "Empezar poco a poco, sin dejar el trabajo", effects: { money: 5, intelligence: 3 }, successChance: 0.5, failEffects: { money: -3, happiness: -2 } },
      { text: "Guardar la idea para más adelante", effects: { intelligence: 1 } },
    ],
  },
  {
    id: "ya_travel",
    text: "Un amigo te propone hacer un viaje mochilero por Asia.",
    agePhase: "young_adult",
    category: "lifestyle",
    weight: 3,
    options: [
      { text: "¡Vamos! La vida son dos días", effects: { happiness: 8, charisma: 5, intelligence: 3, money: -8, relationships: 4 } },
      { text: "No puedo, tengo responsabilidades", effects: { money: 2, happiness: -3 } },
    ],
  },
  {
    id: "ya_move_abroad",
    text: "Te ofrecen un trabajo en otro país con mejor sueldo.",
    agePhase: "young_adult",
    category: "career",
    weight: 3,
    options: [
      { text: "Emigrar, es una oportunidad única", effects: { money: 10, education: 3, intelligence: 3, relationships: -8, happiness: -2 } },
      { text: "Quedarte, aquí está tu vida", effects: { relationships: 3, happiness: 2 } },
    ],
  },
  {
    id: "ya_invest",
    text: "Tienes algunos ahorros. ¿Qué haces con ellos?",
    agePhase: "young_adult",
    category: "finance",
    weight: 4,
    conditions: (stats) => stats.money >= 30,
    options: [
      { text: "Invertir en bolsa", effects: { money: 12, intelligence: 2 }, successChance: 0.5, failEffects: { money: -10, happiness: -5 } },
      { text: "Comprar crypto", effects: { money: 20 }, successChance: 0.3, failEffects: { money: -15, happiness: -8 } },
      { text: "Ahorrar en el banco", effects: { money: 3 } },
      { text: "Gastarlo en vivir bien", effects: { happiness: 6, health: 2, money: -5 } },
    ],
  },
  {
    id: "ya_wedding",
    text: "Tu pareja te propone casaros.",
    agePhase: "young_adult",
    category: "relationships",
    weight: 3,
    conditions: (stats) => stats.relationships >= 50,
    options: [
      { text: "¡Sí, quiero!", effects: { happiness: 8, relationships: 10, money: -8, reputation: 3 } },
      { text: "Todavía no estoy preparado/a", effects: { relationships: -5, happiness: -2 } },
      { text: "Proponer vivir juntos primero", effects: { relationships: 3, happiness: 2, money: -3 } },
    ],
  },
  {
    id: "ya_gym",
    text: "Te miras al espejo y decides que necesitas un cambio.",
    agePhase: "young_adult",
    category: "health",
    weight: 3,
    options: [
      { text: "Apuntarte al gimnasio y dieta estricta", effects: { health: 8, charisma: 4, happiness: 2, money: -2 } },
      { text: "Empezar a correr (gratis)", effects: { health: 5, happiness: 3 } },
      { text: "Nah, estoy bien así", effects: { happiness: 1, health: -2 } },
    ],
  },
  {
    id: "ya_side_hustle",
    text: "Descubres que puedes ganar dinero extra por internet.",
    agePhase: "young_adult",
    category: "finance",
    weight: 3,
    options: [
      { text: "Freelancing en tu campo", effects: { money: 6, education: 2, health: -3 } },
      { text: "Crear contenido en YouTube/TikTok", effects: { charisma: 5, money: 3, reputation: 4 }, successChance: 0.3, failEffects: { money: -1, happiness: -2 } },
      { text: "Trading y especulación", effects: { money: 10, intelligence: 2 }, successChance: 0.2, failEffects: { money: -12, happiness: -5 } },
      { text: "No, prefiero tiempo libre", effects: { happiness: 3, health: 2 } },
    ],
  },

  // ===== ADULT (31-55) =====
  {
    id: "adult_career_change",
    text: "Llevas años en el mismo trabajo y sientes que necesitas un cambio.",
    agePhase: "adult",
    category: "career",
    weight: 4,
    options: [
      { text: "Cambiar de carrera completamente", effects: { happiness: 5, money: -8, education: 5, intelligence: 3 } },
      { text: "Pedir un ascenso", effects: { money: 6, reputation: 3 }, successChance: 0.5, failEffects: { happiness: -5, reputation: -2 } },
      { text: "Montar tu propio negocio", effects: { money: 12, reputation: 5, happiness: 3, health: -5 }, successChance: 0.3, failEffects: { money: -15, happiness: -8 } },
      { text: "Seguir como estás", effects: { happiness: -3 } },
    ],
  },
  {
    id: "adult_midlife_crisis",
    text: "Cumples 40 y empiezas a cuestionarte todo.",
    agePhase: "adult",
    category: "lifestyle",
    weight: 3,
    conditions: (stats) => stats.happiness < 60,
    options: [
      { text: "Comprarte un deportivo", effects: { money: -10, happiness: 5, reputation: -2 }, narrative: "Crisis clásica." },
      { text: "Terapia y autoconocimiento", effects: { happiness: 8, intelligence: 3, health: 3, money: -3 } },
      { text: "Dejarlo todo y viajar", effects: { happiness: 10, money: -12, relationships: -5, charisma: 5 } },
      { text: "Ignorar el malestar", effects: { happiness: -5, health: -3 } },
    ],
  },
  {
    id: "adult_health_scare",
    text: "El médico te dice que tus análisis no son buenos.",
    agePhase: "adult",
    category: "health",
    weight: 4,
    options: [
      { text: "Cambiar radicalmente de hábitos", effects: { health: 10, happiness: -3, money: -3 } },
      { text: "Seguir las recomendaciones básicas", effects: { health: 5, happiness: -1 } },
      { text: "Ignorar al médico", effects: { happiness: 1, health: -8 } },
    ],
  },
  {
    id: "adult_kids",
    text: "¿Quieres tener hijos?",
    agePhase: "adult",
    category: "relationships",
    weight: 4,
    conditions: (stats) => stats.relationships >= 40,
    options: [
      { text: "Sí, es el momento", effects: { happiness: 8, relationships: 8, money: -10, health: -3, reputation: 3 } },
      { text: "Adoptar", effects: { happiness: 7, relationships: 7, money: -8, reputation: 5 } },
      { text: "No, prefiero mi libertad", effects: { happiness: 2, money: 3, relationships: -3 } },
    ],
  },
  {
    id: "adult_property",
    text: "Tienes la oportunidad de comprar una casa.",
    agePhase: "adult",
    category: "finance",
    weight: 4,
    conditions: (stats) => stats.money >= 40,
    options: [
      { text: "Comprar con hipoteca", effects: { money: -8, happiness: 5, reputation: 5 } },
      { text: "Seguir alquilando e invertir", effects: { money: 5, intelligence: 2 } },
      { text: "Comprar algo más pequeño al contado", effects: { money: -5, happiness: 3, reputation: 2 } },
    ],
  },
  {
    id: "adult_politics",
    text: "Te proponen presentarte a las elecciones locales.",
    agePhase: "adult",
    category: "career",
    weight: 2,
    conditions: (stats) => stats.charisma >= 55 && stats.reputation >= 50,
    options: [
      { text: "Aceptar el reto", effects: { reputation: 10, charisma: 5, happiness: -3, money: -5, relationships: -3 }, successChance: 0.4, failEffects: { reputation: -5, happiness: -5 } },
      { text: "Declinar educadamente", effects: { reputation: 1 } },
    ],
  },

  // ===== ELDERLY (56+) =====
  {
    id: "elderly_retirement",
    text: "Es hora de jubilarte. ¿Cómo quieres vivir esta etapa?",
    agePhase: "elderly",
    category: "lifestyle",
    weight: 5,
    options: [
      { text: "Viajar por el mundo", effects: { happiness: 10, money: -8, health: 2, charisma: 3 } },
      { text: "Dedicarte a un hobby", effects: { happiness: 8, health: 3, intelligence: 2 } },
      { text: "Voluntariado", effects: { happiness: 6, reputation: 8, relationships: 5 } },
      { text: "Seguir trabajando a medio tiempo", effects: { money: 5, health: -3, happiness: -2 } },
    ],
  },
  {
    id: "elderly_legacy",
    text: "Quieres dejar algo al mundo antes de irte.",
    agePhase: "elderly",
    category: "lifestyle",
    weight: 3,
    options: [
      { text: "Escribir un libro con tu historia", effects: { reputation: 8, intelligence: 3, happiness: 5 } },
      { text: "Donar a una causa", effects: { reputation: 10, money: -10, happiness: 8 } },
      { text: "Crear una fundación familiar", effects: { reputation: 12, money: -15, relationships: 8 } },
      { text: "Vivir sin preocuparte por el legado", effects: { happiness: 3 } },
    ],
  },
  {
    id: "elderly_health_choice",
    text: "Tu salud empieza a fallar. El médico te da opciones.",
    agePhase: "elderly",
    category: "health",
    weight: 5,
    options: [
      { text: "Tratamiento agresivo", effects: { health: 8, happiness: -5, money: -8 } },
      { text: "Tratamiento suave y calidad de vida", effects: { health: 3, happiness: 3, money: -3 } },
      { text: "Medicina alternativa", effects: { health: 2, happiness: 2 }, successChance: 0.3, failEffects: { health: -5 } },
    ],
  },
  {
    id: "elderly_grandkids",
    text: "Tus nietos quieren pasar más tiempo contigo.",
    agePhase: "elderly",
    category: "relationships",
    weight: 3,
    options: [
      { text: "Dedicarles todo tu tiempo libre", effects: { happiness: 8, relationships: 8, health: -2 } },
      { text: "Equilibrar con tu vida personal", effects: { happiness: 4, relationships: 4 } },
    ],
  },
  {
    id: "elderly_bucket_list",
    text: "Miras tu lista de cosas pendientes. Queda una por tachar.",
    agePhase: "elderly",
    category: "lifestyle",
    weight: 3,
    options: [
      { text: "Tirarte en paracaídas", effects: { happiness: 10, health: -3, charisma: 5 }, successChance: 0.9, failEffects: { health: -20 } },
      { text: "Visitar ese lugar que siempre soñaste", effects: { happiness: 8, money: -5 } },
      { text: "Reconciliarte con alguien del pasado", effects: { happiness: 6, relationships: 8 } },
      { text: "Dejarlo estar, ya no importa", effects: { happiness: -3 } },
    ],
  },
];

/** Get 1-3 relevant decisions for the current turn */
export function getDecisionsForTurn(agePhase: string, stats: CharacterStats): Decision[] {
  const eligible = DECISIONS.filter((d) => {
    if (d.agePhase !== agePhase) return false;
    if (d.conditions && !d.conditions(stats)) return false;
    return true;
  });

  if (eligible.length === 0) return [];

  // Weighted random selection
  const totalWeight = eligible.reduce((sum, d) => sum + d.weight, 0);
  const selected: Decision[] = [];
  const used = new Set<string>();

  // Pick 1-2 decisions (not always decisions every month)
  const count = Math.random() < 0.6 ? 1 : Math.random() < 0.3 ? 2 : 0;

  for (let i = 0; i < count && eligible.length > used.size; i++) {
    let roll = Math.random() * totalWeight;
    for (const decision of eligible) {
      if (used.has(decision.id)) continue;
      roll -= decision.weight;
      if (roll <= 0) {
        selected.push(decision);
        used.add(decision.id);
        break;
      }
    }
  }

  return selected;
}
