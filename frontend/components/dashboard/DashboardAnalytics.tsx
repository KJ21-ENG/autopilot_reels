"use client";

import { useEffect, useRef } from "react";
import { emitAnalyticsEvent } from "@/lib/analytics/emit";

interface DashboardAnalyticsProps {
    userId: string;
}

export default function DashboardAnalytics({
    userId,
}: DashboardAnalyticsProps) {
    const hasEmittedRef = useRef(false);

    useEffect(() => {
        // Prevent double emission in Strict Mode/development
        if (hasEmittedRef.current) return;

        const emitEvent = async () => {
            try {
                await emitAnalyticsEvent({
                    event_name: "dashboard_view",
                    user_id: userId,
                    metadata: {
                        // Additional context could go here if needed
                    },
                });
                hasEmittedRef.current = true;
            } catch (error) {
                console.error("Failed to emit dashboard view event:", error);
            }
        };

        emitEvent();
    }, [userId]);

    return null; // This component renders nothing
}
