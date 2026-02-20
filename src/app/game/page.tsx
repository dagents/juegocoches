import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startNewGame, saveGameState, getLeaderboard, submitScore } from "@/actions/game.actions";
import GameLayout from "@/game/components/GameLayout";
import GameChangelog from "@/game/components/GameChangelog";
import type { GameState } from "@/game/engine/GameState";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Force Node.js runtime, not edge

export default async function GamePage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  let initialState: GameState | null = null;
  let leaderboardEntries: Awaited<ReturnType<typeof getLeaderboard>>["data"] = [];

  try {
    // Load existing save
    const save = await prisma.gameSave.findUnique({
      where: { userId: user.id },
    });
    initialState = save?.gameState as unknown as GameState | null;
  } catch (e) {
    console.error("Failed to load game save:", e);
  }

  try {
    // Fetch leaderboard server-side
    const leaderboardResult = await getLeaderboard();
    leaderboardEntries = leaderboardResult.success && leaderboardResult.data ? leaderboardResult.data : [];
  } catch (e) {
    console.error("Failed to load leaderboard:", e);
  }

  async function handleSubmitScore(score: number, biography: string) {
    "use server";
    await submitScore(score, biography);
  }

  async function handleSave(state: GameState) {
    "use server";
    await saveGameState(JSON.parse(JSON.stringify(state)) as Prisma.InputJsonValue);
  }

  async function handleNewGame(state: GameState) {
    "use server";
    await startNewGame(JSON.parse(JSON.stringify(state)) as Prisma.InputJsonValue);
  }

  return (
    <div className="min-h-[80vh] py-4 space-y-6">
      <GameLayout
        initialState={initialState}
        onSave={handleSave}
        onNewGame={handleNewGame}
        leaderboardEntries={leaderboardEntries ?? []}
        onSubmitScore={handleSubmitScore}
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <GameChangelog />
      </div>
    </div>
  );
}
