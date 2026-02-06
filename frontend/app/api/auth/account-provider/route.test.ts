import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const listUsers = vi.fn();
const from = vi.fn();
const paymentsQuery = {
  select: vi.fn(),
  eq: vi.fn(),
  limit: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServer: () => ({
    auth: {
      admin: {
        listUsers,
      },
    },
    from,
  }),
}));

describe("POST /api/auth/account-provider", () => {
  afterEach(() => {
    listUsers.mockReset();
    from.mockReset();
    paymentsQuery.select.mockReset();
    paymentsQuery.eq.mockReset();
    paymentsQuery.limit.mockReset();
  });

  it("returns has_google_provider false when session id is missing", async () => {
    const request = new Request("http://localhost/api/auth/account-provider", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "user@example.com" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { has_google_provider: false }, error: null });
  });

  it("returns has_google_provider true when matching account uses google", async () => {
    paymentsQuery.eq.mockReturnValue(paymentsQuery);
    paymentsQuery.select.mockReturnValue(paymentsQuery);
    paymentsQuery.limit.mockResolvedValue({
      data: [{ id: "pay-1", email: "user@example.com" }],
      error: null,
    });
    from.mockReturnValue({ select: paymentsQuery.select });
    listUsers.mockResolvedValue({
      data: {
        users: [
          {
            email: "user@example.com",
            identities: [{ provider: "google" }],
          },
        ],
      },
      error: null,
    });

    const request = new Request("http://localhost/api/auth/account-provider", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "user@example.com", stripe_session_id: "cs_test_123" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { has_google_provider: true }, error: null });
  });

  it("returns has_google_provider false when account exists without google", async () => {
    paymentsQuery.eq.mockReturnValue(paymentsQuery);
    paymentsQuery.select.mockReturnValue(paymentsQuery);
    paymentsQuery.limit.mockResolvedValue({
      data: [{ id: "pay-1", email: "user@example.com" }],
      error: null,
    });
    from.mockReturnValue({ select: paymentsQuery.select });
    listUsers.mockResolvedValue({
      data: {
        users: [
          {
            email: "user@example.com",
            identities: [{ provider: "email" }],
          },
        ],
      },
      error: null,
    });

    const request = new Request("http://localhost/api/auth/account-provider", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "user@example.com", stripe_session_id: "cs_test_123" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { has_google_provider: false }, error: null });
  });

  it("detects google provider from app_metadata providers list", async () => {
    paymentsQuery.eq.mockReturnValue(paymentsQuery);
    paymentsQuery.select.mockReturnValue(paymentsQuery);
    paymentsQuery.limit.mockResolvedValue({
      data: [{ id: "pay-1", email: "user@example.com" }],
      error: null,
    });
    from.mockReturnValue({ select: paymentsQuery.select });
    listUsers.mockResolvedValue({
      data: {
        users: [
          {
            email: "user@example.com",
            identities: [],
            app_metadata: { providers: ["email", "google"] },
          },
        ],
      },
      error: null,
    });

    const request = new Request("http://localhost/api/auth/account-provider", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "user@example.com", stripe_session_id: "cs_test_123" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { has_google_provider: true }, error: null });
  });
});
