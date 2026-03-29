import { NextResponse } from "next/server";
import { createProject } from "@/features/projects/actions";

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await createProject(formData);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
