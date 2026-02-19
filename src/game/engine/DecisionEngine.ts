// Context-aware decision generation based on stats, age, and location

import {
  type GameState,
  type CharacterStats,
  type AgePhase,
  getAgePhase,
} from "./GameState";

export interface DecisionOption {
  id: string;
  text: string;
  effects: Partial<CharacterStats>;
  successChance?: number;
  failEffects?: Partial<CharacterStats>;
  narrative: string;
  failNarrative?: string;
}

export interface Decision {
  id: string;
  text: string;
  agePhase: AgePhase;
  category: string;
  options: DecisionOption[];
}

/** Generate contextual decisions for the current turn */
export function generateDecisions(state: GameState): Decision[] {
  const phase = getAgePhase(state.currentAge);
  const decisions: Decision[] = [];

  switch (phase) {
    case "childhood":
      decisions.push(...getChildhoodDecisions(state));
      break;
    case "teen":
      decisions.push(...getTeenDecisions(state));
      break;
    case "young_adult":
      decisions.push(...getYoungAdultDecisions(state));
      break;
    case "adult":
      decisions.push(...getAdultDecisions(state));
      break;
    case "elderly":
      decisions.push(...getElderlyDecisions(state));
      break;
  }

  // Return 1-2 random decisions from the pool
  const shuffled = decisions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(2, shuffled.length));
}

function getChildhoodDecisions(state: GameState): Decision[] {
  const pool: Decision[] = [
    {
      id: "child_study",
      text: "Tu profesor te pide que te esfuerces más en clase. ¿Qué haces?",
      agePhase: "childhood",
      category: "education",
      options: [
        {
          id: "study_hard",
          text: "Estudiar mucho y sacar buenas notas",
          effects: { education: 5, intelligence: 3, happiness: -2 },
          narrative: "Te esfuerzas y tus notas mejoran notablemente.",
        },
        {
          id: "study_balance",
          text: "Estudiar lo justo y jugar con amigos",
          effects: { education: 2, relationships: 3, happiness: 3 },
          narrative: "Mantienes un equilibrio entre estudios y diversión.",
        },
        {
          id: "skip_study",
          text: "Pasar de estudiar y hacer lo que quieras",
          effects: { education: -2, happiness: 4, reputation: -2 },
          narrative: "La libertad se siente bien... por ahora.",
        },
      ],
    },
    {
      id: "child_bully",
      text: "Un compañero del colegio te está molestando. ¿Cómo reaccionas?",
      agePhase: "childhood",
      category: "social",
      options: [
        {
          id: "stand_up",
          text: "Plantarle cara",
          effects: { charisma: 3, reputation: 2, health: -1 },
          successChance: 0.7,
          failEffects: { health: -5, happiness: -3 },
          narrative: "Le plantas cara y te deja en paz. Ganas respeto.",
          failNarrative: "No sale bien. Te llevas un golpe y una nota del director.",
        },
        {
          id: "tell_teacher",
          text: "Contárselo a un profesor",
          effects: { reputation: -1, happiness: 1 },
          narrative: "El profesor interviene. El acoso para, pero algunos te llaman chivato.",
        },
        {
          id: "make_friends",
          text: "Intentar hacerte amigo suyo",
          effects: { charisma: 4, relationships: 3 },
          successChance: 0.4,
          failEffects: { happiness: -3 },
          narrative: "Sorprendentemente, funciona. Os hacéis amigos.",
          failNarrative: "Se ríe de ti. No era buena idea.",
        },
      ],
    },
    {
      id: "child_hobby",
      text: "Tienes tiempo libre después del colegio. ¿A qué lo dedicas?",
      agePhase: "childhood",
      category: "lifestyle",
      options: [
        {
          id: "sports",
          text: "Apuntarte a un deporte",
          effects: { health: 5, charisma: 2, relationships: 2 },
          narrative: "El deporte te sienta genial. Haces nuevos amigos en el equipo.",
        },
        {
          id: "read",
          text: "Leer y explorar cosas nuevas",
          effects: { intelligence: 5, education: 3 },
          narrative: "Los libros abren tu mente a mundos nuevos.",
        },
        {
          id: "videogames",
          text: "Jugar a videojuegos todo el día",
          effects: { happiness: 4, intelligence: 1, health: -2, relationships: -1 },
          narrative: "Te diviertes mucho, aunque tu madre no opina lo mismo.",
        },
        {
          id: "music",
          text: "Aprender a tocar un instrumento",
          effects: { intelligence: 3, charisma: 3, happiness: 2 },
          narrative: "La música se convierte en tu refugio.",
        },
      ],
    },
    {
      id: "child_family_event",
      text: "Tus padres discuten mucho últimamente. ¿Qué haces?",
      agePhase: "childhood",
      category: "personal",
      options: [
        {
          id: "mediate",
          text: "Intentar mediar entre ellos",
          effects: { charisma: 2, happiness: -3, relationships: 2 },
          narrative: "Intentas calmar las cosas. Es mucha presión para tu edad.",
        },
        {
          id: "escape",
          text: "Refugiarte en tus cosas",
          effects: { intelligence: 2, happiness: -1 },
          narrative: "Te aíslas en tu mundo. A veces es la mejor defensa.",
        },
        {
          id: "seek_help",
          text: "Hablar con un familiar de confianza",
          effects: { relationships: 3, happiness: 1 },
          narrative: "Tu abuelo/a te escucha y te reconforta.",
        },
      ],
    },
  ];

  return pool.filter(() => Math.random() > 0.3);
}

