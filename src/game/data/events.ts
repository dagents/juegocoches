// events.ts — Eventos aleatorios del juego

export interface EventEffects {
  money?: number;
  health?: number;
  happiness?: number;
  education?: number;
  relationships?: number;
  reputation?: number;
  intelligence?: number;
  charisma?: number;
}

export interface EventChoice {
  text: string;
  effects: EventEffects;
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  category: 'economic' | 'health' | 'social' | 'opportunity' | 'disaster' | 'personal' | 'global';
  probability: number;
  minAge: number;
  maxAge: number;
  effects: EventEffects;
  choices?: EventChoice[];
}

export interface EventPlayerStats {
  education?: number;
  charisma?: number;
  intelligence?: number;
  health?: number;
  happiness?: number;
  money?: number;
  reputation?: number;
  relationships?: number;
}

export const EVENTS: GameEvent[] = [
  // ═══════════════════════════════════
  // ECONOMIC (10 events)
  // ═══════════════════════════════════
  {
    id: 'crisis_economica',
    name: 'Crisis económica',
    description: 'Los mercados se desploman. Tu banco congela fondos y los precios se disparan. Hay que apretarse el cinturón.',
    category: 'economic',
    probability: 0.04,
    minAge: 18,
    maxAge: 90,
    effects: { money: -30, happiness: -15 },
  },
  {
    id: 'boom_economico',
    name: 'Boom económico',
    description: 'La economía florece. Los negocios prosperan, hay trabajo para todos y el optimismo inunda las calles.',
    category: 'economic',
    probability: 0.05,
    minAge: 18,
    maxAge: 90,
    effects: { money: 25, happiness: 10 },
  },
  {
    id: 'herencia_inesperada',
    name: 'Herencia inesperada',
    description: 'Un pariente lejano que apenas conocías te ha dejado una herencia sorprendente en su testamento.',
    category: 'economic',
    probability: 0.02,
    minAge: 20,
    maxAge: 80,
    effects: { money: 50, happiness: 10 },
  },
  {
    id: 'loteria',
    name: '¡Lotería!',
    description: 'Compras un décimo por impulso en una gasolinera. Los números salen en la tele. Tus números. No te lo puedes creer.',
    category: 'economic',
    probability: 0.005,
    minAge: 18,
    maxAge: 90,
    effects: { money: 100, happiness: 30 },
  },
  {
    id: 'robo_casa',
    name: 'Robo en casa',
    description: 'Llegas a casa y la puerta está forzada. Te han robado todo lo de valor. La sensación de vulnerabilidad es lo peor.',
    category: 'economic',
    probability: 0.03,
    minAge: 18,
    maxAge: 90,
    effects: { money: -25, happiness: -20, health: -5 },
  },
  {
    id: 'multa_hacienda',
    name: 'Inspección de Hacienda',
    description: 'Hacienda te envía una carta certificada. Hay irregularidades en tu declaración. Toca pagar.',
    category: 'economic',
    probability: 0.04,
    minAge: 22,
    maxAge: 80,
    effects: { money: -20, happiness: -10, reputation: -3 },
  },
  {
    id: 'inversion_exitosa',
    name: 'Inversión exitosa',
    description: 'Esas acciones que compraste por corazonada se han multiplicado. A veces la suerte acompaña al valiente.',
    category: 'economic',
    probability: 0.03,
    minAge: 20,
    maxAge: 80,
    effects: { money: 35, happiness: 15, intelligence: 3 },
  },
  {
    id: 'estafa_piramidal',
    name: 'Estafa piramidal',
    description: 'Un "amigo" te convenció de invertir en un negocio infalible. Era una estafa piramidal. Has perdido hasta la camisa.',
    category: 'economic',
    probability: 0.025,
    minAge: 20,
    maxAge: 70,
    effects: { money: -40, happiness: -20, relationships: -10 },
  },
  {
    id: 'subida_alquiler',
    name: 'Subida del alquiler',
    description: 'Tu casero te avisa: el alquiler sube un 30%. Bienvenido a la crisis de la vivienda.',
    category: 'economic',
    probability: 0.06,
    minAge: 18,
    maxAge: 60,
    effects: { money: -15, happiness: -10 },
  },
  {
    id: 'coche_averia',
    name: 'Avería del coche',
    description: 'El coche te deja tirado en la autopista. La grúa, el taller, las piezas... la broma te sale cara.',
    category: 'economic',
    probability: 0.07,
    minAge: 18,
    maxAge: 80,
    effects: { money: -10, happiness: -5 },
  },

  // ═══════════════════════════════════
  // HEALTH (10 events)
  // ═══════════════════════════════════
  {
    id: 'gripe_fuerte',
    name: 'Gripe fuerte',
    description: 'Una gripe te tumba en la cama durante dos semanas. Fiebre, mocos y series de televisión.',
    category: 'health',
    probability: 0.1,
    minAge: 5,
    maxAge: 90,
    effects: { health: -10, happiness: -5 },
  },
  {
    id: 'accidente_trafico',
    name: 'Accidente de tráfico',
    description: 'Un golpe fuerte en la carretera. Sobrevives, pero el hospital se convierte en tu segunda casa durante meses.',
    category: 'health',
    probability: 0.03,
    minAge: 16,
    maxAge: 85,
    effects: { health: -30, happiness: -20, money: -15 },
    choices: [
      { text: 'Rehabilitación intensiva', effects: { health: 15, money: -10, happiness: 5 } },
      { text: 'Dejar que el tiempo cure', effects: { health: 5, happiness: -5 } },
    ],
  },
  {
    id: 'depresion',
    name: 'Depresión',
    description: 'Los días grises se acumulan. Pierdes las ganas de todo. Levantarte de la cama se convierte en un acto heroico.',
    category: 'health',
    probability: 0.06,
    minAge: 15,
    maxAge: 80,
    effects: { health: -10, happiness: -30, relationships: -10 },
    choices: [
      { text: 'Buscar ayuda profesional', effects: { happiness: 20, money: -10, health: 5 } },
      { text: 'Intentar superarlo solo', effects: { happiness: -10, health: -5 } },
    ],
  },
  {
    id: 'adiccion_alcohol',
    name: 'Adicción al alcohol',
    description: 'Lo que empezó como cañas después del trabajo se ha convertido en una botella diaria. Tu cuerpo y tus relaciones piden auxilio.',
    category: 'health',
    probability: 0.04,
    minAge: 18,
    maxAge: 70,
    effects: { health: -20, happiness: -15, relationships: -15, reputation: -5 },
    choices: [
      { text: 'Ingresar en rehabilitación', effects: { health: 15, happiness: 10, money: -15, reputation: 5 } },
      { text: 'Seguir bebiendo', effects: { health: -15, happiness: -10, relationships: -10 } },
    ],
  },
  {
    id: 'adiccion_drogas',
    name: 'Adicción a las drogas',
    description: 'La fiesta se acabó hace tiempo pero tú sigues consumiendo. La espiral descendente es real.',
    category: 'health',
    probability: 0.03,
    minAge: 16,
    maxAge: 60,
    effects: { health: -25, happiness: -20, money: -20, relationships: -15, reputation: -10 },
    choices: [
      { text: 'Pedir ayuda', effects: { health: 20, happiness: 15, reputation: 5, money: -10 } },
      { text: 'Seguir consumiendo', effects: { health: -20, happiness: -15, money: -15 } },
    ],
  },
  {
    id: 'enfermedad_grave',
    name: 'Enfermedad grave',
    description: 'El médico pone cara seria. Los análisis no son buenos. Tu mundo se detiene.',
    category: 'health',
    probability: 0.02,
    minAge: 30,
    maxAge: 90,
    effects: { health: -40, happiness: -25, money: -20 },
    choices: [
      { text: 'Tratamiento agresivo', effects: { health: 25, money: -25, happiness: -5 } },
      { text: 'Medicina alternativa', effects: { health: 5, money: -10, happiness: 5 } },
    ],
  },
  {
    id: 'descubrimiento_gym',
    name: 'Descubres el gimnasio',
    description: 'Un amigo te arrastra al gym. Tras las primeras agujetas, descubres que te encanta. Tu cuerpo y mente lo agradecen.',
    category: 'health',
    probability: 0.06,
    minAge: 14,
    maxAge: 65,
    effects: { health: 15, happiness: 10, charisma: 5 },
  },
  {
    id: 'lesion_deportiva',
    name: 'Lesión deportiva',
    description: 'Un mal gesto en el campo. Crujido, dolor, ambulancia. La rodilla nunca volverá a ser la misma.',
    category: 'health',
    probability: 0.04,
    minAge: 12,
    maxAge: 60,
    effects: { health: -20, happiness: -10 },
  },
  {
    id: 'covid',
    name: 'Virus pandémico',
    description: 'Un nuevo virus barre el mundo. Cuarentena, mascarillas y el miedo a lo desconocido.',
    category: 'health',
    probability: 0.02,
    minAge: 5,
    maxAge: 90,
    effects: { health: -15, happiness: -15, money: -10, relationships: -5 },
  },
  {
    id: 'embarazo_sorpresa',
    name: 'Embarazo sorpresa',
    description: 'El test da positivo. No estaba en los planes. Tu vida está a punto de cambiar para siempre.',
    category: 'health',
    probability: 0.04,
    minAge: 16,
    maxAge: 45,
    effects: { happiness: 5, money: -15, relationships: 10 },
    choices: [
      { text: 'Aceptar la paternidad/maternidad', effects: { happiness: 15, money: -20, relationships: 15 } },
      { text: 'No seguir adelante', effects: { happiness: -15, health: -5, relationships: -10 } },
    ],
  },

  // ═══════════════════════════════════
  // SOCIAL (10 events)
  // ═══════════════════════════════════
  {
    id: 'nuevo_amigo',
    name: 'Nuevo amigo',
    description: 'Conoces a alguien en un evento. La conversación fluye como si os conocierais de toda la vida. Nace una amistad.',
    category: 'social',
    probability: 0.08,
    minAge: 5,
    maxAge: 80,
    effects: { happiness: 10, relationships: 15, charisma: 3 },
  },
  {
    id: 'ruptura_sentimental',
    name: 'Ruptura sentimental',
    description: '"Tenemos que hablar." Cuatro palabras que cambian todo. Las noches son largas y Spotify sabe lo que sientes.',
    category: 'social',
    probability: 0.06,
    minAge: 14,
    maxAge: 70,
    effects: { happiness: -25, relationships: -20, health: -5 },
  },
  {
    id: 'boda',
    name: 'Boda',
    description: 'El amor de tu vida dice "sí, quiero". Lágrimas, baile y un futuro juntos. Hoy es el mejor día de tu vida.',
    category: 'social',
    probability: 0.04,
    minAge: 20,
    maxAge: 65,
    effects: { happiness: 25, relationships: 20, reputation: 5, money: -15 },
  },
  {
    id: 'muerte_familiar',
    name: 'Muerte de un familiar',
    description: 'El teléfono suena a las 3 de la mañana. Nada bueno llega a esas horas. Tu mundo se rompe en pedazos.',
    category: 'social',
    probability: 0.03,
    minAge: 10,
    maxAge: 90,
    effects: { happiness: -30, health: -10, relationships: -5 },
  },
  {
    id: 'traicion_amigo',
    name: 'Traición de un amigo',
    description: 'Tu mejor amigo te apuñala por la espalda. Mentiras, manipulación. La confianza rota duele más que cualquier golpe.',
    category: 'social',
    probability: 0.04,
    minAge: 12,
    maxAge: 70,
    effects: { happiness: -15, relationships: -20, reputation: -5 },
  },
  {
    id: 'fiesta_epica',
    name: 'Fiesta épica',
    description: 'Una noche legendaria. De esas que se recuerdan durante años. Amigos, risas y momentos irrepetibles.',
    category: 'social',
    probability: 0.07,
    minAge: 16,
    maxAge: 50,
    effects: { happiness: 15, relationships: 10, health: -3 },
  },
  {
    id: 'divorcio',
    name: 'Divorcio',
    description: 'El amor se acabó. Abogados, repartición de bienes y noches en el sofá de un amigo.',
    category: 'social',
    probability: 0.03,
    minAge: 22,
    maxAge: 70,
    effects: { happiness: -20, money: -30, relationships: -15, reputation: -3 },
  },
  {
    id: 'nacimiento_hijo',
    name: 'Nacimiento de un hijo',
    description: 'Oyes el primer llanto y todo cambia. Ese ser diminuto depende de ti. Miedo y amor infinito a partes iguales.',
    category: 'social',
    probability: 0.04,
    minAge: 18,
    maxAge: 50,
    effects: { happiness: 25, relationships: 15, money: -10, health: -3 },
  },
  {
    id: 'pelea_vecino',
    name: 'Pelea con el vecino',
    description: 'La música a las 3AM era la gota que colmaba el vaso. La discusión escala más de la cuenta.',
    category: 'social',
    probability: 0.06,
    minAge: 18,
    maxAge: 80,
    effects: { happiness: -5, relationships: -5, reputation: -2 },
  },
  {
    id: 'reencuentro',
    name: 'Reencuentro inesperado',
    description: 'Te cruzas con alguien del pasado. Los recuerdos inundan todo. Parece que el tiempo no ha pasado.',
    category: 'social',
    probability: 0.05,
    minAge: 25,
    maxAge: 80,
    effects: { happiness: 10, relationships: 10 },
  },

  // ═══════════════════════════════════
  // OPPORTUNITY (8 events)
  // ═══════════════════════════════════
  {
    id: 'oferta_trabajo_soñado',
    name: 'Oferta de trabajo soñado',
    description: 'Una empresa te contacta de la nada. El puesto es increíble, el sueldo generoso. ¿Aceptas?',
    category: 'opportunity',
    probability: 0.03,
    minAge: 20,
    maxAge: 60,
    effects: { money: 20, happiness: 15, reputation: 5 },
    choices: [
      { text: 'Aceptar la oferta', effects: { money: 25, happiness: 15, reputation: 5 } },
      { text: 'Rechazar y quedarte donde estás', effects: { happiness: -5 } },
    ],
  },
  {
    id: 'beca_estudios',
    name: 'Beca de estudios',
    description: 'Tu expediente académico llama la atención. Te ofrecen una beca completa para estudiar en el extranjero.',
    category: 'opportunity',
    probability: 0.03,
    minAge: 16,
    maxAge: 35,
    effects: { education: 20, intelligence: 10, happiness: 10 },
    choices: [
      { text: 'Aceptar la beca', effects: { education: 25, intelligence: 15, relationships: -10 } },
      { text: 'Quedarte en casa', effects: { relationships: 5, happiness: -5 } },
    ],
  },
  {
    id: 'idea_negocio',
    name: 'Idea de negocio',
    description: 'Te despiertas a las 4 de la mañana con una idea brillante. No puedes dejar de pensar en ella.',
    category: 'opportunity',
    probability: 0.04,
    minAge: 18,
    maxAge: 65,
    effects: { happiness: 10, intelligence: 5 },
    choices: [
      { text: 'Arriesgarlo todo y montar el negocio', effects: { money: -20, happiness: 10, reputation: 5 } },
      { text: 'Apuntar la idea y seguir con tu vida', effects: { happiness: -5 } },
    ],
  },
  {
    id: 'mentor',
    name: 'Encuentras un mentor',
    description: 'Alguien con experiencia decide guiarte. Sus consejos valen más que cualquier máster.',
    category: 'opportunity',
    probability: 0.03,
    minAge: 16,
    maxAge: 50,
    effects: { intelligence: 10, education: 10, charisma: 5, happiness: 8 },
  },
  {
    id: 'concurso_talento',
    name: 'Concurso de talento',
    description: 'Te apuntas a un concurso por diversión. Resulta que tienes más talento del que pensabas.',
    category: 'opportunity',
    probability: 0.03,
    minAge: 14,
    maxAge: 50,
    effects: { charisma: 10, reputation: 10, happiness: 15 },
  },
  {
    id: 'curso_online',
    name: 'Curso online viral',
    description: 'Descubres un curso online que te vuela la cabeza. Aprendes más en un mes que en años de colegio.',
    category: 'opportunity',
    probability: 0.06,
    minAge: 14,
    maxAge: 70,
    effects: { education: 10, intelligence: 8 },
  },
  {
    id: 'contacto_influyente',
    name: 'Contacto influyente',
    description: 'En una cena conoces a alguien importante. Intercambiáis números. Esa agenda de contactos crece.',
    category: 'opportunity',
    probability: 0.04,
    minAge: 20,
    maxAge: 65,
    effects: { reputation: 10, charisma: 5, relationships: 5 },
  },
  {
    id: 'viaje_transformador',
    name: 'Viaje transformador',
    description: 'Un viaje que te cambia la perspectiva de todo. Vuelves siendo otra persona.',
    category: 'opportunity',
    probability: 0.04,
    minAge: 18,
    maxAge: 70,
    effects: { happiness: 15, intelligence: 5, charisma: 5, money: -10 },
  },

  // ═══════════════════════════════════
  // DISASTER (6 events)
  // ═══════════════════════════════════
  {
    id: 'terremoto',
    name: 'Terremoto',
    description: 'La tierra tiembla. Los edificios crujen. En minutos tu barrio es irreconocible.',
    category: 'disaster',
    probability: 0.01,
    minAge: 5,
    maxAge: 90,
    effects: { health: -15, happiness: -20, money: -30 },
  },
  {
    id: 'pandemia',
    name: 'Pandemia mundial',
    description: 'Un virus desconocido paraliza el planeta. Confinamiento total. El mundo que conocías ya no existe.',
    category: 'disaster',
    probability: 0.01,
    minAge: 5,
    maxAge: 90,
    effects: { health: -15, happiness: -20, money: -20, relationships: -10 },
  },
  {
    id: 'inundacion',
    name: 'Inundación',
    description: 'Llueve sin parar durante días. El río se desborda y el agua llega al primer piso. Pierdes recuerdos irremplazables.',
    category: 'disaster',
    probability: 0.02,
    minAge: 5,
    maxAge: 90,
    effects: { money: -25, happiness: -15, health: -5 },
  },
  {
    id: 'incendio_forestal',
    name: 'Incendio forestal',
    description: 'El monte arde. El humo cubre el cielo. Tu zona se convierte en un infierno naranja.',
    category: 'disaster',
    probability: 0.02,
    minAge: 5,
    maxAge: 90,
    effects: { health: -10, happiness: -15, money: -15 },
  },
  {
    id: 'huelga_general',
    name: 'Huelga general',
    description: 'El país se paraliza. No hay transporte, ni colegios, ni servicios. La tensión social es palpable.',
    category: 'disaster',
    probability: 0.03,
    minAge: 10,
    maxAge: 90,
    effects: { money: -10, happiness: -10 },
  },
  {
    id: 'apagon_masivo',
    name: 'Apagón masivo',
    description: 'Se va la luz en toda la región durante días. Sin internet, sin calefacción, sin nada. Vuelta a lo básico.',
    category: 'disaster',
    probability: 0.02,
    minAge: 5,
    maxAge: 90,
    effects: { happiness: -10, money: -5, health: -5 },
  },

  // ═══════════════════════════════════
  // PERSONAL (8 events)
  // ═══════════════════════════════════
  {
    id: 'crisis_mediana_edad',
    name: 'Crisis de mediana edad',
    description: 'Miras al espejo y no reconoces al que te devuelve la mirada. ¿Esto es todo? ¿Es esto la vida?',
    category: 'personal',
    probability: 0.06,
    minAge: 35,
    maxAge: 55,
    effects: { happiness: -20, health: -5, relationships: -5 },
    choices: [
      { text: 'Comprarte un deportivo', effects: { money: -25, happiness: 15, reputation: -3 } },
      { text: 'Empezar terapia', effects: { money: -10, happiness: 15, intelligence: 5 } },
      { text: 'Aceptar y seguir adelante', effects: { happiness: 5, intelligence: 3 } },
    ],
  },
  {
    id: 'epifania',
    name: 'Epifanía',
    description: 'De repente todo cobra sentido. Sabes exactamente qué quieres hacer con tu vida. Claridad absoluta.',
    category: 'personal',
    probability: 0.03,
    minAge: 16,
    maxAge: 70,
    effects: { happiness: 20, intelligence: 10, education: 5 },
  },
  {
    id: 'crisis_existencial',
    name: 'Crisis existencial',
    description: '¿Qué sentido tiene todo? Las preguntas sin respuesta te mantienen despierto noche tras noche.',
    category: 'personal',
    probability: 0.05,
    minAge: 18,
    maxAge: 80,
    effects: { happiness: -15, intelligence: 5, health: -5 },
  },
  {
    id: 'adoptar_mascota',
    name: 'Adoptar una mascota',
    description: 'Unos ojos tristes te miran desde la jaula de la protectora. Te lo llevas a casa. Mejor decisión del año.',
    category: 'personal',
    probability: 0.05,
    minAge: 10,
    maxAge: 75,
    effects: { happiness: 15, health: 5, money: -5, relationships: 5 },
  },
  {
    id: 'despertar_espiritual',
    name: 'Despertar espiritual',
    description: 'Meditación, yoga, naturaleza. Algo hace clic dentro de ti. El mundo parece diferente, más amable.',
    category: 'personal',
    probability: 0.03,
    minAge: 20,
    maxAge: 80,
    effects: { happiness: 15, health: 5, intelligence: 5 },
  },
  {
    id: 'mudanza',
    name: 'Mudanza a otra ciudad',
    description: 'Cajas, despedidas y un GPS hacia lo desconocido. Ciudad nueva, vida nueva.',
    category: 'personal',
    probability: 0.04,
    minAge: 18,
    maxAge: 65,
    effects: { happiness: -5, relationships: -10, money: -10 },
    choices: [
      { text: 'Explorar y adaptarte', effects: { happiness: 15, charisma: 5, relationships: 10 } },
      { text: 'Encerrarte en casa y echar de menos', effects: { happiness: -10, health: -5 } },
    ],
  },
  {
    id: 'hobby_nuevo',
    name: 'Nuevo hobby',
    description: 'Descubres una afición que no sabías que tenías. Las horas vuelan cuando haces lo que te gusta.',
    category: 'personal',
    probability: 0.07,
    minAge: 8,
    maxAge: 80,
    effects: { happiness: 10, health: 3, intelligence: 3 },
  },
  {
    id: 'burnout',
    name: 'Burnout laboral',
    description: 'Tu cuerpo dice basta. Ansiedad, insomnio, irritabilidad. El trabajo te ha consumido por dentro.',
    category: 'personal',
    probability: 0.06,
    minAge: 22,
    maxAge: 65,
    effects: { health: -15, happiness: -20, relationships: -5 },
    choices: [
      { text: 'Dejarlo todo y tomarte un año sabático', effects: { happiness: 20, health: 10, money: -25 } },
      { text: 'Aguantar y seguir', effects: { happiness: -10, health: -10, money: 5 } },
    ],
  },

  // ═══════════════════════════════════
  // GLOBAL (8 events)
  // ═══════════════════════════════════
  {
    id: 'revolucion_tecnologica',
    name: 'Revolución tecnológica',
    description: 'La inteligencia artificial lo cambia todo. Trabajos desaparecen, otros nacen. El futuro es ahora.',
    category: 'global',
    probability: 0.03,
    minAge: 10,
    maxAge: 90,
    effects: { intelligence: 10, education: 5 },
    choices: [
      { text: 'Adaptarte y aprender', effects: { intelligence: 15, education: 10, money: 10 } },
      { text: 'Ignorar los cambios', effects: { money: -10, intelligence: -5 } },
    ],
  },
  {
    id: 'crash_mercado',
    name: 'Crash del mercado',
    description: 'Los mercados mundiales se desploman en horas. Pánico en las bolsas. Los ahorros de la gente se evaporan.',
    category: 'global',
    probability: 0.02,
    minAge: 18,
    maxAge: 90,
    effects: { money: -35, happiness: -15 },
  },
  {
    id: 'guerra_lejana',
    name: 'Guerra en otro continente',
    description: 'Las noticias muestran imágenes terribles. La guerra está lejos, pero sus efectos económicos llegan a tu bolsillo.',
    category: 'global',
    probability: 0.02,
    minAge: 10,
    maxAge: 90,
    effects: { happiness: -10, money: -10 },
  },
  {
    id: 'descubrimiento_cientifico',
    name: 'Descubrimiento científico',
    description: 'Un avance médico revolucionario promete curar enfermedades hasta ahora incurables. La humanidad da un salto.',
    category: 'global',
    probability: 0.02,
    minAge: 5,
    maxAge: 90,
    effects: { health: 10, happiness: 10 },
  },
  {
    id: 'elecciones_polemicas',
    name: 'Elecciones polémicas',
    description: 'El país está dividido. Las elecciones generan tensión en familias, amigos y redes sociales.',
    category: 'global',
    probability: 0.04,
    minAge: 16,
    maxAge: 90,
    effects: { happiness: -5, relationships: -5, reputation: 3 },
  },
  {
    id: 'crisis_climatica',
    name: 'Crisis climática',
    description: 'Olas de calor récord, cosechas arruinadas, migraciones masivas. El clima ya no es lo que era.',
    category: 'global',
    probability: 0.03,
    minAge: 5,
    maxAge: 90,
    effects: { health: -5, happiness: -10, money: -5 },
  },
  {
    id: 'boom_criptomonedas',
    name: 'Boom de criptomonedas',
    description: 'Bitcoin se dispara. Todo el mundo habla de cripto. Tu vecino se ha comprado un Tesla con Dogecoin.',
    category: 'global',
    probability: 0.03,
    minAge: 16,
    maxAge: 70,
    effects: { happiness: 5 },
    choices: [
      { text: 'Invertir fuerte en cripto', effects: { money: 30, happiness: 10 } },
      { text: 'Pasar del tema', effects: { happiness: -3 } },
      { text: 'Invertir con cautela', effects: { money: 10, happiness: 5 } },
    ],
  },
  {
    id: 'movimiento_social',
    name: 'Movimiento social',
    description: 'La gente sale a la calle. Una ola de cambio recorre el país. Tú decides si unirte o mirar desde la ventana.',
    category: 'global',
    probability: 0.03,
    minAge: 14,
    maxAge: 80,
    effects: { happiness: 5, reputation: 3 },
    choices: [
      { text: 'Unirte al movimiento', effects: { reputation: 10, charisma: 5, happiness: 10, health: -3 } },
      { text: 'Mantenerte al margen', effects: { happiness: -3 } },
    ],
  },
];

