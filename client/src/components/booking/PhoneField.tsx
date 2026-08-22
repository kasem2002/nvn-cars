import { useEffect, useMemo, useRef, useState } from "react";

export const COUNTRY_CODES = [
  { code: "+964", name: "Iraq", flag: "🇮🇶" },
  { code: "+98", name: "Iran", flag: "🇮🇷" },
  { code: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "+962", name: "Jordan", flag: "🇯🇴" },
  { code: "+963", name: "Syria", flag: "🇸🇾" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+1", name: "USA / Canada", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
] as const;

export const DEFAULT_COUNTRY_CODE = "+964";

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D+/g, "");
  return digits.startsWith("0") ? digits.slice(1) : digits;
}

export function isValidLocalPhone(raw: string): boolean {
  const digits = normalizePhone(raw);
  return digits.length >= 6 && digits.length <= 14;
}

export function formatFullPhone(country: string, raw: string): string {
  return `${country} ${normalizePhone(raw)}`;
}

interface Props {
  label: string;
  country: string;
  onCountryChange: (code: string) => void;
  value: string;
  onValueChange: (v: string) => void;
  required?: boolean;
  showError?: boolean;
  errorMessage?: string;
  isArabic?: boolean;
}

export function PhoneField({
  label,
  country,
  onCountryChange,
  value,
  onValueChange,
  required,
  showError,
  errorMessage = "Enter a valid phone number (digits only, at least 6).",
  isArabic,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const selected = COUNTRY_CODES.find((c) => c.code === country) ?? COUNTRY_CODES[0];

  const invalid = useMemo(() => {
    if (!value) return !!required;
    return !isValidLocalPhone(value);
  }, [value, required]);

  return (
    <div ref={rootRef} className="relative">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">{label}</label>
      <div
        className={`flex overflow-hidden border transition-colors ${
          showError && invalid ? "border-nvn-red" : "border-nvn-line focus-within:border-nvn-red"
        } ${isArabic ? "flex-row-reverse" : ""}`}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`flex shrink-0 items-center gap-1.5 bg-nvn-panel px-3 py-3 text-sm text-nvn-white transition-colors hover:bg-nvn-black/60 ${
            isArabic ? "border-l border-nvn-line" : "border-r border-nvn-line"
          }`}
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="font-mono">{selected.code}</span>
          <svg viewBox="0 0 24 24" className="h-3 w-3 opacity-60" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required={required}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="7XX XXX XXXX"
          dir="ltr"
          className={`w-full min-w-0 bg-transparent px-4 py-3 text-nvn-white outline-none placeholder:text-nvn-silver/40 ${
            isArabic ? "text-right" : "text-left"
          }`}
        />
      </div>

      {open && (
        <div
          className={`absolute z-10 mt-1 max-h-64 w-64 overflow-y-auto border border-nvn-line bg-nvn-panel shadow-[0_16px_60px_rgba(0,0,0,0.6)] ${
            isArabic ? "right-0" : "left-0"
          }`}
          role="listbox"
        >
          {COUNTRY_CODES.map((c) => (
            <button
              key={c.code + c.name}
              type="button"
              onClick={() => {
                onCountryChange(c.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-nvn-black/60 ${
                c.code === country ? "bg-nvn-red/15 text-nvn-white" : "text-nvn-silver"
              }`}
              role="option"
              aria-selected={c.code === country}
            >
              <span className="text-base leading-none">{c.flag}</span>
              <span className="w-14 font-mono">{c.code}</span>
              <span className="truncate">{c.name}</span>
            </button>
          ))}
        </div>
      )}

      {showError && invalid && <p className="mt-1.5 text-xs text-nvn-red">{errorMessage}</p>}
    </div>
  );
}
