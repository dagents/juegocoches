'use client';

import React from 'react';

// Leaderboard entry shape used across the app
export type LeaderboardEntry = {
  rank: number;
  characterName: string;
  score: number;
  grade: string;
  age: number;
  country: string;
  career: string | null;
  biography: string;
  createdAt: string;
};

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

// Map grade letters to Tailwind text colour classes
const gradeColor: Record<string, string> = {
  S: 'text-yellow-400',
  A: 'text-green-400',
  B: 'text-neon-cyan',
  C: 'text-blue-400',
  D: 'text-orange-400',
  F: 'text-red-500',
};

// Medals for top 3
const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

/** Format an ISO date string as dd/mm/yyyy */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  // Empty state
  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-foreground/60">
        <span className="text-4xl mb-4">🏆</span>
        <p className="text-lg font-medium">Aún no hay puntuaciones</p>
        <p className="text-sm mt-1">¡Sé el primero en completar una vida!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3 px-2 sm:px-0">
      <h2 className="text-2xl font-bold gradient-text text-center mb-6">
        🏆 Tabla de Clasificación
      </h2>

      {entries.map((entry) => {
        const medal = medals[entry.rank];
        const colorClass = gradeColor[entry.grade] ?? 'text-foreground';

        return (
          <div
            key={`${entry.rank}-${entry.characterName}`}
            className={`
              rounded-xl p-4 transition-colors
              ${entry.rank <= 3 ? 'bg-surface-elevated ring-1 ring-neon-purple/30' : 'bg-surface-card'}
            `}
          >
            {/* Top row: rank, name, score */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Rank */}
              <span className="text-xl font-bold min-w-[2.5rem] text-center">
                {medal ?? `#${entry.rank}`}
              </span>

              {/* Name + country */}
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-foreground truncate block">
                  {entry.characterName}
                </span>
                <span className="text-xs text-foreground/50">
                  {entry.country}
                  {entry.career ? ` · ${entry.career}` : ''}
                  {` · ${entry.age} años`}
                </span>
              </div>

              {/* Score + grade */}
              <div className="text-right shrink-0">
                <span className={`text-lg font-bold ${colorClass}`}>
                  {entry.score.toLocaleString('es-ES')}
                </span>
                <span className={`ml-1 text-sm font-semibold ${colorClass}`}>
                  {entry.grade}
                </span>
              </div>
            </div>

            {/* Biography */}
            <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
              {entry.biography}
            </p>

            {/* Date */}
            <p className="mt-1 text-xs text-foreground/40 text-right">
              {formatDate(entry.createdAt)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
