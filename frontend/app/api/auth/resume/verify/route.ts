import { NextResponse } from "next/server";

import { verifyResumeToken } from "../../../../../lib/auth/resume-token";
import { getSupabaseServer } from "@/lib/supabase/server";

const jsonError = (status: number, code: string, message: string) =>
  NextResponse.json(
    {
      data: null,
      error: { code, message },
    },
    { status }
  );

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { token?: string } | null;
  const token = body?.token?.trim();
  if (!token) {
    return jsonError(400, "missing_token", "Resume token is required.");
  }

  const secret = process.env.AUTH_RESUME_SECRET;
  if (!secret) {
    return jsonError(500, "missing_config", "Resume setup is unavailable.");
  }

  const verification = verifyResumeToken(token, { secret });
  if (!verification.valid) {
    return jsonError(400, "invalid_token", "Resume link is invalid or expired.");
  }

  let supabase: ReturnType<typeof getSupabaseServer>;
  try {
    supabase = getSupabaseServer();
  } catch (error) {
    console.error("Missing Supabase configuration.", error);
    return jsonError(500, "missing_config", "Resume setup is unavailable.");
  }

  const { data: payments, error: paymentError } = await supabase
    .from("payments")
    .select("id,email,stripe_session_id")
    .eq("stripe_session_id", verification.payload.stripe_session_id)
    .eq("email", verification.payload.email)
    .eq("status", "paid")
    .limit(1);

  if (paymentError) {
    console.warn("Unable to verify paid payment for resume token.", paymentError);
    return jsonError(500, "resume_failed", "Unable to validate resume link.");
  }

  if (!payments || payments.length === 0 || !payments[0]?.id) {
    return jsonError(400, "invalid_token", "Resume link is invalid or expired.");
  }

  const { data: links, error: linksError } = await supabase
    .from("user_payment_links")
    .select("id")
    .eq("payment_id", payments[0].id)
    .limit(1);

  if (linksError) {
    console.warn("Unable to verify linkage status for resume token.", linksError);
    return jsonError(500, "resume_failed", "Unable to validate resume link.");
  }

  if (links && links.length > 0) {
    return jsonError(409, "already_linked", "Account setup is already complete for this payment.");
  }

  return NextResponse.json({
    data: {
      email: verification.payload.email,
      stripe_session_id: verification.payload.stripe_session_id,
    },
    error: null,
  });
}
