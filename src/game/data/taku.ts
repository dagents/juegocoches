// Taku — The recurring villain across all life phases
// All player-facing text in Spanish with dark/dramatic tone

import type { AgePhase, CharacterStats } from "@/game/engine/GameState";
import { getAgePhase } from "@/game/engine/GameState";

export interface TakuChoice {
  text: string;
  effects: Partial<CharacterStats>;
  narrative: string;
}

export interface TakuEncounter {
  id: string;
  phase: AgePhase;
  title: string;
  description: string;
  effects: Partial<CharacterStats>;
  choices?: TakuChoice[];
}

// All Taku encounters organized by life phase
const TAKU_ENCOUNTERS: TakuEncounter[] = [
  // ═══════════════════════════════════
  // CHILDHOOD (0-12)
  // ═══════════════════════════════════
  {
    id: "taku_child_bully",
    phase: "childhood",
    title: "El niño de la sombra",
    description:
      "Un niño aparece en el patio. Nadie sabe de dónde viene. Sus ojos oscuros te estudian con una calma antinatural. Te empuja contra la pared y susurra: 'Eres débil. Siempre lo serás.'",
    effects: { happiness: -15, relationships: -10, health: -5 },
    choices: [
      {
        text: "Plantarle cara",
        effects: { happiness: 5, charisma: 5, reputation: 5 },
        narrative: "Le miras a los ojos sin parpadear. Algo en tu mirada le hace retroceder. Hoy no.",
      },
      {
        text: "Huir corriendo",
        effects: { happiness: -10, health: -3 },
        narrative: "Corres hasta que los pulmones arden. Su risa te persigue en sueños durante semanas.",
      },
    ],
  },
  {
    id: "taku_child_theft",
    phase: "childhood",
    title: "La tentación del robo",
    description:
      "Una voz familiar te susurra al oído en la tienda de chuches: 'Cógelo. Nadie te ve. ¿No lo mereces?' Sientes sus dedos fríos en tu hombro, empujándote hacia el mostrador.",
    effects: { happiness: -8, reputation: -10, intelligence: -3 },
    choices: [
      {
        text: "Negarte y salir de la tienda",
        effects: { happiness: 5, reputation: 5, intelligence: 5 },
        narrative: "Algo dentro de ti dice que no. Sales de la tienda temblando pero entero.",
      },
      {
        text: "Robar las chuches",
        effects: { reputation: -15, happiness: -5 },
        narrative: "Te pillan. La vergüenza te marca como hierro candente. Él sonríe desde la esquina.",
      },
    ],
  },
  {
    id: "taku_child_isolation",
    phase: "childhood",
    title: "El amigo invisible",
    description:
      "Un niño nuevo dice ser tu amigo. Poco a poco te aleja de los demás. 'No les necesitas', repite. 'Solo me necesitas a mí.' Un día te das cuenta de que estás completamente solo.",
    effects: { relationships: -20, happiness: -12, charisma: -5 },
  },
  {
    id: "taku_child_nightmare",
    phase: "childhood",
    title: "Las pesadillas",
    description:
      "Cada noche, la misma figura aparece en tus sueños. Te observa desde el rincón de tu habitación con una sonrisa torcida. Tu madre dice que son solo pesadillas, pero las ojeras no mienten.",
    effects: { health: -10, happiness: -15, intelligence: -3 },
    choices: [
      {
        text: "Enfrentar la figura en el sueño",
        effects: { happiness: 8, intelligence: 5, health: 3 },
        narrative: "Esta noche te giras y le miras. La figura se desvanece. Duermes en paz por primera vez en meses.",
      },
      {
        text: "Dormir con la luz encendida",
        effects: { happiness: -5, health: -5 },
        narrative: "La luz no ayuda. Él está en tu cabeza, no en tu habitación.",
      },
    ],
  },

  // ═══════════════════════════════════
  // TEEN (13-17)
  // ═══════════════════════════════════
  {
    id: "taku_teen_drugs",
    phase: "teen",
    title: "La primera calada",
    description:
      "En una fiesta, alguien que te resulta vagamente familiar te ofrece algo. 'Prueba, no seas cobarde.' Sus ojos brillan con malicia. Los demás miran. La presión es insoportable.",
    effects: { health: -15, happiness: -10, reputation: -8 },
    choices: [
      {
        text: "Rechazar con firmeza",
        effects: { reputation: 8, health: 5, happiness: 5, charisma: 3 },
        narrative: "Dices que no. Algunos se ríen, pero otros te respetan más. Él desaparece entre la multitud.",
      },
      {
        text: "Aceptar por presión social",
        effects: { health: -20, happiness: -8, reputation: -5 },
        narrative: "El humo quema. Al día siguiente, sientes un vacío nuevo. Él ya tiene un pie dentro de tu vida.",
      },
    ],
  },
  {
    id: "taku_teen_cyberbully",
    phase: "teen",
    title: "El acoso digital",
    description:
      "Perfiles anónimos empiezan a publicar mentiras sobre ti. Fotos manipuladas, rumores venenosos. Nadie sabe quién está detrás, pero tú reconoces el patrón. Es él. Siempre es él.",
    effects: { happiness: -20, reputation: -15, relationships: -10, health: -5 },
    choices: [
      {
        text: "Denunciar y buscar ayuda",
        effects: { reputation: 10, happiness: 8, relationships: 5 },
        narrative: "Los adultos actúan. Las cuentas caen. Pero sabes que él simplemente cambiará de máscara.",
      },
      {
        text: "Sufrir en silencio",
        effects: { happiness: -15, health: -10, relationships: -5 },
        narrative: "Cada notificación es una puñalada. Dejas de mirar el móvil. Dejas de salir. Él gana.",
      },
    ],
  },
  {
    id: "taku_teen_toxic_friend",
    phase: "teen",
    title: "El amigo que destruye",
    description:
      "Tu 'mejor amigo' te convence de saltarte clases, mentir a tus padres, alejarte de quien te quiere. Cuando protestas, te manipula: 'Si fueras mi amigo de verdad, lo harías.' Su sonrisa es una trampa.",
    effects: { education: -15, relationships: -12, happiness: -8, reputation: -5 },
  },
  {
    id: "taku_teen_sabotage_exam",
    phase: "teen",
    title: "Sabotaje académico",
    description:
      "La noche antes del examen más importante de tu vida, descubres que alguien ha robado tus apuntes de la mochila. Los encuentras destrozados en el baño. Una nota: 'Suerte mañana.'",
    effects: { education: -18, happiness: -15, intelligence: -5 },
    choices: [
      {
        text: "Estudiar toda la noche de memoria",
        effects: { education: 10, intelligence: 8, health: -5 },
        narrative: "No duermes. Pero apruebas. La rabia se convierte en combustible.",
      },
      {
        text: "Rendirte y no presentarte",
        effects: { education: -10, happiness: -12 },
        narrative: "Te quedas en la cama mirando al techo. Él ha ganado esta batalla.",
      },
    ],
  },

  // ═══════════════════════════════════
  // YOUNG ADULT (18-30)
  // ═══════════════════════════════════
  {
    id: "taku_ya_scam_business",
    phase: "young_adult",
    title: "El negocio perfecto",
    description:
      "Un conocido carismático te propone un negocio infalible. Los números son demasiado buenos. Su sonrisa te resulta familiar, como un eco de algo que preferirías olvidar. 'Confía en mí', dice.",
    effects: { money: -25, happiness: -15, reputation: -10 },
    choices: [
      {
        text: "Investigar antes de invertir",
        effects: { money: 5, intelligence: 8, reputation: 5 },
        narrative: "Es una estafa piramidal. Lo denuncias. Él desaparece, pero volverá.",
      },
      {
        text: "Invertir todo",
        effects: { money: -30, happiness: -20, reputation: -15 },
        narrative: "Pierdes todo. Él se esfuma con tu dinero y tu dignidad. La lección cuesta cara.",
      },
    ],
  },
  {
    id: "taku_ya_relationship_poison",
    phase: "young_adult",
    title: "El veneno entre vosotros",
    description:
      "Alguien empieza a sembrar dudas en tu relación. Mensajes 'accidentales', encuentros 'casuales', mentiras perfectamente diseñadas. Tu pareja empieza a mirarte diferente.",
    effects: { relationships: -20, happiness: -18, charisma: -5 },
    choices: [
      {
        text: "Hablar abiertamente con tu pareja",
        effects: { relationships: 12, happiness: 8, charisma: 5 },
        narrative: "La verdad duele pero sana. Juntos identificáis al manipulador. El vínculo se fortalece.",
      },
      {
        text: "Dejar que la desconfianza crezca",
        effects: { relationships: -15, happiness: -12 },
        narrative: "El silencio pudre lo que el amor construyó. Cuando quieres hablar, ya es tarde.",
      },
    ],
  },
  {
    id: "taku_ya_identity_theft",
    phase: "young_adult",
    title: "Te roban la identidad",
    description:
      "Descubres deudas que no son tuyas, contratos que nunca firmaste. Alguien ha usado tu identidad para destruir tu crédito financiero. En la firma falsificada reconoces un trazo burlón, casi artístico.",
    effects: { money: -30, reputation: -20, happiness: -15, health: -5 },
  },
  {
    id: "taku_ya_false_accusation",
    phase: "young_adult",
    title: "La acusación falsa",
    description:
      "De la nada, te acusan de algo que no hiciste. Las pruebas parecen abrumadoras, fabricadas con precisión quirúrgica. Tu palabra contra un expediente inmaculado. Alguien ha dedicado meses a construir tu caída.",
    effects: { reputation: -25, happiness: -20, relationships: -15, money: -10 },
    choices: [
      {
        text: "Luchar legalmente con todo",
        effects: { reputation: 15, money: -15, happiness: 5, intelligence: 5 },
        narrative: "Meses de juicio. Pero la verdad sale a la luz. Sales absuelto, más fuerte y más oscuro.",
      },
      {
        text: "Aceptar un acuerdo injusto",
        effects: { reputation: -10, money: -20, happiness: -15 },
        narrative: "Aceptas para terminar con la pesadilla. Pero la mancha en tu nombre no se borra.",
      },
    ],
  },

  // ═══════════════════════════════════
  // ADULT (31-55)
  // ═══════════════════════════════════
  {
    id: "taku_adult_career_sabotage",
    phase: "adult",
    title: "Sabotaje profesional",
    description:
      "Tu ascenso estaba casi cerrado. Entonces llega un informe anónimo con 'irregularidades' en tu departamento. Todo apunta a ti. Tu jefe te mira con desconfianza. Años de trabajo, evaporados en un email.",
    effects: { money: -20, reputation: -25, happiness: -20, relationships: -8 },
    choices: [
      {
        text: "Reunir pruebas de tu inocencia",
        effects: { reputation: 15, intelligence: 8, happiness: 5 },
        narrative: "Demuestras que el informe es falso. Pero el que lo envió sigue ahí fuera, esperando.",
      },
      {
        text: "Dimitir con dignidad",
        effects: { money: -15, happiness: -10, reputation: 5 },
        narrative: "Te vas con la cabeza alta. Pero él se queda, y tu puesto ahora es suyo.",
      },
    ],
  },
  {
    id: "taku_adult_divorce_architect",
    phase: "adult",
    title: "El arquitecto del divorcio",
    description:
      "Descubres que alguien ha estado alimentando la discordia en tu matrimonio durante meses. Mensajes anónimos a tu pareja, rumores en el trabajo, fotos sacadas de contexto. Tu hogar se desmorona pieza a pieza.",
    effects: { relationships: -25, happiness: -25, health: -10, money: -15 },
  },
  {
    id: "taku_adult_investment_trap",
    phase: "adult",
    title: "La trampa financiera",
    description:
      "Un asesor financiero 'de confianza' te convence de mover todos tus ahorros a un fondo exclusivo. Cuando quieres retirar, el fondo ha desaparecido. Y con él, el asesor. Su descripción coincide con alguien que conoces.",
    effects: { money: -35, happiness: -20, health: -8, intelligence: -5 },
    choices: [
      {
        text: "Reconstruir desde cero con disciplina",
        effects: { money: 5, intelligence: 10, happiness: 3, charisma: 3 },
        narrative: "Tocas fondo. Pero desde el fondo solo se puede subir. Esta vez, más cauto.",
      },
      {
        text: "Caer en la desesperación",
        effects: { happiness: -20, health: -15, relationships: -10 },
        narrative: "La ruina te consume. El alcohol aparece. Las noches son interminables.",
      },
    ],
  },
  {
    id: "taku_adult_health_scare",
    phase: "adult",
    title: "El diagnóstico sospechoso",
    description:
      "Un médico que no conoces te da un diagnóstico devastador y recomienda un tratamiento carísimo. Algo no cuadra. Los ojos del doctor tienen una frialdad que ya has visto antes.",
    effects: { health: -15, happiness: -20, money: -20 },
    choices: [
      {
        text: "Buscar una segunda opinión",
        effects: { health: 10, money: -5, intelligence: 8, happiness: 10 },
        narrative: "Era mentira. El diagnóstico era falso. Pero el miedo que sentiste fue muy real.",
      },
      {
        text: "Pagar el tratamiento",
        effects: { money: -25, health: -5, happiness: -10 },
        narrative: "Meses de pastillas innecesarias. Cuando lo descubres, el médico ha cerrado la consulta.",
      },
    ],
  },
  {
    id: "taku_adult_blackmail",
    phase: "adult",
    title: "El chantaje",
    description:
      "Un sobre aparece en tu buzón. Dentro, fotos, documentos, secretos que creías enterrados. Una nota: 'Paga o todos lo sabrán.' La caligrafía te hiela la sangre.",
    effects: { happiness: -25, money: -20, reputation: -15, health: -8 },
    choices: [
      {
        text: "Negarte a pagar y enfrentar las consecuencias",
        effects: { reputation: -10, happiness: 5, charisma: 8, intelligence: 5 },
        narrative: "La verdad sale. Duele. Pero ya nadie puede usarla contra ti. Eres libre.",
      },
      {
        text: "Pagar para que desaparezca",
        effects: { money: -25, happiness: -15 },
        narrative: "Pagas. Pero nunca es suficiente. El siguiente sobre llega al mes siguiente.",
      },
    ],
  },

  // ═══════════════════════════════════
  // ELDERLY (56+)
  // ═══════════════════════════════════
  {
    id: "taku_elderly_scam_call",
    phase: "elderly",
    title: "La llamada del estafador",
    description:
      "El teléfono suena. Una voz amable dice ser de tu banco. Necesitan tus datos 'por seguridad'. La voz es dulce, convincente, hipnótica. Pero debajo hay algo que reconoces. Algo antiguo y cruel.",
    effects: { money: -25, happiness: -15, intelligence: -5 },
    choices: [
      {
        text: "Colgar inmediatamente",
        effects: { money: 5, intelligence: 5, happiness: 3 },
        narrative: "Cuelgas. No hoy, viejo enemigo. No hoy.",
      },
      {
        text: "Dar los datos",
        effects: { money: -30, happiness: -20, reputation: -5 },
        narrative: "Tu cuenta queda vacía en minutos. La vergüenza es peor que la pérdida.",
      },
    ],
  },
  {
    id: "taku_elderly_regret_voice",
    phase: "elderly",
    title: "La voz del arrepentimiento",
    description:
      "En la quietud de la noche, una voz interior que conoces demasiado bien empieza a hablar: 'No hiciste lo suficiente. Desperdiciaste tu vida. Nadie te recordará.' La oscuridad pesa como plomo.",
    effects: { happiness: -25, health: -12, relationships: -8 },
    choices: [
      {
        text: "Recordar todo lo bueno que viviste",
        effects: { happiness: 15, health: 5, intelligence: 5, relationships: 5 },
        narrative: "Repasas tu vida. Hubo dolor, sí. Pero también amor, risas y momentos irrepetibles. Sonríes en la oscuridad.",
      },
      {
        text: "Dejarte arrastrar por la melancolía",
        effects: { happiness: -15, health: -10 },
        narrative: "La oscuridad te envuelve. Los días pierden color. Él siempre supo cómo encontrar tus grietas.",
      },
    ],
  },
  {
    id: "taku_elderly_inheritance_fraud",
    phase: "elderly",
    title: "El fraude de la herencia",
    description:
      "Un 'sobrino lejano' aparece de la nada, encantador y atento. Poco a poco gana tu confianza. Cuando descubres que ha modificado tu testamento a su favor, ya es casi tarde.",
    effects: { money: -20, relationships: -15, happiness: -18, reputation: -5 },
    choices: [
      {
        text: "Llamar a un abogado inmediatamente",
        effects: { money: -5, relationships: 5, happiness: 8, reputation: 5 },
        narrative: "El testamento se anula. El impostor desaparece. Pero la traición de la confianza queda.",
      },
      {
        text: "No hacer nada por vergüenza",
        effects: { money: -25, happiness: -15, relationships: -10 },
        narrative: "Cuando mueras, tu verdadera familia no recibirá nada. Él habrá ganado incluso después de tu muerte.",
      },
    ],
  },
  {
    id: "taku_elderly_isolation",
    phase: "elderly",
    title: "El aislamiento final",
    description:
      "Uno a uno, tus contactos dejan de llamar. Alguien ha esparcido rumores: que estás senil, que eres difícil, que ya no vale la pena visitarte. La soledad se instala como un inquilino permanente.",
    effects: { relationships: -25, happiness: -20, health: -10 },
  },
  {
    id: "taku_elderly_medical_fraud",
    phase: "elderly",
    title: "El cuidador siniestro",
    description:
      "Tu nuevo cuidador es eficiente y amable. Demasiado amable. Notas que tus pastillas son diferentes, que tu dinero mengua, que las visitas se cancelan 'por tu bien'. Detrás de su sonrisa hay algo que ya conoces.",
    effects: { health: -18, money: -20, happiness: -15, relationships: -10 },
    choices: [
      {
        text: "Pedir ayuda a tu familia",
        effects: { relationships: 10, health: 8, happiness: 8, money: 5 },
        narrative: "Tu familia interviene. El cuidador es despedido. Estabas a tiempo, pero por poco.",
      },
      {
        text: "Resignarte porque dependes de él",
        effects: { health: -15, happiness: -20, money: -15 },
        narrative: "La dependencia es la cadena más cruel. Él lo sabe, y aprieta día a día.",
      },
    ],
  },
];

