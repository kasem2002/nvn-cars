import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function BrandStatement() {
  const { t } = useTranslation();
  const ref = useScrollReveal<HTMLDivElement>({ y: 30 });

  return (
    <section className="border-y border-nvn-line bg-nvn-charcoal py-24 md:py-32">
      <Container>
        <div ref={ref} className="mx-auto max-w-4xl text-center">
          <p data-reveal className="font-display text-4xl leading-[1.05] tracking-wide text-nvn-white sm:text-5xl md:text-6xl">
            {t("brand.line1")} <span className="text-nvn-red">{t("brand.line2")}</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