/**
 * Devuelve una lista de eventos aleatorios que pueden ocurrir
 * dado la edad y stats del jugador.
 */
export function getRandomEvents(age: number, stats: EventPlayerStats): GameEvent[] {
  const eligible = EVENTS.filter(
    (event) => age >= event.minAge && age <= event.maxAge
  );

  const triggered: GameEvent[] = [];

  for (const event of eligible) {
    let probability = event.probability;

    // Modificadores según stats del jugador
    if (event.category === 'health' && stats.health !== undefined) {
      // Peor salud → más probabilidad de eventos de salud negativos
      if (stats.health < 30) probability *= 1.5;
      if (stats.health < 15) probability *= 2.0;
    }

    if (event.category === 'social') {
      // Más carisma → más probabilidad de eventos sociales positivos
      if (stats.charisma !== undefined && stats.charisma > 50) {
        const hasPositiveEffect =
          (event.effects.happiness ?? 0) > 0 || (event.effects.relationships ?? 0) > 0;
        if (hasPositiveEffect) probability *= 1.3;
      }
    }

    if (event.category === 'opportunity') {
      // Más inteligencia/educación → más oportunidades
      if (stats.intelligence !== undefined && stats.intelligence > 60) probability *= 1.3;
      if (stats.education !== undefined && stats.education > 60) probability *= 1.2;
    }

    if (event.category === 'economic') {
      // Más dinero → más exposición a eventos económicos
      if (stats.money !== undefined && stats.money > 70) probability *= 1.2;
    }

    if (event.category === 'personal') {
      // Menos felicidad → más crisis personales
      if (stats.happiness !== undefined && stats.happiness < 25) probability *= 1.5;
    }

    // Tirada de dados
    if (Math.random() < probability) {
      triggered.push(event);
    }
  }

  return triggered;
}
