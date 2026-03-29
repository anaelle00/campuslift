import { NextResponse } from "next/server";
import { reportComment } from "@/features/comments/actions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;

  let reason: unknown = null;
  let details: unknown = null;

  try {
    const payload = await request.json();
    reason = payload.reason;
    details = payload.details;
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

  const result = await reportComment(id, reason, details);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
