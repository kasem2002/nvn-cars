import { useState } from "react";
import { FormField, inputClass } from "@/admin/components/FormField";
import { ImageUpload } from "@/admin/components/ImageUpload";
import { Modal } from "@/admin/components/Modal";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsQuery,
  useUpdateReviewMutation,
} from "@/services/api";
import { Review } from "@/types";

type Form = Omit<Review, "id" | "createdAt" | "date"> & { date?: string };

const EMPTY: Form = {
  customerName: "",
  rating: 5,
  reviewEn: "",
  reviewAr: "",
  vehicle: "",
  customerImage: "",
  featured: false,
  approved: false,
};

export function AdminReviews() {
  const { data: reviews, isLoading } = useGetReviewsQuery();
  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [editing, setEditing] = useState<Review | "new" | null>(null);

  async function toggleApproved(review: Review) {
    await updateReview({ id: review.id, body: { approved: !review.approved } });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Reviews</h1>
        <button onClick={() => setEditing("new")} className="rounded-md bg-nvn-red px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-nvn-black">
          + Add Review
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#131315] text-xs uppercase tracking-wide text-white/40">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Approved</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-white/40">
                  Loading…
                </td>
              </tr>
            )}
            {reviews?.map((r) => (
              <tr key={r.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white">{r.customerName}</td>
                <td className="px-4 py-3 text-white/70">{"★".repeat(r.rating)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleApproved(r)}
                    className={`rounded-full px-2.5 py-1 text-xs ${r.approved ? "bg-green-500/15 text-green-400" : "bg-white/10 text-white/40"}`}
                  >
                    {r.approved ? "Approved" : "Pending"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(r)} className="mr-3 text-nvn-red hover:underline">
                    Edit
                  </button>
                  <button onClick={() => window.confirm("Delete this review?") && deleteReview(r.id)} className="text-white/40 hover:text-red-400">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ReviewModal
          review={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (form) => {
            if (editing === "new") await createReview(form);
            else await updateReview({ id: editing.id, body: form });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ReviewModal({
  review,
  onClose,
  onSave,
}: {
  review: Review | null;
  onClose: () => void;
  onSave: (form: Form) => Promise<void>;
}) {
  const [form, setForm] = useState<Form>(review ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <Modal title={review ? "Edit Review" : "New Review"} onClose={onClose} wide>
      <ImageUpload
        label="Customer Photo (optional)"
        value={form.customerImage}
        onChange={(url) => set("customerImage", url)}
        aspect="aspect-square"
      />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Customer Name">
          <input className={inputClass} value={form.customerName} onChange={(e) => set("customerName", e.target.value)} />
        </FormField>
        <FormField label="Vehicle">
          <input className={inputClass} value={form.vehicle ?? ""} onChange={(e) => set("vehicle", e.target.value)} />
        </FormField>
        <FormField label="Rating (1-5)">
          <input type="number" min={1} max={5} className={inputClass} value={form.rating} onChange={(e) => set("rating", Number(e.target.value))} />
        </FormField>
        <FormField label="Review (English)">
          <textarea className={inputClass} rows={3} value={form.reviewEn} onChange={(e) => set("reviewEn", e.target.value)} />
        </FormField>
        <FormField label="Review (Arabic)">
          <textarea dir="rtl" className={inputClass} rows={3} value={form.reviewAr ?? ""} onChange={(e) => set("reviewAr", e.target.value)} />
        </FormField>
      </div>

      <div className="mt-4 flex gap-6">
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={form.approved} onChange={(e) => set("approved", e.target.checked)} />
          Approved (visible on site)
        </label>
      </div>

      <button
        onClick={async () => {
          setSaving(true);
          await onSave(form);
          setSaving(false);
        }}
        disabled={saving}
        className="mt-6 w-full rounded-md bg-nvn-red py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-nvn-black disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Review"}
      </button>
    </Modal>
  );
}
