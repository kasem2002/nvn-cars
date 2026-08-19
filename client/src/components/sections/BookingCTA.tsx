import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/app/hooks";
import { Container } from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { bookingModalOpened } from "@/store/uiSlice";

export function BookingCTA() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section className="relative overflow-hidden border-y border-nvn-line bg-nvn-charcoal py-24">
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 15% 50%, #E10600, transparent 45%)" }} />
      <Container>
        <div ref={ref} className="relative flex flex-col items-center gap-8 text-center">
          <p data-reveal className="text-xs font-semibold uppercase tracking-widest2 text-nvn-red">{t("booking.eyebrow")}</p>
          <h2 data-reveal className="font-display text-5xl leading-[0.95] tracking-wide text-nvn-white sm:text-6xl md:text-7xl">
            {t("booking.title")}
          </h2>
          <p data-reveal className="max-w-lg text-nvn-silver">{t("booking.subtitle")}</p>
          <button
            data-reveal
            onClick={() => dispatch(bookingModalOpened(null))}
            className="bg-nvn-red px-10 py-4 text-xs font-semibold uppercase tracking-widest2 text-white transition-colors duration-300 hover:bg-white hover:text-nvn-black"
          >
            {t("booking.open")}
          </button>
        </div>
      </Container>
    </section>
  );
}
