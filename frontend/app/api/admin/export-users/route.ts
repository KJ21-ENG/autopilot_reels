import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { resolveVerifiedAuthState } from "@/lib/auth/guards";

export async function GET() {
    // 1. Auth Guard & Admin Check
    const cookieStore = await cookies();
    const getSupabaseServer = () =>
        createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin query
            {
                auth: {
                    persistSession: false,
                },
            },
        );

    // Verify authentication
    const authState = await resolveVerifiedAuthState(cookieStore, {
        getSupabaseServer,
    });

    if (!authState.hasSession || !authState.userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify Admin Access
    // We check the user's email against a whitelist in dependent on getting the user email
    // resolving verified auth state doesn't return email, so we need to fetch it.
    const supabase = getSupabaseServer();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.admin.getUserById(authState.userId);

    if (userError || !user || !user.email) {
        return new NextResponse("Unauthorized: Cannot resolve user email", {
            status: 401,
        });
    }

    const adminEmails =
        process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];
    if (!adminEmails.includes(user.email)) {
        return new NextResponse("Forbidden: Not an admin", { status: 403 });
    }

    // 2. Data Query
    // Query payments table for successful payments
    // We want: Payment Date (created_at), Plan (price_id), User Email (email)
    const { data: payments, error: paymentsError } = await supabase
        .from("payments")
        .select("created_at, price_id, email, amount, currency, status")
        .in("status", ["paid", "succeeded"])
        .order("created_at", { ascending: false });

    if (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

    // 3. CSV Generation
    const headers = ["Payment Date", "Plan", "Email", "Amount", "Currency"];
    const csvRows = [headers.join(",")];

    for (const payment of payments) {
        const row = [
            payment.created_at,
            payment.price_id,
            payment.email || "N/A", // Payment email might differ from auth email, but it's what we want for revenue tracking
            payment.amount,
            payment.currency,
        ].map(field => {
            // Escape quotes and wrap in quotes if necessary
            const stringField = String(field);
            if (
                stringField.includes(",") ||
                stringField.includes('"') ||
                stringField.includes("\n")
            ) {
                return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
        });
        csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\n");

    // 4. Return Response
    return new NextResponse(csvContent, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition":
                'attachment; filename="paid-users-export.csv"',
        },
    });
}
