import { PropsWithChildren } from "react";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, subtitle, align = "left" }: PropsWithChildren<Props>) {
  return (
    <div data-reveal className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-nvn-red">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl leading-[0.95] tracking-wide text-nvn-white sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {subtitle && <p className="mt-5 text-base leading-relaxed text-nvn-silver md:text-lg">{subtitle}</p>}
    </div>
  );
}
