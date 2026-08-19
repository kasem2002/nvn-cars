import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { MediaFrame } from "@/components/ui/MediaFrame";

function Panel({ label, speed }: { label: string; speed: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -40, speed * 40]);

  return (
    <div ref={ref} className="relative aspect-[3/4] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-10%]">
        <MediaFrame src={null} alt={label} label={label} className="h-full w-full" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-nvn-black/70 via-transparent to-transparent" />
      <span className="absolute bottom-6 left-6 text-xs font-semibold uppercase tracking-widest2 text-nvn-white">{label}</span>
    </div>
  );
}

export function Showcase() {
  return (
    <section id="experience" className="bg-nvn-black py-24 md:py-32">
      <div className="grid grid-cols-1 gap-3 px-3 sm:grid-cols-3 sm:gap-4 sm:px-4">
        <Panel label="Paint Protection" speed={0.6} />
        <Panel label="Nano Ceramic Finish" speed={1} />
        <Panel label="Interior Craft" speed={0.6} />
      </div>
    </section>
  );
}
