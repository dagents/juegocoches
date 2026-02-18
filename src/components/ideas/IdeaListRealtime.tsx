"use client";

import { AnimatePresence } from "framer-motion";
import { useRealtimeIdeas } from "@/hooks/useRealtimeIdeas";
import IdeaCard from "@/components/ideas/IdeaCard";
import type { IdeaWithUser } from "@/types";

interface IdeaListRealtimeProps {
  initialIdeas: IdeaWithUser[];
  currentUserId: string | null;
  hasVotedToday: boolean;
}

export default function IdeaListRealtime({
  initialIdeas,
  currentUserId,
  hasVotedToday,
}: IdeaListRealtimeProps) {
  const { ideas } = useRealtimeIdeas(initialIdeas);

  if (ideas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">💡</div>
        <p className="text-gray-400">
          Aún no hay ideas hoy. ¡Sé el primero en proponer!
        </p>
      </div>
    );
  }

  // Split approved and rejected
  const approved = ideas.filter((i) => i.approved === true);
  const rejected = ideas.filter((i) => i.approved === false);

  return (
    <div className="space-y-6">
      {approved.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Ideas Aprobadas ({approved.length})
          </h3>
          <AnimatePresence>
            {approved.map((idea, index) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                rank={index + 1}
                hasVotedToday={hasVotedToday}
                currentUserId={currentUserId}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {rejected.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Rechazadas ({rejected.length})
          </h3>
          {rejected.map((idea, index) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              rank={approved.length + index + 1}
              hasVotedToday={hasVotedToday}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
