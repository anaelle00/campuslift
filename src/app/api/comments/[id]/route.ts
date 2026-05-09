import { NextResponse } from "next/server";
import { deleteComment } from "@/features/comments/actions";
import { enforceRateLimit } from "@/lib/rate-limit";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  const rateLimitResponse = enforceRateLimit(request, {
    key: "comments:delete",
    max: 20,
    windowMs: 10 * 60 * 1000,
    message: "Too many delete attempts. Please wait before trying again.",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { id } = await context.params;
  const result = await deleteComment(id);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
