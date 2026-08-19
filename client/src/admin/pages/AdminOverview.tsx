import { useGetOverviewQuery } from "@/services/api";
import { Overview } from "@/types";

const CARDS: { key: keyof Overview; label: string }[] = [
  { key: "totalBookings", label: "Total Bookings" },
  { key: "pendingBookings", label: "Pending" },
  { key: "confirmedBookings", label: "Confirmed" },
  { key: "completedBookings", label: "Completed" },
  { key: "services", label: "Services" },
  { key: "galleryItems", label: "Gallery Items" },
  { key: "reviews", label: "Reviews" },
];

export function AdminOverview() {
  const { data, isLoading } = useGetOverviewQuery();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">Overview of NVN Cars activity.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading &&
          Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-white/5" />)}
        {data &&
          CARDS.map((card) => (
            <div key={card.key} className="rounded-lg border border-white/10 bg-[#131315] p-5">
              <p className="text-xs uppercase tracking-wide text-white/40">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{data[card.key]}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
