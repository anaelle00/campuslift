"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  projectId: string;
  projectTitle: string;
  redirectTo?: string;
};

export default function DeleteProjectButton({
  projectId,
  projectTitle,
  redirectTo = "/dashboard",
}: Props) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as { success: boolean; message?: string };

      if (!response.ok || !result.success) {
        setError(result.message ?? "Something went wrong.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 space-y-3">
        <p className="text-sm font-medium text-foreground">
          Delete <span className="font-semibold">&ldquo;{projectTitle}&rdquo;</span>?
        </p>
        <p className="text-xs text-muted-foreground">
          This will permanently remove the project, all pledges, comments, and favorites. This cannot be undone.
        </p>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Yes, delete"}
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => { setShowConfirm(false); setError(""); }}
            className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-accent disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className="rounded-xl border border-destructive/30 px-4 py-2 text-sm font-semibold text-destructive transition hover:bg-destructive/5"
    >
      Delete project
    </button>
  );
}
