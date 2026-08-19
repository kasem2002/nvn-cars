import { useState } from "react";
import { FormField, inputClass } from "@/admin/components/FormField";
import { ImageUpload } from "@/admin/components/ImageUpload";
import { Modal } from "@/admin/components/Modal";
import {
  useCreateSocialPostMutation,
  useDeleteSocialPostMutation,
  useGetSocialPostsQuery,
  useUpdateSocialPostMutation,
} from "@/services/api";
import { SocialPost } from "@/types";

type Form = Omit<SocialPost, "id" | "createdAt">;

const EMPTY: Form = { image: "", captionEn: "", captionAr: "", link: "", postedAt: null, order: 0 };

export function AdminInstagram() {
  const { data: posts, isLoading } = useGetSocialPostsQuery();
  const [createPost] = useCreateSocialPostMutation();
  const [updatePost] = useUpdateSocialPostMutation();
  const [deletePost] = useDeleteSocialPostMutation();
  const [editing, setEditing] = useState<SocialPost | "new" | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Instagram</h1>
          <p className="mt-1 text-sm text-white/50">
            Posts shown in the site's Instagram section. Upload photos manually until the Graph API is connected.
          </p>
        </div>
        <button onClick={() => setEditing("new")} className="rounded-md bg-nvn-red px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-nvn-black">
          + Add Post
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {isLoading && Array.from({ length: 5 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-lg bg-white/5" />)}
        {posts?.map((post) => (
          <div key={post.id} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#131315]">
            {post.image ? (
              <img src={post.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-white/30">No Image</div>
            )}
            <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex justify-end gap-3 text-xs">
                <button onClick={() => setEditing(post)} className="text-nvn-red hover:underline">
                  Edit
                </button>
                <button onClick={() => window.confirm("Delete this post?") && deletePost(post.id)} className="text-white/60 hover:text-red-400">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {posts?.length === 0 && !isLoading && <p className="col-span-full text-sm text-white/40">No posts yet — add your first one.</p>}
      </div>

      {editing && (
        <PostModal
          post={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (form) => {
            if (editing === "new") await createPost(form);
            else await updatePost({ id: editing.id, body: form });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function PostModal({
  post,
  onClose,
  onSave,
}: {
  post: SocialPost | null;
  onClose: () => void;
  onSave: (form: Form) => Promise<void>;
}) {
  const [form, setForm] = useState<Form>(post ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <Modal title={post ? "Edit Post" : "New Post"} onClose={onClose}>
      <div className="space-y-4">
        <ImageUpload label="Photo" value={form.image} onChange={(url) => set("image", url)} aspect="aspect-square" />
        <FormField label="Caption (English)">
          <input className={inputClass} value={form.captionEn ?? ""} onChange={(e) => set("captionEn", e.target.value)} />
        </FormField>
        <FormField label="Caption (Arabic)">
          <input dir="rtl" className={inputClass} value={form.captionAr ?? ""} onChange={(e) => set("captionAr", e.target.value)} />
        </FormField>
        <FormField label="Link (optional, defaults to your Instagram profile)">
          <input className={inputClass} value={form.link ?? ""} onChange={(e) => set("link", e.target.value)} placeholder="https://www.instagram.com/p/..." />
        </FormField>
        <FormField label="Display Order">
          <input type="number" className={inputClass} value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
        </FormField>
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
        {saving ? "Saving…" : "Save Post"}
      </button>
    </Modal>
  );
}
