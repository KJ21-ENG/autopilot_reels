export const STRIPE_PLANS = {
    Starter: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID || "price_1SyJyAAIyspwZEkIZ8DrkaaY",
        yearly: process.env.NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PRICE_ID || "price_1SyJyBAIyspwZEkIaoUfQlKf",
        productId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRODUCT_ID || "prod_TwCMItcK7xMREn",
    },
    Creator: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_CREATOR_MONTHLY_PRICE_ID || "price_1SyJyDAIyspwZEkIFivZ7DQS",
        yearly: process.env.NEXT_PUBLIC_STRIPE_CREATOR_YEARLY_PRICE_ID || "price_1SyJyFAIyspwZEkI9uwlltZI",
        productId: process.env.NEXT_PUBLIC_STRIPE_CREATOR_PRODUCT_ID || "prod_TwCMdE5bjkOPQz",
    },
    Pro: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || "price_1SyJyHAIyspwZEkIyQf2cxn8",
        yearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || "price_1SyJyIAIyspwZEkIbthcbTln",
        productId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID || "prod_TwCNMSTX3CBLfW",
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
