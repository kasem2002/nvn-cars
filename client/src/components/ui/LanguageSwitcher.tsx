import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/app/hooks";
import { SupportedLanguage } from "@/i18n";
import { languageSet } from "@/store/languageSlice";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const current = i18n.language === "ar" ? "ar" : "en";

  function toggle() {
    const next: SupportedLanguage = current === "en" ? "ar" : "en";
    i18n.changeLanguage(next);
    dispatch(languageSet(next));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`text-xs font-semibold uppercase tracking-widest2 text-nvn-silver transition-colors duration-300 hover:text-nvn-red ${className}`}
      aria-label="Switch language"
    >
      {current === "en" ? "العربية" : "English"}
    </button>
  );
}
