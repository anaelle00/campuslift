import { NextResponse } from "next/server";
import { updateProfile } from "@/features/profiles/actions";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function PATCH(request: Request) {
  const rateLimitResponse = enforceRateLimit(request, {
    key: "profiles:update",
    max: 20,
    windowMs: 10 * 60 * 1000,
    message: "Too many profile update attempts. Please wait before trying again.",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const formData = await request.formData();
  const result = await updateProfile(formData);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
