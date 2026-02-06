import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

async function sendDeletionEmail({
    email,
    confirmationLink,
}: {
    email: string;
    confirmationLink: string;
}): Promise<"email" | "log"> {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail =
        process.env.RESUME_FROM_EMAIL || "noreply@autopilotreels.com"; // Fallback if specific resume one isn't appropriate, but usually safe to reuse or env var

    if (!apiKey) {
        console.log(
            "----------------------------------------------------------------",
        );
        console.log(" [MOCK EMAIL SERVICE - MISSING API KEY] ");
        console.log(` To: ${email}`);
        console.log(` Subject: Confirm Account Deletion`);
        console.log(` Link: ${confirmationLink}`);
        console.log(
            "----------------------------------------------------------------",
        );
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
            subject: "Confirm Account Deletion",
            html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #f6f7fb; padding: 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);">
            <tr>
              <td style="text-align: center; padding-bottom: 8px;">
                <div style="font-size: 12px; font-weight: 700; letter-spacing: 1.4px; color: #dc2626;">ACCOUNT DELETION</div>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <h1 style="margin: 12px 0 8px; font-size: 24px; color: #0f172a;">Confirm account deletion</h1>
                <p style="margin: 0 0 16px; font-size: 15px; color: #475569; line-height: 1.5;">
                  You requested to permanently delete your account. This action cannot be undone.
                </p>
                <div style="background: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: left;">
                  <strong style="color: #991b1b; display: block; margin-bottom: 8px;">Warning: Data Loss</strong>
                  <ul style="margin: 0; padding-left: 20px; color: #b91c1c; font-size: 13px;">
                    <li>All videos and remaining credits will be lost</li>
                    <li>Connected accounts will be unlinked</li>
                    <li>Subscription will be cancelled</li>
                    <li>This action is irreversible</li>
                  </ul>
                </div>
                <a href="${confirmationLink}" style="display: inline-block; padding: 12px 20px; background: #dc2626; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600;">
                  Permanently Delete Account
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 18px;">
                <p style="margin: 0; font-size: 13px; color: #64748b;">
                  This link expires in 1 hour.
                </p>
                <p style="margin: 12px 0 0; font-size: 12px; color: #94a3b8;">
                  If you didn’t request this, please change your password immediately.
                </p>
              </td>
            </tr>
          </table>
        </div>
      `,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Resend API Error:", errorData);
        // Fallback to log if email fails, so dev can still proceed/debug
        console.log(" [EMAIL SEND FAILED - FALLBACK LOG] ");
        console.log(` Link: ${confirmationLink}`);
        throw new Error("Failed to send email");
    }

    return "email";
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("autopilotreels_session")?.value;
        const supabase = getSupabaseServer();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(sessionToken);

        if (authError || !user) {
            console.error("Auth Failed:", {
                hasToken: !!sessionToken,
                tokenLength: sessionToken?.length,
                error: authError?.message,
            });
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const secret = new TextEncoder().encode(
            process.env.SUPABASE_JWT_SECRET ||
                process.env.SUPABASE_SERVICE_ROLE_KEY ||
                "fallback-secret-do-not-use-in-prod",
        );

        const token = await new SignJWT({
            sub: user.id,
            email: user.email,
            action: "delete_account",
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(secret);

        const host = request.headers.get("host") || "localhost:3000";
        const protocol = host.includes("localhost") ? "http" : "https";
        const confirmationLink = `${protocol}://${host}/dashboard/delete-account/confirm?token=${token}`;

        await sendDeletionEmail({ email: user.email!, confirmationLink });

        return NextResponse.json({
            success: true,
            message: "Confirmation email sent",
        });
    } catch (error) {
        console.error("Deletion request error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
