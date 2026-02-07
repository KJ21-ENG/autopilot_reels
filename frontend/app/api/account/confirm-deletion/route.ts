import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripeServer } from "@/lib/stripe/server";
import { jwtVerify } from "jose";

// Need a separate admin client for deleting users
function getSupabaseAdmin() {
    const url =
        process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error("Missing Supabase Admin configuration");
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { error: "Missing token" },
                { status: 400 },
            );
        }

        const secret = new TextEncoder().encode(
            process.env.SUPABASE_JWT_SECRET ||
                process.env.SUPABASE_SERVICE_ROLE_KEY ||
                "fallback-secret-do-not-use-in-prod",
        );

        let payload;
        try {
            const verified = await jwtVerify(token, secret);
            payload = verified.payload;
        } catch {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 },
            );
        }

        if (payload.action !== "delete_account" || !payload.sub) {
            return NextResponse.json(
                { error: "Invalid token purpose" },
                { status: 400 },
            );
        }

        const userId = payload.sub;
        const supabaseAdmin = getSupabaseAdmin();

        // 1. Fetch user to get email for Stripe cleanup
        const {
            data: { user },
            error: userError,
        } = await supabaseAdmin.auth.admin.getUserById(userId);

        if (userError || !user) {
            console.error("User not found during deletion:", userError);
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        if (user?.email) {
            try {
                const stripe = getStripeServer();
                // Find all customers with this email
                const customers = await stripe.customers.list({
                    email: user.email,
                    limit: 5,
                });

                for (const customer of customers.data) {
                    // Find and cancel all active/trialing subscriptions
                    const subscriptions = await stripe.subscriptions.list({
                        customer: customer.id,
                        status: "all", // check all, but we usually care about active/trialing
                    });

                    for (const sub of subscriptions.data) {
                        if (
                            sub.status === "active" ||
                            sub.status === "trialing" ||
                            sub.status === "past_due"
                        ) {
                            await stripe.subscriptions.cancel(sub.id);
                            console.log(
                                `Cancelled subscription ${sub.id} for user ${userId}`,
                            );
                        }
                    }
                }
            } catch (stripeErr) {
                console.error("Stripe cleanup failed:", stripeErr);
            }
        }

        // 2. Manual cleanup of related tables due to missing ON DELETE CASCADE
        // We MUST delete these first because they might reference 'payments' (via user_payment_links)
        // or prevent 'auth.admin.deleteUser'.
        const tables = ["user_payment_links"];

        for (const table of tables) {
            try {
                const { count, error: tableErr } = await supabaseAdmin
                    .from(table)
                    .delete({ count: "exact" })
                    .eq("user_id", userId);

                console.log(
                    `Deleted ${count} rows from ${table} for user ${userId}`,
                    tableErr || "Success",
                );
            } catch (err) {
                console.warn(`Cleanup for ${table} failed`, err);
            }
        }

        // 3. Clear 'payments' records for this email
        // We do this AFTER clearing user_payment_links to avoid FK violations.
        if (user?.email) {
            try {
                const { count, error: delError } = await supabaseAdmin
                    .from("payments")
                    .delete({ count: "exact" })
                    .ilike("email", user.email);

                console.log(
                    `Deleted ${count} payments rows for ${user.email}`,
                    delError || "Success",
                );
            } catch (e) {
                console.warn("Failed to clean payments by email", e);
            }
        }

        // Also cleanup storage if possible (optional, skipping for now to fix DB error first)

        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) {
            console.error("Supabase delete user error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Clear local session cookies
        const cookieStore = await cookies();
        cookieStore.delete("autopilotreels_session");
        cookieStore.delete("autopilotreels_paid");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Deletion confirmation error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
