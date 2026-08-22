import { useMemo } from "react";

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

/**
 * Strip everything that isn't a digit. Also strips a leading 0 —
 * Iraqi mobile numbers are commonly written as 07xx-xxx-xxxx, but
 * with a country code the leading 0 must not be repeated.
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D+/g, "");
  return digits.startsWith("0") ? digits.slice(1) : digits;
}

/**
 * A valid local phone number is 6–14 digits after normalisation
 * (covers everything from 6-digit landlines up to the longest
 * international mobile formats).
 */
export function isValidLocalPhone(raw: string): boolean {
  const digits = normalizePhone(raw);
  return digits.length >= 6 && digits.length <= 14;
}

export function formatFullPhone(country: string, raw: string): string {
  const digits = normalizePhone(raw);
  return `${country} ${digits}`;
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
}: Props) {
  const invalid = useMemo(() => {
    if (!value) return required;
    return !isValidLocalPhone(value);
  }, [value, required]);

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest2 text-nvn-silver">{label}</label>
      <div className="flex">
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="border border-nvn-line bg-nvn-panel px-3 py-3 text-sm text-nvn-white outline-none focus:border-nvn-red"
          aria-label="Country code"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code + c.name} value={c.code}>
              {c.flag} {c.code} {c.name}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required={required}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="e.g. 7XX XXX XXXX"
          className={`w-full border border-l-0 bg-transparent px-4 py-3 text-nvn-white outline-none ${
            showError && invalid ? "border-nvn-red" : "border-nvn-line focus:border-nvn-red"
          }`}
        />
      </div>
      {showError && invalid && <p className="mt-1.5 text-xs text-nvn-red">{errorMessage}</p>}
    </div>
  );
}
