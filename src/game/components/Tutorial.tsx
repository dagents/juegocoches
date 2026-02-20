"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    emoji: "🎲",
    title: "Nacimiento aleatorio",
    text: "Naces en un país, familia y situación completamente aleatorios. Tu punto de partida lo decide el destino — no tú.",
  },
  {
    emoji: "📊",
    title: "8 estadísticas",
    text: "Dinero, educación, salud, felicidad, relaciones, reputación, inteligencia y carisma. Todo lo que haces las afecta.",
  },
  {
    emoji: "📅",
    title: "Mes a mes",
    text: "La vida avanza mes a mes. Cada mes pueden pasar eventos aleatorios, oportunidades o desgracias. Pulsa 'Siguiente mes' para avanzar.",
  },
  {
    emoji: "🤔",
    title: "Decisiones",
    text: "En momentos clave tendrás que elegir. Cada opción tiene probabilidad de éxito y consecuencias. No hay decisiones perfectas.",
  },
  {
    emoji: "💀",
    title: "Taku",
    text: "Cuidado con Taku — una presencia oscura que aparecerá en los peores momentos. A veces puedes resistirte... a veces no.",
  },
  {
    emoji: "🏠",
    title: "Propiedades",
    text: "Compra pisos, coches, negocios y terrenos. Se revalorizan con el tiempo. O no. La economía es impredecible.",
  },
  {
    emoji: "💑",
    title: "Relaciones",
    text: "Haz amigos, enamórate, ten hijos. Las relaciones afectan tu felicidad y abren nuevos eventos en tu vida.",
  },
  {
    emoji: "🏆",
    title: "Ranking",
    text: "Al morir, tu vida recibe una puntuación. Compite por la mejor biografía en el ranking global. ¿Serás grado S?",
  },
];

interface TutorialProps {
  onComplete: () => void;
}

export default function Tutorial({ onComplete }: TutorialProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-surface-card border border-surface-card rounded-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-5"
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? "bg-neon-purple" : i < step ? "bg-neon-purple/40" : "bg-surface-elevated"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-5xl">{current.emoji}</div>
        <h3 className="text-xl font-bold gradient-text">{current.title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{current.text}</p>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 bg-surface-elevated hover:bg-surface-elevated/80 text-gray-400 rounded-xl font-medium transition-colors min-h-[48px]"
            >
              ← Atrás
            </button>
          )}
          {isLast ? (
            <button
              onClick={onComplete}
              className="flex-1 py-3 bg-neon-purple hover:bg-purple-600 active:bg-purple-700 text-white rounded-xl font-bold transition-colors min-h-[48px] neon-glow-purple"
            >
              ¡A jugar! 🎮
            </button>
          ) : (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 py-3 bg-neon-cyan/20 hover:bg-neon-cyan/30 active:bg-neon-cyan/40 text-neon-cyan border border-neon-cyan/30 rounded-xl font-medium transition-colors min-h-[48px]"
            >
              Siguiente →
            </button>
          )}
        </div>

        {/* Skip */}
        <button
          onClick={onComplete}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Saltar tutorial
        </button>
      </motion.div>
    </div>
  );
}
