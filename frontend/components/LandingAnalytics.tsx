"use client";

import { useEffect } from "react";

import { ANALYTICS_EVENT_NAMES, emitAnalyticsEvent } from "@/lib/analytics";

export default function LandingAnalytics() {
    useEffect(() => {
        void emitAnalyticsEvent({
            event_name: ANALYTICS_EVENT_NAMES.landingView,
            metadata: { route: "/" },
        });
    }, []);

    return null;
}
