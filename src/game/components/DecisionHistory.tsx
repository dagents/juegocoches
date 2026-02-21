"use client";

import { useState, useMemo } from "react";
import type { LifeEvent } from "../engine/GameState";

interface DecisionHistoryProps {
  events: LifeEvent[];
}

// Filterable decision history log
export default function DecisionHistory({ events }: DecisionHistoryProps) {
  const [search, setSearch] = useState("");
  const [filterEffect, setFilterEffect] = useState<"all" | "positive" | "negative">("all");

  const decisions = useMemo(() => {
    return events
      .filter((e) => e.type === "decision")
      .filter((e) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
        );
      })
      .filter((e) => {
        if (filterEffect === "all") return true;
        const net = Object.values(e.effects).reduce((sum, v) => sum + (v ?? 0), 0);
        return filterEffect === "positive" ? net > 0 : net < 0;
      })
      .reverse(); // most recent first
  }, [events, search, filterEffect]);

  const statLabels: Record<string, string> = {
    money: "Dinero",
    education: "Educación",
    health: "Salud",
    happiness: "Felicidad",
    relationships: "Relaciones",
    reputation: "Reputación",
    intelligence: "Inteligencia",
    charisma: "Carisma",
  };

  return (
    <div className="bg-surface-card border border-surface-card rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        🎯 <span>Historial de Decisiones</span>
        <span className="text-xs text-gray-500 font-normal">
          ({decisions.length})
        </span>
      </h3>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Buscar decisión..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 bg-surface-elevated border border-gray-700 rounded-lg text-sm text-foreground placeholder-gray-500 focus:outline-none focus:border-neon-purple/50 min-h-[44px] sm:min-h-0"
        />
        <div className="flex gap-1">
          {(["all", "positive", "negative"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterEffect(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterEffect === f
                  ? "bg-neon-purple text-white"
                  : "bg-surface-elevated text-gray-400 hover:text-white"
              }`}
            >
              {f === "all" ? "Todas" : f === "positive" ? "✅ Positivas" : "❌ Negativas"}
            </button>
          ))}
        </div>
      </div>

      {/* Decision list */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
        {decisions.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-4">
            {search ? "Sin resultados" : "Aún no has tomado decisiones"}
          </p>
        ) : (
          decisions.map((event, index) => {
            const effectEntries = Object.entries(event.effects).filter(
              ([, v]) => v !== undefined && v !== 0
            );
            return (
              <div
                key={`${event.age}-${event.month}-${index}`}
                className="p-3 rounded-lg bg-surface-elevated/50 border-l-2 border-neon-purple space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-foreground truncate">
                    {event.title}
                  </span>
                  <span className="text-[10px] text-gray-500 flex-shrink-0 bg-surface-card px-2 py-0.5 rounded-full">
                    {event.age} años
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {event.description}
                </p>
                {effectEntries.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {effectEntries.map(([stat, value]) => (
                      <span
                        key={stat}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          (value ?? 0) > 0
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {statLabels[stat] ?? stat} {(value ?? 0) > 0 ? "+" : ""}
                        {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
