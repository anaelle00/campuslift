import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name} environment variable.`);
  }

  return value;
}

export function getStripeServer() {
  if (!stripeClient) {
    stripeClient = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"));
  }

  return stripeClient;
}

export function getStripeWebhookSecret() {
  return getRequiredEnv("STRIPE_WEBHOOK_SECRET");
}

export function getStripeCurrency() {
  return (process.env.STRIPE_CURRENCY ?? "cad").toLowerCase();
}

export function resolveAppUrl(request?: Request) {
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredAppUrl) {
    return configuredAppUrl.replace(/\/$/, "");
  }

  if (request) {
    return new URL(request.url).origin;
  }

  throw new Error(
    "Missing NEXT_PUBLIC_APP_URL environment variable for Stripe redirects.",
  );
}
