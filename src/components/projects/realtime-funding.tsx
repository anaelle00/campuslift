"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProjectProgress from "@/components/projects/project-progress";

type Props = {
  projectId: string;
  initialAmount: number;
  initialSupporters: number;
  targetAmount: number;
};

export default function RealtimeFunding({
  projectId,
  initialAmount,
  initialSupporters,
  targetAmount,
}: Props) {
  const [currentAmount, setCurrentAmount] = useState(initialAmount);
  const [supporters, setSupporters] = useState(initialSupporters);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`project-funding:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "projects",
          filter: `id=eq.${projectId}`,
        },
        (payload) => {
          const updated = payload.new as {
            current_amount: number;
            supporters_count: number;
          };
          setCurrentAmount(updated.current_amount);
          setSupporters(updated.supporters_count);
          setFlash(true);
          setTimeout(() => setFlash(false), 1500);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [projectId]);

  return (
    <div className={`space-y-3 transition-all duration-300 ${flash ? "opacity-70" : "opacity-100"}`}>
      <ProjectProgress current={currentAmount} target={targetAmount} />

      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{supporters}</span>{" "}
        {supporters === 1 ? "supporter" : "supporters"}
        {flash && (
          <span className="ml-2 inline-block animate-pulse rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
            Just updated
          </span>
        )}
      </p>
    </div>
  );
}
