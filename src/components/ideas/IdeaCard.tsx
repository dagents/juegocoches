"use client";

import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import VoteButton from "@/components/votes/VoteButton";
import VoteCount from "@/components/votes/VoteCount";
import type { IdeaWithUser } from "@/types";

interface IdeaCardProps {
  idea: IdeaWithUser;
  rank: number;
  hasVotedToday: boolean;
  currentUserId: string | null;
}

export default function IdeaCard({
  idea,
  rank,
  hasVotedToday,
  currentUserId,
}: IdeaCardProps) {
  const isApproved = idea.approved === true;
  const isRejected = idea.approved === false;

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
          <p
            className={`text-sm leading-relaxed ${
              isRejected ? "text-gray-500" : "text-gray-200"
            }`}
          >
            {idea.content}
          </p>

          <div className="flex items-center flex-wrap gap-2 mt-2">
            <span className="text-xs text-gray-500">
              {idea.user.displayName ?? "Anónimo"}
            </span>

            {idea.category && (
              <Badge variant="info">{idea.category}</Badge>
            )}

            {isApproved && <Badge variant="success">Aprobada</Badge>}

            {isRejected && (
              <Badge variant="danger">Rechazada</Badge>
            )}
          </div>

          {isRejected && idea.rejectionReason && (
            <p className="text-xs text-red-400/70 mt-1.5 italic">
              Motivo: {idea.rejectionReason}
            </p>
          )}
        </div>

        {/* Vote section */}
        {isApproved && (
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <VoteCount count={idea.votesCount} />
            <VoteButton
              ideaId={idea.id}
              hasVotedToday={hasVotedToday}
              isOwnIdea={idea.userId === currentUserId}
              isLoggedIn={!!currentUserId}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
