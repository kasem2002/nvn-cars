import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { bookingModalOpened } from "@/store/uiSlice";

const HeroCar = lazy(() => import("@/components/hero-car/HeroCar"));

const ease = [0.16, 1, 0.3, 1] as const;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const entered = useAppSelector((s) => s.ui.hasEnteredSite);

  return (
    <section id="home" className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden">
      <MediaFrame src={null} alt="NVN Cars — premium vehicle" label="Hero Photography" className="absolute inset-0" />
      <Suspense fallback={null}>
        <HeroCar />
      </Suspense>
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-nvn-black via-nvn-black/60 to-nvn-black/20" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-nvn-black/70 via-transparent to-transparent" />

      <div className="relative z-[3] w-full px-6 pb-20 md:px-10 md:pb-24 xl:px-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease }}
          className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-nvn-red"
        >
          {t("hero.eyebrow")}
        </motion.p>

        <h1 className="font-display leading-[0.9] text-nvn-white">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.9, ease }}
            className="block text-6xl tracking-wide sm:text-7xl md:text-8xl xl:text-9xl"
          >
            {t("hero.titleLine1")}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.9, ease }}
            className="text-outline block text-6xl tracking-wide sm:text-7xl md:text-8xl xl:text-9xl"
          >
            {t("hero.titleLine2")}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8, ease }}
          className="mt-8 max-w-md text-base text-nvn-silver md:text-lg"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.85, duration: 0.8, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => dispatch(bookingModalOpened(null))}
            className="bg-nvn-red px-8 py-4 text-xs font-semibold uppercase tracking-widest2 text-white transition-colors duration-300 hover:bg-white hover:text-nvn-black"
          >
            {t("hero.cta1")}
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="border border-white/30 px-8 py-4 text-xs font-semibold uppercase tracking-widest2 text-white transition-colors duration-300 hover:border-white"
          >
            {t("hero.cta2")}
          </button>
        </motion.div>
      </div>

      <motion.button
        onClick={() => scrollToSection("services")}
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.8 }}
        aria-label={t("hero.scroll")}
        className="absolute bottom-8 right-6 z-[3] hidden flex-col items-center gap-2 md:right-10 md:flex xl:right-16"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest2 text-nvn-silver">{t("hero.scroll")}</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-nvn-red"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          />
        </span>
      </motion.button>
    </section>
  );
}
