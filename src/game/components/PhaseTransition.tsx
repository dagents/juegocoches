"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { AgePhase } from "@/game/engine/GameState";

// Phase transition overlay with animation
interface PhaseTransitionProps {
  phase: AgePhase;
  onComplete: () => void;
}

const phaseConfig: Record<AgePhase, { emoji: string; name: string; quote: string; gradient: string }> = {
  childhood: {
    emoji: "🧒",
    name: "Infancia",
    quote: "Todo gran viaje comienza con un pequeño paso.",
    gradient: "from-yellow-400 via-pink-400 to-orange-400",
  },
  teen: {
    emoji: "⚡",
    name: "Adolescencia",
    quote: "El mundo es tuyo, atrévete a soñar en grande.",
    gradient: "from-purple-500 via-blue-500 to-cyan-400",
  },
  young_adult: {
    emoji: "🚀",
    name: "Adulto Joven",
    quote: "Las decisiones de hoy construyen el mañana.",
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  adult: {
    emoji: "💼",
    name: "Adulto",
    quote: "La experiencia es la madre de la sabiduría.",
    gradient: "from-amber-600 via-orange-600 to-red-600",
  },
  elderly: {
    emoji: "🌅",
    name: "Vejez",
    quote: "La vida bien vivida es el mayor tesoro.",
    gradient: "from-slate-500 via-blue-400 to-indigo-500",
  },
};

export default function PhaseTransition({ phase, onComplete }: PhaseTransitionProps) {
  const config = phaseConfig[phase];

  // Auto-dismiss after 2 seconds
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onComplete}
    >
      {/* Dark overlay with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-20`} />
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative text-center space-y-4 px-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-7xl"
        >
          {config.emoji}
        </motion.div>
        <h2 className={`text-4xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
          {config.name}
        </h2>
        <p className="text-gray-300 text-lg italic max-w-md mx-auto">
          &ldquo;{config.quote}&rdquo;
        </p>
      </motion.div>
    </motion.div>
  );
}
