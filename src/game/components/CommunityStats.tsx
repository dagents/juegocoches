'use client';

import React from 'react';

interface CommunityStatsData {
  totalGames: number;
  avgAge: number;
  avgScore: number;
  mostPopularCountry: string;
  mostPopularCareer: string;
  forococheroSurvivalRate: number;
  richestEver: number;
}

interface CommunityStatsProps {
  stats: CommunityStatsData;
}

// Stat card config
const cards: { key: keyof CommunityStatsData; icon: string; label: string; format: (v: number | string) => string }[] = [
  { key: 'totalGames', icon: '🎮', label: 'Partidas jugadas', format: (v) => Number(v).toLocaleString('es-ES') },
  { key: 'avgAge', icon: '📅', label: 'Edad media', format: (v) => `${Number(v).toFixed(1)} años` },
  { key: 'avgScore', icon: '⭐', label: 'Puntuación media', format: (v) => Number(v).toLocaleString('es-ES') },
  { key: 'mostPopularCountry', icon: '🌍', label: 'País más popular', format: (v) => String(v) },
  { key: 'mostPopularCareer', icon: '💼', label: 'Carrera más popular', format: (v) => String(v) },
  { key: 'forococheroSurvivalRate', icon: '💀', label: 'Supervivencia Forocochero', format: (v) => `${Number(v).toFixed(1)}%` },
  { key: 'richestEver', icon: '💰', label: 'Más rico de la historia', format: (v) => `$${Number(v).toLocaleString('es-ES')}` },
];

export default function CommunityStats({ stats }: CommunityStatsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground text-center">📊 Estadísticas de la Comunidad</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cards.map(({ key, icon, label, format }) => (
          <div key={key} className="bg-surface-card border border-surface-elevated rounded-xl p-4 text-center space-y-1">
            <span className="text-2xl">{icon}</span>
            <p className="text-lg font-bold text-foreground">{format(stats[key])}</p>
            <p className="text-xs text-foreground/50">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
