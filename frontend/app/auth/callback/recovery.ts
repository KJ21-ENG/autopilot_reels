export function buildNoAccountRedirectHref({
  redirectTo,
  markPaidFlow,
  stripeSessionId,
  email,
}: {
  redirectTo: string;
  markPaidFlow: boolean;
  stripeSessionId: string | null;
  email?: string | null;
}): string {
  const params = new URLSearchParams({
    redirect: redirectTo,
    error: "no_account",
  });

  if (email) {
    params.set("email", email);
  }
  if (markPaidFlow) {
    params.set("post_payment", "1");
  }
  if (stripeSessionId) {
    params.set("session_id", stripeSessionId);
  }

  return `/auth?${params.toString()}`;
}

export function buildPaymentMismatchRedirectHref({
  redirectTo,
  markPaidFlow,
  stripeSessionId,
}: {
  redirectTo: string;
  markPaidFlow: boolean;
  stripeSessionId: string | null;
}): string {
  const params = new URLSearchParams({
    redirect: redirectTo,
    error: "payment_email_mismatch",
  });

  if (markPaidFlow) {
    params.set("post_payment", "1");
  }
  if (stripeSessionId) {
    params.set("session_id", stripeSessionId);
  }

  return `/auth?${params.toString()}`;
}
