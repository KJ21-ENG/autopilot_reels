import { getSupabaseServer } from "@/lib/supabase/server";
import { ANALYTICS_EVENT_NAMES } from "./events";

export type RecentPayment = {
    id: string;
    email: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
};

export type FunnelStats = {
    visits: number;
    ctaClicks: number;
    checkoutStarts: number;
    payments: number;
    signups: number;
    totalRevenue: number;
    totalUsers: number;
    recentPayments: RecentPayment[];
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

    const [
        visits,
        ctaClicks,
        checkoutStarts,
        paymentsCount,
        signups,
        revenueData,
        usersData,
        recentPaymentsData,
    ] = await Promise.all([
        getCount(ANALYTICS_EVENT_NAMES.landingView),
        getCount(ANALYTICS_EVENT_NAMES.ctaClick),
        getCount(ANALYTICS_EVENT_NAMES.checkoutStart),
        getCount(ANALYTICS_EVENT_NAMES.paymentSuccess),
        getCount(ANALYTICS_EVENT_NAMES.signupComplete),
        supabase.from("payments").select("amount").eq("status", "succeeded"),
        supabase
            .from("user_payment_links")
            .select("id", { count: "exact", head: true }),
        supabase
            .from("payments")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
    ]);

    const totalRevenue = (revenueData.data || []).reduce(
        (acc, curr) => acc + curr.amount,
        0,
    );
    const totalUsers = usersData.count || 0;
    const recentPayments = (recentPaymentsData.data || []) as RecentPayment[];

    return {
        visits,
        ctaClicks,
        checkoutStarts,
        payments: paymentsCount,
        signups,
        totalRevenue,
        totalUsers,
        recentPayments,
    };
}
