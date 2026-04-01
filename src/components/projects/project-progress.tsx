type Props = {
  current: number;
  target: number;
};

export default function ProjectProgress({ current, target }: Props) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full">
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          ${current.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">
          {Math.round(percentage)}% of ${target.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
