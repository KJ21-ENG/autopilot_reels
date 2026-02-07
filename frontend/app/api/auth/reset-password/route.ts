import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function sendPasswordResetEmail({
    email,
    resetLink,
}: {
    email: string;
    resetLink: string;
}): Promise<"email" | "log"> {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail =
        process.env.RESUME_FROM_EMAIL || "noreply@autopilotreels.com";

    if (!apiKey) {
        console.log(
            "----------------------------------------------------------------",
        );
        console.log(" [MOCK EMAIL SERVICE - MISSING API KEY] ");
        console.log(` To: ${email}`);
        console.log(` Subject: Reset Your Password`);
        console.log(` Link: ${resetLink}`);
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
            subject: "Reset Your Password",
            html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #f6f7fb; padding: 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);">
            <tr>
              <td style="text-align: center; padding-bottom: 8px;">
                <div style="font-size: 12px; font-weight: 700; letter-spacing: 1.4px; color: #4F46E5;">PASSWORD RECOVERY</div>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <h1 style="margin: 12px 0 8px; font-size: 24px; color: #0f172a;">Reset your password</h1>
                <p style="margin: 0 0 16px; font-size: 15px; color: #475569; line-height: 1.5;">
                  We received a request to reset the password for your account. If you didn't make this request, you can ignore this email.
                </p>
                
                <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; background: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600;">
                  Reset Password
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 18px;">
                <p style="margin: 0; font-size: 13px; color: #64748b;">
                  This link expires in 1 hour.
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
        throw new Error("Failed to send email");
    }

    return "email";
}

export async function POST(request: Request) {
    try {
        const { email, redirectTo } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 },
            );
        }

        const supabaseUrl =
            process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            console.error("Missing Supabase Service Role configuration");
            return NextResponse.json(
                { error: "Server misconfiguration" },
                { status: 500 },
            );
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey);

        const { data, error } = await supabase.auth.admin.generateLink({
            type: "recovery",
            email,
            options: {
                redirectTo,
            },
        });

        if (error) {
            console.error("Supabase Generate Link Error:", error);
            // Don't expose specific auth errors (user not found, etc) to prevent enumeration if desired,
            // but for now let's just return a generic error or the message if safe.
            // Actually, standard practice is to often simulate success, but here let's be honest for MVP debuggability
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const { action_link } = data.properties;

        await sendPasswordResetEmail({ email, resetLink: action_link });

        return NextResponse.json({
            success: true,
            message: "Reset email sent",
        });
    } catch (error) {
        console.error("Password reset error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
