"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { IdeaWithUser } from "@/types";

export function useRealtimeIdeas(initialIdeas: IdeaWithUser[]) {
  const [ideas, setIdeas] = useState(initialIdeas);

  // Update when server-fetched data changes (revalidation)
  useEffect(() => {
    setIdeas(initialIdeas);
  }, [initialIdeas]);

  const handleVoteUpdate = useCallback((ideaId: string) => {
    setIdeas((prev) =>
      prev
        .map((idea) =>
          idea.id === ideaId
            ? { ...idea, votesCount: idea.votesCount + 1 }
            : idea
        )
        .sort((a, b) => b.votesCount - a.votesCount)
    );
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("ideas-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ideas",
        },
        (payload) => {
          const updated = payload.new as { id: string; votes_count: number };
          setIdeas((prev) =>
            prev
              .map((idea) =>
                idea.id === updated.id
                  ? { ...idea, votesCount: updated.votes_count }
                  : idea
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
          table: "ideas",
        },
        () => {
          // On new idea, just trigger a page refresh for simplicity
          // since we need the user data joined
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { ideas, handleVoteUpdate };
}
