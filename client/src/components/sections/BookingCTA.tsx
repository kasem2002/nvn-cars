import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/app/hooks";
import { Container } from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useGetSettingsQuery } from "@/services/api";
import { bookingModalOpened } from "@/store/uiSlice";

/**
 * Closing section — headline + primary Book CTA + contact quick-links,
 * merged from what used to be two back-to-back sections (BookingCTA
 * and Contact). One strong close, not two.
 */
export function BookingCTA() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: settings } = useGetSettingsQuery();
  const ref = useScrollReveal<HTMLDivElement>();

  const contactItems = [
    settings?.phone && { label: t("contact.phone"), value: settings.phone, href: `tel:${settings.phone}` },
    settings?.whatsapp && {
      label: t("contact.whatsapp"),
      value: settings.whatsapp,
      href: `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`,
    },
    settings?.instagram && { label: t("contact.instagram"), value: "@nvn.cars", href: settings.instagram },
    settings?.facebook && { label: t("contact.facebook"), value: t("contact.viewProfile"), href: settings.facebook },
    settings?.snapchat && { label: t("contact.snapchat"), value: t("contact.viewProfile"), href: settings.snapchat },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <section
      id="booking"
      className="relative overflow-hidden border-y border-nvn-line bg-nvn-charcoal py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(circle at 15% 50%, #E10600, transparent 45%)" }}
      />
      <Container>
        <div ref={ref} className="relative flex flex-col items-center gap-8 text-center">
          <p data-reveal className="text-xs font-semibold uppercase tracking-widest2 text-nvn-red">
            {t("booking.eyebrow")}
          </p>
          <h2
            data-reveal
            className="font-display text-5xl leading-[0.95] tracking-wide text-nvn-white sm:text-6xl md:text-7xl"
          >
            {t("booking.title")}
          </h2>
          <p data-reveal className="max-w-lg text-nvn-silver">
            {t("booking.subtitle")}
          </p>
          <button
            data-reveal
            onClick={() => dispatch(bookingModalOpened(null))}
            className="bg-nvn-red px-10 py-4 text-xs font-semibold uppercase tracking-widest2 text-white transition-colors duration-300 hover:bg-white hover:text-nvn-black"
          >
            {t("booking.open")}
          </button>

          {contactItems.length > 0 && (
            <div
              data-reveal
              className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-5 border-t border-nvn-line pt-8"
            >
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group text-center"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest2 text-nvn-silver">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-base text-nvn-white transition-colors group-hover:text-nvn-red md:text-lg">
                    {item.value}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
