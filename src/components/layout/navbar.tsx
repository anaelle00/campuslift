import Image from "next/image";
import Link from "next/link";
import { HandHeart } from "lucide-react";
import LogoutButton from "@/components/auth/logout-button";
import { getNavbarData } from "@/features/auth/queries";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/create", label: "Create" },
];

export default async function Navbar() {
  const { user, avatarUrl, isAdmin } = await getNavbarData();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
            <HandHeart className="h-5 w-5" />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight">CampusLift</p>
            <p className="text-xs text-gray-500">Student project support</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black"
              >
                Dashboard
              </Link>
            ) : null}

            {isAdmin ? (
              <Link
                href="/admin/moderation"
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black"
              >
                Admin
              </Link>
            ) : null}
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <Image
                  src={avatarUrl || "/avatar-placeholder.png"}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
