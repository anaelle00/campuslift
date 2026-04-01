import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { recordStripeCheckoutSession } from "@/features/donations/actions";
import { getStripeServer, getStripeWebhookSecret } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSupportNotification } from "@/lib/resend";

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

      // Send email notification to project owner (non-blocking)
      const projectId = session.metadata?.projectId;
      const amountTotal = session.amount_total;

      if (projectId && amountTotal) {
        try {
          const supabase = createAdminClient();

          const { data: project } = await supabase
            .from("projects")
            .select("title, owner_id, owner_name")
            .eq("id", projectId)
            .single();

          if (project?.owner_id) {
            const { data: ownerAuth } = await supabase.auth.admin.getUserById(
              project.owner_id,
            );

            if (ownerAuth.user?.email) {
              await sendSupportNotification({
                ownerEmail: ownerAuth.user.email,
                ownerName: project.owner_name,
                projectTitle: project.title,
                projectId,
                amount: amountTotal / 100,
              });
            }
          }
        } catch {
          // Email failure must never break the payment flow
        }
      }
    }
  }

  return NextResponse.json({ success: true });
}
