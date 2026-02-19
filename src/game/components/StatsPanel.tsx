"use client";

import { motion } from "framer-motion";
import type { CharacterStats } from "@/game/engine/GameState";

interface StatBarProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

function StatBar({ label, value, icon, color }: StatBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-gray-300">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span className="font-mono text-gray-400">{Math.round(value)}</span>
      </div>
      <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(2, value)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

interface StatsPanelProps {
  stats: CharacterStats;
  className?: string;
}

export default function StatsPanel({ stats, className }: StatsPanelProps) {
  const statConfigs = [
    { key: "money" as const, label: "Dinero", icon: "💰", color: "#f59e0b" },
    { key: "education" as const, label: "Educación", icon: "🎓", color: "#3b82f6" },
    { key: "health" as const, label: "Salud", icon: "❤️", color: "#ef4444" },
    { key: "happiness" as const, label: "Felicidad", icon: "😊", color: "#22c55e" },
    { key: "relationships" as const, label: "Relaciones", icon: "👥", color: "#ec4899" },
    { key: "reputation" as const, label: "Reputación", icon: "⭐", color: "#eab308" },
    { key: "intelligence" as const, label: "Inteligencia", icon: "🧠", color: "#8b5cf6" },
    { key: "charisma" as const, label: "Carisma", icon: "💪", color: "#06b6d4" },
  ];

  return (
    <div className={`space-y-2.5 ${className ?? ""}`}>
      {statConfigs.map(({ key, label, icon, color }) => (
        <StatBar
          key={key}
          label={label}
          value={stats[key]}
          icon={icon}
          color={color}
        />
      ))}
    </div>
  );
}
