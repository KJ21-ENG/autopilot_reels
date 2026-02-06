import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

const SESSION_COOKIE = "autopilotreels_session";
const PAID_COOKIE = "autopilotreels_paid";

const jsonError = (status: number, code: string, message: string) =>
  NextResponse.json(
    {
      data: null,
      error: { code, message },
    },
    { status }
  );

export async function POST(request: Request) {
  let body:
    | { access_token?: string; accessToken?: string; stripe_session_id?: string; enforce_paid?: boolean }
    | null = null;

  try {
    body = await request.json();
  } catch (error) {
    console.error("Auth session request missing JSON body.", error);
    return jsonError(400, "invalid_request", "Invalid request payload.");
  }

  const accessToken = body?.access_token ?? body?.accessToken;
  const stripeSessionId = body?.stripe_session_id?.trim();
  const enforcePaid = Boolean(body?.enforce_paid);

  if (!accessToken) {
    return jsonError(400, "missing_token", "Missing authentication token.");
  }

  let supabase: ReturnType<typeof getSupabaseServer>;
  try {
    supabase = getSupabaseServer();
  } catch (error) {
    console.error("Missing Supabase configuration.", error);
    return jsonError(500, "missing_config", "Server configuration is incomplete.");
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data?.user) {
    console.warn("Failed to verify Supabase session.", error);
    return jsonError(401, "invalid_token", "We could not confirm your session.");
  }

  const cookieStore = await cookies();
  const userEmail = data.user.email?.trim().toLowerCase() ?? null;

  const findPaidPayment = async (): Promise<{ id: string; email: string | null } | null> => {
    if (stripeSessionId) {
      const { data: payments, error: paymentError } = await supabase
        .from("payments")
        .select("id,email")
        .eq("stripe_session_id", stripeSessionId)
        .eq("status", "paid")
        .limit(1);

      if (paymentError) {
        console.warn("Unable to verify paid status by session id.", paymentError);
      } else if (payments && payments.length > 0 && payments[0]?.id) {
        const paymentEmail = payments[0].email?.trim().toLowerCase() ?? null;
        if (paymentEmail && userEmail && paymentEmail !== userEmail) {
          cookieStore.delete(PAID_COOKIE);
          return null;
        }

        return {
          id: payments[0].id,
          email: paymentEmail,
        };
      }
    }

    if (data.user.email) {
      const { data: payments, error: paymentError } = await supabase
        .from("payments")
        .select("id,email")
        .eq("email", data.user.email)
        .eq("status", "paid")
        .order("created_at", { ascending: false })
        .limit(1);

      if (paymentError) {
        console.warn("Unable to verify paid status by email.", paymentError);
      } else if (payments && payments.length > 0 && payments[0]?.id) {
        return {
          id: payments[0].id,
          email: payments[0].email?.trim().toLowerCase() ?? null,
        };
      }
    }

    return null;
  };

  const linkUserToPayment = async (paymentId: string) => {
    const { data: existing, error: existingError } = await supabase
      .from("user_payment_links")
      .select("id")
      .eq("user_id", data.user.id)
      .eq("payment_id", paymentId)
      .limit(1);

    if (existingError) {
      console.warn("Unable to verify existing payment linkage.", existingError);
      return;
    }

    if (existing && existing.length > 0) {
      return;
    }

    const { error: insertError } = await supabase.from("user_payment_links").insert({
      user_id: data.user.id,
      payment_id: paymentId,
      linked_at: new Date().toISOString(),
    });

    if (insertError && insertError.code !== "23505") {
      console.error("Unable to persist payment linkage.", {
        code: insertError.code,
        message: insertError.message,
        user_id: data.user.id,
        payment_id: paymentId,
      });
    }
  };

  let isPaid = false;
  const matchedPayment = await findPaidPayment();
  const shouldEnforcePaid = Boolean(stripeSessionId) || enforcePaid;

  if (stripeSessionId && matchedPayment === null) {
    const { data: sessionPayments, error: sessionPaymentError } = await supabase
      .from("payments")
      .select("id,email,status")
      .eq("stripe_session_id", stripeSessionId)
      .limit(1);

    if (!sessionPaymentError && sessionPayments && sessionPayments.length > 0) {
      const paymentEmail = sessionPayments[0]?.email?.trim().toLowerCase() ?? null;
      if (paymentEmail && userEmail && paymentEmail !== userEmail) {
        return jsonError(
          403,
          "payment_email_mismatch",
          "Please sign in with the same email used during checkout, or continue with Google for that account."
        );
      }
    }
  }

  if (shouldEnforcePaid && !matchedPayment?.id) {
    try {
      await supabase.auth.admin?.deleteUser?.(data.user.id);
      console.info("Removed unpaid auth user after post-payment auth.", {
        user_id: data.user.id,
        email: userEmail,
        stripe_session_id: stripeSessionId,
      });
    } catch (error) {
      console.warn("Unable to remove unpaid auth user.", error);
    }
    cookieStore.delete(SESSION_COOKIE);
    cookieStore.delete(PAID_COOKIE);
    return NextResponse.json({ data: { session: false, paid: false }, error: null });
  }

  if (matchedPayment?.id) {
    isPaid = true;
    await linkUserToPayment(matchedPayment.id);
  }

  cookieStore.set(SESSION_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  if (isPaid) {
    cookieStore.set(PAID_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  } else {
    cookieStore.delete(PAID_COOKIE);
  }

  return NextResponse.json({ data: { session: true, paid: isPaid }, error: null });
}
