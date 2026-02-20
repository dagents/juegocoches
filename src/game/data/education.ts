// Education system for "El Destino en tus Manos"

import type { GameState, CharacterStats } from "@/game/engine/GameState";
import type { Decision } from "@/game/data/decisions";

export interface EducationPath {
  id: string;
  name: string;
  description: string;
  durationMonths: number;
  monthlyCost: number;
  requirements: {
    minAge?: number;
    maxAge?: number;
    minEducation?: number;
    minIntelligence?: number;
    completedPaths?: string[]; // prerequisite education ids
  };
  effects: {
    onComplete: Partial<CharacterStats>;
    monthlyStatBoost?: Partial<CharacterStats>;
  };
  salaryBoost: number; // monthly salary increase on completion
}

export const EDUCATION_PATHS: EducationPath[] = [
  // Basic education
  {
    id: "eso",
    name: "ESO",
    description: "Educación Secundaria Obligatoria — la base de todo.",
    durationMonths: 48,
    monthlyCost: 0,
    requirements: { minAge: 12, maxAge: 18 },
    effects: { onComplete: { education: 15, intelligence: 5 }, monthlyStatBoost: { education: 0.3, intelligence: 0.1 } },
    salaryBoost: 200,
  },
  {
    id: "bachillerato",
    name: "Bachillerato",
    description: "Preparación para la universidad o la vida.",
    durationMonths: 24,
    monthlyCost: 50,
    requirements: { minAge: 16, maxAge: 20, minEducation: 20, completedPaths: ["eso"] },
    effects: { onComplete: { education: 12, intelligence: 8 }, monthlyStatBoost: { education: 0.4, intelligence: 0.2 } },
    salaryBoost: 300,
  },

  // Formación Profesional
  {
    id: "fp_grado_medio",
    name: "FP Grado Medio",
    description: "Formación práctica para incorporarte al mercado laboral.",
    durationMonths: 24,
    monthlyCost: 100,
    requirements: { minAge: 16, maxAge: 30, minEducation: 15, completedPaths: ["eso"] },
    effects: { onComplete: { education: 10, intelligence: 3, money: 5 }, monthlyStatBoost: { education: 0.3 } },
    salaryBoost: 500,
  },
  {
    id: "fp_grado_superior",
    name: "FP Grado Superior",
    description: "Formación avanzada con alta empleabilidad.",
    durationMonths: 24,
    monthlyCost: 200,
    requirements: { minAge: 18, maxAge: 35, minEducation: 25, completedPaths: ["bachillerato"] },
    effects: { onComplete: { education: 14, intelligence: 5, money: 8 }, monthlyStatBoost: { education: 0.4 } },
    salaryBoost: 800,
  },
  {
    id: "fp_informatica",
    name: "FP Informática",
    description: "Desarrollo de software y sistemas — muy demandado.",
    durationMonths: 24,
    monthlyCost: 250,
    requirements: { minAge: 18, maxAge: 40, minEducation: 25, minIntelligence: 40, completedPaths: ["bachillerato"] },
    effects: { onComplete: { education: 15, intelligence: 8, money: 10 }, monthlyStatBoost: { intelligence: 0.3 } },
    salaryBoost: 1200,
  },
  {
    id: "fp_sanidad",
    name: "FP Sanidad",
    description: "Técnico sanitario — trabajo estable y vocacional.",
    durationMonths: 24,
    monthlyCost: 200,
    requirements: { minAge: 18, maxAge: 35, minEducation: 25, completedPaths: ["bachillerato"] },
    effects: { onComplete: { education: 12, intelligence: 4, health: 5 }, monthlyStatBoost: { education: 0.3 } },
    salaryBoost: 700,
  },

  // Universidad
  {
    id: "universidad",
    name: "Grado Universitario",
    description: "Carrera universitaria de 4 años.",
    durationMonths: 48,
    monthlyCost: 500,
    requirements: { minAge: 18, maxAge: 45, minEducation: 30, minIntelligence: 40, completedPaths: ["bachillerato"] },
    effects: { onComplete: { education: 20, intelligence: 10, reputation: 5, charisma: 3 }, monthlyStatBoost: { education: 0.5, intelligence: 0.2 } },
    salaryBoost: 1500,
  },
  {
    id: "universidad_ingenieria",
    name: "Ingeniería",
    description: "Carrera técnica exigente pero muy bien pagada.",
    durationMonths: 48,
    monthlyCost: 600,
    requirements: { minAge: 18, maxAge: 40, minEducation: 35, minIntelligence: 55, completedPaths: ["bachillerato"] },
    effects: { onComplete: { education: 22, intelligence: 15, money: 10 }, monthlyStatBoost: { intelligence: 0.4, education: 0.5 } },
    salaryBoost: 2000,
  },
  {
    id: "universidad_medicina",
    name: "Medicina",
    description: "La carrera más larga y exigente — pero la más respetada.",
    durationMonths: 72,
    monthlyCost: 700,
    requirements: { minAge: 18, maxAge: 35, minEducation: 40, minIntelligence: 65, completedPaths: ["bachillerato"] },
    effects: { onComplete: { education: 25, intelligence: 15, reputation: 10, health: 5 }, monthlyStatBoost: { intelligence: 0.4, education: 0.5 } },
    salaryBoost: 3000,
  },
  {
    id: "universidad_derecho",
    name: "Derecho",
    description: "Abogacía — abre muchas puertas.",
    durationMonths: 48,
    monthlyCost: 500,
    requirements: { minAge: 18, maxAge: 45, minEducation: 30, minIntelligence: 45, completedPaths: ["bachillerato"] },
    effects: { onComplete: { education: 18, intelligence: 10, charisma: 8, reputation: 5 }, monthlyStatBoost: { intelligence: 0.3, charisma: 0.2 } },
    salaryBoost: 1800,
  },

  // Postgrado
  {
    id: "master",
    name: "Máster",
    description: "Especialización de postgrado — un año intensivo.",
    durationMonths: 12,
    monthlyCost: 1000,
    requirements: { minAge: 22, maxAge: 55, minEducation: 50, minIntelligence: 50, completedPaths: ["universidad"] },
    effects: { onComplete: { education: 12, intelligence: 8, reputation: 5, money: 5 }, monthlyStatBoost: { intelligence: 0.3 } },
    salaryBoost: 1000,
  },
  {
    id: "mba",
    name: "MBA",
    description: "Máster en Administración de Empresas — el clásico para directivos.",
    durationMonths: 18,
    monthlyCost: 2000,
    requirements: { minAge: 25, maxAge: 50, minEducation: 50, minIntelligence: 50, completedPaths: ["universidad"] },
    effects: { onComplete: { education: 10, intelligence: 5, charisma: 8, money: 10, reputation: 8 }, monthlyStatBoost: { charisma: 0.3 } },
    salaryBoost: 2000,
  },
  {
    id: "doctorado",
    name: "Doctorado",
    description: "El pináculo académico — investigación pura.",
    durationMonths: 48,
    monthlyCost: 300,
    requirements: { minAge: 24, maxAge: 60, minEducation: 60, minIntelligence: 65, completedPaths: ["master"] },
    effects: { onComplete: { education: 15, intelligence: 15, reputation: 10 }, monthlyStatBoost: { intelligence: 0.5, education: 0.3 } },
    salaryBoost: 800,
  },

  // Short courses
  {
    id: "curso_idiomas",
    name: "Curso de Idiomas",
    description: "Aprende un nuevo idioma — abre puertas en el extranjero.",
    durationMonths: 6,
    monthlyCost: 150,
    requirements: { minAge: 16 },
    effects: { onComplete: { education: 5, intelligence: 3, charisma: 3 }, monthlyStatBoost: { intelligence: 0.2 } },
    salaryBoost: 200,
  },
  {
    id: "curso_programacion",
    name: "Bootcamp de Programación",
    description: "Aprende a programar en 6 meses — muy demandado.",
    durationMonths: 6,
    monthlyCost: 800,
    requirements: { minAge: 18, minIntelligence: 35 },
    effects: { onComplete: { education: 8, intelligence: 8, money: 5 }, monthlyStatBoost: { intelligence: 0.4 } },
    salaryBoost: 1000,
  },
  {
    id: "curso_cocina",
    name: "Curso de Cocina Profesional",
    description: "Formación culinaria — pasión convertida en oficio.",
    durationMonths: 12,
    monthlyCost: 400,
    requirements: { minAge: 16 },
    effects: { onComplete: { education: 5, charisma: 5, happiness: 5 }, monthlyStatBoost: { charisma: 0.2 } },
    salaryBoost: 600,
  },
  {
    id: "curso_marketing",
    name: "Curso de Marketing Digital",
    description: "Domina las redes y el marketing online.",
    durationMonths: 4,
    monthlyCost: 300,
    requirements: { minAge: 18, minIntelligence: 30 },
    effects: { onComplete: { education: 4, charisma: 6, money: 3 }, monthlyStatBoost: { charisma: 0.3 } },
    salaryBoost: 500,
  },
];

