"use client";

import { motion } from "framer-motion";
import type { LifeEvent } from "../engine/GameState";

interface TimelineProps {
  events: LifeEvent[];
  maxEvents?: number;
}

export default function Timeline({ events, maxEvents = 15 }: TimelineProps) {
  // Show most recent events first
  const displayEvents = events.slice(-maxEvents).reverse();

  const getEventIcon = (type: LifeEvent["type"]) => {
    const icons: Record<string, string> = {
      decision: "🎯",
      event: "⚡",
      career: "💼",
      relationship: "❤️",
      milestone: "🏆",
    };
    return icons[type] ?? "📌";
  };

  const getEventColor = (type: LifeEvent["type"]) => {
    const colors: Record<string, string> = {
      decision: "border-neon-purple",
      event: "border-neon-cyan",
      career: "border-yellow-500",
      relationship: "border-pink-500",
      milestone: "border-green-500",
    };
    return colors[type] ?? "border-gray-500";
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        Tu historia acaba de comenzar...
      </div>
    );
  }

  return (
    <div className="bg-surface-card border border-surface-card rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        📜 <span>Tu Historia</span>
        <span className="text-xs text-gray-500 font-normal">
          ({events.length} eventos)
        </span>
      </h3>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
        {displayEvents.map((event, index) => (
          <motion.div
            key={`${event.age}-${event.month}-${event.title}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`flex items-start gap-3 p-2 rounded-lg border-l-2 ${getEventColor(
              event.type
            )} bg-surface-elevated/50`}
          >
            <span className="text-sm flex-shrink-0 mt-0.5">
              {getEventIcon(event.type)}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground truncate">
                  {event.title}
                </span>
                <span className="text-[10px] text-gray-500 flex-shrink-0">
                  {event.age} años
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {event.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
