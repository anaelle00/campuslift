import { NextResponse } from "next/server";
import { markNotificationRead } from "@/features/notifications/actions";
import { enforceRateLimit } from "@/lib/rate-limit";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const rateLimitResponse = enforceRateLimit(request, {
    key: "notifications:read",
    max: 60,
    windowMs: 60 * 1000,
    message: "Too many requests.",
  });
  if (rateLimitResponse) return rateLimitResponse;

  const { id } = await context.params;
  const result = await markNotificationRead(id);
  return NextResponse.json(result, { status: result.success ? 200 : (result.status ?? 500) });
}
