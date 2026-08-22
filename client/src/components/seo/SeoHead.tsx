import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetSettingsQuery } from "@/services/api";

/**
 * Keeps the page title, description, canonical URL, keywords, OG
 * and Twitter tags in sync with the current UI language and the
 * site-settings SEO overrides. Every string has both an English
 * and an Arabic default so search snippets stay in the visitor's
 * language even before the shop owner customises anything from
 * the dashboard.
 */

const DEFAULTS = {
  en: {
    title:
      "NVN Cars — Premium Automotive Care Center in Al Mansour, Baghdad | PPF, Nano Ceramic, Tinting, Detailing",
    shortTitle: "NVN Cars — Premium Automotive Care in Baghdad",
    description:
      "NVN Cars — a premium automotive care center in Al Mansour, Baghdad. Paint Protection Film (PPF), nano ceramic coating, American window tinting, thermal insulation, professional polish, deep interior cleaning, wheel painting, removable paint, vehicle updating and premium detailing. Book online.",
    keywords:
      "NVN Cars, NVN Cars Baghdad, car care Baghdad, luxury car care Baghdad, premium car detailing Baghdad, PPF Baghdad, paint protection film Baghdad, nano ceramic Baghdad, ceramic coating Iraq, car window tinting Baghdad, American tinting Iraq, thermal insulation cars, professional polish Baghdad, paint correction Iraq, dry cleaning car interior, deep interior cleaning, wheel painting Baghdad, rim painting Iraq, removable paint Baghdad, vehicle updating Baghdad, Black Edition conversion, interior detailing Baghdad, Al Mansour car care, 14 Ramadan Street Baghdad",
    ogLocale: "en_US",
    dir: "ltr",
  },
  ar: {
    title:
      "إن في إن كارز — مركز عناية فاخر بالسيارات في المنصور، بغداد | حماية طلاء PPF، نانو سيراميك، تظليل، تلميع، تفصيل",
    shortTitle: "إن في إن كارز — عناية فاخرة بالسيارات في بغداد",
    description:
      "إن في إن كارز — مركز عناية فاخر بالسيارات في المنصور، بغداد. حماية طلاء PPF، طبقة نانو سيراميك، تظليل نوافذ أمريكي، عزل حراري، تلميع احترافي، تنظيف داخلي عميق، طلاء الجنوط، الطلاء القابل للإزالة، تحديث السيارات، وتفصيل داخلي فاخر. احجز عبر الإنترنت.",
    keywords:
      "إن في إن كارز, إن في إن كارز بغداد, عناية بالسيارات بغداد, تلميع سيارات بغداد, حماية طلاء بغداد, حماية طلاء PPF بغداد, نانو سيراميك بغداد, نانو سيراميك العراق, تظليل نوافذ بغداد, تظليل أمريكي العراق, عزل حراري سيارات, تلميع احترافي بغداد, تصحيح طلاء العراق, تنظيف داخلي عميق, تنظيف جاف للسيارات, طلاء الجنوط بغداد, الطلاء القابل للإزالة, تحديث السيارات بغداد, تحويل Black Edition, تفصيل داخلي بغداد, المنصور, شارع 14 رمضان بغداد",
    ogLocale: "ar_IQ",
    dir: "rtl",
  },
} as const;

export function SeoHead() {
  const { i18n } = useTranslation();
  const { data: settings } = useGetSettingsQuery();

  useEffect(() => {
    const lang: "en" | "ar" = i18n.language === "ar" ? "ar" : "en";
    const d = DEFAULTS[lang];
    const other = DEFAULTS[lang === "ar" ? "en" : "ar"];

    // Prefer a dashboard-supplied override in the current language,
    // fall back to the other language's override if only one side is
    // filled, then finally to the bilingual defaults above.
    const settingsTitle =
      lang === "ar"
        ? settings?.seoTitleAr || settings?.seoTitleEn
        : settings?.seoTitleEn || settings?.seoTitleAr;
    const settingsDesc =
      lang === "ar"
        ? settings?.seoDescriptionAr || settings?.seoDescriptionEn
        : settings?.seoDescriptionEn || settings?.seoDescriptionAr;

    const title = settingsTitle || d.title;
    const shortTitle = settingsTitle || d.shortTitle;
    const description = settingsDesc || d.description;
    const keywords = settings?.keywords || d.keywords;

    document.title = title;
    document.documentElement.lang = lang;
    document.documentElement.dir = d.dir;

    setMeta({ name: "description" }, description);
    setMeta({ name: "keywords" }, keywords);
    setMeta({ property: "og:title" }, shortTitle);
    setMeta({ property: "og:description" }, description);
    setMeta({ property: "og:locale" }, d.ogLocale);
    setMeta({ property: "og:locale:alternate" }, other.ogLocale);
    setMeta({ name: "twitter:title" }, shortTitle);
    setMeta({ name: "twitter:description" }, description);
    if (settings?.ogImage) {
      setMeta({ property: "og:image" }, settings.ogImage);
      setMeta({ name: "twitter:image" }, settings.ogImage);
    }
  }, [settings, i18n.language]);

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
