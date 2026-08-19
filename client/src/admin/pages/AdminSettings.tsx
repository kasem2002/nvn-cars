import { ReactNode, useEffect, useState } from "react";
import { FormField, inputClass } from "@/admin/components/FormField";
import { ImageUpload } from "@/admin/components/ImageUpload";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/services/api";
import { SiteSettings } from "@/types";

type Form = Partial<Omit<SiteSettings, "id" | "updatedAt">>;

export function AdminSettings() {
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: saving }] = useUpdateSettingsMutation();
  const [form, setForm] = useState<Form>({});
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    await updateSettings(form);
    setSavedAt(Date.now());
  }

  if (isLoading || !settings) return <p className="text-white/40">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Website Settings</h1>

      <Section title="Branding">
        <ImageUpload label="Logo" value={form.logo} onChange={(url) => set("logo", url)} aspect="aspect-[3/1]" />
        <ImageUpload label="Favicon" value={form.favicon} onChange={(url) => set("favicon", url)} aspect="aspect-square" />
      </Section>

      <Section title="Contact">
        <FormField label="Phone">
          <input className={inputClass} value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
        </FormField>
        <FormField label="WhatsApp (with country code, digits only)">
          <input className={inputClass} value={form.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} placeholder="9647xxxxxxxxx" />
        </FormField>
        <FormField label="Email">
          <input className={inputClass} value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
        </FormField>
      </Section>

      <Section title="Social">
        <FormField label="Instagram URL">
          <input className={inputClass} value={form.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} />
        </FormField>
        <FormField label="Facebook URL">
          <input className={inputClass} value={form.facebook ?? ""} onChange={(e) => set("facebook", e.target.value)} />
        </FormField>
        <FormField label="TikTok URL">
          <input className={inputClass} value={form.tiktok ?? ""} onChange={(e) => set("tiktok", e.target.value)} />
        </FormField>
      </Section>

      <Section title="SEO">
        <FormField label="Page Title (English)">
          <input className={inputClass} value={form.seoTitleEn ?? ""} onChange={(e) => set("seoTitleEn", e.target.value)} />
        </FormField>
        <FormField label="Page Title (Arabic)">
          <input dir="rtl" className={inputClass} value={form.seoTitleAr ?? ""} onChange={(e) => set("seoTitleAr", e.target.value)} />
        </FormField>
        <FormField label="Meta Description (English)">
          <textarea className={inputClass} rows={2} value={form.seoDescriptionEn ?? ""} onChange={(e) => set("seoDescriptionEn", e.target.value)} />
        </FormField>
        <FormField label="Meta Description (Arabic)">
          <textarea dir="rtl" className={inputClass} rows={2} value={form.seoDescriptionAr ?? ""} onChange={(e) => set("seoDescriptionAr", e.target.value)} />
        </FormField>
        <FormField label="Keywords (comma separated)">
          <input className={inputClass} value={form.keywords ?? ""} onChange={(e) => set("keywords", e.target.value)} />
        </FormField>
      </Section>

      <Section title="General">
        <div className="space-y-3">
          <Toggle label="Booking Enabled" checked={form.bookingEnabled ?? true} onChange={(v) => set("bookingEnabled", v)} />
          <Toggle label="Instagram Section Enabled" checked={form.instagramEnabled ?? true} onChange={(v) => set("instagramEnabled", v)} />
          <Toggle label="Reviews Section Enabled" checked={form.reviewsEnabled ?? true} onChange={(v) => set("reviewsEnabled", v)} />
          <Toggle label="Maintenance Mode" checked={form.maintenanceMode ?? false} onChange={(v) => set("maintenanceMode", v)} />
        </div>
      </Section>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-md bg-nvn-red px-6 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-nvn-black disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
        {savedAt && <span className="text-xs text-green-400">Saved</span>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-8 rounded-lg border border-white/10 bg-[#131315] p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm text-white/70">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}
