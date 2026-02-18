"use client";

import { AnimatePresence } from "framer-motion";
import { useRealtimeGameProposals } from "@/hooks/useRealtimeGameProposals";
import GameProposalCard from "@/components/game-proposals/GameProposalCard";
import type { GameProposalWithUser } from "@/types";

interface GameProposalListRealtimeProps {
  initialProposals: GameProposalWithUser[];
  currentUserId: string | null;
  hasVotedToday: boolean;
}

export default function GameProposalListRealtime({
  initialProposals,
  currentUserId,
  hasVotedToday,
}: GameProposalListRealtimeProps) {
  const { proposals } = useRealtimeGameProposals(initialProposals);

  if (proposals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🎮</div>
        <p className="text-gray-400">
          Aún no hay propuestas de juego. ¡Sé el primero en proponer!
        </p>
      </div>
    );
  }

  const approved = proposals.filter((p) => p.approved === true);
  const rejected = proposals.filter((p) => p.approved === false);

  return (
    <div className="space-y-6">
      {approved.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Propuestas Aprobadas ({approved.length})
          </h3>
          <AnimatePresence>
            {approved.map((proposal, index) => (
              <GameProposalCard
                key={proposal.id}
                proposal={proposal}
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
          {rejected.map((proposal, index) => (
            <GameProposalCard
              key={proposal.id}
              proposal={proposal}
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
