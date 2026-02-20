"use client";

import { useState } from "react";
import { CHANGELOG, type ChangelogEntry } from "@/game/data/changelog";

function VersionCard({ entry, defaultOpen }: { entry: ChangelogEntry; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  const dateStr = new Date(entry.date + "T00:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="border border-surface-card rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 bg-surface-card hover:bg-surface-elevated transition-colors flex items-center gap-3 min-h-[56px]"
      >
        <div className="flex-shrink-0">
          <span className="inline-block px-2.5 py-1 bg-neon-purple/20 text-neon-purple text-xs font-bold rounded-lg">
            v{entry.version}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
            {entry.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{dateStr}</p>
        </div>
        {entry.highlight && (
          <span className="hidden sm:block text-xs text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded-lg flex-shrink-0">
            {entry.highlight}
          </span>
        )}
        <span className={`text-gray-500 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Content — collapsible */}
      {open && (
        <div className="p-4 pt-2 space-y-2 bg-surface/50">
          {entry.highlight && (
            <p className="sm:hidden text-xs text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded-lg inline-block mb-2">
              {entry.highlight}
            </p>
          )}
          <ul className="space-y-1.5">
            {entry.changes.map((change, i) => (
              <li key={i} className="text-sm text-gray-300 leading-relaxed pl-1">
                {change}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function GameChangelog() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold gradient-text">📋 Changelog del Juego</h2>
        <span className="text-xs text-gray-500">
          {CHANGELOG.length} versiones
        </span>
      </div>
      <div className="space-y-2">
        {CHANGELOG.map((entry, i) => (
          <VersionCard key={entry.version} entry={entry} defaultOpen={i === 0} />
        ))}
      </div>
    </div>
  );
}
