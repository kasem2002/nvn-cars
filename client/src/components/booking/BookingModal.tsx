import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useLocalized } from "@/hooks/useLocalized";
import { useCreateBookingMutation, useGetServicesQuery } from "@/services/api";
import { bookingModalClosed } from "@/store/uiSlice";
import { DEFAULT_COUNTRY_CODE, PhoneField, formatFullPhone, isValidLocalPhone, normalizePhone } from "./PhoneField";

const VEHICLE_TYPES = ["sedan", "suv", "sports", "luxury", "super", "other"] as const;
const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00", "18:00"];
const TOTAL_STEPS = 5;
const SUCCESS_AUTOCLOSE_MS = 2200;

interface FormState {
  serviceId: string | null;
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  preferredDate: string;
  preferredTime: string;
  customerName: string;
  phoneCountry: string;
  phone: string;
  whatsappCountry: string;
  whatsapp: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  serviceId: null,
  vehicleType: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleYear: "",
  vehicleColor: "",
  preferredDate: "",
  preferredTime: "",
  customerName: "",
  phoneCountry: DEFAULT_COUNTRY_CODE,
  phone: "",
  whatsappCountry: DEFAULT_COUNTRY_CODE,
  whatsapp: "",
  notes: "",
};

const ease = [0.16, 1, 0.3, 1] as const;

