import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const from = vi.fn();
const paymentsQuery = {
  select: vi.fn(),
  eq: vi.fn(),
  order: vi.fn(),
  limit: vi.fn(),
};
const linksQuery = {
  select: vi.fn(),
  eq: vi.fn(),
  limit: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServer: () => ({
    from,
  }),
}));

describe("POST /api/auth/resume/request", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    from.mockReset();
    paymentsQuery.select.mockReset();
    paymentsQuery.eq.mockReset();
    paymentsQuery.order.mockReset();
    paymentsQuery.limit.mockReset();
    linksQuery.select.mockReset();
    linksQuery.eq.mockReset();
    linksQuery.limit.mockReset();
  });

  it("returns link_generated for eligible paid email when email delivery is disabled", async () => {
    process.env.AUTH_RESUME_SECRET = "test-secret";
    process.env.SITE_URL = "http://localhost:3000";

    paymentsQuery.select.mockReturnValue(paymentsQuery);
    paymentsQuery.eq.mockReturnValue(paymentsQuery);
    paymentsQuery.order.mockReturnValue(paymentsQuery);
    paymentsQuery.limit.mockResolvedValue({
      data: [{ id: "pay-1", stripe_session_id: "cs_test_123", email: "buyer@example.com" }],
      error: null,
    });
    linksQuery.select.mockReturnValue(linksQuery);
    linksQuery.eq.mockReturnValue(linksQuery);
    linksQuery.limit.mockResolvedValue({ data: [], error: null });

    from.mockImplementation((table: string) => {
      if (table === "payments") {
        return { select: paymentsQuery.select };
      }
      if (table === "user_payment_links") {
        return { select: linksQuery.select };
      }
      return { select: vi.fn() };
    });

    const response = await POST(
      new Request("http://localhost/api/auth/resume/request", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "http://localhost:3000" },
        body: JSON.stringify({ email: "buyer@example.com" }),
      })
    );

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: { status: "link_generated", delivery: "log", missing: ["RESEND_API_KEY", "RESUME_FROM_EMAIL"] },
      error: null,
    });
  });

  it("returns 400 when email and session id are missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/auth/resume/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      })
    );
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error.code).toBe("missing_email");
  });

  it("returns no_paid_payment when no paid record exists", async () => {
    process.env.AUTH_RESUME_SECRET = "test-secret";
    process.env.SITE_URL = "http://localhost:3000";

    paymentsQuery.select.mockReturnValue(paymentsQuery);
    paymentsQuery.eq.mockReturnValue(paymentsQuery);
    paymentsQuery.order.mockReturnValue(paymentsQuery);
    paymentsQuery.limit.mockResolvedValue({ data: [], error: null });

    from.mockImplementation((table: string) => {
      if (table === "payments") {
        return { select: paymentsQuery.select };
      }
      return { select: vi.fn() };
    });

    const response = await POST(
      new Request("http://localhost/api/auth/resume/request", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "http://localhost:3000" },
        body: JSON.stringify({ email: "buyer@example.com" }),
      })
    );

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { status: "no_paid_payment" }, error: null });
  });
});
