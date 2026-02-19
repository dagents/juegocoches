// Random event system with probability-weighted selection

import {
  type GameState,
  type CharacterStats,
  type LifeEvent,
  getAgePhase,
} from "./GameState";

export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  category: "economic" | "health" | "social" | "opportunity" | "disaster" | "personal" | "global";
  probability: number; // per month
  minAge: number;
  maxAge: number;
  effects: Partial<CharacterStats>;
}

const RANDOM_EVENTS: RandomEvent[] = [
  // Economic
  { id: "lottery_small", name: "Premio de lotería", description: "¡Te toca un premio pequeño en la lotería! No es un millón, pero alegra el mes.", category: "economic", probability: 0.01, minAge: 18, maxAge: 100, effects: { money: 8, happiness: 5 } },
  { id: "robbery", name: "Robo", description: "Te roban la cartera/bolso en la calle. Pierdes dinero y la sensación de seguridad.", category: "economic", probability: 0.02, minAge: 10, maxAge: 90, effects: { money: -5, happiness: -4, health: -1 } },
  { id: "inheritance", name: "Herencia inesperada", description: "Un familiar lejano te deja una herencia que no esperabas.", category: "economic", probability: 0.005, minAge: 20, maxAge: 80, effects: { money: 15, happiness: 3 } },
  { id: "tax_audit", name: "Inspección fiscal", description: "Hacienda te hace una inspección. Toca pagar lo que debías... y más.", category: "economic", probability: 0.015, minAge: 25, maxAge: 70, effects: { money: -8, happiness: -3 } },
  { id: "economic_boom", name: "Boom económico", description: "La economía de tu país está en auge. Todo el mundo parece prosperar.", category: "economic", probability: 0.02, minAge: 0, maxAge: 100, effects: { money: 5, happiness: 3 } },
  { id: "recession", name: "Recesión económica", description: "Crisis económica. Los precios suben, los sueldos bajan.", category: "economic", probability: 0.02, minAge: 0, maxAge: 100, effects: { money: -6, happiness: -4 } },
  { id: "inflation", name: "Inflación disparada", description: "Los precios se disparan. Tu dinero vale cada vez menos.", category: "economic", probability: 0.03, minAge: 0, maxAge: 100, effects: { money: -4, happiness: -2 } },

  // Health
  { id: "flu", name: "Gripe fuerte", description: "Caes enfermo/a con una gripe terrible. Una semana en cama.", category: "health", probability: 0.05, minAge: 0, maxAge: 100, effects: { health: -5, happiness: -2 } },
  { id: "accident_minor", name: "Accidente leve", description: "Te caes y te haces daño. Nada grave pero duele.", category: "health", probability: 0.03, minAge: 5, maxAge: 80, effects: { health: -8, happiness: -3 } },
  { id: "accident_serious", name: "Accidente grave", description: "Un accidente serio te deja en el hospital durante semanas.", category: "health", probability: 0.005, minAge: 10, maxAge: 90, effects: { health: -25, happiness: -10, money: -8 } },
  { id: "depression_onset", name: "Episodio depresivo", description: "La oscuridad llega sin avisar. Nada parece tener sentido.", category: "health", probability: 0.03, minAge: 14, maxAge: 80, effects: { happiness: -15, health: -5, relationships: -5 } },
  { id: "fitness_motivation", name: "Motivación fitness", description: "Algo hace click y empiezas a cuidarte de verdad.", category: "health", probability: 0.04, minAge: 15, maxAge: 70, effects: { health: 8, happiness: 4, charisma: 2 } },
  { id: "addiction_risk", name: "Riesgo de adicción", description: "Una sustancia o hábito empieza a controlarte.", category: "health", probability: 0.02, minAge: 15, maxAge: 60, effects: { health: -10, happiness: -5, money: -5, relationships: -5 } },
  { id: "dental_issue", name: "Problema dental", description: "Dolor de muelas terrible. Al dentista no se escapa nadie.", category: "health", probability: 0.04, minAge: 5, maxAge: 90, effects: { health: -3, money: -3, happiness: -2 } },

  // Social
  { id: "new_friend", name: "Nuevo amigo/a", description: "Conoces a alguien genial. Conexión instantánea.", category: "social", probability: 0.06, minAge: 5, maxAge: 80, effects: { relationships: 8, happiness: 4, charisma: 1 } },
  { id: "betrayal", name: "Traición", description: "Alguien cercano te traiciona. La confianza se rompe.", category: "social", probability: 0.02, minAge: 12, maxAge: 80, effects: { relationships: -10, happiness: -8 } },
  { id: "family_death", name: "Muerte de un familiar", description: "Pierdes a alguien importante. El vacío es enorme.", category: "social", probability: 0.015, minAge: 10, maxAge: 100, effects: { happiness: -15, health: -3, relationships: -5 } },
  { id: "party_invite", name: "Fiesta épica", description: "Te invitan a una fiesta increíble. La pasas genial.", category: "social", probability: 0.05, minAge: 15, maxAge: 60, effects: { happiness: 5, relationships: 3, charisma: 2 } },
  { id: "viral_moment", name: "Momento viral", description: "Algo que haces se hace viral en redes. Fama instantánea.", category: "social", probability: 0.01, minAge: 12, maxAge: 50, effects: { reputation: 10, charisma: 5, happiness: 4 } },
  { id: "neighbor_conflict", name: "Conflicto vecinal", description: "Problemas con los vecinos. Ruido, disputas, tensión.", category: "social", probability: 0.03, minAge: 18, maxAge: 90, effects: { happiness: -4, relationships: -2 } },

  // Opportunity
  { id: "job_offer", name: "Oferta de trabajo", description: "Te llega una oferta de trabajo inesperada con mejor sueldo.", category: "opportunity", probability: 0.03, minAge: 18, maxAge: 65, effects: { money: 8, happiness: 3, reputation: 2 } },
  { id: "scholarship", name: "Beca de estudios", description: "Te conceden una beca. Oportunidad de formarte gratis.", category: "opportunity", probability: 0.02, minAge: 16, maxAge: 35, effects: { education: 10, intelligence: 5, money: 3 } },
  { id: "business_idea", name: "Idea de negocio", description: "Se te ocurre una idea de negocio brillante.", category: "opportunity", probability: 0.02, minAge: 18, maxAge: 60, effects: { intelligence: 3, happiness: 3 } },
  { id: "mentor_appears", name: "Aparece un mentor", description: "Alguien experimentado decide guiarte. Oro puro.", category: "opportunity", probability: 0.02, minAge: 15, maxAge: 50, effects: { intelligence: 5, education: 3, charisma: 3, reputation: 2 } },
  { id: "travel_opportunity", name: "Oportunidad de viaje", description: "Surge la posibilidad de un viaje increíble a buen precio.", category: "opportunity", probability: 0.03, minAge: 18, maxAge: 75, effects: { happiness: 6, charisma: 3, intelligence: 2, money: -3 } },
  { id: "contest_win", name: "Ganas un concurso", description: "Participas en un concurso y ganas. Reconocimiento público.", category: "opportunity", probability: 0.015, minAge: 10, maxAge: 70, effects: { reputation: 5, happiness: 5, charisma: 3 } },

  // Disaster
  { id: "earthquake", name: "Terremoto", description: "Un terremoto sacude tu ciudad. Miedo y destrucción.", category: "disaster", probability: 0.005, minAge: 0, maxAge: 100, effects: { health: -5, happiness: -8, money: -5 } },
  { id: "pandemic", name: "Pandemia global", description: "Una pandemia paraliza el mundo. Confinamiento y miedo.", category: "disaster", probability: 0.005, minAge: 0, maxAge: 100, effects: { health: -5, happiness: -10, money: -5, relationships: -5 } },
  { id: "flood", name: "Inundación", description: "Lluvias torrenciales inundan tu barrio.", category: "disaster", probability: 0.01, minAge: 0, maxAge: 100, effects: { money: -8, happiness: -6, health: -3 } },
  { id: "house_fire", name: "Incendio en casa", description: "Se produce un incendio en tu vivienda. Pierdes muchas cosas.", category: "disaster", probability: 0.005, minAge: 0, maxAge: 100, effects: { money: -12, happiness: -10, health: -5 } },

  // Personal
  { id: "epiphany", name: "Epifanía", description: "De repente todo cobra sentido. Ves tu vida con total claridad.", category: "personal", probability: 0.02, minAge: 20, maxAge: 80, effects: { intelligence: 5, happiness: 8 } },
  { id: "midlife_crisis", name: "Crisis existencial", description: "¿Qué estoy haciendo con mi vida? La pregunta que no te deja dormir.", category: "personal", probability: 0.03, minAge: 35, maxAge: 55, effects: { happiness: -10, health: -3 } },
  { id: "spiritual_awakening", name: "Despertar espiritual", description: "Descubres algo que te da paz interior.", category: "personal", probability: 0.02, minAge: 25, maxAge: 90, effects: { happiness: 8, health: 3 } },
  { id: "creative_burst", name: "Inspiración creativa", description: "La musa te visita. Creatividad a raudales.", category: "personal", probability: 0.03, minAge: 10, maxAge: 80, effects: { intelligence: 3, happiness: 5, charisma: 2 } },
  { id: "burnout", name: "Burnout", description: "Llevas demasiado tiempo al límite. Tu cuerpo y mente dicen basta.", category: "personal", probability: 0.04, minAge: 25, maxAge: 60, effects: { health: -8, happiness: -10, education: -2 } },

  // Global
  { id: "tech_revolution", name: "Revolución tecnológica", description: "Una nueva tecnología cambia la sociedad. Adaptarse o quedarse atrás.", category: "global", probability: 0.015, minAge: 0, maxAge: 100, effects: { intelligence: 3, education: 2 } },
  { id: "market_crash", name: "Crash bursátil", description: "Los mercados se desploman. El pánico se apodera de inversores.", category: "global", probability: 0.01, minAge: 18, maxAge: 100, effects: { money: -10, happiness: -5 } },
  { id: "political_change", name: "Cambio político", description: "Un gran cambio político sacude tu país. Incertidumbre general.", category: "global", probability: 0.02, minAge: 0, maxAge: 100, effects: { happiness: -3 } },
  { id: "world_event_positive", name: "Evento mundial positivo", description: "Algo increíble pasa en el mundo. Esperanza renovada.", category: "global", probability: 0.02, minAge: 0, maxAge: 100, effects: { happiness: 5 } },
];

/** Get random events for this month based on age and probability */
export function rollRandomEvents(state: GameState): RandomEvent[] {
  const triggered: RandomEvent[] = [];

  for (const event of RANDOM_EVENTS) {
    if (state.currentAge < event.minAge || state.currentAge > event.maxAge) continue;
    if (Math.random() < event.probability) {
      triggered.push(event);
    }
  }

  // Cap at 2 events per month to avoid overwhelming the player
  return triggered.slice(0, 2);
}

/** Convert a RandomEvent to a LifeEvent for the timeline */
export function eventToLifeEvent(
  event: RandomEvent,
  state: GameState
): LifeEvent {
  return {
    age: state.currentAge,
    month: state.currentMonth,
    type: "event",
    title: event.name,
    description: event.description,
    effects: event.effects,
  };
}
