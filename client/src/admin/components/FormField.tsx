import { PropsWithChildren } from "react";

export function FormField({ label, children }: PropsWithChildren<{ label: string }>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-white/15 bg-[#0B0B0C] px-3 py-2 text-sm text-white outline-none focus:border-nvn-red";
