"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { voteSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getMadridDateToday } from "@/lib/dates";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

export async function castVote(formData: FormData): Promise<ActionResult> {
  try {
    // 1. Auth
    const user = await requireAuth();

    // 2. Rate limit
    const rl = checkRateLimit(user.id, "castVote");
    if (!rl.success) {
      return { success: false, error: "Demasiadas solicitudes." };
    }

    // 3. Validate
    const parsed = voteSchema.safeParse({ ideaId: formData.get("ideaId") });
    if (!parsed.success) {
      return { success: false, error: "ID de idea no válido." };
    }
    const { ideaId } = parsed.data;

    const todayDate = getMadridDateToday();

    // 4. Already voted today?
    const existingVote = await prisma.vote.findFirst({
      where: { userId: user.id, dayDate: todayDate },
    });
    if (existingVote) {
      return { success: false, error: "Ya has votado hoy." };
    }

    // 5. Idea exists, approved, from today?
    const idea = await prisma.idea.findFirst({
      where: {
        id: ideaId,
        approved: true,
        dayDate: todayDate,
      },
    });
    if (!idea) {
      return { success: false, error: "Idea no encontrada o no aprobada." };
    }

    // 6. Can't vote own idea
    if (idea.userId === user.id) {
      return { success: false, error: "No puedes votar tu propia idea." };
    }

    // 7. Create vote (trigger handles votesCount)
    await prisma.vote.create({
      data: {
        userId: user.id,
        ideaId,
        dayDate: todayDate,
      },
    });

    // 8. Revalidate
    revalidatePath("/");

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
    console.error("castVote error:", error);
    return { success: false, error: "Error interno." };
  }
}
