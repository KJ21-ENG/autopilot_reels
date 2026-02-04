# Analytics Plumbing (Baseline)

## Purpose
This project uses a minimal, internal analytics endpoint to capture funnel events without external tooling.

## Event Schema
All events use a consistent payload:

```
{
  event_name: string,
  user_id?: string,
  session_id?: string,
  metadata?: object
}
```

- `event_name` uses `snake_case` and should map to the funnel stage.
- `user_id` is the Supabase user id when available.
- `session_id` is an anonymous session token when available.
- `metadata` contains small, JSON-serializable details.

Baseline event names (expandable later):
- `landing_view`
- `cta_click`
- `checkout_start`

## Where To Emit Events
- Landing page render: `landing_view`
- Primary CTA buttons: `cta_click`
- Checkout start (future Stripe flow): `checkout_start`

## How To Emit
Use the helper in `frontend/lib/analytics/emit.ts`:

```
import { emitAnalyticsEvent, ANALYTICS_EVENT_NAMES } from "@/lib/analytics";

await emitAnalyticsEvent(
  {
    event_name: ANALYTICS_EVENT_NAMES.ctaClick,
    metadata: { location: "hero" },
  },
  { useBeacon: true, beaconOnly: true }
);
```

## API
POST `/api/analytics/event` returns `{ data, error }` with `data.recorded = true` on success.