function getTeenDecisions(state: GameState): Decision[] {
  const pool: Decision[] = [
    {
      id: "teen_party",
      text: "Te invitan a una fiesta donde habrá alcohol. ¿Vas?",
      agePhase: "teen",
      category: "lifestyle",
      options: [
        {
          id: "go_party",
          text: "Ir y pasarlo bien",
          effects: { happiness: 5, charisma: 3, relationships: 3, health: -2 },
          narrative: "La fiesta es épica. Conoces gente nueva y te lo pasas genial.",
        },
        {
          id: "go_careful",
          text: "Ir pero controlarte",
          effects: { happiness: 3, relationships: 2, charisma: 1 },
          narrative: "Vas, socializas, pero con cabeza. Buena elección.",
        },
        {
          id: "stay_home",
          text: "Quedarte en casa estudiando",
          effects: { education: 4, happiness: -2 },
          narrative: "FOMO total, pero tus notas lo agradecen.",
        },
      ],
    },
    {
      id: "teen_first_love",
      text: "Te gusta alguien de tu clase. ¿Qué haces?",
      agePhase: "teen",
      category: "relationships",
      options: [
        {
          id: "confess",
          text: "Declararte",
          effects: { charisma: 4, happiness: 5 },
          successChance: 0.5,
          failEffects: { happiness: -8, charisma: 1 },
          narrative: "¡Dice que sí! Tu primer amor. El mundo es maravilloso.",
          failNarrative: "Te rechaza. Duele, pero aprendes algo sobre ti mismo/a.",
        },
        {
          id: "flirt",
          text: "Tirarle indirectas y esperar",
          effects: { charisma: 2 },
          narrative: "Las indirectas van y vienen. Algo puede pasar... o no.",
        },
        {
          id: "focus_self",
          text: "Pasar y centrarte en ti",
          effects: { intelligence: 2, education: 2, happiness: -1 },
          narrative: "Decides que el amor puede esperar. Tu futuro no.",
        },
      ],
    },
    {
      id: "teen_career_path",
      text: "Es hora de pensar en tu futuro. ¿Qué dirección tomas?",
      agePhase: "teen",
      category: "education",
      options: [
        {
          id: "university_track",
          text: "Prepararte para la universidad",
          effects: { education: 6, intelligence: 3, happiness: -2 },
          narrative: "Te centras en los estudios. Selectividad, allá vamos.",
        },
        {
          id: "vocational",
          text: "Formación profesional o grado medio",
          effects: { education: 4, money: 2 },
          narrative: "Aprendes un oficio. Práctico y con salida laboral.",
        },
        {
          id: "work_early",
          text: "Dejar de estudiar y trabajar",
          effects: { money: 5, education: -3, happiness: 1 },
          narrative: "Empiezas a ganar dinero pronto. Libertad económica, pero sin título.",
        },
        {
          id: "rebel",
          text: "No me importa el futuro",
          effects: { happiness: 3, reputation: -3, education: -4 },
          narrative: "Vives el momento. Ya pensarás en eso después... ¿no?",
        },
      ],
    },
    {
      id: "teen_drugs",
      text: "Un amigo te ofrece probar marihuana. ¿Qué decides?",
      agePhase: "teen",
      category: "risk",
      options: [
        {
          id: "try_it",
          text: "Probar por curiosidad",
          effects: { happiness: 2, health: -3, charisma: 1 },
          successChance: 0.7,
          failEffects: { health: -8, happiness: -5, reputation: -5 },
          narrative: "La pruebas una vez y no pasa nada. Experiencia de vida.",
          failNarrative: "Te pilla tu madre. Castigado/a. Y te sienta fatal.",
        },
        {
          id: "refuse",
          text: "Rechazarlo educadamente",
          effects: { health: 1, reputation: 1 },
          narrative: "Dices que no. Tu amigo lo respeta.",
        },
        {
          id: "lecture",
          text: "Darle un sermón sobre drogas",
          effects: { reputation: 2, relationships: -3 },
          narrative: "Le sueltas un discurso. No te invitan a la siguiente.",
        },
      ],
    },
  ];

  return pool.filter(() => Math.random() > 0.3);
}

