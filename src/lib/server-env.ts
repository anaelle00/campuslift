import "server-only";

import { getOptionalEnv, getRequiredEnv } from "@/lib/env";

export const serverEnv = {
  SUPABASE_SERVICE_ROLE_KEY: getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  STRIPE_SECRET_KEY: getRequiredEnv("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: getRequiredEnv("STRIPE_WEBHOOK_SECRET"),
  STRIPE_CURRENCY: (getOptionalEnv("STRIPE_CURRENCY") ?? "cad").toLowerCase(),
  RESEND_API_KEY: getOptionalEnv("RESEND_API_KEY"),
};
