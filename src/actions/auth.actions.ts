"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ActionResult } from "@/types";

export async function signUp(formData: FormData): Promise<ActionResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos" };
  }

  const { email, password, displayName } = parsed.data;

  const rl = checkRateLimit(email, "auth");
  if (!rl.success) {
    return {
      success: false,
      error: `Demasiados intentos. Espera ${Math.ceil((rl.retryAfterMs ?? 0) / 1000)}s.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        full_name: displayName,
      },
    },
  });

  if (error) {
    // Generic message to prevent email enumeration
    if (error.message.includes("already registered")) {
      return { success: true };
    }
    return { success: false, error: "Error al crear la cuenta. Inténtalo de nuevo." };
  }

  return { success: true };
}

export async function signIn(formData: FormData): Promise<ActionResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos" };
  }

  const { email, password } = parsed.data;

  const rl = checkRateLimit(email, "auth");
  if (!rl.success) {
    return {
      success: false,
      error: `Demasiados intentos. Espera ${Math.ceil((rl.retryAfterMs ?? 0) / 1000)}s.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: "Email o contraseña incorrectos." };
  }

  redirect("/poll");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth_failed");
  }

  redirect(data.url);
}
