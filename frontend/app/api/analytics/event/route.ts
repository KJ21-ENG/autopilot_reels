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

    console.info("[analytics] event", validation.data);

    return jsonResponse({ data: { recorded: true }, error: null });
  } catch (error) {
    console.error("[analytics] failed to record event", error);
    return jsonResponse(
      {
        data: null,
        error: { code: "server_error", message: "Unable to record event." },
      },
      500
    );
  }
}
