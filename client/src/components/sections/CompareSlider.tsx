import { useCallback, useRef, useState } from "react";
import { MediaFrame } from "@/components/ui/MediaFrame";

interface Props {
  beforeSrc?: string | null;
  afterSrc?: string | null;
  beforeLabel: string;
  afterLabel: string;
}

export function CompareSlider({ beforeSrc, afterSrc, beforeLabel, afterLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full select-none overflow-hidden bg-nvn-panel"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      <div className="absolute inset-0">
        <MediaFrame src={afterSrc} alt={afterLabel} label={afterLabel} className="h-full w-full" />
        <span className="absolute right-3 top-3 bg-nvn-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest2 text-nvn-white">
          {afterLabel}
        </span>
      </div>

      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <MediaFrame src={beforeSrc} alt={beforeLabel} label={beforeLabel} className="h-full w-full" />
        <span className="absolute left-3 top-3 bg-nvn-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest2 text-nvn-white">
          {beforeLabel}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-y-0 z-10" style={{ left: `${position}%` }}>
        <div className="h-full w-px -translate-x-1/2 bg-white/80" />
        <div className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-nvn-black/70 backdrop-blur-sm">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6 3 12l6 6M15 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Compare before and after"
        className="absolute inset-x-0 bottom-3 z-20 mx-auto w-1/2 accent-nvn-red opacity-0 focus:opacity-100"
      />
    </div>
  );
}
