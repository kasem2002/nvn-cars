import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocalized } from "@/hooks/useLocalized";
import { useGetLocationsQuery } from "@/services/api";

export function Location() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { data: locations } = useGetLocationsQuery();
  const primary = locations?.[0];

  return (
    <section id="location" className="bg-nvn-black py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow={t("location.eyebrow")} title={t("location.title")} />

        {primary && (
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden border border-nvn-line bg-gradient-to-br from-nvn-panel to-nvn-black">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, #E10600, transparent 55%)" }} />
              <div className="relative text-center">
                <svg viewBox="0 0 24 24" className="mx-auto h-10 w-10 text-nvn-red" fill="currentColor">
                  <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                </svg>
                <p className="mt-3 font-display text-2xl tracking-wide text-nvn-white">{pick(primary.name, primary.nameAr)}</p>
                <p className="mt-1 max-w-xs px-4 text-sm text-nvn-silver">{pick(primary.address, primary.addressAr)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-6 border border-nvn-line bg-nvn-panel p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">{t("location.title")}</p>
                <p className="mt-2 text-nvn-white">{pick(primary.address, primary.addressAr)}</p>
              </div>

              {primary.workingHours && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">{t("location.hours")}</p>
                  <p className="mt-2 text-nvn-white">{primary.workingHours}</p>
                </div>
              )}

              <div className="mt-2 flex flex-col gap-3">
                {primary.wazeUrl && (
                  <a
                    href={primary.wazeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-nvn-red px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-widest2 text-white transition-colors duration-300 hover:bg-white hover:text-nvn-black"
                  >
                    {t("location.directions")}
                  </a>
                )}
                {primary.googleMapsUrl && (
                  <a
                    href={primary.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-nvn-line px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-widest2 text-nvn-white transition-colors duration-300 hover:border-nvn-red hover:text-nvn-red"
                  >
                    Google Maps
                  </a>
                )}
                {primary.phone && (
                  <a
                    href={`tel:${primary.phone}`}
                    className="border border-nvn-line px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-widest2 text-nvn-white transition-colors duration-300 hover:border-nvn-red hover:text-nvn-red"
                  >
                    {t("location.call")}: {primary.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
