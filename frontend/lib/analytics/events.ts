export const ANALYTICS_EVENT_NAMES = {
    landingView: "landing_view",
    ctaClick: "cta_click",
    checkoutStart: "checkout_start",
    paymentSuccess: "payment_success",
    signupComplete: "signup_complete",
    dashboardView: "dashboard_view",
} as const;

export type AnalyticsEventName =
    (typeof ANALYTICS_EVENT_NAMES)[keyof typeof ANALYTICS_EVENT_NAMES];

export type AnalyticsEventPayload = {
    event_name: AnalyticsEventName | string;
    user_id?: string;
    session_id?: string;
    metadata?: Record<string, unknown>;
};

export const ANALYTICS_EVENT_SCHEMA_DOC = `Analytics event schema (baseline):
- event_name: string (snake_case, e.g. landing_view, cta_click, checkout_start, payment_success, signup_complete, dashboard_view)
- user_id?: string (Supabase user id if known)
- session_id?: string (anonymous session token if available)
- metadata?: object (small, JSON-serializable details, e.g. { plan: 'pro', price: 2900 })

All analytics events should be sent via POST /api/analytics/event and return the { data, error } envelope.
`;

export const BASELINE_ANALYTICS_EVENTS: AnalyticsEventName[] = [
    ANALYTICS_EVENT_NAMES.landingView,
    ANALYTICS_EVENT_NAMES.ctaClick,
    ANALYTICS_EVENT_NAMES.checkoutStart,
    ANALYTICS_EVENT_NAMES.paymentSuccess,
    ANALYTICS_EVENT_NAMES.signupComplete,
    ANALYTICS_EVENT_NAMES.dashboardView,
];
