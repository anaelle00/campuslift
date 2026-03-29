"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  projectId: string;
  initialIsFavorite: boolean;
  isLoggedIn: boolean;
};

export default function FavoriteButton({
  projectId,
  initialIsFavorite,
  isLoggedIn,
}: Props) {
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  async function handleToggleFavorite() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/projects/${projectId}/favorite`, {
        method: "POST",
      });
      const result = (await response.json()) as {
        success: boolean;
        message?: string;
        data?: { isFavorite: boolean };
      };

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        setErrorMessage(result.message ?? "Something went wrong.");
        return;
      }

      setIsFavorite(result.data?.isFavorite ?? !isFavorite);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-full border bg-white/90 p-2 shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`h-5 w-5 transition ${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
          }`}
        />
      </button>

      {errorMessage ? (
        <p className="max-w-36 text-right text-xs text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}
