import Stripe from "stripe";
import { getStripeServer } from "./server";

// Cache for products/prices (server-side, in-memory)
let cachedPlans: Map<string, { monthly: string | null; yearly: string | null; productId: string }> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type PlanPrices = {
    monthly: string | null;
    yearly: string | null;
    productId: string;
};

/**
 * Fetches products and prices from Stripe and returns a map of plan name to price IDs.
 * Results are cached for 5 minutes.
 */
export async function getStripePlans(): Promise<Map<string, PlanPrices>> {
    const now = Date.now();

    // Return cached data if still valid
    if (cachedPlans && now - cacheTimestamp < CACHE_TTL_MS) {
        return cachedPlans;
    }

    const stripe = getStripeServer();

    // Fetch all active products
    const products = await stripe.products.list({
        active: true,
        limit: 10,
    });

    // Fetch all active prices
    const prices = await stripe.prices.list({
        active: true,
        limit: 50,
    });

    // Build a map of product ID to prices
    const pricesByProduct = new Map<
        string,
        { monthly: Stripe.Price | null; yearly: Stripe.Price | null }
    >();

    for (const price of prices.data) {
        const productId =
            typeof price.product === "string"
                ? price.product
                : (price.product as Stripe.Product)?.id;
        if (!productId || price.type !== "recurring") continue;

        const interval = price.recurring?.interval;
        if (!interval) continue;

        const existing = pricesByProduct.get(productId) || {
            monthly: null,
            yearly: null,
        };

        if (interval === "month") {
            existing.monthly = price;
        } else if (interval === "year") {
            existing.yearly = price;
        }

        pricesByProduct.set(productId, existing);
    }

    // Build plans map keyed by normalized plan name
    const plans = new Map<string, PlanPrices>();

    for (const product of products.data) {
        const productPrices = pricesByProduct.get(product.id);
        if (!productPrices?.monthly && !productPrices?.yearly) continue;

        // Normalize plan name: "Starter Plan" -> "Starter", "Creator Plan" -> "Creator"
        const normalizedName = product.name
            .replace(/ Plan$/i, "")
            .trim();

        plans.set(normalizedName, {
            monthly: productPrices?.monthly?.id || null,
            yearly: productPrices?.yearly?.id || null,
            productId: product.id,
        });

        // Also add with full name as fallback
        plans.set(product.name, {
            monthly: productPrices?.monthly?.id || null,
            yearly: productPrices?.yearly?.id || null,
            productId: product.id,
        });
    }

    // Update cache
    cachedPlans = plans;
    cacheTimestamp = now;

    return plans;
}

/**
 * Gets the price ID for a given plan and billing cycle.
 * First tries to fetch dynamically from Stripe, then falls back to env vars.
 */
export async function getDynamicPriceId(
    planName: string,
    billing: "monthly" | "yearly",
): Promise<string | null> {
    try {
        const plans = await getStripePlans();
        const plan = plans.get(planName) || plans.get(`${planName} Plan`);
        if (plan) {
            return plan[billing];
        }
    } catch (error) {
        console.warn("Failed to fetch dynamic prices, using fallback.", error);
    }

    // Fallback to env vars
    const { getPriceId } = await import("./plans");
    return getPriceId(planName, billing);
}

/**
 * Gets the product ID for a given plan.
 * First tries to fetch dynamically from Stripe, then falls back to env vars.
 */
export async function getDynamicProductId(
    planName: string,
): Promise<string | null> {
    try {
        const plans = await getStripePlans();
        const plan = plans.get(planName) || plans.get(`${planName} Plan`);
        if (plan) {
            return plan.productId;
        }
    } catch (error) {
        console.warn("Failed to fetch dynamic product ID, using fallback.", error);
    }

    // Fallback to env vars
    const { getProductId } = await import("./plans");
    return getProductId(planName);
}
