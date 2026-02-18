"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GameProposalWithUser } from "@/types";

export function useRealtimeGameProposals(initialProposals: GameProposalWithUser[]) {
  const [proposals, setProposals] = useState(initialProposals);

  // Update when server-fetched data changes (revalidation)
  useEffect(() => {
    setProposals(initialProposals);
  }, [initialProposals]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("game-proposals-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_proposals",
        },
        (payload) => {
          const updated = payload.new as { id: string; votes_count: number };
          setProposals((prev) =>
            prev
              .map((p) =>
                p.id === updated.id
                  ? { ...p, votesCount: updated.votes_count }
                  : p
              )
              .sort((a, b) => b.votesCount - a.votesCount)
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "game_proposals",
        },
        () => {
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { proposals };
}
