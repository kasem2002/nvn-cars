import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocalized } from "@/hooks/useLocalized";
import { useGetGalleryItemsQuery } from "@/services/api";
import { GalleryItem } from "@/types";

const CATEGORIES = ["all", "ppf", "nano-ceramic", "polish", "tint", "interior", "customization"] as const;
const PAGE_SIZE = 6;

export function Gallery() {
  const { t } = useTranslation();
  const { pick, isArabic } = useLocalized();
  const { data: items } = useGetGalleryItemsQuery();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("all");
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = useMemo(() => {
    if (!items) return [];
    return category === "all" ? items : items.filter((i) => i.category === category);
  }, [items, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [category]);

  function changeCategory(c: (typeof CATEGORIES)[number]) {
    setCategory(c);
  }

  function goToPage(p: number) {
    setPage(p);
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="gallery" className="bg-nvn-charcoal py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow={t("gallery.eyebrow")} title={t("gallery.title")} subtitle={t("gallery.subtitle")} />

        <div className="mt-10 flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => changeCategory(c)}
              className={`border px-4 py-2 text-xs font-semibold uppercase tracking-widest2 transition-colors duration-300 ${
                category === c ? "border-nvn-red bg-nvn-red text-white" : "border-nvn-line text-nvn-silver hover:border-nvn-white hover:text-nvn-white"
              }`}
            >
              {t(`gallery.categories.${c}`)}
            </button>
          ))}
        </div>

        {pageItems.length > 0 ? (
          <>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((item) => (
                <button key={item.id} onClick={() => setLightbox(item)} className="block w-full">
                  <MediaFrame
                    src={item.image}
                    alt={pick(item.captionEn, item.captionAr) || "NVN Cars"}
                    className="aspect-[4/5] w-full transition-opacity duration-500 hover:opacity-90"
                  />
                </button>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label={t("gallery.prevPage")}
                  className="flex h-10 w-10 items-center justify-center border border-nvn-line text-nvn-white transition-colors duration-300 hover:border-nvn-red hover:text-nvn-red disabled:pointer-events-none disabled:opacity-30"
                >
                  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      aria-current={pageNum === currentPage}
                      className={`flex h-10 w-10 items-center justify-center border text-sm transition-colors duration-300 ${
                        pageNum === currentPage
                          ? "border-nvn-red bg-nvn-red text-white"
                          : "border-nvn-line text-nvn-silver hover:border-nvn-white hover:text-nvn-white"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label={t("gallery.nextPage")}
                  className="flex h-10 w-10 items-center justify-center border border-nvn-line text-nvn-white transition-colors duration-300 hover:border-nvn-red hover:text-nvn-red disabled:pointer-events-none disabled:opacity-30"
                >
                  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="mt-10 text-sm text-nvn-silver">{t("gallery.empty")}</p>
        )}
      </Container>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-6"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-[80vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <MediaFrame src={lightbox.image} alt={pick(lightbox.captionEn, lightbox.captionAr) || "NVN Cars"} className="max-h-[80vh] w-full" />
              {(lightbox.captionEn || lightbox.captionAr) && (
                <p className="mt-4 text-center text-sm text-nvn-silver">{pick(lightbox.captionEn, lightbox.captionAr)}</p>
              )}
            </motion.div>
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute right-6 top-6 text-2xl text-white/80 transition-colors hover:text-white"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
