import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import LogoutButton from "@/components/auth/logout-button";
import { getNavbarData } from "@/features/auth/queries";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/create", label: "Create" },
];

export default async function Navbar() {
  const { user, avatarUrl, isAdmin } = await getNavbarData();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20 transition group-hover:shadow-primary/40">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="font-display text-[15px] font-bold tracking-tight">
            CampusLift
          </span>
        </Link>

        {/* Nav + Auth */}
        <div className="flex items-center gap-1.5">
          <nav className="flex items-center gap-0.5 mr-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                href="/dashboard"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin/moderation"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Admin
              </Link>
            )}
          </nav>

          {user ? (
            <div className="flex items-center gap-2.5">
              <Link href="/profile">
                <Image
                  src={avatarUrl || "/avatar-placeholder.png"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/25 transition hover:ring-primary/50"
                />
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition hover:opacity-90 hover:shadow-primary/30"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
