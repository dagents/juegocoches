"use client";

import { useState, useCallback, useTransition } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import type { GameState, LifeEvent } from "../engine/GameState";
import { applyEffects, calculateScore } from "../engine/GameState";
import { processTurn, applyDecision, type TurnResult } from "../engine/TurnManager";
import type { Decision } from "@/game/data/decisions";
import type { GameEvent } from "@/game/data/events";
import StatsPanel from "./StatsPanel";
import DecisionCard from "./DecisionCard";
import Timeline from "./Timeline";
import GameOverScreen from "./GameOverScreen";
import NewGameScreen from "./NewGameScreen";

// Dynamically import Babylon.js scene (client-only, no SSR)
const GameScene = dynamic(() => import("../scene/GameScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video rounded-xl bg-surface-card border border-surface-card flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="text-2xl animate-pulse">🌍</div>
        <p className="text-sm text-gray-400">Cargando mundo 3D...</p>
      </div>
    </div>
  ),
});

interface GameLayoutProps {
  initialState: GameState | null;
  onSave: (state: GameState) => Promise<void>;
  onNewGame: (state: GameState) => Promise<void>;
}

export default function GameLayout({ initialState, onSave, onNewGame }: GameLayoutProps) {
  const [gameState, setGameState] = useState<GameState | null>(initialState);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [pendingEvents, setPendingEvents] = useState<GameEvent[]>([]);
  const [eventNarrative, setEventNarrative] = useState<string | null>(null);
  const [decisionNarrative, setDecisionNarrative] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "events" | "decisions" | "narrative">(
    initialState ? "idle" : "idle"
  );
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);

  // Start new game
  const handleNewGame = useCallback(
    async (state: GameState) => {
      setSaving(true);
      try {
        await onNewGame(state);
        setGameState(state);
        setPhase("idle");
        setDecisions([]);
        setEventNarrative(null);
        setDecisionNarrative(null);
      } finally {
        setSaving(false);
      }
    },
    [onNewGame]
  );

  // Advance one month
  const handleNextMonth = useCallback(() => {
    if (!gameState || !gameState.isAlive) return;

    startTransition(() => {
      const { newState, turnResult } = processTurn(gameState);

      // Show events if any
      if (turnResult.events.length > 0) {
        const eventTexts = turnResult.events
          .map((e) => `**${e.name}**: ${e.description}`)
          .join("\n\n");
        setEventNarrative(eventTexts);
        setPendingEvents(turnResult.events);
        setPhase("events");
      }

      // Queue decisions
      if (turnResult.decisions.length > 0) {
        setDecisions(turnResult.decisions);
        if (turnResult.events.length === 0) {
          setPhase("decisions");
        }
      } else if (turnResult.events.length === 0) {
        setPhase("idle");
      }

      setGameState(newState);
    });
  }, [gameState]);

  // Handle event acknowledgment
  const handleEventAck = useCallback(() => {
    setEventNarrative(null);
    if (decisions.length > 0) {
      setPhase("decisions");
    } else {
      setPhase("idle");
      // Auto-save
      if (gameState) {
        onSave(gameState);
      }
    }
  }, [decisions, gameState, onSave]);

  // Handle decision choice
  const handleDecision = useCallback(
    (decision: Decision, choiceIndex: number) => {
      if (!gameState) return;

      const choice = decision.options[choiceIndex];
      if (!choice) return;

      const newState = applyDecision(gameState, decision, choiceIndex);
      setGameState(newState);

      // Show narrative from the last life event added
      const lastEvent = newState.lifeEvents[newState.lifeEvents.length - 1];
      setDecisionNarrative(lastEvent?.description ?? choice.text);
      setPhase("narrative");

      // Remove this decision from the queue
      setDecisions((prev) => prev.filter((d) => d.id !== decision.id));
    },
    [gameState]
  );

  // Handle narrative acknowledgment
  const handleNarrativeAck = useCallback(() => {
    setDecisionNarrative(null);
    if (decisions.length > 0) {
      setPhase("decisions");
    } else {
      setPhase("idle");
      // Auto-save after all decisions
      if (gameState) {
        onSave(gameState);
      }
    }
  }, [decisions, gameState, onSave]);

  // New game from game over
  const handleRestart = useCallback(() => {
    setGameState(null);
    setDecisions([]);
    setPhase("idle");
    setEventNarrative(null);
    setDecisionNarrative(null);
  }, []);

  // No game yet — show new game screen
  if (!gameState) {
    return <NewGameScreen onStart={handleNewGame} loading={saving} />;
  }

  // Game over
  if (!gameState.isAlive) {
    return <GameOverScreen gameState={gameState} onNewGame={handleRestart} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top: 3D scene + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Scene */}
        <div className="lg:col-span-2">
          <GameScene gameState={gameState} />
        </div>

        {/* Stats panel */}
        <div>
          <div className="space-y-4">
            {/* Character info card */}
            <div className="bg-surface-card border border-surface-card rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground text-lg">{gameState.characterName}</h3>
                  <p className="text-xs text-gray-400">
                    {gameState.currentAge} años · Mes {gameState.currentMonth} · {gameState.countryName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Balance</p>
                  <p className="font-mono font-bold text-neon-cyan text-sm">
                    ${gameState.bankBalance.toLocaleString("es-ES")}
                  </p>
                </div>
              </div>
              {gameState.career && (
                <div className="text-xs text-gray-400 bg-surface-elevated rounded-lg px-3 py-1.5 mt-2">
                  💼 {gameState.career.name}
                </div>
              )}
            </div>
            <StatsPanel stats={gameState.stats} />
          </div>
        </div>
      </div>

      {/* Middle: Action area */}
      <div className="max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* Event narrative */}
          {phase === "events" && eventNarrative && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-surface-card border border-neon-cyan/30 rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <h3 className="font-semibold text-foreground">¡Algo ha pasado!</h3>
              </div>
              <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                {eventNarrative}
              </div>
              <button
                onClick={handleEventAck}
                className="w-full py-2.5 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/30 rounded-lg transition-colors font-medium"
              >
                Continuar →
              </button>
            </motion.div>
          )}

          {/* Decisions */}
          {phase === "decisions" && decisions.length > 0 && (
            <motion.div
              key="decisions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {decisions.map((decision) => (
                <DecisionCard
                  key={decision.id}
                  decision={decision}
                  onChoose={(choiceIndex) => handleDecision(decision, choiceIndex)}
                />
              ))}
            </motion.div>
          )}

          {/* Decision narrative */}
          {phase === "narrative" && decisionNarrative && (
            <motion.div
              key="narrative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-surface-card border border-neon-purple/30 rounded-xl p-5 space-y-4"
            >
              <p className="text-sm text-gray-300 leading-relaxed">
                {decisionNarrative}
              </p>
              <button
                onClick={handleNarrativeAck}
                className="w-full py-2.5 bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border border-neon-purple/30 rounded-lg transition-colors font-medium"
              >
                {decisions.length > 0 ? "Siguiente decisión →" : "Continuar →"}
              </button>
            </motion.div>
          )}

          {/* Idle — next month button */}
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <button
                onClick={handleNextMonth}
                disabled={isPending}
                className="px-8 py-3.5 bg-neon-purple hover:bg-purple-600 disabled:bg-gray-700 text-white rounded-xl font-semibold text-lg transition-all neon-glow-purple"
              >
                {isPending ? "Procesando..." : "Siguiente mes →"}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                {gameState.currentAge} años · Mes {gameState.currentMonth}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: Timeline */}
      <div className="max-w-3xl mx-auto w-full">
        <Timeline events={gameState.lifeEvents} />
      </div>
    </div>
  );
}
