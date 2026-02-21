'use client';

import React from 'react';
import type { LeaderboardEntry } from './Leaderboard';

interface CompareModalProps {
  entry1: LeaderboardEntry;
  entry2: LeaderboardEntry;
  onClose: () => void;
}

/** Render a comparison bar between two values (max determines 100%) */
function CompareBar({ label, v1, v2, format }: { label: string; v1: number; v2: number; format?: (n: number) => string }) {
  const max = Math.max(v1, v2, 1);
  const fmt = format ?? ((n: number) => String(n));
  return (
    <div className="space-y-1">
      <p className="text-xs text-foreground/50 text-center">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-neon-cyan w-16 text-right shrink-0">{fmt(v1)}</span>
        <div className="flex-1 flex gap-0.5 h-3">
          <div className="flex-1 bg-surface-elevated rounded-l-full overflow-hidden flex justify-end">
            <div className="bg-neon-cyan/60 rounded-l-full" style={{ width: `${(v1 / max) * 100}%` }} />
          </div>
          <div className="flex-1 bg-surface-elevated rounded-r-full overflow-hidden">
            <div className="bg-neon-purple/60 rounded-r-full" style={{ width: `${(v2 / max) * 100}%` }} />
          </div>
        </div>
        <span className="text-xs font-mono text-neon-purple w-16 shrink-0">{fmt(v2)}</span>
      </div>
    </div>
  );
}

export default function CompareModal({ entry1, entry2, onClose }: CompareModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="bg-surface-card border border-surface-elevated rounded-2xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">⚔️ Comparar Vidas</h2>
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground text-xl leading-none">✕</button>
        </div>

        {/* Names */}
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-neon-cyan">{entry1.characterName}</span>
          <span className="text-neon-purple">{entry2.characterName}</span>
        </div>

        {/* Countries */}
        <div className="flex justify-between text-xs text-foreground/50">
          <span>{entry1.country}</span>
          <span>{entry2.country}</span>
        </div>

        {/* Careers */}
        <div className="flex justify-between text-xs text-foreground/60">
          <span>{entry1.career ?? 'Sin carrera'}</span>
          <span>{entry2.career ?? 'Sin carrera'}</span>
        </div>

        {/* Comparison bars */}
        <div className="space-y-3">
          <CompareBar label="Puntuación" v1={entry1.score} v2={entry2.score} format={(n) => n.toLocaleString('es-ES')} />
          <CompareBar label="Edad" v1={entry1.age} v2={entry2.age} format={(n) => `${n} años`} />
        </div>

        {/* Grades */}
        <div className="flex justify-around text-center">
          <div>
            <p className="text-xs text-foreground/50">Nota</p>
            <p className="text-2xl font-bold text-neon-cyan">{entry1.grade}</p>
          </div>
          <div className="text-foreground/20 text-2xl font-light">vs</div>
          <div>
            <p className="text-xs text-foreground/50">Nota</p>
            <p className="text-2xl font-bold text-neon-purple">{entry2.grade}</p>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-surface-elevated hover:bg-surface-elevated/80 text-foreground rounded-lg text-sm font-medium transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
