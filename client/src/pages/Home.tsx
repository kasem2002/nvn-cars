import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useAppSelector } from "@/app/hooks";
import { BookingModal } from "@/components/booking/BookingModal";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { About } from "@/components/sections/About";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { Contact } from "@/components/sections/Contact";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Instagram } from "@/components/sections/Instagram";
import { Location } from "@/components/sections/Location";
import { Reviews } from "@/components/sections/Reviews";
import { ServiceSelector } from "@/components/sections/ServiceSelector";
import { Services } from "@/components/sections/Services";
import { Showcase } from "@/components/sections/Showcase";
import { SeoHead } from "@/components/seo/SeoHead";
import { StructuredData } from "@/components/seo/StructuredData";
import { useGetSettingsQuery } from "@/services/api";
import { useLenis } from "@/hooks/useLenis";

export function Home() {
  const { i18n } = useTranslation();
  const { data: settings } = useGetSettingsQuery();
  const hasEntered = useAppSelector((s) => s.ui.hasEnteredSite);
  useLenis();

  useEffect(() => {
    const title = i18n.language === "ar" ? settings?.seoTitleAr : settings?.seoTitleEn;
    document.title = title || "NVN Cars — Premium Automotive Care";
  }, [settings, i18n.language]);

  return (
    <>
      <SeoHead />
      <StructuredData />
      <Loader />
      {hasEntered && (
        <>
          <Navbar />
          <main>
            <Hero />
            <BrandStatement />
            <Services />
            <ServiceSelector />
            <Showcase />
            <About />
            <BeforeAfter />
            <Gallery />
            <Reviews />
            <Instagram />
            <Location />
            <BookingCTA />
            <Contact />
          </main>
          <Footer />
          <WhatsAppFloat />
          <BookingModal />
        </>
      )}
    </>
  );
}
