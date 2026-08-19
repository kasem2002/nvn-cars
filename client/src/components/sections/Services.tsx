import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/app/hooks";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocalized } from "@/hooks/useLocalized";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useGetServicesQuery } from "@/services/api";
import { bookingModalOpened } from "@/store/uiSlice";
import { Service } from "@/types";

function ServiceCard({ service }: { service: Service }) {
  const { pick } = useLocalized();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <article data-reveal className="group relative flex flex-col overflow-hidden border border-nvn-line bg-nvn-panel">
      <MediaFrame src={service.image} alt={pick(service.nameEn, service.nameAr)} className="aspect-[4/3] w-full transition-transform duration-700 ease-luxury group-hover:scale-[1.04]" />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl tracking-wide text-nvn-white">{pick(service.nameEn, service.nameAr)}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-nvn-silver">{pick(service.descriptionEn, service.descriptionAr)}</p>
        <div className="mt-6 flex items-center justify-between border-t border-nvn-line pt-4">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-nvn-silver">
            {service.duration && <span>{service.duration}</span>}
            {service.price != null && <span className="text-nvn-white">{service.price.toLocaleString()} IQD</span>}
          </div>
          <button
            onClick={() => dispatch(bookingModalOpened(service.id))}
            className="text-xs font-semibold uppercase tracking-widest2 text-nvn-red transition-colors duration-300 hover:text-white"
          >
            {t("services.cta")} →
          </button>
        </div>
      </div>
    </article>
  );
}

export function Services() {
  const { t } = useTranslation();
  const { data: services, isLoading } = useGetServicesQuery();
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section id="services" className="bg-nvn-black py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow={t("services.eyebrow")} title={t("services.title")} subtitle={t("services.subtitle")} />

        <div ref={ref} className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse border border-nvn-line bg-nvn-panel" />
            ))}
          {services?.filter((s) => s.active).map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
      </Container>
    </section>
  );
}
