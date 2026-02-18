import Badge from "@/components/ui/Badge";
import type { DailyWinnerWithIdea } from "@/types";

interface ChangelogProps {
  winners: DailyWinnerWithIdea[];
}

export default function Changelog({ winners }: ChangelogProps) {
  if (winners.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          No hay ganadores anteriores aún.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {winners.map((winner) => (
        <div
          key={winner.id}
          className="p-3 rounded-lg bg-surface-card border border-surface-card"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300">{winner.idea.content}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-gray-500">
                  {winner.idea.user.displayName ?? "Anónimo"}
                </span>
                {winner.idea.category && (
                  <Badge variant="info">{winner.idea.category}</Badge>
                )}
                <span className="text-xs text-gray-600">
                  {new Date(winner.dayDate).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="text-sm font-bold text-neon-cyan">
                {winner.idea.votesCount}
              </span>
              <span className="text-xs text-gray-500 ml-1">votos</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
