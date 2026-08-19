import { useEffect } from "react";
import { useGetLocationsQuery, useGetSettingsQuery } from "@/services/api";

const SCRIPT_ID = "nvn-local-business-schema";

export function StructuredData() {
  const { data: settings } = useGetSettingsQuery();
  const { data: locations } = useGetLocationsQuery();

  useEffect(() => {
    const primary = locations?.[0];
    if (!settings) return;

    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "AutomotiveBusiness",
      name: "NVN Cars",
      image: settings.logo || undefined,
      telephone: settings.phone || undefined,
      sameAs: [settings.instagram, settings.facebook, settings.tiktok].filter(Boolean),
      ...(primary && {
        address: {
          "@type": "PostalAddress",
          streetAddress: primary.address,
          addressLocality: "Baghdad",
          addressCountry: "IQ",
        },
      }),
    };

    let el = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = SCRIPT_ID;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
  }, [settings, locations]);

  return null;
}