/**
 * Returns a Taku encounter or null based on probability and game state.
 * ~15% chance per year (normal), ~25% forocochero. Max 3-8 per lifetime.
 */
export function getTakuEncounter(
  age: number,
  stats: CharacterStats,
  difficulty: "normal" | "forocochero",
  previousEncounters: number
): TakuEncounter | null {
  // Max encounters per lifetime: 8 (forocochero) or 6 (normal)
  const maxEncounters = difficulty === "forocochero" ? 8 : 6;
  if (previousEncounters >= maxEncounters) return null;

  // Minimum 3 encounters guaranteed by increasing probability over time
  const baseProbability = difficulty === "forocochero" ? 0.25 : 0.15;

  // Scale probability: higher if fewer encounters and older age
  let probability = baseProbability;
  if (age > 50 && previousEncounters < 3) {
    probability += 0.15; // Push toward minimum 3
  }

  // More success = more Taku (envy mechanic from GAME.md)
  const avgSuccess = (stats.money + stats.reputation + stats.happiness) / 3;
  if (avgSuccess > 60) probability += 0.05;
  if (avgSuccess > 80) probability += 0.05;

  // Low stats also attract Taku (preying on the weak)
  if (stats.health < 30 || stats.happiness < 25) probability += 0.05;

  if (Math.random() > probability) return null;

  // Filter encounters by current phase, exclude already-used IDs by picking randomly
  const phase = getAgePhase(age);
  const phaseEncounters = TAKU_ENCOUNTERS.filter((e) => e.phase === phase);

  if (phaseEncounters.length === 0) return null;

  // Pick a random encounter from the phase
  const encounter = phaseEncounters[Math.floor(Math.random() * phaseEncounters.length)];

  // Scale effects by difficulty
  if (difficulty === "forocochero") {
    const scaled = { ...encounter.effects };
    for (const key of Object.keys(scaled) as (keyof CharacterStats)[]) {
      const val = scaled[key];
      if (val !== undefined && val < 0) {
        scaled[key] = Math.round(val * 1.4);
      }
    }
    return { ...encounter, effects: scaled };
  }

  return encounter;
}
