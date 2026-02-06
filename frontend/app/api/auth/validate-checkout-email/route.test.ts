import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const paymentsQuery = {
  select: vi.fn(),
  eq: vi.fn(),
  limit: vi.fn(),
};
const from = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServer: () => ({
    from,
  }),
}));

describe("POST /api/auth/validate-checkout-email", () => {
  afterEach(() => {
    from.mockReset();
    paymentsQuery.select.mockReset();
    paymentsQuery.eq.mockReset();
    paymentsQuery.limit.mockReset();
  });

  it("returns match true when checkout email matches", async () => {
    paymentsQuery.eq.mockReturnValue(paymentsQuery);
    paymentsQuery.select.mockReturnValue(paymentsQuery);
    paymentsQuery.limit.mockResolvedValue({
      data: [{ email: "buyer@example.com" }],
      error: null,
    });
    from.mockReturnValue({ select: paymentsQuery.select });

    const request = new Request("http://localhost/api/auth/validate-checkout-email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: "buyer@example.com",
        stripe_session_id: "cs_test_123",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { payment_found: true, match: true }, error: null });
  });

  it("returns match false when checkout email does not match", async () => {
    paymentsQuery.eq.mockReturnValue(paymentsQuery);
    paymentsQuery.select.mockReturnValue(paymentsQuery);
    paymentsQuery.limit.mockResolvedValue({
      data: [{ email: "buyer@example.com" }],
      error: null,
    });
    from.mockReturnValue({ select: paymentsQuery.select });

    const request = new Request("http://localhost/api/auth/validate-checkout-email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: "other@example.com",
        stripe_session_id: "cs_test_123",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { payment_found: true, match: false }, error: null });
  });
});
