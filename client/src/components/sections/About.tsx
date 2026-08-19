import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STAT_KEYS = ["stat1", "stat2", "stat3", "stat4"] as const;

export function About() {
  const { t } = useTranslation();
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-nvn-charcoal py-24 md:py-32">
      <Container>
        <div ref={ref} className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p data-reveal className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-nvn-red">
              {t("about.eyebrow")}
            </p>
            <h2 data-reveal className="font-display text-4xl leading-[0.95] tracking-wide text-nvn-white sm:text-5xl md:text-6xl">
              {t("about.title")}
            </h2>
            <p data-reveal className="mt-6 max-w-lg text-base leading-relaxed text-nvn-silver md:text-lg">
              {t("about.body")}
            </p>

            <div data-reveal className="mt-12 grid grid-cols-2 gap-8">
              {STAT_KEYS.map((key) => (
                <div key={key} className="border-t border-nvn-line pt-4">
                  <p className="font-display text-2xl tracking-wide text-nvn-white md:text-3xl">{t(`about.${key}Value`)}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest2 text-nvn-silver">{t(`about.${key}Label`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="grid grid-cols-2 gap-4">
            <MediaFrame src={null} alt="NVN Cars craftsmanship" className="aspect-[3/4] translate-y-8" />
            <MediaFrame src={null} alt="NVN Cars precision detailing" className="aspect-[3/4]" />
          </div>
        </div>
      </Container>
    </section>
  );
}
