"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  projectId: string;
  isLoggedIn: boolean;
};

export default function SupportProjectForm({ projectId, isLoggedIn }: Props) {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const parsedAmount = Number(amount);

    if (!amount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid amount greater than 0.");
      return;
    }

    setIsRedirecting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parsedAmount,
        }),
      });
      const result = (await response.json()) as {
        success: boolean;
        data?: {
          url?: string;
        };
        message?: string;
      };

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        setErrorMessage(result.message ?? "Something went wrong.");
        return;
      }

      if (!result.data?.url) {
        setErrorMessage("Stripe did not return a checkout URL.");
        return;
      }

      window.location.assign(result.data.url);
    } finally {
      setIsRedirecting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex flex-col">
        <input
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-40 rounded-lg border px-3 py-2"
        />
        {errorMessage ? (
          <p className="mt-2 text-xs text-red-500">{errorMessage}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isRedirecting}
        className="rounded-lg bg-black px-4 py-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRedirecting ? "Redirecting..." : "Support this project"}
      </button>
    </form>
  );
}
