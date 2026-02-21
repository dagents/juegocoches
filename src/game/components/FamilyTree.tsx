"use client";

import type { RelationshipInfo } from "../engine/GameState";

interface FamilyTreeProps {
  characterName: string;
  partner: RelationshipInfo | null;
  children: RelationshipInfo[];
  parents: { status: string; siblings: number };
  isMarried: boolean;
}

// Strength indicator bar
function StrengthBar({ value }: { value: number }) {
  const color =
    value >= 70 ? "bg-green-400" : value >= 40 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// Single person node
function PersonNode({
  name,
  subtitle,
  emoji,
  strength,
  highlight,
}: {
  name: string;
  subtitle?: string;
  emoji: string;
  strength?: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`inline-flex flex-col items-center px-3 py-2 rounded-xl border text-center min-w-[90px] max-w-[130px] ${
        highlight
          ? "bg-neon-purple/20 border-neon-purple/60 neon-glow-purple"
          : "bg-surface-elevated border-gray-700"
      }`}
    >
      <span className="text-xl">{emoji}</span>
      <p className="text-xs font-bold text-foreground truncate w-full">{name}</p>
      {subtitle && (
        <p className="text-[10px] text-gray-400">{subtitle}</p>
      )}
      {strength !== undefined && (
        <div className="w-full px-1">
          <StrengthBar value={strength} />
        </div>
      )}
    </div>
  );
}

// Vertical connector line
function VLine({ height = 24 }: { height?: number }) {
  return (
    <div
      className="mx-auto border-l-2 border-neon-cyan/40"
      style={{ height, width: 0 }}
    />
  );
}

// Horizontal connector line
function HLine() {
  return <div className="border-t-2 border-neon-cyan/40 flex-1 self-center" />;
}

// Visual family tree using CSS layout
export default function FamilyTree({
  characterName,
  partner,
  children,
  parents,
  isMarried,
}: FamilyTreeProps) {
  const parentStatusLabels: Record<string, string> = {
    united: "Familia unida",
    divorced: "Padres divorciados",
    single_parent: "Monoparental",
    orphanage: "Orfanato",
  };

  return (
    <div className="bg-surface-card border border-surface-card rounded-xl p-4 space-y-1">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
        🌳 <span>Árbol Familiar</span>
      </h3>

      <div className="flex flex-col items-center space-y-0">
        {/* Parents row */}
        <div className="flex items-end justify-center gap-4">
          <PersonNode
            name="Padre"
            subtitle={parentStatusLabels[parents.status] ?? parents.status}
            emoji="👨"
          />
          <PersonNode name="Madre" emoji="👩" />
        </div>

        {/* Connector from parents to player */}
        <VLine height={20} />

        {/* Siblings note */}
        {parents.siblings > 0 && (
          <p className="text-[10px] text-gray-500 text-center">
            +{parents.siblings} hermano{parents.siblings > 1 ? "s" : ""}
          </p>
        )}

        {/* Player + partner row */}
        <div className="flex items-center justify-center gap-2">
          <PersonNode
            name={characterName}
            subtitle="Tú"
            emoji="🧑"
            highlight
          />
          {partner && (
            <>
              <div className="flex items-center gap-1">
                <HLine />
                <span className="text-xs">{isMarried ? "💍" : "❤️"}</span>
                <HLine />
              </div>
              <PersonNode
                name={partner.name}
                subtitle={`${partner.age} años`}
                emoji="💑"
                strength={partner.strength}
              />
            </>
          )}
        </div>

        {/* Connector to children */}
        {children.length > 0 && (
          <>
            <VLine height={20} />
            {/* Children row */}
            <div className="flex flex-wrap items-start justify-center gap-3">
              {children.map((child) => (
                <PersonNode
                  key={child.id}
                  name={child.name}
                  subtitle={`${child.age} años`}
                  emoji={child.age < 13 ? "👶" : "🧒"}
                  strength={child.strength}
                />
              ))}
            </div>
          </>
        )}

        {children.length === 0 && (
          <p className="text-[10px] text-gray-500 mt-2">Sin hijos</p>
        )}
      </div>
    </div>
  );
}
