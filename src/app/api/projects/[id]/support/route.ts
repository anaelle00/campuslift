import { NextResponse } from "next/server";
import { supportProject } from "@/features/donations/actions";
import { enforceRateLimit } from "@/lib/rate-limit";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const rateLimitResponse = enforceRateLimit(request, {
    key: "donations:legacy-support",
    max: 10,
    windowMs: 5 * 60 * 1000,
    message: "Too many support attempts. Please wait a moment before trying again.",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { id } = await context.params;

  let amount: unknown = null;

  try {
    const body = await request.json();
    amount = body.amount;
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

  const result = await supportProject(id, amount);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
