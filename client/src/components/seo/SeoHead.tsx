import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/hooks/useLocalized";
import { useGetSettingsQuery } from "@/services/api";

/**
 * Keeps the page title, description, canonical URL and og:locale in
 * sync with the current UI language and the site-settings SEO
 * overrides. Even without SSR, modern crawlers execute JS and pick
 * these tags up, so search snippets stay coherent with what the
 * visitor actually sees.
 */
export function SeoHead() {
  const { i18n } = useTranslation();
  const { pick } = useLocalized();
  const { data: settings } = useGetSettingsQuery();

  useEffect(() => {
    const lang = i18n.language === "ar" ? "ar" : "en";

    const title =
      pick(settings?.seoTitleEn, settings?.seoTitleAr) ||
      "NVN Cars — Premium Automotive Care Center in Al Mansour, Baghdad";
    const description =
      pick(settings?.seoDescriptionEn, settings?.seoDescriptionAr) ||
      "Premium PPF, nano ceramic, tinting, polishing, and detailing services in Al Mansour, Baghdad.";

    document.title = title;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    setMeta({ name: "description" }, description);
    setMeta({ property: "og:title" }, title);
    setMeta({ property: "og:description" }, description);
    setMeta({ property: "og:locale" }, lang === "ar" ? "ar_IQ" : "en_US");
    setMeta({ name: "twitter:title" }, title);
    setMeta({ name: "twitter:description" }, description);
    if (settings?.ogImage) {
      setMeta({ property: "og:image" }, settings.ogImage);
      setMeta({ name: "twitter:image" }, settings.ogImage);
    }
    if (settings?.keywords) {
      setMeta({ name: "keywords" }, settings.keywords);
    }
  }, [settings, i18n.language, pick]);

  return null;
}

function setMeta(selector: { name?: string; property?: string }, content: string) {
  const attr = selector.name ? "name" : "property";
  const value = selector.name ?? selector.property!;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${value}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
