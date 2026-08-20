import { useTranslation } from "react-i18next";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Container } from "@/components/ui/Container";
import { useGetSettingsQuery } from "@/services/api";

const LINKS = [
  { id: "home", key: "nav.home" },
  { id: "services", key: "nav.services" },
  { id: "gallery", key: "nav.gallery" },
  { id: "location", key: "nav.location" },
] as const;

export function Footer() {
  const { t } = useTranslation();
  const { data: settings } = useGetSettingsQuery();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-nvn-line bg-nvn-black">
      <Container className="grid gap-10 py-16 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <span className="text-3xl">
            <Logo />
          </span>
          <p className="mt-4 max-w-xs text-sm text-nvn-silver">{t("footer.tagline")}</p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">{t("nav.services")}</p>
          <ul className="space-y-2 text-sm text-nvn-white/80">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="transition-colors hover:text-nvn-red">
                  {t(link.key)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">{t("contact.title")}</p>
          <ul className="space-y-2 text-sm text-nvn-white/80">
            {settings?.phone && <li>{settings.phone}</li>}
            {settings?.whatsapp && <li>{t("contact.whatsapp")}: {settings.whatsapp}</li>}
            {settings?.instagram && (
              <li>
                <a href={settings.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-nvn-red">
                  Instagram
                </a>
              </li>
            )}
            {settings?.facebook && (
              <li>
                <a href={settings.facebook} target="_blank" rel="noreferrer" className="transition-colors hover:text-nvn-red">
                  Facebook
                </a>
              </li>
            )}
            {settings?.snapchat && (
              <li>
                <a href={settings.snapchat} target="_blank" rel="noreferrer" className="transition-colors hover:text-nvn-red">
                  Snapchat
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          <LanguageSwitcher />
        </div>
      </Container>

      <div className="border-t border-nvn-line py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-nvn-silver md:flex-row">
          <span>© {year} NVN Cars. {t("footer.rights")}</span>
          <span>Baghdad, Iraq</span>
        </Container>
      </div>
    </footer>
  );
}
