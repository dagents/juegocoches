import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startNewGame, saveGameState } from "@/actions/game.actions";
import GameLayout from "@/game/components/GameLayout";
import GameChangelog from "@/game/components/GameChangelog";
import type { GameState } from "@/game/engine/GameState";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function GamePage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  // Load existing save
  const save = await prisma.gameSave.findUnique({
    where: { userId: user.id },
  });

  const initialState = save?.gameState as unknown as GameState | null;

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
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <GameChangelog />
      </div>
    </div>
  );
}
