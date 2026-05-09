import { NextResponse } from "next/server";
import { deleteProject, updateProject, updateProjectStatus } from "@/features/projects/actions";
import { enforceRateLimit } from "@/lib/rate-limit";
import type { ProjectStatus } from "@/types/project";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const rateLimitResponse = enforceRateLimit(request, {
    key: "projects:update",
    max: 10,
    windowMs: 10 * 60 * 1000,
    message: "Too many project update attempts. Please wait before trying again.",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { id } = await params;
  const formData = await request.formData();
  const result = await updateProject(id, formData);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}

export async function PUT(request: Request, { params }: Params) {
  const rateLimitResponse = enforceRateLimit(request, {
    key: "projects:status",
    max: 20,
    windowMs: 10 * 60 * 1000,
    message: "Too many status update attempts. Please wait before trying again.",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { id } = await params;
  const body = (await request.json()) as { status?: string };
  const result = await updateProjectStatus(id, body.status as ProjectStatus);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}

export async function DELETE(request: Request, { params }: Params) {
  const rateLimitResponse = enforceRateLimit(request, {
    key: "projects:delete",
    max: 5,
    windowMs: 10 * 60 * 1000,
    message: "Too many delete attempts. Please wait before trying again.",
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { id } = await params;
  const result = await deleteProject(id);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
