import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const rawType = searchParams.get("type");
  const ALLOWED_TYPES = ["signup", "email"] as const;
  const type = ALLOWED_TYPES.includes(rawType as typeof ALLOWED_TYPES[number])
    ? (rawType as typeof ALLOWED_TYPES[number])
    : null;

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}/login?verified=true`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`);
}
