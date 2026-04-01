type Props = {
  current: number;
  target: number;
};

export default function ProjectProgress({ current, target }: Props) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">${current}</span>
        <span>${target} goal</span>
      </div>
    </div>
  );
}