type Props = {
  label: string;
  value: string;
  helper?: string;
};

export default function StatsCard({ label, value, helper }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {helper ? <p className="mt-2 text-sm text-gray-400">{helper}</p> : null}
    </div>
  );
}