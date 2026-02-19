"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, ensureProfile } from "@/lib/auth";
import { gameProposalSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { moderateGameProposal } from "@/lib/moderation";
import { getMadridDateToday, isGameVotingOpen } from "@/lib/dates";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

export async function submitGameProposal(
  formData: FormData
): Promise<ActionResult<{ id: string; approved: boolean | null }>> {
  try {
    // 1. Auth
    const user = await requireAuth();
    await ensureProfile(user);

    // 2. Check voting window
    if (!isGameVotingOpen()) {
      return {
        success: false,
        error: "El plazo para proponer juegos ha terminado.",
      };
    }

    // 3. Rate limit
    const rl = checkRateLimit(user.id, "submitGameProposal");
    if (!rl.success) {
      return {
        success: false,
        error: `Demasiadas solicitudes. Intenta en ${Math.ceil((rl.retryAfterMs ?? 0) / 1000)}s.`,
      };
    }

    // 3. Validate input
    const parsed = gameProposalSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
    });
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Contenido no válido",
      };
    }
    const { title, description } = parsed.data;

    // 4. Check daily limit (one proposal per user per day)
    const todayDate = getMadridDateToday();
    const existingProposal = await prisma.gameProposal.findFirst({
      where: { userId: user.id, proposalDate: todayDate },
    });
    if (existingProposal) {
      return { success: false, error: "Ya has propuesto un juego hoy." };
    }

    // 5. Daily API limit (3 moderation calls per 24h)
    const apiRl = checkRateLimit(user.id, "moderationApi");
    if (!apiRl.success) {
      return {
        success: false,
        error: "Has alcanzado el límite diario de moderación (3/día). Inténtalo mañana.",
      };
    }

    // 6. AI Moderation
    const moderation = await moderateGameProposal(title, description);

    // 7. Create proposal
    const proposal = await prisma.gameProposal.create({
      data: {
        userId: user.id,
        title,
        description,
        approved: moderation.approved,
        rejectionReason: moderation.approved ? null : moderation.reason,
        category: moderation.category,
        proposalDate: todayDate,
      },
    });

    // 8. Revalidate
    revalidatePath("/poll");

    return {
      success: true,
      data: { id: proposal.id, approved: proposal.approved },
    };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Debes iniciar sesión." };
    }
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return { success: false, error: "Ya has propuesto un juego hoy." };
    }
    console.error("submitGameProposal error:", error);
    return { success: false, error: "Error interno. Inténtalo de nuevo." };
  }
}
