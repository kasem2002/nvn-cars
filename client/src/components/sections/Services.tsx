import { MouseEvent, PointerEvent, useRef } from "react";
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
    <article
      data-reveal
      className="group relative flex w-[82vw] shrink-0 snap-start flex-col overflow-hidden border border-nvn-line bg-nvn-panel sm:w-[52vw] md:w-[38vw] lg:w-[380px]"
    >
      <MediaFrame
        src={service.image}
        alt={pick(service.nameEn, service.nameAr)}
        className="aspect-[4/3] w-full transition-transform duration-700 ease-luxury group-hover:scale-[1.04]"
      />
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
  const { i18n } = useTranslation();
  const { data: services, isLoading } = useGetServicesQuery();
  const trackRef = useRef<HTMLDivElement>(null);
  useScrollReveal<HTMLDivElement>({ targetRef: trackRef });
  const isArabic = i18n.language === "ar";

  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("article");
    const amount = (card?.clientWidth ?? 360) + 24;
    const sign = isArabic ? -1 : 1;
    track.scrollBy({ left: sign * direction * amount, behavior: "smooth" });
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = { active: true, startX: e.clientX, startScroll: track.scrollLeft, moved: false };
    track.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 5) drag.current.moved = true;
    track.scrollLeft = drag.current.startScroll - delta;
  }

  function endDrag() {
    drag.current.active = false;
  }

  function onClickCapture(e: MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  return (
    <section id="services" className="bg-nvn-black py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t("services.eyebrow")} title={t("services.title")} subtitle={t("services.subtitle")} />

          <div className="flex gap-3">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Previous services"
              className="flex h-11 w-11 items-center justify-center border border-nvn-line text-nvn-white transition-colors duration-300 hover:border-nvn-red hover:text-nvn-red"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Next services"
              className="flex h-11 w-11 items-center justify-center border border-nvn-line text-nvn-white transition-colors duration-300 hover:border-nvn-red hover:text-nvn-red"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </Container>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className="scrollbar-none mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pl-6 pr-6 cursor-grab active:cursor-grabbing md:pl-10 xl:pl-16"
      >
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] w-[82vw] shrink-0 animate-pulse border border-nvn-line bg-nvn-panel sm:w-[52vw] md:w-[38vw] lg:w-[380px]" />
          ))}
        {services?.filter((s) => s.active).map((service) => <ServiceCard key={service.id} service={service} />)}
        <div aria-hidden className="shrink-0 basis-2 md:basis-4 xl:basis-8" />
      </div>
    </section>
  );
}
