import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CompareSlider } from "@/components/sections/CompareSlider";
import { useLocalized } from "@/hooks/useLocalized";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useGetBeforeAfterItemsQuery } from "@/services/api";

export function BeforeAfter() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { data: items } = useGetBeforeAfterItemsQuery();
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section id="before-after" className="bg-nvn-black py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow={t("beforeAfter.eyebrow")} title={t("beforeAfter.title")} subtitle={t("beforeAfter.subtitle")} />

        {items && items.length > 0 ? (
          <div ref={ref} className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} data-reveal>
                <CompareSlider
                  beforeSrc={item.beforeImage}
                  afterSrc={item.afterImage}
                  beforeLabel="Before"
                  afterLabel="After"
                />
                <div className="mt-4 flex items-center justify-between">
                  <p className="font-display text-xl tracking-wide text-nvn-white">{item.vehicleName}</p>
                  {item.serviceName && <p className="text-xs uppercase tracking-widest2 text-nvn-red">{item.serviceName}</p>}
                </div>
                {(item.descriptionEn || item.descriptionAr) && (
                  <p className="mt-1 text-sm text-nvn-silver">{pick(item.descriptionEn, item.descriptionAr)}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-16 text-sm text-nvn-silver">{t("beforeAfter.empty")}</p>
        )}
      </Container>
    </section>
  );
}
