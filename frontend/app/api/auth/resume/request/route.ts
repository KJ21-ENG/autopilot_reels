import { NextResponse } from "next/server";

import { createResumeToken } from "../../../../../lib/auth/resume-token";
import { getSupabaseServer } from "@/lib/supabase/server";

const jsonError = (status: number, code: string, message: string) =>
  NextResponse.json(
    {
      data: null,
      error: { code, message },
    },
    { status }
  );

function resolveBaseUrl(request: Request): string | null {
  const configured = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      return null;
    }
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return null;
  }

  try {
    return new URL(origin).origin;
  } catch {
    return null;
  }
}

async function sendResumeEmail({
  email,
  resumeUrl,
}: {
  email: string;
  resumeUrl: string;
}): Promise<"email" | "log"> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESUME_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    const missing: string[] = [];
    if (!apiKey) {
      missing.push("RESEND_API_KEY");
    }
    if (!fromEmail) {
      missing.push("RESUME_FROM_EMAIL");
    }
    console.info("Resume setup link generated.", { email, resumeUrl, missing });
    return "log";
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email],
      subject: "Finish setting up your AutopilotReels account",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #f6f7fb; padding: 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);">
            <tr>
              <td style="text-align: center; padding-bottom: 8px;">
                <div style="font-size: 12px; font-weight: 700; letter-spacing: 1.4px; color: #7c3aed;">PAYMENT CONFIRMED</div>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <h1 style="margin: 12px 0 8px; font-size: 24px; color: #0f172a;">Finish your account setup</h1>
                <p style="margin: 0 0 16px; font-size: 15px; color: #475569; line-height: 1.5;">
                  Your plan is active. Complete your account to unlock your dashboard.
                </p>
                <a href="${resumeUrl}" style="display: inline-block; padding: 12px 20px; background: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600;">
                  Continue setup
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 18px;">
                <p style="margin: 0; font-size: 13px; color: #64748b;">
                  This link expires in 24 hours.
                </p>
                <p style="margin: 12px 0 0; font-size: 12px; color: #94a3b8;">
                  If you didn’t request this, you can ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error("email_send_failed");
  }
  return "email";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; session_id?: string }
    | null;
  const email = body?.email?.trim().toLowerCase();
  const sessionId = body?.session_id?.trim();

  if (!email && !sessionId) {
    return jsonError(400, "missing_email", "Email or session ID is required.");
  }

  const secret = process.env.AUTH_RESUME_SECRET;
  if (!secret) {
    return jsonError(500, "missing_config", "Resume setup is not configured.");
  }

  const baseUrl = resolveBaseUrl(request);
  if (!baseUrl) {
    return jsonError(500, "missing_config", "Resume setup is unavailable.");
  }

  let supabase: ReturnType<typeof getSupabaseServer>;
  try {
    supabase = getSupabaseServer();
  } catch (error) {
    console.error("Missing Supabase configuration.", error);
    return jsonError(500, "missing_config", "Resume setup is unavailable.");
  }

  let paymentsQuery = supabase
    .from("payments")
    .select("id,stripe_session_id,email")
    .eq("status", "paid");
  if (sessionId) {
    paymentsQuery = paymentsQuery.eq("stripe_session_id", sessionId);
  } else if (email) {
    paymentsQuery = paymentsQuery.eq("email", email);
  }

  const { data: payments, error: paymentError } = await paymentsQuery
    .order("created_at", { ascending: false })
    .limit(1);

  if (paymentError) {
    console.warn("Unable to resolve paid payment for resume setup.", paymentError);
    return jsonError(500, "resume_failed", "Unable to process request.");
  }

  if (!payments || payments.length === 0 || !payments[0]?.id || !payments[0]?.stripe_session_id) {
    return NextResponse.json({ data: { status: "no_paid_payment" }, error: null });
  }

  const { data: links, error: linksError } = await supabase
    .from("user_payment_links")
    .select("id")
    .eq("payment_id", payments[0].id)
    .limit(1);

  if (linksError) {
    console.warn("Unable to resolve payment linkage status for resume setup.", linksError);
    return jsonError(500, "resume_failed", "Unable to process request.");
  }

  if (links && links.length > 0) {
    return NextResponse.json({ data: { status: "already_linked" }, error: null });
  }

  const resolvedEmail = payments[0].email?.trim().toLowerCase();
  if (!resolvedEmail) {
    return NextResponse.json({ data: { status: "no_email_on_payment" }, error: null });
  }

  const token = createResumeToken(
    {
      email: resolvedEmail,
      stripe_session_id: payments[0].stripe_session_id,
    },
    {
      secret,
      ttlSeconds: 60 * 60 * 24,
    }
  );
  const resumeUrl = `${baseUrl}/auth?resume_token=${encodeURIComponent(token)}`;

  try {
    const delivery = await sendResumeEmail({ email: resolvedEmail, resumeUrl });
    if (delivery === "log") {
      const missing: string[] = [];
      if (!process.env.RESEND_API_KEY) {
        missing.push("RESEND_API_KEY");
      }
      if (!process.env.RESUME_FROM_EMAIL) {
        missing.push("RESUME_FROM_EMAIL");
      }
      return NextResponse.json({
        data: { status: "link_generated", delivery, missing },
        error: null,
      });
    }
    return NextResponse.json({ data: { status: "email_sent", delivery }, error: null });
  } catch (error) {
    console.error("Unable to send resume setup email.", error);
    return jsonError(500, "email_failed", "Unable to send resume email.");
  }
}
