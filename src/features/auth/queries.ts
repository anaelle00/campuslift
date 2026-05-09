import { createClient } from "@/lib/supabase/server";

export async function getNavbarData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      avatarUrl: null as string | null,
      isAdmin: false,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    avatarUrl: profile?.avatar_url ?? null,
    isAdmin: profile?.role === "admin",
  };
}
