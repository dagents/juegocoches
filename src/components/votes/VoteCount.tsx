"use client";

import { motion, AnimatePresence } from "framer-motion";

interface VoteCountProps {
  count: number;
}

export default function VoteCount({ count }: VoteCountProps) {
  return (
    <div className="flex items-center gap-1">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={count}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-lg font-bold text-neon-cyan tabular-nums"
        >
          {count}
        </motion.span>
      </AnimatePresence>
      <span className="text-xs text-gray-500">
        {count === 1 ? "voto" : "votos"}
      </span>
    </div>
  );
}