function getYoungAdultDecisions(state: GameState): Decision[] {
  const pool: Decision[] = [
    {
      id: "ya_move_out",
      text: "¿Es hora de independizarte?",
      agePhase: "young_adult",
      category: "lifestyle",
      options: [
        {
          id: "move_alone",
          text: "Mudarte solo/a a un piso",
          effects: { happiness: 5, money: -8, charisma: 3 },
          narrative: "Libertad total. Tu propio espacio. También tus propias facturas.",
        },
        {
          id: "move_friends",
          text: "Compartir piso con amigos",
          effects: { happiness: 4, money: -4, relationships: 3 },
          narrative: "Convivir con amigos. Risas, caos y facturas compartidas.",
        },
        {
          id: "stay_parents",
          text: "Quedarte con tus padres y ahorrar",
          effects: { money: 5, happiness: -2, reputation: -2 },
          narrative: "Ahorras mucho, pero la independencia tendrá que esperar.",
        },
      ],
    },
    {
      id: "ya_invest",
      text: "Has ahorrado algo de dinero. ¿Qué haces con él?",
      agePhase: "young_adult",
      category: "finance",
      options: [
        {
          id: "invest_safe",
          text: "Invertir en fondos indexados",
          effects: { money: 3, intelligence: 2 },
          narrative: "Inversión conservadora pero inteligente. El interés compuesto hará su trabajo.",
        },
        {
          id: "invest_crypto",
          text: "Meterlo todo en crypto",
          effects: { money: 10 },
          successChance: 0.35,
          failEffects: { money: -15, happiness: -8 },
          narrative: "¡To the moon! 🚀 Tu inversión se multiplica.",
          failNarrative: "Crash total. Pierdes casi todo. Lección cara.",
        },
        {
          id: "invest_business",
          text: "Montar un negocio propio",
          effects: { money: 8, reputation: 5, charisma: 3 },
          successChance: 0.4,
          failEffects: { money: -12, happiness: -5, reputation: -2 },
          narrative: "¡Tu negocio funciona! Eres tu propio jefe.",
          failNarrative: "El negocio fracasa. Pierdes la inversión, pero ganas experiencia.",
        },
        {
          id: "spend_travel",
          text: "Gastarlo en un viaje épico",
          effects: { money: -5, happiness: 10, charisma: 3, intelligence: 2 },
          narrative: "Un viaje que nunca olvidarás. Experiencias > cosas.",
        },
      ],
    },
    {
      id: "ya_career_change",
      text: "No estás contento/a con tu trabajo actual. ¿Qué haces?",
      agePhase: "young_adult",
      category: "career",
      options: [
        {
          id: "switch_career",
          text: "Cambiar de profesión radicalmente",
          effects: { happiness: 5, money: -5, education: 3 },
          narrative: "Empiezas de cero en algo nuevo. Arriesgado pero liberador.",
        },
        {
          id: "study_more",
          text: "Hacer un máster o formación extra",
          effects: { education: 8, money: -4, intelligence: 3 },
          narrative: "Inviertes en ti mismo/a. Los resultados llegarán.",
        },
        {
          id: "endure",
          text: "Aguantar y cobrar el sueldo",
          effects: { money: 2, happiness: -3 },
          narrative: "El dinero no lo es todo, pero las facturas hay que pagarlas.",
        },
      ],
    },
    {
      id: "ya_relationship_serious",
      text: "Llevas tiempo con tu pareja. ¿Dónde va esto?",
      agePhase: "young_adult",
      category: "relationships",
      options: [
        {
          id: "propose",
          text: "Dar el paso y comprometerte",
          effects: { relationships: 10, happiness: 8, money: -3 },
          successChance: 0.8,
          failEffects: { relationships: -15, happiness: -12 },
          narrative: "¡Dice que sí! El comienzo de una nueva etapa.",
          failNarrative: "No estaba preparado/a. La relación se rompe.",
        },
        {
          id: "keep_dating",
          text: "Seguir como estáis, sin prisas",
          effects: { relationships: 2, happiness: 1 },
          narrative: "Sin prisas. Lo bueno se cuece lento.",
        },
        {
          id: "break_up",
          text: "Dejarlo y ser libre",
          effects: { relationships: -8, happiness: -5, charisma: 2 },
          narrative: "Duele, pero necesitabas espacio para crecer.",
        },
      ],
    },
  ];

  // Only show relationship decision if has partner
  const hasPartner = state.relationships.some((r) => r.type === "partner");
  return pool
    .filter((d) => {
      if (d.id === "ya_relationship_serious") return hasPartner;
      return true;
    })
    .filter(() => Math.random() > 0.3);
}

