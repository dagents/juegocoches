"use client";

import Link from "next/link";

export default function ProposeGameButton() {
  return (
    <div className="text-center">
      <Link
        href="/poll/proponer-juego"
        className="inline-flex items-center px-6 py-2.5 bg-neon-purple hover:bg-purple-600 text-white rounded-lg font-medium transition-colors neon-glow-purple"
      >
        Proponer Juego
      </Link>
    </div>
  );
}
