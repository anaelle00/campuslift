import { NextResponse } from "next/server";
import { deleteComment } from "@/features/comments/actions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const result = await deleteComment(id);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
