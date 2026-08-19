import { useState } from "react";
import { Modal } from "@/admin/components/Modal";
import { useGetBookingsQuery, useGetServicesQuery, useUpdateBookingStatusMutation } from "@/services/api";
import { Booking, BookingStatus } from "@/types";

const STATUSES: BookingStatus[] = ["pending", "confirmed", "in_progress", "completed", "cancelled"];

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  confirmed: "bg-blue-500/15 text-blue-400",
  in_progress: "bg-purple-500/15 text-purple-400",
  completed: "bg-green-500/15 text-green-400",
  cancelled: "bg-red-500/15 text-red-400",
};

export function AdminBookings() {
  const [status, setStatus] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const { data: bookings, isLoading } = useGetBookingsQuery({
    ...(status ? { status } : {}),
    ...(serviceId ? { serviceId } : {}),
    ...(search ? { search } : {}),
  });
  const { data: services } = useGetServicesQuery();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Bookings</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          placeholder="Search name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-white/15 bg-[#131315] px-3 py-2 text-sm text-white outline-none focus:border-nvn-red"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-white/15 bg-[#131315] px-3 py-2 text-sm text-white">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
        <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="rounded-md border border-white/15 bg-[#131315] px-3 py-2 text-sm text-white">
          <option value="">All Services</option>
          {services?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nameEn}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#131315] text-xs uppercase tracking-wide text-white/40">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/40">
                  Loading…
                </td>
              </tr>
            )}
            {bookings?.map((booking) => (
              <tr key={booking.id} onClick={() => setSelected(booking)} className="cursor-pointer hover:bg-white/5">
                <td className="px-4 py-3">
                  <p className="text-white">{booking.customerName}</p>
                  <p className="text-xs text-white/40">{booking.phone}</p>
                </td>
                <td className="px-4 py-3 text-white/70">{booking.service?.nameEn ?? "—"}</td>
                <td className="px-4 py-3 text-white/70">{booking.vehicleType}</td>
                <td className="px-4 py-3 text-white/70">
                  {new Date(booking.preferredDate).toLocaleDateString()} · {booking.preferredTime}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${STATUS_STYLES[booking.status]}`}>
                    {booking.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
            {bookings?.length === 0 && !isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/40">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && <BookingDetail booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function BookingDetail({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const [updateStatus, { isLoading }] = useUpdateBookingStatusMutation();
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [internalNotes, setInternalNotes] = useState(booking.internalNotes ?? "");

  async function save() {
    await updateStatus({ id: booking.id, status, internalNotes });
    onClose();
  }

  return (
    <Modal title="Booking Details" onClose={onClose}>
      <div className="space-y-3 text-sm">
        <Row label="Customer" value={booking.customerName} />
        <Row label="Phone" value={booking.phone} />
        {booking.whatsapp && <Row label="WhatsApp" value={booking.whatsapp} />}
        <Row label="Service" value={booking.service?.nameEn ?? "—"} />
        <Row label="Vehicle" value={`${booking.vehicleType} ${booking.vehicleMake ?? ""} ${booking.vehicleModel ?? ""}`.trim()} />
        <Row label="Date" value={`${new Date(booking.preferredDate).toLocaleDateString()} · ${booking.preferredTime}`} />
        {booking.notes && <Row label="Customer Notes" value={booking.notes} />}

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatus)}
            className="w-full rounded-md border border-white/15 bg-[#0B0B0C] px-3 py-2 text-sm text-white"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">Internal Notes</label>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-white/15 bg-[#0B0B0C] px-3 py-2 text-sm text-white"
          />
        </div>

        <button
          onClick={save}
          disabled={isLoading}
          className="w-full rounded-md bg-nvn-red py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-nvn-black disabled:opacity-60"
        >
          {isLoading ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
      <span className="text-white/40">{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}
