import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocalized } from "@/hooks/useLocalized";
import { useGetSettingsQuery, useGetSocialPostsQuery } from "@/services/api";

export function Instagram() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const { data: posts } = useGetSocialPostsQuery();
  const { data: settings } = useGetSettingsQuery();

  if (settings && settings.instagramEnabled === false) return null;

  return (
    <section className="bg-nvn-charcoal py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t("instagram.eyebrow")} title={t("instagram.title")} subtitle={t("instagram.subtitle")} />
          <a
            href={settings?.instagram ?? "https://www.instagram.com/nvn.cars/"}
            target="_blank"
            rel="noreferrer"
            className="border border-nvn-line px-6 py-3 text-xs font-semibold uppercase tracking-widest2 text-nvn-white transition-colors duration-300 hover:border-nvn-red hover:text-nvn-red"
          >
            {t("instagram.cta")}
          </a>
        </div>

        {posts && posts.length > 0 ? (
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {posts.slice(0, 10).map((post) => (
              <a
                key={post.id}
                href={post.link ?? settings?.instagram ?? "https://www.instagram.com/nvn.cars/"}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-square overflow-hidden"
              >
                <MediaFrame src={post.image} alt={pick(post.captionEn, post.captionAr) || "NVN Cars on Instagram"} className="h-full w-full transition-transform duration-700 ease-luxury group-hover:scale-110" />
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-14 text-sm text-nvn-silver">{t("instagram.empty")}</p>
        )}
      </Container>
    </section>
  );
}
