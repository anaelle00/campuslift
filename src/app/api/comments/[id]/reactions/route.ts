import { NextResponse } from "next/server";
import { toggleCommentReaction } from "@/features/comments/actions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
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
