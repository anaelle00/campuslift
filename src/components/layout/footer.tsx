import Link from "next/link";
import { HandHeart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <HandHeart className="h-4 w-4" />
              </div>
              <span className="font-display text-base font-bold tracking-tight">CampusLift</span>
            </Link>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Helping students bring their projects to life — one supporter at a time.
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
            <Link href="/explore" className="text-muted-foreground transition hover:text-foreground">
              Explore
            </Link>
            <Link href="/create" className="text-muted-foreground transition hover:text-foreground">
              Start a project
            </Link>
            <Link href="/login" className="text-muted-foreground transition hover:text-foreground">
              Log in
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CampusLift. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
