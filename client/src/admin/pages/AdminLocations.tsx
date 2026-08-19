import { useState } from "react";
import { FormField, inputClass } from "@/admin/components/FormField";
import { Modal } from "@/admin/components/Modal";
import {
  useCreateLocationMutation,
  useDeleteLocationMutation,
  useGetLocationsQuery,
  useUpdateLocationMutation,
} from "@/services/api";
import { LocationItem } from "@/types";

type Form = Omit<LocationItem, "id" | "createdAt">;

const EMPTY: Form = {
  name: "",
  nameAr: "",
  address: "",
  addressAr: "",
  lat: null,
  lng: null,
  wazeUrl: "",
  googleMapsUrl: "",
  phone: "",
  whatsapp: "",
  workingHours: "",
  active: true,
};

export function AdminLocations() {
  const { data: locations, isLoading } = useGetLocationsQuery();
  const [createLocation] = useCreateLocationMutation();
  const [updateLocation] = useUpdateLocationMutation();
  const [deleteLocation] = useDeleteLocationMutation();
  const [editing, setEditing] = useState<LocationItem | "new" | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Locations</h1>
        <button onClick={() => setEditing("new")} className="rounded-md bg-nvn-red px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-nvn-black">
          + Add Branch
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading && <div className="h-20 animate-pulse rounded-lg bg-white/5" />}
        {locations?.map((loc) => (
          <div key={loc.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-[#131315] p-5">
            <div>
              <p className="text-white">{loc.name}</p>
              <p className="mt-1 text-sm text-white/50">{loc.address}</p>
              <p className="mt-1 text-xs text-white/30">{loc.active ? "Active" : "Hidden"}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => setEditing(loc)} className="text-nvn-red hover:underline">
                Edit
              </button>
              <button onClick={() => window.confirm("Delete this location?") && deleteLocation(loc.id)} className="text-white/40 hover:text-red-400">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <LocationModal
          location={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (form) => {
            if (editing === "new") await createLocation(form);
            else await updateLocation({ id: editing.id, body: form });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function LocationModal({
  location,
  onClose,
  onSave,
}: {
  location: LocationItem | null;
  onClose: () => void;
  onSave: (form: Form) => Promise<void>;
}) {
  const [form, setForm] = useState<Form>(location ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <Modal title={location ? "Edit Branch" : "New Branch"} onClose={onClose} wide>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Branch Name (English)">
          <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </FormField>
        <FormField label="Branch Name (Arabic)">
          <input dir="rtl" className={inputClass} value={form.nameAr ?? ""} onChange={(e) => set("nameAr", e.target.value)} />
        </FormField>
        <FormField label="Address (English)">
          <input className={inputClass} value={form.address} onChange={(e) => set("address", e.target.value)} />
        </FormField>
        <FormField label="Address (Arabic)">
          <input dir="rtl" className={inputClass} value={form.addressAr ?? ""} onChange={(e) => set("addressAr", e.target.value)} />
        </FormField>
        <FormField label="Waze URL">
          <input className={inputClass} value={form.wazeUrl ?? ""} onChange={(e) => set("wazeUrl", e.target.value)} />
        </FormField>
        <FormField label="Google Maps URL">
          <input className={inputClass} value={form.googleMapsUrl ?? ""} onChange={(e) => set("googleMapsUrl", e.target.value)} />
        </FormField>
        <FormField label="Phone">
          <input className={inputClass} value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
        </FormField>
        <FormField label="WhatsApp">
          <input className={inputClass} value={form.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} />
        </FormField>
        <FormField label="Working Hours">
          <input className={inputClass} value={form.workingHours ?? ""} onChange={(e) => set("workingHours", e.target.value)} placeholder="e.g. Sat–Thu 9am–7pm" />
        </FormField>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-white/70">
        <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
        Active
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
        {saving ? "Saving…" : "Save Branch"}
      </button>
    </Modal>
  );
}
