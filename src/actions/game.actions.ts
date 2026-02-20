"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, ensureProfile } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";
import type { LeaderboardEntry } from "@/game/components/Leaderboard";

import type { Prisma } from "@prisma/client";

type GameStateJSON = Prisma.InputJsonValue;

/** Start a new game — save initial state to DB */
export async function startNewGame(
  gameState: GameStateJSON
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireAuth();
    await ensureProfile(user);

    const state = gameState as Record<string, unknown>;

    // Delete existing save if any
    await prisma.gameSave.deleteMany({
      where: { userId: user.id },
    });

    // Create new save
    const save = await prisma.gameSave.create({
      data: {
        userId: user.id,
        gameState: gameState as Prisma.InputJsonValue,
        currentAge: (state.currentAge as number) ?? 0,
        currentMonth: (state.currentMonth as number) ?? 1,
        isAlive: true,
        score: 0,
        countryCode: (state.countryCode as string) ?? "XX",
      },
    });

    revalidatePath("/game");
    return { success: true, data: { id: save.id } };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Debes iniciar sesión." };
    }
    console.error("startNewGame error:", error);
    return { success: false, error: "Error al crear la partida." };
  }
}

/** Save game state after each turn */
export async function saveGameState(
  gameState: GameStateJSON
): Promise<ActionResult> {
  try {
    const user = await requireAuth();

    const state = gameState as Record<string, unknown>;
    const currentAge = (state.currentAge as number) ?? 0;
    const currentMonth = (state.currentMonth as number) ?? 1;
    const isAlive = (state.isAlive as boolean) ?? true;

    // Calculate score from stats
    const stats = state.stats as Record<string, number> | undefined;
    let score = 0;
    if (stats) {
      const avgStats =
        (stats.money +
          stats.education +
          stats.health +
          stats.happiness +
          stats.relationships +
          stats.reputation +
          stats.intelligence +
          stats.charisma) /
        8;
      score = Math.round(avgStats * 3 + currentAge * 2);
    }

    await prisma.gameSave.upsert({
      where: { userId: user.id },
      update: {
        gameState: gameState as Prisma.InputJsonValue,
        currentAge,
        currentMonth,
        isAlive,
        score,
      },
      create: {
        userId: user.id,
        gameState: gameState as Prisma.InputJsonValue,
        currentAge,
        currentMonth,
        isAlive,
        score,
        countryCode: (state.countryCode as string) ?? "XX",
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Debes iniciar sesión." };
    }
    console.error("saveGameState error:", error);
    return { success: false, error: "Error al guardar." };
  }
}

/** Load existing game save */
export async function loadGameSave(): Promise<
  ActionResult<{ gameState: GameStateJSON } | null>
> {
  try {
    const user = await requireAuth();

    const save = await prisma.gameSave.findUnique({
      where: { userId: user.id },
    });

    if (!save) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: { gameState: save.gameState as GameStateJSON },
    };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Debes iniciar sesión." };
    }
    console.error("loadGameSave error:", error);
    return { success: false, error: "Error al cargar la partida." };
  }
}

/** Get leaderboard — top 20 finished games with score */
export async function getLeaderboard(): Promise<
  ActionResult<LeaderboardEntry[]>
> {
  try {
    const saves = await prisma.gameSave.findMany({
      where: { score: { gt: 0 } },
      orderBy: { score: "desc" },
      take: 20,
      include: {
        user: { select: { displayName: true } },
      },
    });

    const entries: LeaderboardEntry[] = saves.map((save, i) => {
      const gs = save.gameState as Record<string, unknown>;
      const grade = getGradeFromScore(save.score);

      return {
        rank: i + 1,
        characterName:
          (gs.characterName as string) ??
          save.user.displayName ??
          "Desconocido",
        score: save.score,
        grade,
        age: save.currentAge,
        country: (gs.countryName as string) ?? save.countryCode,
        career: (gs.career as Record<string, unknown>)?.name as string | null ?? null,
        biography: save.biography ?? "",
        createdAt: save.updatedAt.toISOString(),
      };
    });

    return { success: true, data: entries };
  } catch (error) {
    console.error("getLeaderboard error:", error);
    return { success: false, error: "Error al cargar el ranking." };
  }
}

/** Submit final score and biography for the current user's game */
export async function submitScore(
  score: number,
  biography: string
): Promise<ActionResult> {
  try {
    const user = await requireAuth();

    await prisma.gameSave.update({
      where: { userId: user.id },
      data: { score, biography },
    });

    revalidatePath("/game");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Debes iniciar sesión." };
    }
    console.error("submitScore error:", error);
    return { success: false, error: "Error al enviar puntuación." };
  }
}

// Helper to map score to grade letter
function getGradeFromScore(score: number): string {
  if (score >= 800) return "S";
  if (score >= 600) return "A";
  if (score >= 400) return "B";
  if (score >= 250) return "C";
  if (score >= 100) return "D";
  return "F";
}
