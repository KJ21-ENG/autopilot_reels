import Stripe from "stripe";

const stripeApiVersion = "2025-12-15.clover";

export function getStripeServer() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
        throw new Error("Missing STRIPE_SECRET_KEY");
    }

    return new Stripe(stripeSecretKey, { apiVersion: stripeApiVersion });
}
