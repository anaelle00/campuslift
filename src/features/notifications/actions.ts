import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, actionSuccess, type ActionResult } from "@/features/shared/result";

export async function createNotification({
  userId,
  type,
  title,
  body,
  projectId,
}: {
  userId: string;
  type: "new_supporter" | "new_comment";
  title: string;
  body: string;
  projectId?: string;
}): Promise<ActionResult> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    body,
    project_id: projectId ?? null,
  });

  if (error) {
    return actionFailure(error.message);
  }

  return actionSuccess();
}

export async function markNotificationRead(notificationId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return actionFailure("Unauthorized.", 401);
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  if (error) {
    return actionFailure(error.message);
  }

  return actionSuccess();
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return actionFailure("Unauthorized.", 401);
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) {
    return actionFailure(error.message);
  }

  return actionSuccess();
}
