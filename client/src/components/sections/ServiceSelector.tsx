import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/app/hooks";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocalized } from "@/hooks/useLocalized";
import { useGetServicesQuery } from "@/services/api";
import { bookingModalOpened } from "@/store/uiSlice";

const VEHICLES = ["sedan", "suv", "sports", "luxury", "super", "other"] as const;

const GOALS = [
  { id: "protectPaint", categories: ["ppf", "nano-ceramic"] },
  { id: "improveAppearance", categories: ["polish", "customization"] },
  { id: "protectHeat", categories: ["tint"] },
  { id: "interior", categories: ["interior"] },
  { id: "customize", categories: ["customization"] },
  { id: "fullCare", categories: ["ppf", "nano-ceramic", "polish", "interior", "tint", "customization"] },
] as const;

export function ServiceSelector() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const dispatch = useAppDispatch();
  const { data: services } = useGetServicesQuery();
  const [vehicle, setVehicle] = useState<(typeof VEHICLES)[number] | null>(null);
  const [goal, setGoal] = useState<(typeof GOALS)[number]["id"] | null>(null);

  const recommendations = useMemo(() => {
    if (!goal || !services) return [];
    const categories = GOALS.find((g) => g.id === goal)?.categories ?? [];
    return services.filter((s) => s.active && s.category && categories.includes(s.category as never)).slice(0, 4);
  }, [goal, services]);

  return (
    <section className="bg-nvn-charcoal py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow={t("selector.eyebrow")} title={t("selector.title")} subtitle={t("selector.subtitle")} />

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="space-y-10">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">{t("selector.vehicleLabel")}</p>
              <div className="flex flex-wrap gap-3">
                {VEHICLES.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVehicle(v)}
                    className={`border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest2 transition-colors duration-300 ${
                      vehicle === v ? "border-nvn-red bg-nvn-red text-white" : "border-nvn-line text-nvn-silver hover:border-nvn-white hover:text-nvn-white"
                    }`}
                  >
                    {t(`selector.vehicles.${v}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">{t("selector.goalLabel")}</p>
              <div className="flex flex-wrap gap-3">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest2 transition-colors duration-300 ${
                      goal === g.id ? "border-nvn-red bg-nvn-red text-white" : "border-nvn-line text-nvn-silver hover:border-nvn-white hover:text-nvn-white"
                    }`}
                  >
                    {t(`selector.goals.${g.id}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-nvn-line bg-nvn-panel p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-widest2 text-nvn-red">{t("selector.resultTitle")}</p>
            <AnimatePresence mode="wait">
              {recommendations.length > 0 ? (
                <motion.ul
                  key={goal}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 space-y-4"
                >
                  {recommendations.map((service) => (
                    <li key={service.id} className="flex items-center justify-between border-b border-nvn-line pb-4">
                      <div>
                        <p className="font-display text-xl tracking-wide text-nvn-white">{pick(service.nameEn, service.nameAr)}</p>
                        <p className="mt-1 text-sm text-nvn-silver">{pick(service.descriptionEn, service.descriptionAr)}</p>
                      </div>
                      <button
                        onClick={() => dispatch(bookingModalOpened(service.id))}
                        className="shrink-0 text-xs font-semibold uppercase tracking-widest2 text-nvn-red transition-colors hover:text-white"
                      >
                        {t("services.cta")}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              ) : (
                <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-sm text-nvn-silver">
                  {t("selector.noSelection")}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
