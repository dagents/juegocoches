// Dynamic relationships system — age-appropriate relationship events

import type { GameState } from "@/game/engine/GameState";
import { getAgePhase } from "@/game/engine/GameState";
import type { GameEvent } from "@/game/data/events";
import type { RelationshipInfo } from "@/game/engine/GameState";

export const MALE_NAMES: string[] = [
  "Alejandro", "Carlos", "Daniel", "David", "Diego", "Eduardo", "Fernando",
  "Gabriel", "Hugo", "Iván", "Javier", "Jorge", "José", "Juan", "Luis",
  "Manuel", "Marco", "Mario", "Miguel", "Nicolás", "Pablo", "Pedro",
  "Rafael", "Raúl", "Roberto", "Rodrigo", "Samuel", "Santiago", "Sergio", "Víctor",
  "Adrián", "Álvaro", "Andrés", "Antonio", "Óscar",
];

export const FEMALE_NAMES: string[] = [
  "Alba", "Alejandra", "Ana", "Andrea", "Carmen", "Claudia", "Cristina",
  "Elena", "Eva", "Irene", "Isabel", "Julia", "Laura", "Lucía", "María",
  "Marta", "Natalia", "Nerea", "Noelia", "Nuria", "Paula", "Pilar",
  "Raquel", "Rosa", "Sara", "Silvia", "Sofía", "Teresa", "Valentina", "Verónica",
  "Alicia", "Beatriz", "Carlota", "Diana", "Inés",
];

let npcCounter = 0;

/** Generate a random NPC with the given type */
export function generateNPC(
  age: number,
  type: "partner" | "friend" | "enemy" | "family"
): RelationshipInfo {
  const isMale = Math.random() < 0.5;
  const names = isMale ? MALE_NAMES : FEMALE_NAMES;
  const name = names[Math.floor(Math.random() * names.length)];
  npcCounter++;

  // NPC age varies by type
  let npcAge = age;
  if (type === "partner") {
    npcAge = Math.max(0, age + Math.floor(Math.random() * 7) - 3);
  } else if (type === "friend") {
    npcAge = Math.max(0, age + Math.floor(Math.random() * 5) - 2);
  } else if (type === "family") {
    npcAge = 0; // children start at 0
  }

  return {
    id: `npc_${type}_${npcCounter}_${Date.now()}`,
    name,
    type,
    strength: 50,
    since: age,
    age: npcAge,
  };
}

