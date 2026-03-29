import { NextResponse } from "next/server";
import { toggleFavorite } from "@/features/projects/actions";
import { enforceRateLimit } from "@/lib/rate-limit";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const rateLimitResponse = enforceRateLimit(request, {
    key: "projects:favorite",
    max: 60,
    windowMs: 5 * 60 * 1000,
    message: "Too many favorite updates. Please wait a moment before trying again.",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { id } = await context.params;
  const result = await toggleFavorite(id);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
