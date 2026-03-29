import Link from "next/link";
import type { PaymentHistoryItem } from "@/features/donations/queries";

type Props = {
  title: string;
  description: string;
  counterpartyLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  items: PaymentHistoryItem[];
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function SupportHistoryList({
  title,
  description,
  counterpartyLabel,
  emptyTitle,
  emptyDescription,
  items,
}: Props) {
  return (
    <section className="space-y-4 rounded-3xl border bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      {items.length ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {dateFormatter.format(new Date(item.createdAt))}
                </p>

                <Link
                  href={item.projectHref}
                  className="text-lg font-semibold transition hover:underline"
                >
                  {item.projectTitle}
                </Link>

                <p className="text-sm text-gray-600">
                  {counterpartyLabel}:{" "}
                  {item.counterpartyHref ? (
                    <Link href={item.counterpartyHref} className="hover:underline">
                      {item.counterpartyLabel}
                    </Link>
                  ) : (
                    item.counterpartyLabel
                  )}
                </p>
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <p className="text-xl font-bold">
                  {currencyFormatter.format(item.amount)}
                </p>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-600">
                  {item.source === "stripe" ? "Stripe" : "Legacy support"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed p-6 text-center">
          <h3 className="text-lg font-semibold">{emptyTitle}</h3>
          <p className="mt-2 text-sm text-gray-600">{emptyDescription}</p>
        </div>
      )}
    </section>
  );
}
