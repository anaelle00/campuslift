import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getStripeCurrency,
  getStripeServer,
  resolveAppUrl,
} from "@/lib/stripe/server";
import { validateSupportAmount } from "@/features/donations/schemas";
import { actionFailure, actionSuccess, type ActionResult } from "@/features/shared/result";
import type Stripe from "stripe";

type SupportProjectResponse = {
  current_amount: number;
  supporters_count: number;
};

type StripeSupportResponse = SupportProjectResponse & {
  already_processed: boolean;
};

export async function supportProject(
  projectId: string,
  rawAmount: unknown,
): Promise<ActionResult<SupportProjectResponse[]>> {
  if (!projectId.trim()) {
    return actionFailure("Project id is required.");
  }

  const { amount, error: validationError } = validateSupportAmount(rawAmount);

  if (validationError || amount === null) {
    return actionFailure(validationError ?? "Invalid amount.");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionFailure("You must be logged in to support a project.", 401);
  }

  const { data, error } = await supabase.rpc("support_project", {
    p_project_id: projectId,
    p_amount: amount,
  });

  if (error) {
    return actionFailure(error.message);
  }

  return actionSuccess((data ?? []) as SupportProjectResponse[]);
}

export async function createSupportCheckoutSession(
  projectId: string,
  rawAmount: unknown,
  request: Request,
): Promise<ActionResult<{ url: string }>> {
  if (!projectId.trim()) {
    return actionFailure("Project id is required.");
  }

  const { amount, error: validationError } = validateSupportAmount(rawAmount);

  if (validationError || amount === null) {
    return actionFailure(validationError ?? "Invalid amount.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return actionFailure("You must be logged in to support a project.", 401);
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, title, short_description")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    return actionFailure("Project not found.", 404);
  }

  const unitAmount = Math.round(amount * 100);

  if (unitAmount <= 0) {
    return actionFailure("Please enter a valid amount greater than 0.");
  }

  try {
    const stripe = getStripeServer();
    const appUrl = resolveAppUrl(request);
    const successUrl = new URL("/support/success", appUrl);
    successUrl.searchParams.set("projectId", projectId);
    successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");

    const cancelUrl = new URL("/support/cancel", appUrl);
    cancelUrl.searchParams.set("projectId", projectId);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: getStripeCurrency(),
            unit_amount: unitAmount,
            product_data: {
              name: `Support ${project.title}`,
              description: project.short_description,
            },
          },
        },
      ],
      metadata: {
        source: "campuslift_support",
        projectId,
        userId: user.id,
      },
      payment_intent_data: {
        metadata: {
          source: "campuslift_support",
          projectId,
          userId: user.id,
        },
      },
    });

    if (!session.url) {
      return actionFailure("Stripe did not return a checkout URL.");
    }

    return actionSuccess({ url: session.url });
  } catch (error) {
    return actionFailure(
      error instanceof Error ? error.message : "Unable to start Stripe checkout.",
    );
  }
}

export async function recordStripeCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<ActionResult<StripeSupportResponse[]>> {
  const projectId = session.metadata?.projectId;
  const userId = session.metadata?.userId ?? session.client_reference_id;
  const amountTotal = session.amount_total;

  if (session.metadata?.source !== "campuslift_support") {
    return actionSuccess([]);
  }

  if (!projectId || !userId) {
    return actionFailure("Missing Stripe session metadata.", 400);
  }

  if (!amountTotal || amountTotal <= 0) {
    return actionFailure("Stripe session is missing an amount.", 400);
  }

  const checkoutSessionId = session.id;
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("record_stripe_support", {
        p_amount: amountTotal / 100,
        p_checkout_session_id: checkoutSessionId,
        p_payment_intent_id: paymentIntentId,
        p_project_id: projectId,
        p_user_id: userId,
    });

    if (error) {
      return actionFailure(error.message, 500);
    }

    return actionSuccess((data ?? []) as StripeSupportResponse[]);
  } catch (error) {
    return actionFailure(
      error instanceof Error
        ? error.message
        : "Unable to record the Stripe payment.",
      500,
    );
  }
}
