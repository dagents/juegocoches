"use client";

import { useTransition } from "react";
import { castGameVote } from "@/actions/game-votes.actions";
import { toast } from "sonner";

interface GameVoteButtonProps {
  proposalId: string;
  hasVotedToday: boolean;
  isOwnProposal: boolean;
  isLoggedIn: boolean;
}

export default function GameVoteButton({
  proposalId,
  hasVotedToday,
  isOwnProposal,
  isLoggedIn,
}: GameVoteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const disabled = !isLoggedIn || hasVotedToday || isOwnProposal || isPending;

  function handleVote() {
    if (disabled) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.set("proposalId", proposalId);
      const result = await castGameVote(formData);
      if (result.success) {
        toast.success("Voto registrado");
      } else {
        toast.error(result.error ?? "Error al votar");
      }
    });
  }

  let tooltip = "Votar";
  if (!isLoggedIn) tooltip = "Inicia sesión para votar";
  if (hasVotedToday) tooltip = "Ya has votado hoy";
  if (isOwnProposal) tooltip = "No puedes votar tu propia propuesta";

  return (
    <button
      onClick={handleVote}
      disabled={disabled}
      title={tooltip}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        disabled
          ? "bg-surface-elevated text-gray-500 cursor-not-allowed"
          : "bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 hover:neon-glow-purple active:scale-95"
      }`}
    >
      {isPending ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      )}
      Votar
    </button>
  );
}
