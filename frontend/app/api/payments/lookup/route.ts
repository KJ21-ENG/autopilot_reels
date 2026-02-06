import { getSupabaseServer } from "../../../../lib/supabase/server";

const jsonResponse = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), {
        status,
        headers: { "content-type": "application/json" },
    });

type LookupRequest = {
    session_id?: string;
    email?: string;
};

export async function POST(request: Request) {
    // Supports post-payment auth linkage by returning stored payment metadata.
    let payload: LookupRequest = {};
    try {
        payload = await request.json();
    } catch (error) {
        console.warn("Invalid payment lookup payload.", error);
    }

    const sessionId = payload.session_id?.trim();
    const email = payload.email?.trim();
    const lookupToken = request.headers.get("x-payment-lookup-token");
    const lookupTokenExpected = process.env.PAYMENT_LOOKUP_TOKEN;

    if (!sessionId && !email) {
        return jsonResponse(
            { data: null, error: { code: "invalid_request", message: "Provide session ID or email." } },
            400
        );
    }

    if (email && (!lookupTokenExpected || lookupToken !== lookupTokenExpected)) {
        return jsonResponse(
            { data: null, error: { code: "forbidden", message: "Email lookup is not permitted." } },
            403
        );
    }

    let supabase: ReturnType<typeof getSupabaseServer>;
    try {
        supabase = getSupabaseServer();
    } catch (error) {
        console.error("Missing Supabase configuration.", error);
        return jsonResponse(
            { data: null, error: { code: "missing_env", message: "Payment lookup is unavailable." } },
            500
        );
    }

    let query = supabase.from("payments").select("email");

    if (sessionId) {
        query = query.eq("stripe_session_id", sessionId);
    }

    if (email) {
        query = query.eq("email", email);
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(25);

    if (error) {
        console.error("Payment lookup failed.", error);
        return jsonResponse(
            { data: null, error: { code: "lookup_failed", message: "Unable to fetch payment records." } },
            500
        );
    }

    return jsonResponse({ data: { payments: data ?? [] }, error: null });
}
