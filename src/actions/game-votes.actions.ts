"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, ensureProfile } from "@/lib/auth";
import { gameVoteSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getMadridDateToday, isGameVotingOpen } from "@/lib/dates";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

export async function castGameVote(formData: FormData): Promise<ActionResult> {
  try {
    // 1. Auth
    const user = await requireAuth();
    await ensureProfile(user);

    // 2. Check voting window
    if (!isGameVotingOpen()) {
      return {
        success: false,
        error: "El plazo para votar juegos ha terminado.",
      };
    }

    // 3. Rate limit
    const rl = checkRateLimit(user.id, "castGameVote");
    if (!rl.success) {
      return { success: false, error: "Demasiadas solicitudes." };
    }

    // 3. Validate
    const parsed = gameVoteSchema.safeParse({
      proposalId: formData.get("proposalId"),
    });
    if (!parsed.success) {
      return { success: false, error: "ID de propuesta no válido." };
    }
    const { proposalId } = parsed.data;

    const todayDate = getMadridDateToday();

    // 4. Already voted today?
    const existingVote = await prisma.gameVote.findFirst({
      where: { userId: user.id, proposalDate: todayDate },
    });
    if (existingVote) {
      return { success: false, error: "Ya has votado hoy." };
    }

    // 5. Proposal exists and approved?
    const proposal = await prisma.gameProposal.findFirst({
      where: {
        id: proposalId,
        approved: true,
      },
    });
    if (!proposal) {
      return { success: false, error: "Propuesta no encontrada o no aprobada." };
    }

    // 6. Can't vote own proposal
    if (proposal.userId === user.id) {
      return { success: false, error: "No puedes votar tu propia propuesta." };
    }

    // 7. Create vote (trigger handles votesCount)
    await prisma.gameVote.create({
      data: {
        userId: user.id,
        proposalId,
        proposalDate: todayDate,
      },
    });

    // 8. Revalidate
    revalidatePath("/poll");

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Debes iniciar sesión." };
    }
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return { success: false, error: "Ya has votado hoy." };
    }
    console.error("castGameVote error:", error);
    return { success: false, error: "Error interno." };
  }
}
