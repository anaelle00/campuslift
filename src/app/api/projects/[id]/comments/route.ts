import { NextResponse } from "next/server";
import { createComment } from "@/features/comments/actions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;

  let body: unknown = null;
  let parentId: unknown = null;

  try {
    const payload = await request.json();
    body = payload.body;
    parentId = payload.parentId;
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

  const result = await createComment(id, body, parentId);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
