'use client';

import type { RelationshipInfo } from '@/game/engine/GameState';

interface RelationshipsPanelProps {
  partner: RelationshipInfo | null;
  children: RelationshipInfo[];
  relationships: RelationshipInfo[];
  isMarried: boolean;
}

function StrengthBar({ value }: { value: number }) {
  const color =
    value >= 70 ? 'bg-green-500' :
    value >= 40 ? 'bg-yellow-500' :
    'bg-red-500';
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export default function RelationshipsPanel({
  partner,
  children,
  relationships,
  isMarried,
}: RelationshipsPanelProps) {
  const friends = relationships.filter((r) => r.type === 'friend');
  const enemies = relationships.filter((r) => r.type === 'enemy');

  const hasAnything = partner || children.length > 0 || friends.length > 0 || enemies.length > 0;

  if (!hasAnything) {
    return (
      <div className="bg-surface-card rounded-xl p-4">
        <h3 className="text-foreground font-semibold text-sm mb-2">💞 Relaciones</h3>
        <p className="text-foreground/50 text-xs">Sin relaciones todavía.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-card rounded-xl p-4 space-y-3">
      <h3 className="text-foreground font-semibold text-sm">💞 Relaciones</h3>

      {/* Partner */}
      {partner && (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neon-pink">❤️</span>
            <span className="text-neon-pink font-medium">{partner.name}</span>
            <span className="text-foreground/50">
              ({partner.age} años){isMarried ? ' 💍' : ''}
            </span>
          </div>
          <StrengthBar value={partner.strength} />
        </div>
      )}

      {/* Children */}
      {children.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-foreground/70 text-xs font-medium">👶 Hijos</p>
          {children.map((child) => (
            <div key={child.id} className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-foreground">{child.name}</span>
                <span className="text-foreground/50">({child.age} años)</span>
              </div>
              <StrengthBar value={child.strength} />
            </div>
          ))}
        </div>
      )}

      {/* Friends */}
      {friends.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-foreground/70 text-xs font-medium">🤝 Amigos</p>
          {friends.slice(0, 5).map((f) => (
            <div key={f.id} className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-foreground">{f.name}</span>
                <span className="text-foreground/50">({f.age} años)</span>
              </div>
              <StrengthBar value={f.strength} />
            </div>
          ))}
          {friends.length > 5 && (
            <p className="text-foreground/40 text-xs">+{friends.length - 5} más</p>
          )}
        </div>
      )}

      {/* Enemies */}
      {enemies.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-foreground/70 text-xs font-medium">😠 Enemigos</p>
          {enemies.slice(0, 3).map((e) => (
            <div key={e.id} className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-foreground">{e.name}</span>
                <span className="text-foreground/50">({e.age} años)</span>
              </div>
              <StrengthBar value={e.strength} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
