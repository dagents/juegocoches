"use client";

import { motion } from "framer-motion";

export interface SaveSlot {
  slot: number;
  characterName?: string;
  age?: number;
  country?: string;
}

interface SaveSlotPickerProps {
  slots: SaveSlot[];
  onSelect: (slot: number, hasData: boolean) => void;
}

const SLOT_LABELS = ["Vida 1", "Vida 2", "Vida 3"];

// Save slot picker UI — lets the user choose between 3 save slots
export default function SaveSlotPicker({ slots, onSelect }: SaveSlotPickerProps) {
  // Build a map for quick lookup
  const slotMap = new Map(slots.map((s) => [s.slot, s]));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">💾 Elige una partida</h2>
          <p className="text-sm text-gray-400">
            Selecciona una ranura para continuar o empezar una nueva vida
          </p>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((slotNum, i) => {
            const data = slotMap.get(slotNum);
            const hasData = !!(data?.characterName);

            return (
              <motion.button
                key={slotNum}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => onSelect(slotNum, hasData)}
                className="w-full p-4 bg-surface-card border border-surface-card hover:border-neon-purple/50 rounded-xl transition-all group text-left min-h-[80px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {hasData ? "👤" : "➕"}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-neon-purple transition-colors">
                        {SLOT_LABELS[i]}
                      </p>
                      {hasData ? (
                        <p className="text-xs text-gray-400">
                          {data!.characterName} · {data!.age} años · {data!.country}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 italic">Vacío</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 group-hover:text-neon-purple transition-colors">
                    {hasData ? "Continuar →" : "Nueva vida →"}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
