"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, ensureProfile } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

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

/** Get leaderboard — top scores */
export async function getLeaderboard(): Promise<
  ActionResult<
    {
      userId: string;
      score: number;
      currentAge: number;
      countryCode: string;
      isAlive: boolean;
    }[]
  >
> {
  try {
    const saves = await prisma.gameSave.findMany({
      orderBy: { score: "desc" },
      take: 20,
      select: {
        userId: true,
        score: true,
        currentAge: true,
        countryCode: true,
        isAlive: true,
      },
    });

    return { success: true, data: saves };
  } catch (error) {
    console.error("getLeaderboard error:", error);
    return { success: false, error: "Error al cargar el ranking." };
  }
}
