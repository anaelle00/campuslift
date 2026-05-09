import Link from "next/link";
import { HandHeart } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-32 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <HandHeart className="h-8 w-8 text-primary" />
      </div>

      <p className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
        404
      </p>

      <h1 className="mt-3 font-display text-3xl font-bold">Page not found</h1>

      <p className="mt-4 text-muted-foreground">
        This page doesn&apos;t exist or has been moved. Head back to explore
        student projects looking for support.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/explore"
          className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Explore projects
        </Link>
        <Link
          href="/"
          className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-accent"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
