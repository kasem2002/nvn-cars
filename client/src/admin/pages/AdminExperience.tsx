import { useEffect, useState } from "react";
import { FormField, inputClass } from "@/admin/components/FormField";
import { ImageUpload } from "@/admin/components/ImageUpload";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/services/api";
import { ExperienceStat } from "@/types";

const EMPTY_STAT: ExperienceStat = { labelEn: "", labelAr: "", valueEn: "", valueAr: "" };

interface Form {
  experienceTitleEn: string;
  experienceTitleAr: string;
  experienceBodyEn: string;
  experienceBodyAr: string;
  experienceImage1: string;
  experienceImage2: string;
  stats: ExperienceStat[];
}

const EMPTY_FORM: Form = {
  experienceTitleEn: "",
  experienceTitleAr: "",
  experienceBodyEn: "",
  experienceBodyAr: "",
  experienceImage1: "",
  experienceImage2: "",
  stats: [EMPTY_STAT, EMPTY_STAT, EMPTY_STAT, EMPTY_STAT],
};

function parseStats(json: string | null | undefined): ExperienceStat[] {
  if (!json) return [EMPTY_STAT, EMPTY_STAT, EMPTY_STAT, EMPTY_STAT];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [EMPTY_STAT, EMPTY_STAT, EMPTY_STAT, EMPTY_STAT];
    const cleaned = parsed
      .filter((s) => s && typeof s === "object")
      .map((s) => ({
        labelEn: String(s.labelEn ?? ""),
        labelAr: String(s.labelAr ?? ""),
        valueEn: String(s.valueEn ?? ""),
        valueAr: String(s.valueAr ?? ""),
      }));
    while (cleaned.length < 4) cleaned.push(EMPTY_STAT);
    return cleaned.slice(0, 4);
  } catch {
    return [EMPTY_STAT, EMPTY_STAT, EMPTY_STAT, EMPTY_STAT];
  }
}

export function AdminExperience() {
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: saving }] = useUpdateSettingsMutation();
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!settings) return;
    setForm({
      experienceTitleEn: settings.experienceTitleEn ?? "",
      experienceTitleAr: settings.experienceTitleAr ?? "",
      experienceBodyEn: settings.experienceBodyEn ?? "",
      experienceBodyAr: settings.experienceBodyAr ?? "",
      experienceImage1: settings.experienceImage1 ?? "",
      experienceImage2: settings.experienceImage2 ?? "",
      stats: parseStats(settings.experienceStats),
    });
  }, [settings]);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setStat(index: number, key: keyof ExperienceStat, value: string) {
    setForm((f) => ({
      ...f,
      stats: f.stats.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }));
  }

  async function save() {
    await updateSettings({
      experienceTitleEn: form.experienceTitleEn || null,
      experienceTitleAr: form.experienceTitleAr || null,
      experienceBodyEn: form.experienceBodyEn || null,
      experienceBodyAr: form.experienceBodyAr || null,
      experienceImage1: form.experienceImage1 || null,
      experienceImage2: form.experienceImage2 || null,
      experienceStats: JSON.stringify(form.stats),
    });
    setSavedAt(Date.now());
  }

  if (isLoading || !settings) return <p className="text-white/40">Loading…</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-white">Experience Section</h1>
      <p className="mt-1 text-sm text-white/50">
        Controls the "NVN Standard" / "More Than Car Care" section on the home page. Leave any field blank to fall
        back to the default translated content.
      </p>

      <div className="mt-8 space-y-8">
        <Section title="Headline">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Title (English)">
              <input
                className={inputClass}
                value={form.experienceTitleEn}
                onChange={(e) => set("experienceTitleEn", e.target.value)}
                placeholder="More Than Car Care."
              />
            </FormField>
            <FormField label="Title (Arabic)">
              <input
                dir="rtl"
                className={inputClass}
                value={form.experienceTitleAr}
                onChange={(e) => set("experienceTitleAr", e.target.value)}
                placeholder="أكثر من مجرد عناية بالسيارة."
              />
            </FormField>
            <FormField label="Body (English)">
              <textarea
                className={inputClass}
                rows={4}
                value={form.experienceBodyEn}
                onChange={(e) => set("experienceBodyEn", e.target.value)}
              />
            </FormField>
            <FormField label="Body (Arabic)">
              <textarea
                dir="rtl"
                className={inputClass}
                rows={4}
                value={form.experienceBodyAr}
                onChange={(e) => set("experienceBodyAr", e.target.value)}
              />
            </FormField>
          </div>
        </Section>

        <Section title="Stat Pillars (four blocks)">
          <div className="space-y-6">
            {form.stats.map((stat, i) => (
              <div key={i} className="rounded-md border border-white/10 bg-[#0B0B0C] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-nvn-red">Pillar {i + 1}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Value (English)">
                    <input
                      className={inputClass}
                      value={stat.valueEn}
                      onChange={(e) => setStat(i, "valueEn", e.target.value)}
                      placeholder="e.g. Every Panel"
                    />
                  </FormField>
                  <FormField label="Value (Arabic)">
                    <input
                      dir="rtl"
                      className={inputClass}
                      value={stat.valueAr}
                      onChange={(e) => setStat(i, "valueAr", e.target.value)}
                    />
                  </FormField>
                  <FormField label="Label (English)">
                    <input
                      className={inputClass}
                      value={stat.labelEn}
                      onChange={(e) => setStat(i, "labelEn", e.target.value)}
                      placeholder="e.g. PRECISION"
                    />
                  </FormField>
                  <FormField label="Label (Arabic)">
                    <input
                      dir="rtl"
                      className={inputClass}
                      value={stat.labelAr}
                      onChange={(e) => setStat(i, "labelAr", e.target.value)}
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Photography">
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUpload
              label="Image 1 (offset upward)"
              value={form.experienceImage1}
              onChange={(url) => set("experienceImage1", url)}
              aspect="aspect-[3/4]"
            />
            <ImageUpload
              label="Image 2"
              value={form.experienceImage2}
              onChange={(url) => set("experienceImage2", url)}
              aspect="aspect-[3/4]"
            />
          </div>
        </Section>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-md bg-nvn-red px-6 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-nvn-black disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Experience"}
        </button>
        {savedAt && !saving && <span className="text-xs text-emerald-400">Saved</span>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-white/10 bg-[#131315] p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/70">{title}</h2>
      {children}
    </section>
  );
}
