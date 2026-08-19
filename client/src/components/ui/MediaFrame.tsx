import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string;
  label?: string;
}

/**
 * Renders real photography when `src` is provided by the dashboard.
 * Otherwise renders a clearly-labeled placeholder so the layout reads as
 * intentional rather than broken, until real NVN photography is uploaded.
 */
export function MediaFrame({ src, alt, label, className = "", ...rest }: Props) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-nvn-charcoal ${className}`} {...rest}>
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-nvn-charcoal via-nvn-panel to-nvn-black ${className}`}
      role="img"
      aria-label={alt}
      {...rest}
    >
      <svg
        className="h-1/3 w-1/3 max-h-24 max-w-24 text-nvn-line"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M6 40h52l-5-14a6 6 0 0 0-5.7-4H16.7a6 6 0 0 0-5.7 4L6 40Z" />
        <circle cx="18" cy="44" r="5" />
        <circle cx="46" cy="44" r="5" />
        <path d="M6 40v6a2 2 0 0 0 2 2h4M58 40v6a2 2 0 0 1-2 2h-4" />
      </svg>
      <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-widest2 text-nvn-silver/60">
        {label ?? "NVN Photography"}
      </span>
    </div>
  );
}
