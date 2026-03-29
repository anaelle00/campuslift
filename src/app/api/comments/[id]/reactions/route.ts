import { NextResponse } from "next/server";
import { toggleCommentReaction } from "@/features/comments/actions";
import { enforceRateLimit } from "@/lib/rate-limit";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const rateLimitResponse = enforceRateLimit(request, {
    key: "comments:reactions",
    max: 60,
    windowMs: 5 * 60 * 1000,
    message: "Too many reaction updates. Please wait a moment before trying again.",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { id } = await context.params;

  let reactionType: unknown = null;

  try {
    const payload = await request.json();
    reactionType = payload.reactionType;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body.",
      },
      {
        status: 400,
      },
    );
  }

  if (reactionType !== "like" && reactionType !== "dislike") {
    return NextResponse.json(
      {
        success: false,
        message: "Reaction type must be like or dislike.",
      },
      {
        status: 400,
      },
    );
  }

  const result = await toggleCommentReaction(id, reactionType);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
