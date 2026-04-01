import { NextResponse } from "next/server";
import { updateProject } from "@/features/projects/actions";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const formData = await request.formData();
  const result = await updateProject(id, formData);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
