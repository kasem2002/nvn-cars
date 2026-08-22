import { useEffect } from "react";
import { useGetLocationsQuery, useGetServicesQuery, useGetSettingsQuery } from "@/services/api";

const SCRIPT_ID = "nvn-seo-schema";
const SITE_URL = "https://nvncars.iq";
const BASE_ID = `${SITE_URL}/#business`;

/**
 * Emits a rich JSON-LD @graph so Google can index the shop as a
 * local automotive business AND surface each individual service in
 * search results ("PPF Baghdad", "nano ceramic Baghdad", etc.).
 *
 * Nodes:
 *  - AutomotiveBusiness / LocalBusiness (name, address, geo, hours, contact, socials)
 *  - Organization (for brand-level knowledge panel)
 *  - WebSite (with SearchAction — enables sitelinks searchbox)
 *  - Service x N — one per shop offering, each linked to the business
 */
export function StructuredData() {
  const { data: settings } = useGetSettingsQuery();
  const { data: locations } = useGetLocationsQuery();
  const { data: services } = useGetServicesQuery();

  useEffect(() => {
    if (!settings) return;
    const primary = locations?.[0];

    const address = primary
      ? {
          "@type": "PostalAddress",
          streetAddress: primary.address ?? "14 Ramadan Street, Al Mansour",
          addressLocality: "Baghdad",
          addressRegion: "Baghdad Governorate",
          addressCountry: "IQ",
        }
      : {
          "@type": "PostalAddress",
          streetAddress: "14 Ramadan Street, Al Mansour",
          addressLocality: "Baghdad",
          addressRegion: "Baghdad Governorate",
          addressCountry: "IQ",
        };

    const geo =
      primary && typeof primary.lat === "number" && typeof primary.lng === "number"
        ? { "@type": "GeoCoordinates", latitude: primary.lat, longitude: primary.lng }
        : { "@type": "GeoCoordinates", latitude: 33.3152, longitude: 44.3661 };

    const sameAs = [settings.instagram, settings.facebook, settings.snapchat, settings.tiktok].filter(
      (s): s is string => !!s
    );

    const business: Record<string, unknown> = {
      "@type": ["AutomotiveBusiness", "LocalBusiness"],
      "@id": BASE_ID,
      name: "NVN Cars",
      alternateName: ["إن في إن كارز", "NVN Cars Baghdad"],
      url: SITE_URL,
      logo: settings.logo ? new URL(settings.logo, SITE_URL).toString() : `${SITE_URL}/logo.png`,
      image: settings.logo ? new URL(settings.logo, SITE_URL).toString() : `${SITE_URL}/og-image.jpg`,
      description:
        settings.seoDescriptionEn ||
        "Premium automotive care center in Al Mansour, Baghdad. PPF, nano ceramic, tinting, polishing, deep detailing, wheel painting, vehicle updating.",
      priceRange: "$$$",
      currenciesAccepted: "IQD",
      address,
      geo,
      areaServed: [
        { "@type": "City", name: "Baghdad" },
        { "@type": "Country", name: "Iraq" },
      ],
      telephone: settings.phone || undefined,
      email: settings.email || undefined,
      sameAs: sameAs.length > 0 ? sameAs : undefined,
      hasMap: primary?.googleMapsUrl || primary?.wazeUrl || undefined,
      // Rendered even without dashboard-supplied hours so the
      // knowledge panel isn't blank; owner can override via the
      // location settings later.
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          opens: "10:00",
          closes: "22:00",
        },
      ],
      makesOffer:
        services && services.length > 0
          ? services
              .filter((s) => s.active)
              .map((s) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  "@id": `${SITE_URL}/#service-${s.id}`,
                },
              }))
          : undefined,
    };

    const organization: Record<string, unknown> = {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "NVN Cars",
      url: SITE_URL,
      logo: settings.logo ? new URL(settings.logo, SITE_URL).toString() : `${SITE_URL}/logo.png`,
      sameAs: sameAs.length > 0 ? sameAs : undefined,
    };

    const website: Record<string, unknown> = {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "NVN Cars",
      inLanguage: ["en", "ar"],
      publisher: { "@id": `${SITE_URL}/#org` },
    };

    const serviceNodes = (services ?? [])
      .filter((s) => s.active)
      .map((s) => ({
        "@type": "Service",
        "@id": `${SITE_URL}/#service-${s.id}`,
        name: s.nameEn,
        alternateName: s.nameAr,
        description: s.descriptionEn,
        category: s.category || "Automotive Care",
        serviceType: s.nameEn,
        provider: { "@id": BASE_ID },
        areaServed: { "@type": "City", name: "Baghdad" },
        offers: s.price
          ? {
              "@type": "Offer",
              price: s.price,
              priceCurrency: "IQD",
            }
          : undefined,
      }));

    const graph = {
      "@context": "https://schema.org",
      "@graph": [organization, website, business, ...serviceNodes],
    };

    let el = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = SCRIPT_ID;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(graph);
  }, [settings, locations, services]);

  return null;
}
