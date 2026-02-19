"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, ensureProfile } from "@/lib/auth";
import { ideaSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { moderateIdea } from "@/lib/moderation";
import { getMadridDateToday, isBeforeMadridNoon } from "@/lib/dates";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

export async function submitIdea(
  formData: FormData
): Promise<ActionResult<{ id: string; approved: boolean | null }>> {
  try {
    // 1. Auth
    const user = await requireAuth();
    await ensureProfile(user);

    // 2. Check proposal window (before noon Madrid)
    if (!isBeforeMadridNoon()) {
      return {
        success: false,
        error: "Las propuestas de mejora se aceptan hasta las 12:00. A partir de ahora solo se puede votar.",
      };
    }

    // 3. Rate limit
    const rl = checkRateLimit(user.id, "submitIdea");
    if (!rl.success) {
      return {
        success: false,
        error: `Demasiadas solicitudes. Intenta en ${Math.ceil((rl.retryAfterMs ?? 0) / 1000)}s.`,
      };
    }

    // 3. Validate input
    const parsed = ideaSchema.safeParse({ content: formData.get("content") });
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Contenido no válido",
      };
    }
    const { content } = parsed.data;

    // 4. Check daily limit
    const todayDate = getMadridDateToday();
    const existingIdea = await prisma.idea.findFirst({
      where: { userId: user.id, dayDate: todayDate },
    });
    if (existingIdea) {
      return { success: false, error: "Ya has propuesto una mejora hoy." };
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
    const moderation = await moderateIdea(content);

    // 7. Create idea
    const idea = await prisma.idea.create({
      data: {
        userId: user.id,
        content,
        approved: moderation.approved,
        rejectionReason: moderation.approved ? null : moderation.reason,
        category: moderation.category,
        dayDate: todayDate,
      },
    });

    // 8. Revalidate
    revalidatePath("/poll");

    return {
      success: true,
      data: { id: idea.id, approved: idea.approved },
    };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Debes iniciar sesión." };
    }
    // Unique constraint violation
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return { success: false, error: "Ya has propuesto una mejora hoy." };
    }
    console.error("submitIdea error:", error);
    return { success: false, error: "Error interno. Inténtalo de nuevo." };
  }
}
