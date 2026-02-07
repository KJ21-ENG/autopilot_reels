import { NextResponse } from "next/server";
import { getStripeServer } from "../../../../lib/stripe/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json(
            { error: { message: "Missing session_id." } },
            { status: 400 },
        );
    }

    try {
        const stripe = getStripeServer();
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return NextResponse.json({
            status: session.status,
            customer_email: session.customer_details?.email,
            client_secret: session.client_secret,
        });
    } catch (error: unknown) {
        console.error("Failed to retrieve Stripe session:", error);
        return NextResponse.json(
            {
                error: {
                    message:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                },
            },
            { status: 500 },
        );
    }
}
