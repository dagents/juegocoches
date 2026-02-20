// Game changelog — update this file daily with new changes

export interface ChangelogEntry {
  version: string;
  date: string; // YYYY-MM-DD
  title: string;
  changes: string[];
  highlight?: string; // optional featured change
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.2",
    date: "2026-02-20",
    title: "Taku, Tutorial, Sonidos y Leaderboard",
    highlight: "⚫ Taku ha llegado — el villano que arruinará tu vida",
    changes: [
      "⚫ Taku — el villano: 21 encuentros oscuros en todas las fases de vida. Te persigue desde la infancia hasta la vejez. Puedes resistirte... o no",
      "🎓 Tutorial interactivo: 8 pasos que explican las mecánicas del juego para nuevos jugadores. Se puede saltar",
      "🔊 Efectos de sonido: clicks, decisiones, eventos buenos/malos, sonido ominoso de Taku, nacimiento, muerte y milestones",
      "🏆 Leaderboard global: ranking real conectado a la base de datos. Tu puntuación y biografía se guardan automáticamente al morir",
      "📋 Changelog visible en /poll y /game para seguir las actualizaciones diarias",
    ],
  },
  {
    version: "1.1",
    date: "2026-02-20",
    title: "Modo Forocochero, Propiedades y Relaciones",
    highlight: "💀 Nuevo modo de dificultad Forocochero",
    changes: [
      "💀 Modo Forocochero: dificultad hardcore con stats reducidos, muerte 1.5x más probable. Sobrevive hasta los 70 para el badge exclusivo",
      "🏠 Sistema de propiedades: 22 items entre pisos, casas, coches, negocios y terrenos. Compra, vende y mira cómo se revalorizan",
      "💑 Relaciones dinámicas: pareja, hijos, amigos y enemigos. Eventos por edad: crushes adolescentes, bodas, divorcios, muerte de la pareja...",
      "🏆 Sistema de ranking y biografías: al morir, se genera una biografía automática de tu vida. Compite por la mejor puntuación",
      "📱 Mejoras de responsive: botones más grandes en móvil, layout adaptativo, touch targets de 44px mínimo",
      "⏳ Pantalla de carga animada con barra de progreso mientras carga el mundo 3D",
      "🔒 Desactivado indexación por buscadores (noindex)",
    ],
  },
  {
    version: "1.0",
    date: "2026-02-19",
    title: "Lanzamiento — El Destino en tus Manos",
    highlight: "🎮 ¡El juego elegido por la comunidad ya está aquí!",
    changes: [
      "🎮 Juego completo: simulación de vida mes a mes con decisiones que cambian tu destino",
      "🌍 30 países reales con datos económicos, educativos y de esperanza de vida",
      "📊 8 estadísticas: dinero, educación, salud, felicidad, relaciones, reputación, inteligencia y carisma",
      "💼 30 carreras profesionales con requisitos, salarios y progresión",
      "🎲 60+ eventos aleatorios en 7 categorías que pueden cambiar tu vida",
      "🧠 120+ decisiones únicas por fase de vida (infancia, adolescencia, adulto joven, adulto, vejez)",
      "🌆 Escena 3D con Babylon.js: el entorno cambia según tu edad, riqueza y felicidad",
      "💾 Guardado automático en base de datos — tu progreso no se pierde",
      "🗳️ Sistema de votación de la comunidad completado: Phase 1 (juego) → Phase 2 (mejoras diarias)",
      "📜 Página archivo de propuestas de juego con historial de votaciones",
    ],
  },
];
