export type AuthState = {
  isKnown: boolean;
  hasSession: boolean;
  hasPaid: boolean;
};

export type GuardDecision = {
  allowed: boolean;
  reason: "unknown" | "unauthenticated" | "unpaid" | "authorized";
  redirectTo?: string;
  message: string;
};

type CookieStoreLike = {
  get: (name: string) => { value: string } | undefined;
};

const SESSION_COOKIE = "autopilotreels_session";
const PAID_COOKIE = "autopilotreels_paid";

export const PROTECTED_ROUTES = ["/dashboard"] as const;

export function getAuthStateFromCookies(cookies: CookieStoreLike): AuthState {
  const hasSession = Boolean(cookies.get(SESSION_COOKIE)?.value);
  const hasPaid = Boolean(cookies.get(PAID_COOKIE)?.value);
  const isKnown = hasSession || hasPaid;

  return {
    isKnown,
    hasSession,
    hasPaid,
  };
}

export function buildAuthRedirect(targetPath: string): string {
  const redirectTarget = encodeURIComponent(targetPath);
  return `/auth?redirect=${redirectTarget}`;
}

export function getProtectedRouteDecision({
  route,
  auth,
}: {
  route: string;
  auth: AuthState;
}): GuardDecision {
  if (!auth.isKnown) {
    return {
      allowed: false,
      reason: "unknown",
      redirectTo: buildAuthRedirect(route),
      message: "Please complete post-payment sign in to continue.",
    };
  }

  if (!auth.hasSession) {
    return {
      allowed: false,
      reason: "unauthenticated",
      redirectTo: buildAuthRedirect(route),
      message: "Please sign in to access your dashboard.",
    };
  }

  if (!auth.hasPaid) {
    return {
      allowed: false,
      reason: "unpaid",
      redirectTo: "/checkout",
      message: "Complete checkout to unlock dashboard access.",
    };
  }

  return {
    allowed: true,
    reason: "authorized",
    message: "Access granted.",
  };
}
