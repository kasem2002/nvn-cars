import { useTranslation } from "react-i18next";

export function useLocalized() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  function pick(en: string | null | undefined, ar: string | null | undefined): string {
    if (isArabic) return ar || en || "";
    return en || ar || "";
  }

  return { isArabic, pick };
}
