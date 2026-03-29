import { NextResponse } from "next/server";
import { moderateReport } from "@/features/moderation/actions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  let action: unknown = null;

  try {
    const payload = await request.json();
    action = payload.action;
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

  if (action !== "resolve" && action !== "dismiss" && action !== "delete_comment") {
    return NextResponse.json(
      {
        success: false,
        message: "Unknown moderation action.",
      },
      {
        status: 400,
      },
    );
  }

  const result = await moderateReport(id, action);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
