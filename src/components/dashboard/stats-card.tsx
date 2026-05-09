type Props = {
  label: string;
  value: string;
  helper?: string;
};

export default function StatsCard({ label, value, helper }: Props) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      {helper ? <p className="mt-1.5 text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}