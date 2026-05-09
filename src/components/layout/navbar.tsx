import Image from "next/image";
import Link from "next/link";
import { HandHeart } from "lucide-react";
import LogoutButton from "@/components/auth/logout-button";
import ThemeToggle from "@/components/layout/theme-toggle";
import MobileMenu from "@/components/layout/mobile-menu";
import NotificationBell from "@/components/notifications/notification-bell";
import { getNavbarData } from "@/features/auth/queries";
import { getNotifications } from "@/features/notifications/queries";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/create", label: "Create" },
];

export default async function Navbar() {
  const { user, avatarUrl, isAdmin } = await getNavbarData();
  const { notifications, unreadCount } = user ? await getNotifications() : { notifications: [], unreadCount: 0 };

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
          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
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

          <ThemeToggle />

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <NotificationBell
                initialNotifications={notifications}
                initialUnreadCount={unreadCount}
                userId={user.id}
              />
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
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 md:inline-flex"
            >
              Log in
            </Link>
          )}

          {/* Mobile hamburger */}
          <MobileMenu links={navLinks} isLoggedIn={!!user} isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
