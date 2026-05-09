"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type NavLink = { href: string; label: string };

type Props = {
  links: NavLink[];
  isLoggedIn: boolean;
  isAdmin: boolean;
};

export default function MobileMenu({ links, isLoggedIn, isAdmin }: Props) {
  const [open, setOpen] = useState(false);

  const allLinks = [
    ...links,
    ...(isLoggedIn ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    ...(isAdmin ? [{ href: "/admin/moderation", label: "Admin" }] : []),
    ...(!isLoggedIn ? [{ href: "/login", label: "Log in" }] : []),
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+1px)] z-50 border-b border-border/60 bg-background/95 px-6 py-4 backdrop-blur-md">
          <nav className="flex flex-col gap-1">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
