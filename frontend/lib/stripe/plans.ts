export const STRIPE_PLANS = {
    Starter: {
        monthly: "price_1Sy7QZDtHMbPRbCHFW2Pyxq8",
        yearly: "price_1Sy7QaDtHMbPRbCH3ZFljcLb",
        productId: "prod_TvzPEtCINh4M0L",
    },
    Creator: {
        monthly: "price_1Sy7QdDtHMbPRbCHJLEhPU9e",
        yearly: "price_1Sy7QeDtHMbPRbCH6kYPAPAR",
        productId: "prod_TvzP1YPXubfvkO",
    },
    Pro: {
        monthly: "price_1Sy7QgDtHMbPRbCHdqtfZJyG",
        yearly: "price_1Sy7QiDtHMbPRbCHUuaUHZpX",
        productId: "prod_TvzPdD19YhyTzS",
    },
} as const;

export type PlanName = keyof typeof STRIPE_PLANS;
export type BillingCycle = "monthly" | "yearly";

export function getPriceId(
    planName: string,
    billing: BillingCycle,
): string | null {
    const plan = STRIPE_PLANS[planName as PlanName];
    if (!plan) return null;
    return plan[billing];
}

export function getProductId(planName: string): string | null {
    const plan = STRIPE_PLANS[planName as PlanName];
    if (!plan) return null;
    return plan.productId;
}
