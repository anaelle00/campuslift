import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { actionFailure, actionSuccess, type ActionResult } from "@/features/shared/result";

type ModerationAction = "resolve" | "dismiss" | "delete_comment";

async function requireAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: actionFailure("You must be logged in to moderate reports.", 401),
      adminUserId: null,
      adminSupabase: null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      error: actionFailure("You are not allowed to moderate reports.", 403),
      adminUserId: null,
      adminSupabase: null,
    };
  }

  return {
    error: null,
    adminUserId: user.id,
    adminSupabase: createAdminClient(),
  };
}

export async function moderateReport(
  reportId: string,
  action: ModerationAction,
): Promise<ActionResult> {
  if (!reportId.trim()) {
    return actionFailure("Report id is required.");
  }

  const access = await requireAdminAccess();

  if (access.error || !access.adminSupabase || !access.adminUserId) {
    return access.error ?? actionFailure("Unable to verify admin access.", 403);
  }

  const { data: report, error: reportError } = await access.adminSupabase
    .from("comment_reports")
    .select("id, comment_id")
    .eq("id", reportId)
    .single();

  if (reportError || !report) {
    return actionFailure("Report not found.", 404);
  }

  if (action === "delete_comment") {
    const { error } = await access.adminSupabase
      .from("comments")
      .delete()
      .eq("id", report.comment_id);

    if (error) {
      return actionFailure(error.message);
    }

    return actionSuccess(undefined, "Comment deleted.");
  }

  const nextStatus = action === "resolve" ? "resolved" : "dismissed";
  const { error } = await access.adminSupabase
    .from("comment_reports")
    .update({
      status: nextStatus,
      reviewed_at: new Date().toISOString(),
      reviewed_by: access.adminUserId,
    })
    .eq("id", reportId);

  if (error) {
    return actionFailure(error.message);
  }

  return actionSuccess(undefined, `Report ${nextStatus}.`);
}
