import type { AnalyticsEventPayload } from "./events";

export type AnalyticsApiResponse = {
  data: { recorded: true } | null;
  error: { code: string; message: string } | null;
};

export const emitAnalyticsEvent = async (
  payload: AnalyticsEventPayload,
  options: { useBeacon?: boolean; beaconOnly?: boolean } = {}
): Promise<AnalyticsApiResponse> => {
  const body = JSON.stringify(payload);

  if (options.useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    const sent = navigator.sendBeacon("/api/analytics/event", blob);

    if (sent || options.beaconOnly) {
      return { data: { recorded: true }, error: null };
    }
  }

  if (options.beaconOnly) {
    return {
      data: null,
      error: { code: "server_error", message: "Beacon unavailable." },
    };
  }

  const response = await fetch("/api/analytics/event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  });

  if (!response.ok) {
    return {
      data: null,
      error: { code: "server_error", message: "Failed to record analytics event." },
    };
  }

  const json = (await response.json()) as AnalyticsApiResponse;
  return json;
};
