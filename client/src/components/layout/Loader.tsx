import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { siteEntered } from "@/store/uiSlice";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Loader() {
  const dispatch = useAppDispatch();
  const reducedMotion = usePrefersReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const delay = reducedMotion ? 200 : 1500;
    const timer = window.setTimeout(() => {
      setDone(true);
      window.setTimeout(() => dispatch(siteEntered()), 500);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [dispatch, reducedMotion]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-nvn-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: done ? "none" : "auto" }}
    >
      <motion.span
        className="font-display text-6xl tracking-[0.1em] text-nvn-white md:text-7xl"
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        NV<span className="text-nvn-red">N</span>
      </motion.span>
      <motion.div
        className="absolute bottom-16 h-px w-40 origin-left bg-nvn-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: done ? 1 : 0.85 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div className="h-full w-full origin-left bg-nvn-red" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.3 }} />
      </motion.div>
    </motion.div>
  );
}
