/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
    getAuthStateFromCookies,
    getProtectedRouteDecision,
    resolveVerifiedAuthState,
} from "./guards";

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
            makeCookies({ autopilotreels_session: "1" }),
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

describe("resolveVerifiedAuthState", () => {
    it("denies access when session token cannot be verified", async () => {
        const authState = await resolveVerifiedAuthState(
            makeCookies({
                autopilotreels_session: "forged-token",
                autopilotreels_paid: "1",
            }),
            {
                getSupabaseServer: () =>
                    ({
                        auth: {
                            getUser: async () =>
                                ({
                                    data: { user: null },
                                    error: { message: "invalid token" },
                                }) as any,
                        } as any,
                        from: () =>
                            ({
                                select: () =>
                                    ({
                                        eq: () =>
                                            ({
                                                limit: async () =>
                                                    ({
                                                        data: null,
                                                        error: null,
                                                    }) as any,
                                            }) as any,
                                    }) as any,
                            }) as any,
                    }) as any,
            },
        );

        expect(authState).toEqual({
            isKnown: false,
            hasSession: false,
            hasPaid: false,
        });
    });

    it("requires verified paid linkage to mark user paid", async () => {
        const authState = await resolveVerifiedAuthState(
            makeCookies({
                autopilotreels_session: "valid-token",
            }),
            {
                getSupabaseServer: () =>
                    ({
                        auth: {
                            getUser: async () =>
                                ({
                                    data: { user: { id: "user-1" } },
                                    error: null,
                                }) as any,
                        } as any,
                        from: () =>
                            ({
                                select: () =>
                                    ({
                                        eq: () =>
                                            ({
                                                limit: async () =>
                                                    ({
                                                        data: [{ id: "upl-1" }],
                                                        error: null,
                                                    }) as any,
                                            }) as any,
                                    }) as any,
                            }) as any,
                    }) as any,
            },
        );

        expect(authState).toEqual({
            isKnown: true,
            hasSession: true,
            hasPaid: true,
            userId: "user-1",
        });
    });
});

describe("protected route wiring", () => {
    it("reuses centralized guard logic in middleware and dashboard", () => {
        const middlewareSource = readFileSync(
            path.resolve(process.cwd(), "middleware.ts"),
            "utf8",
        );
        const layoutSource = readFileSync(
            path.resolve(process.cwd(), "app/dashboard/layout.tsx"),
            "utf8",
        );

        expect(middlewareSource).toContain("getProtectedRouteDecision");
        expect(layoutSource).toContain("getProtectedRouteDecision");
    });
});