/** Get age-appropriate relationship events for the current turn */
export function getRelationshipEvents(state: GameState): GameEvent[] {
  const phase = getAgePhase(state.currentAge);
  const age = state.currentAge;
  const triggered: GameEvent[] = [];

  // Helper: roll probability
  const roll = (p: number) => Math.random() < p;

  // ── Childhood (0-12) ──
  if (phase === "childhood") {
    if (age >= 5 && roll(0.04)) {
      triggered.push({
        id: "rel_new_friend",
        name: "Nuevo amigo del cole",
        description: "Haces un nuevo amigo en el colegio. Compartís bocadillos y secretos en el recreo.",
        category: "social",
        probability: 0.04,
        minAge: 5, maxAge: 12,
        effects: { happiness: 8, relationships: 10 },
      });
    }
    if (age >= 8 && roll(0.02)) {
      triggered.push({
        id: "rel_best_friend",
        name: "Mejor amigo/a",
        description: "Alguien se convierte en tu mejor amigo/a. Sois inseparables, hacéis planes todos los días.",
        category: "social",
        probability: 0.02,
        minAge: 8, maxAge: 12,
        effects: { happiness: 12, relationships: 15 },
      });
    }
  }

  // ── Teen (13-17) ──
  if (phase === "teen") {
    if (!state.partner && roll(0.03)) {
      triggered.push({
        id: "rel_teen_crush",
        name: "Primer amor",
        description: "Mariposas en el estómago. No puedes dejar de pensar en esa persona. El mundo brilla más.",
        category: "social",
        probability: 0.03,
        minAge: 13, maxAge: 17,
        effects: { happiness: 15, relationships: 10, charisma: 3 },
      });
    }
    if (state.partner && roll(0.05)) {
      triggered.push({
        id: "rel_teen_breakup",
        name: "Ruptura adolescente",
        description: "El primer amor duele cuando se acaba. Lloras con música triste y juras que nunca volverás a enamorarte.",
        category: "social",
        probability: 0.05,
        minAge: 13, maxAge: 17,
        effects: { happiness: -20, relationships: -10 },
      });
    }
    if (roll(0.03)) {
      triggered.push({
        id: "rel_new_friend",
        name: "Drama entre amigos",
        description: "Un malentendido causa tensión en el grupo. Rumores, bandos y reconciliaciones.",
        category: "social",
        probability: 0.03,
        minAge: 13, maxAge: 17,
        effects: { happiness: -5, relationships: -5, charisma: 2 },
      });
    }
  }

  // ── Young Adult (18-30) ──
  if (phase === "young_adult") {
    if (!state.partner && roll(0.04)) {
      triggered.push({
        id: "rel_ya_new_partner",
        name: "Conoces a alguien especial",
        description: "En una fiesta, en el trabajo, en una app... da igual dónde. Hay química instantánea.",
        category: "social",
        probability: 0.04,
        minAge: 18, maxAge: 30,
        effects: { happiness: 15, relationships: 12, charisma: 3 },
      });
    }
    if (state.partner && !state.isMarried && state.partner.strength >= 50 && age >= 22 && roll(0.03)) {
      triggered.push({
        id: "rel_ya_proposal",
        name: "Pedida de mano",
        description: `Le pides matrimonio a ${state.partner.name}. Dice que sí entre lágrimas de alegría. ¡Os casáis!`,
        category: "social",
        probability: 0.03,
        minAge: 22, maxAge: 30,
        effects: { happiness: 25, relationships: 20, reputation: 5, money: -15 },
      });
    }
    if (state.partner && roll(0.04)) {
      triggered.push({
        id: "rel_teen_breakup",
        name: "Ruptura sentimental",
        description: `Las cosas con ${state.partner.name} no funcionan. Os separáis. Duele, pero la vida sigue.`,
        category: "social",
        probability: 0.04,
        minAge: 18, maxAge: 30,
        effects: { happiness: -20, relationships: -15 },
      });
    }
    if (state.isMarried && state.children.length < 3 && age >= 24 && roll(0.03)) {
      triggered.push({
        id: "rel_adult_baby",
        name: "¡Vas a ser padre/madre!",
        description: "El test da positivo. Nervios, ilusión y un mundo nuevo por descubrir. La familia crece.",
        category: "social",
        probability: 0.03,
        minAge: 24, maxAge: 30,
        effects: { happiness: 20, relationships: 15, money: -10, health: -3 },
      });
    }
    if (roll(0.03)) {
      triggered.push({
        id: "rel_new_friend",
        name: "Nuevo amigo/a",
        description: "Conoces a alguien genial. Compartís gustos, humor y visión de la vida.",
        category: "social",
        probability: 0.03,
        minAge: 18, maxAge: 30,
        effects: { happiness: 8, relationships: 10, charisma: 2 },
      });
    }
  }

  // ── Adult (31-55) ──
  if (phase === "adult") {
    if (state.isMarried && roll(0.02)) {
      triggered.push({
        id: "rel_adult_divorce",
        name: "Divorcio",
        description: `La relación con ${state.partner?.name ?? "tu pareja"} se rompe. Abogados, papeles y un corazón roto.`,
        category: "social",
        probability: 0.02,
        minAge: 31, maxAge: 55,
        effects: { happiness: -25, relationships: -20, money: -25, reputation: -5 },
      });
    }
    if (!state.partner && roll(0.03)) {
      triggered.push({
        id: "rel_ya_new_partner",
        name: "Nueva pareja",
        description: "Después de tiempo solo/a, alguien aparece cuando menos lo esperabas.",
        category: "social",
        probability: 0.03,
        minAge: 31, maxAge: 55,
        effects: { happiness: 15, relationships: 12 },
      });
    }
    if (state.isMarried && state.children.length < 4 && age <= 42 && roll(0.025)) {
      triggered.push({
        id: "rel_adult_baby",
        name: "Nuevo bebé en la familia",
        description: "La familia crece. Otro pequeño/a llena la casa de risas y noches sin dormir.",
        category: "social",
        probability: 0.025,
        minAge: 31, maxAge: 42,
        effects: { happiness: 18, relationships: 12, money: -12, health: -3 },
      });
    }
    if (state.isMarried && roll(0.015)) {
      triggered.push({
        id: "rel_adult_affair",
        name: "Aventura extramatrimonial",
        description: "Una tentación peligrosa. Un desliz que podría destruirlo todo.",
        category: "social",
        probability: 0.015,
        minAge: 31, maxAge: 55,
        effects: { happiness: -10, relationships: -20, reputation: -10 },
      });
    }
    if (roll(0.02)) {
      triggered.push({
        id: "rel_new_friend",
        name: "Amigo/a del trabajo",
        description: "Alguien del trabajo se convierte en mucho más que un compañero. Cafés, risas y apoyo mutuo.",
        category: "social",
        probability: 0.02,
        minAge: 31, maxAge: 55,
        effects: { happiness: 8, relationships: 8 },
      });
    }
    if (state.children.some((c) => c.age >= 18) && roll(0.03)) {
      triggered.push({
        id: "rel_kids_leave",
        name: "Los hijos se independizan",
        description: "Tu hijo/a se va de casa. Orgullo y vacío a partes iguales. El nido se queda en silencio.",
        category: "social",
        probability: 0.03,
        minAge: 40, maxAge: 55,
        effects: { happiness: -8, relationships: -5 },
      });
    }
  }

  // ── Elderly (56+) ──
  if (phase === "elderly") {
    if (state.partner && age >= 65 && roll(0.02)) {
      triggered.push({
        id: "rel_elderly_partner_death",
        name: "Fallecimiento de tu pareja",
        description: `${state.partner.name} ya no está. El silencio en casa es ensordecedor. Una parte de ti se fue también.`,
        category: "social",
        probability: 0.02,
        minAge: 65, maxAge: 100,
        effects: { happiness: -35, health: -15, relationships: -20 },
      });
    }
    if (state.children.some((c) => c.age >= 25) && roll(0.03)) {
      triggered.push({
        id: "rel_grandchild",
        name: "¡Eres abuelo/a!",
        description: "Tu hijo/a te presenta a tu nieto/a. Esos ojitos te miran y el corazón se derrite.",
        category: "social",
        probability: 0.03,
        minAge: 56, maxAge: 90,
        effects: { happiness: 20, relationships: 15, health: 3 },
      });
    }
    if (!state.partner && state.relationships.filter((r) => r.type === "friend").length < 2 && roll(0.04)) {
      triggered.push({
        id: "rel_loneliness",
        name: "Soledad",
        description: "Los días son largos y silenciosos. Echas de menos las voces, las risas, la compañía.",
        category: "social",
        probability: 0.04,
        minAge: 60, maxAge: 100,
        effects: { happiness: -15, health: -5, relationships: -5 },
      });
    }
    if (!state.partner && roll(0.015)) {
      triggered.push({
        id: "rel_elderly_new_companion",
        name: "Nuevo compañero/a de vida",
        description: "En el centro social conoces a alguien que te devuelve las ganas de sonreír.",
        category: "social",
        probability: 0.015,
        minAge: 60, maxAge: 85,
        effects: { happiness: 15, relationships: 12, health: 3 },
      });
    }
  }

  return triggered;
}
