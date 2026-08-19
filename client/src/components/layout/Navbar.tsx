import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { bookingModalOpened, mobileMenuToggled } from "@/store/uiSlice";

const SECTIONS = [
  { id: "home", key: "nav.home" },
  { id: "services", key: "nav.services" },
  { id: "experience", key: "nav.experience" },
  { id: "gallery", key: "nav.gallery" },
  { id: "before-after", key: "nav.beforeAfter" },
  { id: "reviews", key: "nav.reviews" },
  { id: "location", key: "nav.location" },
] as const;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = useAppSelector((s) => s.ui.mobileMenuOpen);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxury ${
          scrolled ? "bg-nvn-black/90 backdrop-blur-md py-3 shadow-[0_1px_0_rgba(255,255,255,0.06)]" : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 md:px-10 xl:px-16">
          <button onClick={() => scrollToSection("home")} className="text-2xl md:text-3xl">
            <Logo />
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-xs font-medium uppercase tracking-widest2 text-nvn-silver transition-colors duration-300 hover:text-nvn-white"
              >
                {t(section.key)}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <LanguageSwitcher />
            <button
              onClick={() => dispatch(bookingModalOpened(null))}
              className="border border-nvn-red px-5 py-2.5 text-xs font-semibold uppercase tracking-widest2 text-nvn-red transition-colors duration-300 hover:bg-nvn-red hover:text-white"
            >
              {t("nav.book")}
            </button>
          </div>

          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => dispatch(mobileMenuToggled())}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`h-px w-6 bg-nvn-white transition-transform duration-300 ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-nvn-white transition-transform duration-300 ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col bg-nvn-black lg:hidden"
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              {SECTIONS.map((section, i) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    dispatch(mobileMenuToggled(false));
                    scrollToSection(section.id);
                  }}
                  className="font-display text-4xl tracking-wide text-nvn-white"
                >
                  {t(section.key)}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * SECTIONS.length, duration: 0.5 }}
                onClick={() => {
                  dispatch(mobileMenuToggled(false));
                  dispatch(bookingModalOpened(null));
                }}
                className="mt-4 border border-nvn-red px-8 py-3 text-sm font-semibold uppercase tracking-widest2 text-nvn-red"
              >
                {t("nav.book")}
              </motion.button>
            </div>
            <div className="flex items-center justify-center pb-10">
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