function getAdultDecisions(state: GameState): Decision[] {
  const pool: Decision[] = [
    {
      id: "adult_midlife",
      text: "Sientes que la vida se te escapa. ¿Cómo reaccionas?",
      agePhase: "adult",
      category: "personal",
      options: [
        {
          id: "reinvent",
          text: "Reinventarte por completo",
          effects: { happiness: 8, money: -5, charisma: 5 },
          narrative: "Nuevo look, nuevos objetivos, nueva energía. Renacer.",
        },
        {
          id: "therapy",
          text: "Ir a terapia",
          effects: { happiness: 6, health: 4, intelligence: 2, money: -2 },
          narrative: "Hablar con un profesional cambia tu perspectiva.",
        },
        {
          id: "buy_something",
          text: "Comprarte algo caro para compensar",
          effects: { happiness: 3, money: -8 },
          narrative: "Un capricho temporal. La felicidad dura poco.",
        },
        {
          id: "accept",
          text: "Aceptarlo y seguir adelante",
          effects: { intelligence: 3, happiness: 2 },
          narrative: "La madurez es aceptar lo que no puedes cambiar.",
        },
      ],
    },
    {
      id: "adult_health_scare",
      text: "El médico te dice que tu salud necesita atención urgente.",
      agePhase: "adult",
      category: "health",
      options: [
        {
          id: "lifestyle_change",
          text: "Cambiar radicalmente tus hábitos",
          effects: { health: 10, happiness: -3, money: -2 },
          narrative: "Dieta, ejercicio, nada de vicios. Tu cuerpo te lo agradece.",
        },
        {
          id: "medication",
          text: "Tomar medicación y seguir igual",
          effects: { health: 4, money: -3 },
          narrative: "Las pastillas ayudan, pero no son la solución completa.",
        },
        {
          id: "ignore",
          text: "Ignorar al médico",
          effects: { health: -8, happiness: 2 },
          narrative: "Ya se pasará... ¿verdad?",
        },
      ],
    },
    {
      id: "adult_investment_opp",
      text: "Te ofrecen invertir en un proyecto inmobiliario con alta rentabilidad.",
      agePhase: "adult",
      category: "finance",
      options: [
        {
          id: "invest_big",
          text: "Invertir fuerte",
          effects: { money: 15 },
          successChance: 0.5,
          failEffects: { money: -20, happiness: -10 },
          narrative: "El proyecto triunfa. Ganancias enormes.",
          failNarrative: "Era una estafa piramidal. Pierdes todo lo invertido.",
        },
        {
          id: "invest_small",
          text: "Invertir una cantidad prudente",
          effects: { money: 5 },
          successChance: 0.5,
          failEffects: { money: -5, happiness: -3 },
          narrative: "Ganancias modestas pero seguras.",
          failNarrative: "Pierdes algo, pero no es el fin del mundo.",
        },
        {
          id: "decline",
          text: "Rechazar la oferta",
          effects: { intelligence: 1 },
          narrative: "Mejor prevenir que curar. La prudencia es una virtud.",
        },
      ],
    },
  ];

  return pool.filter(() => Math.random() > 0.3);
}

