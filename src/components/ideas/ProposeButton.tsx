"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const MADRID_TZ = "Europe/Madrid";

function isMadridBeforeNoon(): boolean {
  const now = new Date();
  const madridNow = new Date(
    now.toLocaleString("en-US", { timeZone: MADRID_TZ })
  );
  return madridNow.getHours() < 12;
}

export default function ProposeButton() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(isMadridBeforeNoon());
    const interval = setInterval(() => {
      setOpen(isMadridBeforeNoon());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (open === null) return null;

  if (!open) {
    return (
      <div className="text-center">
        <span className="inline-flex items-center px-6 py-2.5 bg-gray-700 text-gray-400 rounded-lg font-medium cursor-not-allowed">
          Mejoras cerradas (hasta mañana a las 00:00)
        </span>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Link
        href="/proponer"
        className="inline-flex items-center px-6 py-2.5 bg-neon-purple hover:bg-purple-600 text-white rounded-lg font-medium transition-colors neon-glow-purple"
      >
        Proponer Mejora del Día
      </Link>
    </div>
  );
}
