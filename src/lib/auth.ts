import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@supabase/supabase-js";

export async function getAuthUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function requireAuth(): Promise<User> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/**
 * Ensures the user has a profile row in the database.
 * The DB trigger should handle this on sign-up, but this
 * acts as a fallback for edge cases (e.g. trigger failure,
 * users created before the trigger existed).
 */
export async function ensureProfile(user: User): Promise<void> {
  await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email ?? "",
      displayName:
        user.user_metadata?.display_name ??
        user.user_metadata?.full_name ??
        user.email?.split("@")[0] ??
        null,
      avatarUrl: user.user_metadata?.avatar_url ?? null,
    },
  });
}
