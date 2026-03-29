import { NextResponse } from "next/server";
import { toggleFavorite } from "@/features/projects/actions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const result = await toggleFavorite(id);

  return NextResponse.json(result, {
    status: result.success ? 200 : (result.status ?? 400),
  });
}
