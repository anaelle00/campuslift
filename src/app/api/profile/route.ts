import { NextResponse } from "next/server";
import { updateProfile } from "@/features/profiles/actions";

export async function PATCH(request: Request) {
  const formData = await request.formData();
  const result = await updateProfile(formData);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
