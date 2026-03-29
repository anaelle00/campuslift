import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { recordStripeCheckoutSession } from "@/features/donations/actions";
import { getStripeServer, getStripeWebhookSecret } from "@/lib/stripe/server";

export const runtime = "nodejs";

function isCheckoutSessionEvent(
  eventType: Stripe.Event.Type,
): eventType is "checkout.session.completed" | "checkout.session.async_payment_succeeded" {
  return (
    eventType === "checkout.session.completed" ||
    eventType === "checkout.session.async_payment_succeeded"
  );
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing Stripe signature.",
      },
      {
        status: 400,
      },
    );
  }

  const payload = await request.text();
  const stripe = getStripeServer();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      getStripeWebhookSecret(),
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Invalid Stripe webhook signature.",
      },
      {
        status: 400,
      },
    );
  }

  if (isCheckoutSessionEvent(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      const result = await recordStripeCheckoutSession(session);

      if (!result.success) {
        return NextResponse.json(result, {
          status: result.status ?? 500,
        });
      }
    }
  }

  return NextResponse.json({ success: true });
}
