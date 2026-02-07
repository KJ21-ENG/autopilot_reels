import { getSupabaseServer } from "@/lib/supabase/server";
import { ANALYTICS_EVENT_NAMES } from "./events";

export type FunnelStats = {
    visits: number;
    ctaClicks: number;
    checkoutStarts: number;
    payments: number;
    signups: number;
};

export async function getFunnelStats(): Promise<FunnelStats> {
    const supabase = getSupabaseServer();

    const getCount = async (eventName: string) => {
        const { count, error } = await supabase
            .from("events")
            .select("*", { count: "exact", head: true })
            .eq("event_name", eventName);

        if (error) {
            console.error(`Error fetching count for ${eventName}:`, error);
            return 0;
        }
        return count || 0;
    };

    const [visits, ctaClicks, checkoutStarts, payments, signups] =
        await Promise.all([
            getCount(ANALYTICS_EVENT_NAMES.landingView),
            getCount(ANALYTICS_EVENT_NAMES.ctaClick),
            getCount(ANALYTICS_EVENT_NAMES.checkoutStart),
            getCount(ANALYTICS_EVENT_NAMES.paymentSuccess),
            getCount(ANALYTICS_EVENT_NAMES.signupComplete),
        ]);

    return {
        visits,
        ctaClicks,
        checkoutStarts,
        payments,
        signups,
    };
}
