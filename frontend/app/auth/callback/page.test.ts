import { describe, expect, it } from "vitest";

import {
  buildNoAccountRedirectHref,
  buildPaymentMismatchRedirectHref,
} from "./recovery";

describe("auth callback no-account recovery", () => {
  it("builds recovery redirect with post-payment markers and checkout session id", () => {
    const href = buildNoAccountRedirectHref({
      redirectTo: "/dashboard",
      markPaidFlow: true,
      stripeSessionId: "cs_test_123",
      email: "buyer@example.com",
    });

    expect(href).toBe(
      "/auth?redirect=%2Fdashboard&error=no_account&email=buyer%40example.com&post_payment=1&session_id=cs_test_123"
    );
  });

  it("omits optional fields when not present", () => {
    const href = buildNoAccountRedirectHref({
      redirectTo: "/dashboard",
      markPaidFlow: false,
      stripeSessionId: null,
    });

    expect(href).toBe("/auth?redirect=%2Fdashboard&error=no_account");
  });

  it("builds payment mismatch redirect back to auth flow", () => {
    const href = buildPaymentMismatchRedirectHref({
      redirectTo: "/dashboard",
      markPaidFlow: true,
      stripeSessionId: "cs_test_456",
    });

    expect(href).toBe(
      "/auth?redirect=%2Fdashboard&error=payment_email_mismatch&post_payment=1&session_id=cs_test_456"
    );
  });
});
