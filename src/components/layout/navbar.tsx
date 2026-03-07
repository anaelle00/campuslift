"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HandHeart } from "lucide-react";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/create", label: "Create" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();

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

        <nav className="flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}