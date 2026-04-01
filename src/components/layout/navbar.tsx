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
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <HandHeart className="h-4.5 w-4.5" />
          </div>

          <div>
            <p className="font-display text-base font-bold tracking-tight">CampusLift</p>
            <p className="text-xs text-muted-foreground">Student project support</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                Dashboard
              </Link>
            ) : null}

            {isAdmin ? (
              <Link
                href="/admin/moderation"
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
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
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
                />
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
