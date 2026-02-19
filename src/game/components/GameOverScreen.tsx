"use client";

import { motion } from "framer-motion";
import type { GameState } from "../engine/GameState";
import { calculateScore, getAgePhaseLabel, getAgePhase } from "../engine/GameState";

interface GameOverScreenProps {
  gameState: GameState;
  onNewGame: () => void;
}

export default function GameOverScreen({ gameState, onNewGame }: GameOverScreenProps) {
  const score = calculateScore(gameState);

  const getScoreGrade = (s: number) => {
    if (s >= 800) return { grade: "S", label: "Leyenda", color: "text-yellow-400" };
    if (s >= 600) return { grade: "A", label: "Extraordinaria", color: "text-green-400" };
    if (s >= 400) return { grade: "B", label: "Notable", color: "text-blue-400" };
    if (s >= 250) return { grade: "C", label: "Normal", color: "text-gray-300" };
    if (s >= 100) return { grade: "D", label: "Difícil", color: "text-orange-400" };
    return { grade: "F", label: "Trágica", color: "text-red-400" };
  };

  const { grade, label, color } = getScoreGrade(score);

  // Life highlights
  const highlights = gameState.lifeEvents
    .filter((e) => e.type !== "milestone" || e.title !== `Cumples ${gameState.currentAge} años`)
    .slice(-10);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-6xl"
        >
          ⚰️
        </motion.div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">
            {gameState.characterName}
          </h2>
          <p className="text-gray-400">
            {gameState.countryName} · Vivió {gameState.currentAge} años
          </p>
          {gameState.causeOfDeath && (
            <p className="text-sm text-gray-500 italic">
              {gameState.causeOfDeath}
            </p>
          )}
        </div>

        {/* Score */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="inline-block"
        >
          <div className="bg-surface-card border border-neon-purple/30 rounded-2xl px-8 py-4 neon-glow-purple">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Puntuación de vida
            </p>
            <div className="flex items-center justify-center gap-3 mt-1">
              <span className={`text-5xl font-bold ${color}`}>{grade}</span>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">{score}</p>
                <p className={`text-xs ${color}`}>Vida {label}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Final stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-surface-card border border-surface-card rounded-xl p-4"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Resumen de vida
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Dinero", value: gameState.stats.money, icon: "💰" },
            { label: "Educación", value: gameState.stats.education, icon: "🎓" },
            { label: "Salud", value: gameState.stats.health, icon: "❤️" },
            { label: "Felicidad", value: gameState.stats.happiness, icon: "😊" },
            { label: "Relaciones", value: gameState.stats.relationships, icon: "👥" },
            { label: "Reputación", value: gameState.stats.reputation, icon: "⭐" },
            { label: "Inteligencia", value: gameState.stats.intelligence, icon: "🧠" },
            { label: "Carisma", value: gameState.stats.charisma, icon: "💪" },
          ].map(({ label: statLabel, value, icon }) => (
            <div
              key={statLabel}
              className="text-center p-2 rounded-lg bg-surface-elevated"
            >
              <span className="text-lg">{icon}</span>
              <p className="text-lg font-bold text-foreground">{value}</p>
              <p className="text-[10px] text-gray-500">{statLabel}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-surface-card border border-surface-card rounded-xl p-4"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Momentos destacados
          </h3>
          <div className="space-y-2">
            {highlights.map((event, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-gray-500">{event.age}a</span>
                <span className="text-foreground">{event.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex justify-center gap-3"
      >
        <button
          onClick={onNewGame}
          className="px-6 py-3 bg-neon-purple hover:bg-purple-600 text-white rounded-xl font-semibold transition-colors neon-glow-purple"
        >
          Nueva vida 🔄
        </button>
      </motion.div>
    </motion.div>
  );
}
