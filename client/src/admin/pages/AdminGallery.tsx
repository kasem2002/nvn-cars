import { useState } from "react";
import { FormField, inputClass } from "@/admin/components/FormField";
import { Modal } from "@/admin/components/Modal";
import {
  useCreateGalleryItemMutation,
  useDeleteGalleryItemMutation,
  useGetGalleryItemsQuery,
  useUpdateGalleryItemMutation,
} from "@/services/api";
import { GalleryItem } from "@/types";

type GalleryForm = Omit<GalleryItem, "id" | "createdAt">;

const EMPTY: GalleryForm = { image: "", captionEn: "", captionAr: "", category: "ppf", featured: false, order: 0 };

const CATEGORIES = ["ppf", "nano-ceramic", "polish", "tint", "interior", "customization"];

export function AdminGallery() {
  const { data: items, isLoading } = useGetGalleryItemsQuery();
  const [createItem] = useCreateGalleryItemMutation();
  const [updateItem] = useUpdateGalleryItemMutation();
  const [deleteItem] = useDeleteGalleryItemMutation();
  const [editing, setEditing] = useState<GalleryItem | "new" | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Gallery</h1>
        <button onClick={() => setEditing("new")} className="rounded-md bg-nvn-red px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-nvn-black">
          + Add Image
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-lg bg-white/5" />)}
        {items?.map((item) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#131315]">
            {item.image ? (
              <img src={item.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-white/30">No Image</div>
            )}
            <div className="absolute inset-0 flex flex-col justify-between bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[10px] uppercase tracking-wide text-white/70">{item.category}</span>
              <div className="flex justify-end gap-3 text-xs">
                <button onClick={() => setEditing(item)} className="text-nvn-red hover:underline">
                  Edit
                </button>
                <button
                  onClick={() => window.confirm("Delete this image?") && deleteItem(item.id)}
                  className="text-white/60 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <GalleryModal
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

function GalleryModal({
  item,
  onClose,
  onSave,
}: {
  item: GalleryItem | null;
  onClose: () => void;
  onSave: (form: GalleryForm) => Promise<void>;
}) {
  const [form, setForm] = useState<GalleryForm>(item ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof GalleryForm>(key: K, value: GalleryForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <Modal title={item ? "Edit Image" : "New Image"} onClose={onClose}>
      <div className="space-y-4">
        <FormField label="Image URL">
          <input className={inputClass} value={form.image} onChange={(e) => set("image", e.target.value)} />
        </FormField>
        <FormField label="Caption (English)">
          <input className={inputClass} value={form.captionEn ?? ""} onChange={(e) => set("captionEn", e.target.value)} />
        </FormField>
        <FormField label="Caption (Arabic)">
          <input dir="rtl" className={inputClass} value={form.captionAr ?? ""} onChange={(e) => set("captionAr", e.target.value)} />
        </FormField>
        <FormField label="Category">
          <select className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Display Order">
          <input type="number" className={inputClass} value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          Featured
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
        {saving ? "Saving…" : "Save Image"}
      </button>
    </Modal>
  );
}
