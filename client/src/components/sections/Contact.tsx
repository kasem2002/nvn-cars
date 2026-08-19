import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/app/hooks";
import { Container } from "@/components/ui/Container";
import { useGetSettingsQuery } from "@/services/api";
import { bookingModalOpened } from "@/store/uiSlice";

export function Contact() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: settings } = useGetSettingsQuery();

  const items = [
    settings?.phone && { label: t("contact.phone"), value: settings.phone, href: `tel:${settings.phone}` },
    settings?.whatsapp && { label: t("contact.whatsapp"), value: settings.whatsapp, href: `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}` },
    settings?.instagram && { label: t("contact.instagram"), value: "@nvn.cars", href: settings.instagram },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <section className="bg-nvn-black py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-nvn-red">{t("contact.eyebrow")}</p>
            <h2 className="font-display text-4xl leading-[0.95] tracking-wide text-nvn-white sm:text-5xl md:text-6xl">
              {t("contact.title")}
            </h2>

            <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
              {items.length > 0 ? (
                items.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="group">
                    <p className="text-xs uppercase tracking-widest2 text-nvn-silver">{item.label}</p>
                    <p className="mt-1 text-xl text-nvn-white transition-colors group-hover:text-nvn-red">{item.value}</p>
                  </a>
                ))
              ) : (
                <p className="text-sm text-nvn-silver">Contact details are managed from the admin dashboard.</p>
              )}
            </div>
          </div>

          <button
            onClick={() => dispatch(bookingModalOpened(null))}
            className="border border-nvn-red px-10 py-4 text-xs font-semibold uppercase tracking-widest2 text-nvn-red transition-colors duration-300 hover:bg-nvn-red hover:text-white"
          >
            {t("contact.cta")}
          </button>
        </div>
      </Container>
    </section>
  );
}
