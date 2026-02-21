'use client';

import React from 'react';
import { getCurrentChallenge } from '@/game/data/challenges';

const difficultyConfig = {
  easy: { label: 'Fácil', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
  medium: { label: 'Media', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  hard: { label: 'Difícil', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
};

export default function WeeklyChallenge() {
  const challenge = getCurrentChallenge();
  const diff = difficultyConfig[challenge.difficulty];

  return (
    <div className="bg-surface-card border border-neon-purple/30 rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <h3 className="font-bold text-foreground text-sm">Reto Semanal</h3>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diff.bg} ${diff.color} ${diff.border} border`}>
          {diff.label}
        </span>
      </div>

      {/* Challenge info */}
      <div>
        <p className="font-semibold text-neon-purple text-sm">{challenge.title}</p>
        <p className="text-xs text-foreground/70 mt-1">{challenge.description}</p>
      </div>

      {/* Reward */}
      <div className="flex items-center gap-2 text-xs text-foreground/50">
        <span>🏅</span>
        <span>{challenge.reward}</span>
      </div>
    </div>
  );
}
