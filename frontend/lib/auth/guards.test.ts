import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { getAuthStateFromCookies, getProtectedRouteDecision } from "./guards";

const makeCookies = (values: Record<string, string>) => ({
  get: (name: string) => (values[name] ? { value: values[name] } : undefined),
});

describe("getAuthStateFromCookies", () => {
  it("treats missing cookies as unknown", () => {
    const authState = getAuthStateFromCookies(makeCookies({}));

    expect(authState).toEqual({
      isKnown: false,
      hasSession: false,
      hasPaid: false,
    });
  });

  it("marks known when session cookie exists", () => {
    const authState = getAuthStateFromCookies(
      makeCookies({ autopilotreels_session: "1" })
    );

    expect(authState.isKnown).toBe(true);
    expect(authState.hasSession).toBe(true);
  });
});

describe("getProtectedRouteDecision", () => {
  it("denies access when auth state is unknown", () => {
    const decision = getProtectedRouteDecision({
      route: "/dashboard",
      auth: { isKnown: false, hasSession: false, hasPaid: false },
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("unknown");
    expect(decision.redirectTo).toContain("/auth");
  });

  it("allows access when session and payment are present", () => {
    const decision = getProtectedRouteDecision({
      route: "/dashboard",
      auth: { isKnown: true, hasSession: true, hasPaid: true },
    });

    expect(decision.allowed).toBe(true);
    expect(decision.reason).toBe("authorized");
  });
});

describe("protected route wiring", () => {
  it("reuses centralized guard logic in middleware and dashboard", () => {
    const middlewareSource = readFileSync(
      path.resolve(process.cwd(), "middleware.ts"),
      "utf8"
    );
    const dashboardSource = readFileSync(
      path.resolve(process.cwd(), "app/dashboard/page.tsx"),
      "utf8"
    );

    expect(middlewareSource).toContain("getProtectedRouteDecision");
    expect(dashboardSource).toContain("getProtectedRouteDecision");
  });
});
