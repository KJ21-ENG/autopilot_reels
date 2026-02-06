import { NextResponse } from "next/server";
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
  let body: { email?: string; stripe_session_id?: string } | null = null;

  try {
    body = await request.json();
  } catch (error) {
    console.error("Checkout email validation request missing JSON body.", error);
    return jsonError(400, "invalid_request", "Invalid request payload.");
  }

  const email = body?.email?.trim().toLowerCase();
  const stripeSessionId = body?.stripe_session_id?.trim();

  if (!email || !stripeSessionId) {
    return jsonError(400, "invalid_request", "Email and session ID are required.");
  }

  let supabase: ReturnType<typeof getSupabaseServer>;
  try {
    supabase = getSupabaseServer();
  } catch (error) {
    console.error("Missing Supabase configuration.", error);
    return jsonError(500, "missing_config", "Server configuration is incomplete.");
  }

  const { data, error } = await supabase
    .from("payments")
    .select("email")
    .eq("stripe_session_id", stripeSessionId)
    .eq("status", "paid")
    .limit(1);

  if (error) {
    console.warn("Unable to validate checkout ownership.", error);
    return jsonError(500, "validation_failed", "Unable to verify checkout ownership.");
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ data: { payment_found: false, match: false }, error: null });
  }

  const paymentEmail = data[0]?.email?.trim().toLowerCase() ?? null;
  const match = Boolean(paymentEmail && paymentEmail === email);

  return NextResponse.json({ data: { payment_found: true, match }, error: null });
}
