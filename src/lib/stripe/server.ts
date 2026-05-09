import "server-only";

import Stripe from "stripe";
import { publicEnv } from "@/lib/env";
import { serverEnv } from "@/lib/server-env";

let stripeClient: Stripe | null = null;

export function getStripeServer() {
  if (!stripeClient) {
    stripeClient = new Stripe(serverEnv.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

export function getStripeWebhookSecret() {
  return serverEnv.STRIPE_WEBHOOK_SECRET;
}

export function getStripeCurrency() {
  return serverEnv.STRIPE_CURRENCY;
}

export function resolveAppUrl(request?: Request) {
  const configuredAppUrl = publicEnv.NEXT_PUBLIC_APP_URL;

  if (configuredAppUrl) {
    return configuredAppUrl;
  }

  if (request) {
    return new URL(request.url).origin;
  }

  throw new Error(
    "Missing NEXT_PUBLIC_APP_URL environment variable for Stripe redirects.",
  );
}