function getElderlyDecisions(state: GameState): Decision[] {
  const pool: Decision[] = [
    {
      id: "elderly_legacy",
      text: "Piensas en qué legado dejar. ¿Qué te importa más?",
      agePhase: "elderly",
      category: "personal",
      options: [
        {
          id: "write_memoirs",
          text: "Escribir tus memorias",
          effects: { happiness: 5, reputation: 5, intelligence: 2 },
          narrative: "Tu historia merece ser contada. Empiezas a escribir.",
        },
        {
          id: "donate",
          text: "Donar tu fortuna a causas benéficas",
          effects: { reputation: 10, happiness: 8, money: -15 },
          narrative: "Tu generosidad marcará la diferencia en muchas vidas.",
        },
        {
          id: "family_first",
          text: "Dedicar todo tu tiempo a la familia",
          effects: { relationships: 10, happiness: 6 },
          narrative: "Los mejores momentos son con los que más quieres.",
        },
      ],
    },
    {
      id: "elderly_bucket_list",
      text: "Tienes una lista de cosas pendientes. ¿Qué haces primero?",
      agePhase: "elderly",
      category: "lifestyle",
      options: [
        {
          id: "world_trip",
          text: "Dar la vuelta al mundo",
          effects: { happiness: 10, health: -3, money: -8, charisma: 3 },
          narrative: "El viaje de tu vida. Cada día una aventura nueva.",
        },
        {
          id: "learn_new",
          text: "Aprender algo que siempre quisiste",
          effects: { happiness: 6, intelligence: 5, education: 3 },
          narrative: "Nunca es tarde para aprender. Tu mente se expande.",
        },
        {
          id: "rest",
          text: "Disfrutar de la tranquilidad",
          effects: { health: 3, happiness: 4 },
          narrative: "La paz de no tener que demostrar nada a nadie.",
        },
      ],
    },
  ];

  return pool.filter(() => Math.random() > 0.2);
}
