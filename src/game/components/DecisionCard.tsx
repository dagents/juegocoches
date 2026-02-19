"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Decision } from "@/game/data/decisions";

interface DecisionCardProps {
  decision: Decision;
  onChoose: (choiceIndex: number) => void;
  disabled?: boolean;
}

export default function DecisionCard({
  decision,
  onChoose,
  disabled = false,
}: DecisionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleChoose = (index: number) => {
    if (disabled || selected) return;
    setSelected(String(index));
    // Small delay for visual feedback before processing
    setTimeout(() => onChoose(index), 300);
  };

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, string> = {
      education: "📚",
      career: "💼",
      relationships: "❤️",
      finance: "💸",
      health: "🏥",
      lifestyle: "🎯",
      risk: "🎲",
      personal: "🧘",
      social: "🎉",
    };
    return icons[cat] ?? "❓";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="bg-surface-card border border-neon-purple/30 rounded-xl p-5 space-y-4 neon-glow-purple"
    >
      {/* Question */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getCategoryIcon(decision.category)}</span>
          <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            {decision.category}
          </span>
        </div>
        <p className="text-foreground font-medium leading-relaxed">
          {decision.text}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {decision.options.map((option, index) => {
          const optKey = String(index);
          const isSelected = selected === optKey;
          const isHovered = hoveredId === optKey;
          const isDisabledOption = disabled || (selected !== null && !isSelected);

          return (
            <motion.button
              key={index}
              layout
              onClick={() => handleChoose(index)}
              onMouseEnter={() => setHoveredId(optKey)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={isDisabledOption}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                isSelected
                  ? "border-neon-cyan bg-neon-cyan/10 text-foreground"
                  : isHovered && !isDisabledOption
                  ? "border-neon-purple/50 bg-surface-elevated text-foreground"
                  : isDisabledOption
                  ? "border-surface-card bg-surface opacity-40 cursor-not-allowed"
                  : "border-surface-card bg-surface-elevated text-gray-300 hover:text-foreground"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5">
                  {isSelected ? "✓" : "›"}
                </span>
                <span className="text-sm leading-relaxed">{option.text}</span>
              </div>

              {/* Show success chance if applicable */}
              {option.successChance !== undefined && option.successChance < 1 && isHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 ml-5 text-xs text-gray-500"
                >
                  ⚡ {Math.round(option.successChance * 100)}% probabilidad de éxito
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
