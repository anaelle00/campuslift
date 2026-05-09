import { createClient } from "@/lib/supabase/server";

export type Notification = {
  id: string;
  type: "new_supporter" | "new_comment";
  title: string;
  body: string;
  project_id: string | null;
  read: boolean;
  created_at: string;
};

export async function getNotifications(): Promise<{
  notifications: Notification[];
  unreadCount: number;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { notifications: [], unreadCount: 0, error: null };
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, project_id, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    return { notifications: [], unreadCount: 0, error: error.message };
  }

  const notifications = (data ?? []) as Notification[];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, error: null };
}
