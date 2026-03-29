"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  isLoggedIn: boolean;
};

export default function AuthButton({ isLoggedIn }: Props) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Log in
      </Link>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
    >
      Log out
    </button>
  );
}
