import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

const jsonResponse = (payload: unknown, status = 200) =>
  NextResponse.json(payload, { status });

export async function POST(request: Request) {
  let body: { email?: string; stripe_session_id?: string } | null = null;

  try {
    body = await request.json();
  } catch (error) {
    console.error("Account provider check request missing JSON body.", error);
    return jsonResponse(
      {
        data: null,
        error: { code: "invalid_request", message: "Invalid request payload." },
      },
      400
    );
  }

  const email = body?.email?.trim().toLowerCase();
  const stripeSessionId = body?.stripe_session_id?.trim();
  if (!email) {
    return jsonResponse(
      {
        data: null,
        error: { code: "missing_email", message: "Email is required." },
      },
      400
    );
  }

  if (!stripeSessionId) {
    return jsonResponse({ data: { has_google_provider: false }, error: null });
  }

  let supabase: ReturnType<typeof getSupabaseServer>;
  try {
    supabase = getSupabaseServer();
  } catch (error) {
    console.error("Missing Supabase configuration.", error);
    return jsonResponse(
      {
        data: null,
        error: { code: "missing_config", message: "Server configuration is incomplete." },
      },
      500
    );
  }

  try {
    const { data: payments, error: paymentError } = await supabase
      .from("payments")
      .select("id,email")
      .eq("stripe_session_id", stripeSessionId)
      .eq("status", "paid")
      .limit(1);

    if (paymentError) {
      console.warn("Unable to validate payment for provider check.", paymentError);
      return jsonResponse({ data: { has_google_provider: false }, error: null });
    }

    const paymentEmail = payments?.[0]?.email?.trim().toLowerCase();
    if (!payments || payments.length === 0 || !paymentEmail || paymentEmail !== email) {
      return jsonResponse({ data: { has_google_provider: false }, error: null });
    }

    let matchingUser:
      | {
          email?: string;
          identities?: Array<{ provider?: string }>;
          app_metadata?: { providers?: string[] };
        }
      | undefined;

    let page = 1;
    const perPage = 200;

    while (!matchingUser) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) {
        console.warn("Unable to list auth users for provider check.", error);
        return jsonResponse({ data: { has_google_provider: false }, error: null });
      }

      const users = data.users ?? [];
      matchingUser = users.find((user) => user.email?.toLowerCase() === email);

      if (matchingUser || users.length < perPage) {
        break;
      }

      page += 1;
    }

    const hasGoogleIdentity = Boolean(
      matchingUser?.identities?.some((identity) => identity.provider === "google")
    );
    const hasGoogleInProviders = Boolean(
      matchingUser?.app_metadata?.providers?.some((provider) => provider === "google")
    );
    const hasGoogleProvider = hasGoogleIdentity || hasGoogleInProviders;

    return jsonResponse({ data: { has_google_provider: hasGoogleProvider }, error: null });
  } catch (error) {
    console.warn("Provider check failed unexpectedly.", error);
    return jsonResponse({ data: { has_google_provider: false }, error: null });
  }
}
