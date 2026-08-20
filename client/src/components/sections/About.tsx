import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { useLocalized } from "@/hooks/useLocalized";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useGetSettingsQuery } from "@/services/api";
import { ExperienceStat } from "@/types";

const DEFAULT_STAT_KEYS = ["stat1", "stat2", "stat3", "stat4"] as const;

function safeParseStats(json: string | null | undefined): ExperienceStat[] | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((s): s is ExperienceStat => s && typeof s === "object");
  } catch {
    return null;
  }
}

export function About() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { data: settings } = useGetSettingsQuery();
  const ref = useScrollReveal<HTMLDivElement>();

  const stats = useMemo(() => {
    const overrides = safeParseStats(settings?.experienceStats);
    if (overrides && overrides.length > 0) return overrides.slice(0, 4);
    return DEFAULT_STAT_KEYS.map((key) => ({
      labelEn: t(`about.${key}Label`, { lng: "en" }),
      labelAr: t(`about.${key}Label`, { lng: "ar" }),
      valueEn: t(`about.${key}Value`, { lng: "en" }),
      valueAr: t(`about.${key}Value`, { lng: "ar" }),
    }));
  }, [settings?.experienceStats, t]);

  const title = pick(settings?.experienceTitleEn, settings?.experienceTitleAr) || t("about.title");
  const body = pick(settings?.experienceBodyEn, settings?.experienceBodyAr) || t("about.body");

  return (
    <section className="bg-nvn-charcoal py-24 md:py-32">
      <Container>
        <div ref={ref} className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p data-reveal className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-nvn-red">
              {t("about.eyebrow")}
            </p>
            <h2 data-reveal className="font-display text-4xl leading-[0.95] tracking-wide text-nvn-white sm:text-5xl md:text-6xl">
              {title}
            </h2>
            <p data-reveal className="mt-6 max-w-lg text-base leading-relaxed text-nvn-silver md:text-lg">
              {body}
            </p>

            <div data-reveal className="mt-12 grid grid-cols-2 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="border-t border-nvn-line pt-4">
                  <p className="font-display text-2xl tracking-wide text-nvn-white md:text-3xl">
                    {pick(stat.valueEn, stat.valueAr)}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-widest2 text-nvn-silver">
                    {pick(stat.labelEn, stat.labelAr)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="grid grid-cols-2 gap-4">
            <MediaFrame
              src={settings?.experienceImage1}
              alt="NVN Cars craftsmanship"
              className="aspect-[3/4] translate-y-8"
            />
            <MediaFrame
              src={settings?.experienceImage2}
              alt="NVN Cars precision detailing"
              className="aspect-[3/4]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
