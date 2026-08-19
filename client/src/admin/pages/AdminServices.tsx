import { useState } from "react";
import { FormField, inputClass } from "@/admin/components/FormField";
import { Modal } from "@/admin/components/Modal";
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesQuery,
  useUpdateServiceMutation,
} from "@/services/api";
import { Service } from "@/types";

type ServiceForm = Omit<Service, "id" | "createdAt" | "updatedAt">;

const EMPTY: ServiceForm = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  detailedDescriptionEn: "",
  detailedDescriptionAr: "",
  image: "",
  icon: "",
  price: null,
  duration: "",
  warranty: "",
  category: "",
  featured: false,
  active: true,
  order: 0,
};

export function AdminServices() {
  const { data: services, isLoading } = useGetServicesQuery();
  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();
  const [editing, setEditing] = useState<Service | "new" | null>(null);

  async function handleDelete(id: string) {
    if (window.confirm("Delete this service? This cannot be undone.")) {
      await deleteService(id);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Services</h1>
        <button onClick={() => setEditing("new")} className="rounded-md bg-nvn-red px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-nvn-black">
          + Add Service
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#131315] text-xs uppercase tracking-wide text-white/40">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Name (EN)</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-white/40">
                  Loading…
                </td>
              </tr>
            )}
            {services?.map((s) => (
              <tr key={s.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white/50">{s.order}</td>
                <td className="px-4 py-3 text-white">
                  {s.nameEn}
                  {s.featured && <span className="ml-2 rounded-full bg-nvn-red/15 px-2 py-0.5 text-[10px] text-nvn-red">Featured</span>}
                </td>
                <td className="px-4 py-3 text-white/70">{s.category ?? "—"}</td>
                <td className="px-4 py-3 text-white/70">{s.price != null ? s.price.toLocaleString() : "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${s.active ? "bg-green-500/15 text-green-400" : "bg-white/10 text-white/40"}`}>
                    {s.active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(s)} className="mr-3 text-nvn-red hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="text-white/40 hover:text-red-400">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ServiceModal
          service={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (form) => {
            if (editing === "new") await createService(form);
            else await updateService({ id: editing.id, body: form });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ServiceModal({
  service,
  onClose,
  onSave,
}: {
  service: Service | null;
  onClose: () => void;
  onSave: (form: ServiceForm) => Promise<void>;
}) {
  const [form, setForm] = useState<ServiceForm>(service ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={service ? "Edit Service" : "New Service"} onClose={onClose} wide>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Name (English)">
          <input className={inputClass} value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} />
        </FormField>
        <FormField label="Name (Arabic)">
          <input dir="rtl" className={inputClass} value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} />
        </FormField>
        <FormField label="Description (English)">
          <textarea className={inputClass} rows={2} value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} />
        </FormField>
        <FormField label="Description (Arabic)">
          <textarea dir="rtl" className={inputClass} rows={2} value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} />
        </FormField>
        <FormField label="Image URL">
          <input className={inputClass} value={form.image ?? ""} onChange={(e) => set("image", e.target.value)} />
        </FormField>
        <FormField label="Category">
          <input className={inputClass} value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} placeholder="ppf, nano-ceramic, tint…" />
        </FormField>
        <FormField label="Price (IQD)">
          <input
            type="number"
            className={inputClass}
            value={form.price ?? ""}
            onChange={(e) => set("price", e.target.value ? Number(e.target.value) : null)}
          />
        </FormField>
        <FormField label="Duration">
          <input className={inputClass} value={form.duration ?? ""} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 2 days" />
        </FormField>
        <FormField label="Warranty">
          <input className={inputClass} value={form.warranty ?? ""} onChange={(e) => set("warranty", e.target.value)} />
        </FormField>
        <FormField label="Display Order">
          <input type="number" className={inputClass} value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
        </FormField>
      </div>

      <div className="mt-4 flex gap-6">
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
          Active
        </label>
      </div>

      <button
        onClick={submit}
        disabled={saving}
        className="mt-6 w-full rounded-md bg-nvn-red py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-nvn-black disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Service"}
      </button>
    </Modal>
  );
}
