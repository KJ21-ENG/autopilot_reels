import { getSupabaseServer } from "../../../../lib/supabase/server";
import { validateAnalyticsEventPayload } from "../../../../lib/analytics/validate";

const jsonResponse = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), {
        status,
        headers: { "content-type": "application/json" },
    });

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const validation = validateAnalyticsEventPayload(payload);

        if (!validation.ok) {
            return jsonResponse({ data: null, error: validation.error }, 400);
        }

        const { event_name, user_id, session_id, metadata } = validation.data;

        const supabase = getSupabaseServer();
        const { error } = await supabase.from("events").insert({
            event_name,
            user_id,
            session_id,
            metadata: metadata ?? {},
        });

        if (error) {
            console.error("[analytics] failed to save to database", error);
            // We still return true to the client to avoid blocking UI,
            // but log the error on the server.
        }

        console.info("[analytics] event recorded", validation.data);

        return jsonResponse({ data: { recorded: true }, error: null });
    } catch (error) {
        console.error("[analytics] failed to record event", error);
        return jsonResponse(
            {
                data: null,
                error: {
                    code: "server_error",
                    message: "Unable to record event.",
                },
            },
            500,
        );
    }
}
