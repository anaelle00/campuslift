import { NextResponse } from "next/server";
import { createSupportCheckoutSession } from "@/features/donations/actions";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
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

  const result = await createSupportCheckoutSession(id, amount, request);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