/** Check if a player meets requirements for an education path */
function meetsRequirements(state: GameState, path: EducationPath): boolean {
  const req = path.requirements;
  const completed = state.completedEducation ?? [];

  if (req.minAge !== undefined && state.currentAge < req.minAge) return false;
  if (req.maxAge !== undefined && state.currentAge > req.maxAge) return false;
  if (req.minEducation !== undefined && state.stats.education < req.minEducation) return false;
  if (req.minIntelligence !== undefined && state.stats.intelligence < req.minIntelligence) return false;
  if (req.completedPaths) {
    for (const reqPath of req.completedPaths) {
      if (!completed.includes(reqPath)) return false;
    }
  }
  return true;
}

/** Get education-related decisions for this turn */
export function getEducationDecisions(state: GameState): Decision[] {
  const decisions: Decision[] = [];
  const completed = state.completedEducation ?? [];

  // Don't offer if already studying
  if (state.currentEducation) return [];

  // Find available paths
  const available = EDUCATION_PATHS.filter(p => {
    if (completed.includes(p.id)) return false;
    if (!meetsRequirements(state, p)) return false;
    if (state.bankBalance < p.monthlyCost * 3) return false; // need at least 3 months of funds
    return true;
  });

  if (available.length === 0) return [];

  // Pick up to 3 random options to offer
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  const options = shuffled.slice(0, 3);

  const decision: Decision = {
    id: "education_enroll",
    text: "Tienes la oportunidad de formarte. ¿Qué estudios quieres hacer?",
    agePhase: state.currentAge <= 12 ? "childhood" : state.currentAge <= 17 ? "teen" : state.currentAge <= 30 ? "young_adult" : state.currentAge <= 55 ? "adult" : "elderly",
    category: "education",
    weight: 5,
    options: [
      ...options.map(path => ({
        text: `${path.name} — ${path.description} (${Math.ceil(path.durationMonths / 12)} año${Math.ceil(path.durationMonths / 12) > 1 ? "s" : ""}, ${path.monthlyCost}€/mes)`,
        effects: { education: 2, intelligence: 1, happiness: 1 },
        narrative: `Te matriculas en ${path.name}.`,
        // Store pathId in the narrative for processing
        _pathId: path.id,
      } as Decision["options"][0] & { _pathId?: string })),
      { text: "No estudiar ahora", effects: {} },
    ],
  };

  decisions.push(decision);
  return decisions;
}

/** Get education path by id */
export function getEducationPathById(id: string): EducationPath | undefined {
  return EDUCATION_PATHS.find(p => p.id === id);
}