export function BookingModal() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.bookingModalOpen);
  const presetServiceId = useAppSelector((s) => s.ui.bookingPresetServiceId);
  const { data: services } = useGetServicesQuery();
  const [createBooking, { isLoading, isSuccess, isError, reset }] = useCreateBookingMutation();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showPhoneErrors, setShowPhoneErrors] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY_FORM, serviceId: presetServiceId });
      setStep(1);
      setShowPhoneErrors(false);
      reset();
    }
  }, [open, presetServiceId, reset]);

  function close() {
    dispatch(bookingModalClosed());
  }

  // After a successful booking: show confirmation briefly, then close
  // the modal and scroll the visitor back to the top of the home page.
  useEffect(() => {
    if (!isSuccess) return;
    const t = window.setTimeout(() => {
      close();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, SUCCESS_AUTOCLOSE_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function step4Valid(): boolean {
    if (!form.customerName.trim()) return false;
    if (!isValidLocalPhone(form.phone)) return false;
    if (form.whatsapp && !isValidLocalPhone(form.whatsapp)) return false;
    return true;
  }

  function canProceed() {
    if (step === 1) return !!form.serviceId;
    if (step === 2) return !!form.vehicleType;
    if (step === 3) return !!form.preferredDate && !!form.preferredTime;
    if (step === 4) return step4Valid();
    return true;
  }

  function handleNext() {
    if (step === 4 && !step4Valid()) {
      setShowPhoneErrors(true);
      return;
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!step4Valid()) {
      setShowPhoneErrors(true);
      setStep(4);
      return;
    }
    await createBooking({
      serviceId: form.serviceId,
      vehicleType: form.vehicleType,
      vehicleMake: form.vehicleMake || undefined,
      vehicleModel: form.vehicleModel || undefined,
      vehicleYear: form.vehicleYear || undefined,
      vehicleColor: form.vehicleColor || undefined,
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime,
      customerName: form.customerName.trim(),
      phone: formatFullPhone(form.phoneCountry, form.phone),
      whatsapp: form.whatsapp ? formatFullPhone(form.whatsappCountry, form.whatsapp) : undefined,
      notes: form.notes || undefined,
    });
  }

  const selectedService = services?.find((s) => s.id === form.serviceId);
  const stepLabels = ["step1", "step2", "step3", "step4", "step5"] as const;

  const vehicleSummary = [
    form.vehicleType ? t(`selector.vehicles.${form.vehicleType}` as never) : "",
    form.vehicleYear,
    form.vehicleMake,
    form.vehicleModel,
    form.vehicleColor,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={close}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden bg-nvn-panel sm:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label={t("booking.close")}
              className="absolute right-5 top-5 z-10 text-2xl text-nvn-silver transition-colors hover:text-white"
            >
              ×
            </button>

            {!isSuccess ? (
              <>
                <div className="border-b border-nvn-line px-8 pb-6 pt-8">
                  <p className="text-xs font-semibold uppercase tracking-widest2 text-nvn-red">{t("booking.eyebrow")}</p>
                  <h3 className="mt-2 font-display text-3xl tracking-wide text-nvn-white">
                    {t(`booking.${stepLabels[step - 1]}.title`)}
                  </h3>
                  <div className="mt-5 flex gap-2">
                    {stepLabels.map((s, i) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                          i < step ? "bg-nvn-red" : "bg-nvn-line"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
                  <div className="flex-1 px-8 py-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.35, ease }}
                      >
                        {step === 1 && (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {services
                              ?.filter((s) => s.active)
                              .map((service) => (
                                <button
                                  type="button"
                                  key={service.id}
                                  onClick={() => update("serviceId", service.id)}
                                  className={`border px-5 py-4 text-left transition-colors duration-300 ${
                                    form.serviceId === service.id
                                      ? "border-nvn-red bg-nvn-red/10"
                                      : "border-nvn-line hover:border-nvn-white/40"
                                  }`}
                                >
                                  <p className="font-display text-lg tracking-wide text-nvn-white">
                                    {pick(service.nameEn, service.nameAr)}
                                  </p>
                                </button>
                              ))}
                          </div>
                        )}

                        {step === 2 && (
                          <div className="space-y-6">
                            <div>
                              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">
                                {t("booking.fields.vehicleType")}
                              </label>
                              <div className="flex flex-wrap gap-3">
                                {VEHICLE_TYPES.map((v) => (
                                  <button
                                    type="button"
                                    key={v}
                                    onClick={() => update("vehicleType", v)}
                                    className={`border px-4 py-2 text-xs font-semibold uppercase tracking-widest2 transition-colors duration-300 ${
                                      form.vehicleType === v
                                        ? "border-nvn-red bg-nvn-red text-white"
                                        : "border-nvn-line text-nvn-silver hover:border-white/40"
                                    }`}
                                  >
                                    {t(`selector.vehicles.${v}`)}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <Field
                                label={t("booking.fields.vehicleMake")}
                                value={form.vehicleMake}
                                onChange={(v) => update("vehicleMake", v)}
                              />
                              <Field
                                label={t("booking.fields.vehicleModel")}
                                value={form.vehicleModel}
                                onChange={(v) => update("vehicleModel", v)}
                              />
                              <Field
                                label={t("booking.fields.vehicleYear")}
                                value={form.vehicleYear}
                                onChange={(v) => update("vehicleYear", v)}
                              />
                              <Field
                                label={t("booking.fields.vehicleColor")}
                                value={form.vehicleColor}
                                onChange={(v) => update("vehicleColor", v)}
                              />
                            </div>
                          </div>
                        )}

                        {step === 3 && (
                          <div className="space-y-6">
                            <div>
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">
                                {t("booking.fields.date")}
                              </label>
                              <input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={form.preferredDate}
                                onChange={(e) => update("preferredDate", e.target.value)}
                                className="w-full border border-nvn-line bg-transparent px-4 py-3 text-nvn-white outline-none focus:border-nvn-red"
                              />
                            </div>
                            <div>
                              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">
                                {t("booking.fields.time")}
                              </label>
                              <div className="flex flex-wrap gap-3">
                                {TIME_SLOTS.map((slot) => (
                                  <button
                                    type="button"
                                    key={slot}
                                    onClick={() => update("preferredTime", slot)}
                                    className={`border px-4 py-2 text-sm transition-colors duration-300 ${
                                      form.preferredTime === slot
                                        ? "border-nvn-red bg-nvn-red text-white"
                                        : "border-nvn-line text-nvn-silver hover:border-white/40"
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {step === 4 && (
                          <div className="space-y-4">
                            <Field
                              label={t("booking.fields.name")}
                              value={form.customerName}
                              onChange={(v) => update("customerName", v)}
                              required
                            />
                            <PhoneField
                              label={t("booking.fields.phone")}
                              country={form.phoneCountry}
                              onCountryChange={(c) => update("phoneCountry", c)}
                              value={form.phone}
                              onValueChange={(v) => update("phone", v)}
                              required
                              showError={showPhoneErrors}
                            />
                            <PhoneField
                              label={t("booking.fields.whatsapp")}
                              country={form.whatsappCountry}
                              onCountryChange={(c) => update("whatsappCountry", c)}
                              value={form.whatsapp}
                              onValueChange={(v) => update("whatsapp", v)}
                              showError={showPhoneErrors && !!form.whatsapp}
                            />
                            <div>
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">
                                {t("booking.fields.notes")}
                              </label>
                              <textarea
                                value={form.notes}
                                onChange={(e) => update("notes", e.target.value)}
                                rows={3}
                                className="w-full border border-nvn-line bg-transparent px-4 py-3 text-nvn-white outline-none focus:border-nvn-red"
                              />
                            </div>
                          </div>
                        )}

                        {step === 5 && (
                          <div className="space-y-6">
                            <p className="text-sm text-nvn-silver">{t("booking.reviewIntro")}</p>

                            <div className="divide-y divide-nvn-line border border-nvn-line">
                              <SummaryRow
                                label={t("booking.step1.label")}
                                value={selectedService ? pick(selectedService.nameEn, selectedService.nameAr) : "—"}
                                onEdit={() => setStep(1)}
                              />
                              <SummaryRow
                                label={t("booking.step2.label")}
                                value={vehicleSummary || "—"}
                                onEdit={() => setStep(2)}
                              />
                              <SummaryRow
                                label={t("booking.step3.label")}
                                value={`${form.preferredDate} · ${form.preferredTime}`}
                                onEdit={() => setStep(3)}
                              />
                              <SummaryRow
                                label={t("booking.fields.name")}
                                value={form.customerName || "—"}
                                onEdit={() => setStep(4)}
                              />
                              <SummaryRow
                                label={t("booking.fields.phone")}
                                value={form.phone ? `${form.phoneCountry} ${normalizePhone(form.phone)}` : "—"}
                                onEdit={() => setStep(4)}
                              />
                              {form.whatsapp && (
                                <SummaryRow
                                  label={t("booking.fields.whatsapp")}
                                  value={`${form.whatsappCountry} ${normalizePhone(form.whatsapp)}`}
                                  onEdit={() => setStep(4)}
                                />
                              )}
                              {form.notes && (
                                <SummaryRow
                                  label={t("booking.fields.notes")}
                                  value={form.notes}
                                  onEdit={() => setStep(4)}
                                />
                              )}
                            </div>

                            {isError && <p className="text-sm text-nvn-red">{t("booking.errorGeneric")}</p>}
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between border-t border-nvn-line px-8 py-6">
                    <button
                      type="button"
                      onClick={() => setStep((s) => Math.max(1, s - 1))}
                      className={`text-xs font-semibold uppercase tracking-widest2 text-nvn-silver transition-colors hover:text-white ${
                        step === 1 ? "invisible" : ""
                      }`}
                    >
                      {t("booking.back")}
                    </button>

                    {step < TOTAL_STEPS ? (
                      <button
                        type="button"
                        disabled={!canProceed()}
                        onClick={handleNext}
                        className="bg-nvn-red px-8 py-3.5 text-xs font-semibold uppercase tracking-widest2 text-white transition-colors duration-300 hover:bg-white hover:text-nvn-black disabled:opacity-40"
                      >
                        {t("booking.next")}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-nvn-red px-8 py-3.5 text-xs font-semibold uppercase tracking-widest2 text-white transition-colors duration-300 hover:bg-white hover:text-nvn-black disabled:opacity-60"
                      >
                        {isLoading ? t("booking.submitting") : t("booking.submit")}
                      </button>
                    )}
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-nvn-red">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-nvn-red" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-display text-3xl tracking-wide text-nvn-white">{t("booking.successTitle")}</h3>
                <p className="max-w-sm text-sm text-nvn-silver">{t("booking.successBody")}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-nvn-line bg-transparent px-4 py-3 text-nvn-white outline-none focus:border-nvn-red"
      />
    </div>
  );
}

function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest2 text-nvn-silver">{label}</p>
        <p className="mt-1 break-words text-sm text-nvn-white">{value}</p>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-[10px] font-semibold uppercase tracking-widest2 text-nvn-red transition-colors hover:text-white"
        >
          Edit
        </button>
      )}
    </div>
  );
}
