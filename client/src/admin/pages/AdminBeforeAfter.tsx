import { useState } from "react";
import { FormField, inputClass } from "@/admin/components/FormField";
import { Modal } from "@/admin/components/Modal";
import {
  useCreateBeforeAfterItemMutation,
  useDeleteBeforeAfterItemMutation,
  useGetBeforeAfterItemsQuery,
  useUpdateBeforeAfterItemMutation,
} from "@/services/api";
import { BeforeAfterItem } from "@/types";

type Form = Omit<BeforeAfterItem, "id" | "createdAt">;

const EMPTY: Form = {
  vehicleName: "",
  vehicleCategory: "",
  beforeImage: "",
  afterImage: "",
  serviceName: "",
  descriptionEn: "",
  descriptionAr: "",
  date: null,
  featured: false,
  order: 0,
};

export function AdminBeforeAfter() {
  const { data: items, isLoading } = useGetBeforeAfterItemsQuery();
  const [createItem] = useCreateBeforeAfterItemMutation();
  const [updateItem] = useUpdateBeforeAfterItemMutation();
  const [deleteItem] = useDeleteBeforeAfterItemMutation();
  const [editing, setEditing] = useState<BeforeAfterItem | "new" | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Before / After</h1>
        <button onClick={() => setEditing("new")} className="rounded-md bg-nvn-red px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-nvn-black">
          + Add Project
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#131315] text-xs uppercase tracking-wide text-white/40">
            <tr>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Featured</th>
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
            {items?.map((item) => (
              <tr key={item.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white">{item.vehicleName}</td>
                <td className="px-4 py-3 text-white/70">{item.serviceName ?? "—"}</td>
                <td className="px-4 py-3 text-white/70">{item.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(item)} className="mr-3 text-nvn-red hover:underline">
                    Edit
                  </button>
                  <button onClick={() => window.confirm("Delete this project?") && deleteItem(item.id)} className="text-white/40 hover:text-red-400">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <BeforeAfterModal
          item={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (form) => {
            if (editing === "new") await createItem(form);
            else await updateItem({ id: editing.id, body: form });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function BeforeAfterModal({
  item,
  onClose,
  onSave,
}: {
  item: BeforeAfterItem | null;
  onClose: () => void;
  onSave: (form: Form) => Promise<void>;
}) {
  const [form, setForm] = useState<Form>(item ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <Modal title={item ? "Edit Project" : "New Project"} onClose={onClose} wide>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Vehicle Name">
          <input className={inputClass} value={form.vehicleName} onChange={(e) => set("vehicleName", e.target.value)} />
        </FormField>
        <FormField label="Vehicle Category">
          <input className={inputClass} value={form.vehicleCategory ?? ""} onChange={(e) => set("vehicleCategory", e.target.value)} />
        </FormField>
        <FormField label="Before Image URL">
          <input className={inputClass} value={form.beforeImage} onChange={(e) => set("beforeImage", e.target.value)} />
        </FormField>
        <FormField label="After Image URL">
          <input className={inputClass} value={form.afterImage} onChange={(e) => set("afterImage", e.target.value)} />
        </FormField>
        <FormField label="Service Name">
          <input className={inputClass} value={form.serviceName ?? ""} onChange={(e) => set("serviceName", e.target.value)} />
        </FormField>
        <FormField label="Display Order">
          <input type="number" className={inputClass} value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
        </FormField>
        <FormField label="Description (English)">
          <textarea className={inputClass} rows={2} value={form.descriptionEn ?? ""} onChange={(e) => set("descriptionEn", e.target.value)} />
        </FormField>
        <FormField label="Description (Arabic)">
          <textarea dir="rtl" className={inputClass} rows={2} value={form.descriptionAr ?? ""} onChange={(e) => set("descriptionAr", e.target.value)} />
        </FormField>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-white/70">
        <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
        Featured
      </label>

      <button
        onClick={async () => {
          setSaving(true);
          await onSave(form);
          setSaving(false);
        }}
        disabled={saving}
        className="mt-6 w-full rounded-md bg-nvn-red py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-nvn-black disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Project"}
      </button>
    </Modal>
  );
}
