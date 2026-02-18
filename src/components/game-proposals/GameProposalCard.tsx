"use client";

import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import GameVoteButton from "@/components/game-proposals/GameVoteButton";
import VoteCount from "@/components/votes/VoteCount";
import type { GameProposalWithUser } from "@/types";

interface GameProposalCardProps {
  proposal: GameProposalWithUser;
  rank: number;
  hasVotedToday: boolean;
  currentUserId: string | null;
}

export default function GameProposalCard({
  proposal,
  rank,
  hasVotedToday,
  currentUserId,
}: GameProposalCardProps) {
  const isApproved = proposal.approved === true;
  const isRejected = proposal.approved === false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-xl border transition-all ${
        isRejected
          ? "bg-surface-card/50 border-gray-800 opacity-60"
          : "bg-surface-card border-surface-card hover:border-neon-purple/30"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Rank */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-sm font-bold text-gray-400">
          {rank}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold leading-tight ${
              isRejected ? "text-gray-500" : "text-gray-100"
            }`}
          >
            {proposal.title}
          </h3>
          <p
            className={`text-xs leading-relaxed mt-1 ${
              isRejected ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {proposal.description}
          </p>

          <div className="flex items-center flex-wrap gap-2 mt-2">
            <span className="text-xs text-gray-500">
              {proposal.user.displayName ?? "Anónimo"}
            </span>

            {proposal.category && (
              <Badge variant="info">{proposal.category}</Badge>
            )}

            {isApproved && <Badge variant="success">Aprobada</Badge>}

            {isRejected && (
              <Badge variant="danger">Rechazada</Badge>
            )}
          </div>

          {isRejected && proposal.rejectionReason && (
            <p className="text-xs text-red-400/70 mt-1.5 italic">
              Motivo: {proposal.rejectionReason}
            </p>
          )}
        </div>

        {/* Vote section */}
        {isApproved && (
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <VoteCount count={proposal.votesCount} />
            <GameVoteButton
              proposalId={proposal.id}
              hasVotedToday={hasVotedToday}
              isOwnProposal={proposal.userId === currentUserId}
              isLoggedIn={!!currentUserId}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
