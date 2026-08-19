import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocalized } from "@/hooks/useLocalized";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useGetReviewsQuery } from "@/services/api";
import { Review } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i < rating ? "text-nvn-red" : "text-nvn-line"}`} fill="currentColor">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const { pick } = useLocalized();
  return (
    <article data-reveal className="flex flex-col gap-4 border border-nvn-line bg-nvn-panel p-8">
      <Stars rating={review.rating} />
      <p className="flex-1 text-sm leading-relaxed text-nvn-white/90">{pick(review.reviewEn, review.reviewAr)}</p>
      <div className="flex items-center gap-3 border-t border-nvn-line pt-4">
        <MediaFrame src={review.customerImage} alt={review.customerName} label="" className="h-10 w-10 shrink-0 rounded-full" />
        <div>
          <p className="text-sm font-semibold text-nvn-white">{review.customerName}</p>
          {review.vehicle && <p className="text-xs text-nvn-silver">{review.vehicle}</p>}
        </div>
      </div>
    </article>
  );
}

export function Reviews() {
  const { t } = useTranslation();
  const { data: reviews } = useGetReviewsQuery();
  const ref = useScrollReveal<HTMLDivElement>();
  const approved = reviews?.filter((r) => r.approved) ?? [];

  return (
    <section id="reviews" className="bg-nvn-black py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow={t("reviews.eyebrow")} title={t("reviews.title")} subtitle={t("reviews.subtitle")} />

        {approved.length > 0 ? (
          <div ref={ref} className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {approved.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-sm text-nvn-silver">{t("reviews.empty")}</p>
        )}
      </Container>
    </section>
  );
}
