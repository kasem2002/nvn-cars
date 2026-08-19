import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocalized } from "@/hooks/useLocalized";
import { useGetGalleryItemsQuery } from "@/services/api";
import { GalleryItem } from "@/types";

const CATEGORIES = ["all", "ppf", "nano-ceramic", "polish", "tint", "interior", "customization"] as const;

export function Gallery() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { data: items } = useGetGalleryItemsQuery();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = useMemo(() => {
    if (!items) return [];
    return category === "all" ? items : items.filter((i) => i.category === category);
  }, [items, category]);

  return (
    <section id="gallery" className="bg-nvn-charcoal py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow={t("gallery.eyebrow")} title={t("gallery.title")} subtitle={t("gallery.subtitle")} />

        <div className="mt-10 flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`border px-4 py-2 text-xs font-semibold uppercase tracking-widest2 transition-colors duration-300 ${
                category === c ? "border-nvn-red bg-nvn-red text-white" : "border-nvn-line text-nvn-silver hover:border-nvn-white hover:text-nvn-white"
              }`}
            >
              {t(`gallery.categories.${c}`)}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {filtered.map((item) => (
              <button key={item.id} onClick={() => setLightbox(item)} className="block w-full break-inside-avoid">
                <MediaFrame
                  src={item.image}
                  alt={pick(item.captionEn, item.captionAr) || "NVN Cars"}
                  className="aspect-[4/5] w-full transition-opacity duration-500 hover:opacity-90"
                />
              </button>
            ))}
          </div>
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
