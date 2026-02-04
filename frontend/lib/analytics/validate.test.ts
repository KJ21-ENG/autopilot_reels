import { describe, expect, it } from "vitest";

import { validateAnalyticsEventPayload } from "./validate";

describe("validateAnalyticsEventPayload", () => {
  it("accepts a baseline event payload", () => {
    const result = validateAnalyticsEventPayload({
      event_name: "landing_view",
      session_id: "session-123",
      metadata: { route: "/" },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.event_name).toBe("landing_view");
    }
  });

  it("rejects payloads with missing event names", () => {
    const result = validateAnalyticsEventPayload({});

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_event");
    }
  });

  it("rejects payloads with non snake_case event names", () => {
    const result = validateAnalyticsEventPayload({
      event_name: "LandingView",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("snake_case");
    }
  });
});
