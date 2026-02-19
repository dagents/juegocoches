"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { GameState } from "../engine/GameState";
import { generateNewCharacter } from "../engine/CharacterGenerator";

interface NewGameScreenProps {
  onStart: (state: GameState) => void;
  loading?: boolean;
}

export default function NewGameScreen({ onStart, loading = false }: NewGameScreenProps) {
  const [playerName, setPlayerName] = useState("");
  const [preview, setPreview] = useState<GameState | null>(null);
  const [rolling, setRolling] = useState(false);

  const canRoll = playerName.trim().length >= 2;

  const rollCharacter = () => {
    if (!canRoll) return;
    setRolling(true);
    // Dramatic rolling effect
    let count = 0;
    const interval = setInterval(() => {
      setPreview(generateNewCharacter(playerName));
      count++;
      if (count >= 8) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 100);
  };

  const handleStart = () => {
    if (preview) {
      onStart(preview);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold gradient-text"
        >
          El Destino en tus Manos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-md mx-auto"
        >
          Naces en un lugar aleatorio. Tu vida depende de tus decisiones.
          ¿Hasta dónde llegarás?
        </motion.p>
      </div>

      {/* Name input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Escribe tu nombre..."
          maxLength={30}
          className="w-full max-w-sm px-4 py-3 bg-surface-elevated border border-gray-700 focus:border-neon-cyan rounded-xl text-center text-foreground text-lg placeholder-gray-500 outline-none transition-colors"
        />
      </motion.div>

      {/* Roll button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <button
          onClick={rollCharacter}
          disabled={!canRoll || rolling || loading}
          className="w-full sm:w-auto px-8 py-4 bg-neon-purple hover:bg-purple-600 active:bg-purple-700 disabled:bg-gray-700 text-white rounded-xl font-bold text-lg transition-all neon-glow-purple disabled:opacity-50 min-h-[48px]"
        >
          {rolling ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">🎲</span> Generando destino...
            </span>
          ) : preview ? (
            "🎲 Volver a tirar"
          ) : (
            "🎲 Descubrir tu destino"
          )}
        </button>
      </motion.div>

      {/* Character preview */}
      {preview && !rolling && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-card border border-neon-cyan/30 rounded-xl p-6 space-y-5"
        >
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Tu nueva vida
            </p>
            <h2 className="text-2xl font-bold text-foreground">
              {preview.characterName}
            </h2>
            <p className="text-neon-cyan font-medium">
              📍 {preview.countryName}
            </p>
          </div>

          {/* Family info */}
          <div className="bg-surface-elevated rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Familia
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Estado: </span>
                <span className="text-foreground">
                  {preview.family.familyStatus === "united"
                    ? "Unida 👨‍👩‍👧"
                    : preview.family.familyStatus === "divorced"
                    ? "Divorciada 💔"
                    : preview.family.familyStatus === "single_parent"
                    ? "Monoparental 👩‍👧"
                    : "Orfanato 🏠"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Nivel económico: </span>
                <span className="text-foreground">
                  {"💰".repeat(preview.family.wealthTier)}
                  {"○".repeat(5 - preview.family.wealthTier)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Hermanos: </span>
                <span className="text-foreground">{preview.family.siblings}</span>
              </div>
              <div>
                <span className="text-gray-500">Balance: </span>
                <span className="text-neon-cyan font-mono">
                  ${preview.bankBalance.toLocaleString("es-ES")}
                </span>
              </div>
            </div>
          </div>

          {/* Talents */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Talentos:</span>
            {preview.talents.map((talent) => (
              <span
                key={talent}
                className="text-xs px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30"
              >
                {talent}
              </span>
            ))}
          </div>

          {/* Starting stats */}
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
            {[
              { label: "💰", value: preview.stats.money },
              { label: "🎓", value: preview.stats.education },
              { label: "❤️", value: preview.stats.health },
              { label: "😊", value: preview.stats.happiness },
              { label: "👥", value: preview.stats.relationships },
              { label: "⭐", value: preview.stats.reputation },
              { label: "🧠", value: preview.stats.intelligence },
              { label: "💪", value: preview.stats.charisma },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-2 rounded-lg bg-surface-elevated">
                <span className="text-sm">{label}</span>
                <p className="text-sm font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-4 sm:py-3 bg-neon-cyan hover:bg-cyan-600 active:bg-cyan-700 disabled:bg-gray-700 text-black font-bold rounded-xl transition-colors text-lg min-h-[48px]"
          >
            {loading ? "Creando tu vida..." : "🚀 Empezar esta vida"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
