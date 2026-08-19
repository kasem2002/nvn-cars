import { useTranslation } from "react-i18next";
import { useGetSettingsQuery } from "@/services/api";

export function WhatsAppFloat() {
  const { data: settings } = useGetSettingsQuery();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  if (!settings?.whatsapp) return null;

  const digits = settings.whatsapp.replace(/[^\d]/g, "");
  const message = isArabic ? "مرحباً، أود الاستفسار عن خدمات NVN Cars" : "Hi, I'd like to ask about NVN Cars services";

  return (
    <a
      href={`https://wa.me/${digits}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-110 ${
        isArabic ? "left-6" : "right-6"
      }`}
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.393.7 4.62 1.91 6.49L4 29l7.72-1.87A12.9 12.9 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3Zm0 21.8c-1.98 0-3.83-.55-5.41-1.5l-.39-.23-4.58 1.11 1.15-4.46-.25-.41A9.77 9.77 0 0 1 5.2 15c0-5.96 4.84-10.8 10.8-10.8S26.8 9.04 26.8 15 21.96 24.8 16 24.8Zm5.55-8.1c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.68-2.09-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.65-.94-2.26-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.44.25-.7.25-1.31.18-1.44-.08-.13-.28-.2-.58-.35Z" />
      </svg>
    </a>
  );
}
