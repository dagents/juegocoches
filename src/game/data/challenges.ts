// Weekly challenge definitions for "El Destino en tus Manos"

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  condition: string; // machine-readable condition key
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const ALL_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'survive_80_somalia',
    title: 'Guerrero de Somalia',
    description: 'Sobrevive hasta los 80 naciendo en Somalia.',
    condition: 'age>=80 && country==Somalia',
    reward: '+500 puntos bonus',
    difficulty: 'hard',
  },
  {
    id: 'millionaire_30',
    title: 'Millonario precoz',
    description: 'Llega a millonario antes de los 30.',
    condition: 'bankBalance>=1000000 && age<30',
    reward: 'Logro dorado desbloqueado',
    difficulty: 'hard',
  },
  {
    id: 'complete_doctorate',
    title: 'Doctor/a en todo',
    description: 'Completa un doctorado.',
    condition: 'completedEducation includes doctorate',
    reward: '+200 puntos bonus',
    difficulty: 'medium',
  },
  {
    id: 'forocochero_survive',
    title: 'Modo Forocochero',
    description: 'Sobrevive hasta los 70 en modo Forocochero.',
    condition: 'difficulty==forocochero && age>=70',
    reward: 'Título de Leyenda',
    difficulty: 'hard',
  },
  {
    id: 'five_children',
    title: 'Familia numerosa',
    description: 'Ten 5 hijos.',
    condition: 'children.length>=5',
    reward: '+150 puntos bonus',
    difficulty: 'medium',
  },
  {
    id: 'never_marry',
    title: 'Lobo solitario',
    description: 'Nunca te cases y llega a los 60.',
    condition: 'isMarried==false && age>=60',
    reward: '+100 puntos bonus',
    difficulty: 'easy',
  },
  {
    id: 'all_stats_80',
    title: 'Perfeccionista',
    description: 'Lleva todas las estadísticas por encima de 80.',
    condition: 'all stats >= 80',
    reward: '+300 puntos bonus',
    difficulty: 'hard',
  },
  {
    id: 'zero_debt',
    title: 'Sin deudas',
    description: 'Llega a los 50 sin deuda alguna.',
    condition: 'debt==0 && age>=50',
    reward: '+100 puntos bonus',
    difficulty: 'easy',
  },
  {
    id: 'emigrate_3',
    title: 'Ciudadano del mundo',
    description: 'Vive en al menos 3 países diferentes.',
    condition: 'countriesLived.length>=3',
    reward: '+200 puntos bonus',
    difficulty: 'medium',
  },
  {
    id: 'max_happiness',
    title: 'Felicidad plena',
    description: 'Alcanza 100 de felicidad.',
    condition: 'happiness==100',
    reward: '+100 puntos bonus',
    difficulty: 'easy',
  },
  {
    id: 'business_empire',
    title: 'Imperio empresarial',
    description: 'Ten 3 negocios activos al mismo tiempo.',
    condition: 'ownedBusinesses.length>=3',
    reward: '+250 puntos bonus',
    difficulty: 'hard',
  },
  {
    id: 'survive_100',
    title: 'Centenario',
    description: 'Llega a los 100 años.',
    condition: 'age>=100',
    reward: 'Logro legendario',
    difficulty: 'hard',
  },
  {
    id: 'property_mogul',
    title: 'Magnate inmobiliario',
    description: 'Posee al menos 5 propiedades.',
    condition: 'properties.length>=5',
    reward: '+200 puntos bonus',
    difficulty: 'medium',
  },
  {
    id: 'no_career',
    title: 'Nini profesional',
    description: 'Llega a los 40 sin haber tenido nunca una carrera.',
    condition: 'career==null && age>=40',
    reward: '+150 puntos bonus',
    difficulty: 'medium',
  },
  {
    id: 'high_reputation',
    title: 'Famoso/a',
    description: 'Alcanza 95+ de reputación.',
    condition: 'reputation>=95',
    reward: '+100 puntos bonus',
    difficulty: 'easy',
  },
  {
    id: 'addiction_recovery',
    title: 'Segunda oportunidad',
    description: 'Supera una adicción y llega a los 60 limpio.',
    condition: 'had addiction && addictions.length==0 && age>=60',
    reward: '+200 puntos bonus',
    difficulty: 'medium',
  },
];

/** Get the current weekly challenge based on the week number of the year */
export function getCurrentChallenge(): WeeklyChallenge {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
  );
  const index = weekNumber % ALL_CHALLENGES.length;
  return ALL_CHALLENGES[index];
}
