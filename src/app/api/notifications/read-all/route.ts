import { NextResponse } from "next/server";
import { markAllNotificationsRead } from "@/features/notifications/actions";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const rateLimitResponse = enforceRateLimit(request, {
    key: "notifications:read-all",
    max: 20,
    windowMs: 60 * 1000,
    message: "Too many requests.",
  });
  if (rateLimitResponse) return rateLimitResponse;

  const result = await markAllNotificationsRead();
  return NextResponse.json(result, { status: result.success ? 200 : (result.status ?? 500) });
}
