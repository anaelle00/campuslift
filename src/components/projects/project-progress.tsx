import React from "react";

type Props = {
  current: number;
  target: number;
};

export default function ProjectProgress({ current, target }: Props) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>${current}</span>
        <span>${target}</span>
      </div>
    </div>
  );
}