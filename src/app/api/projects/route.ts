import { NextResponse } from "next/server";
import { createProject } from "@/features/projects/actions";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const rateLimitResponse = enforceRateLimit(request, {
    key: "projects:create",
    max: 5,
    windowMs: 10 * 60 * 1000,
    message: "Too many project creation attempts. Please try again later.",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const formData = await request.formData();
  const result = await createProject(formData);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
