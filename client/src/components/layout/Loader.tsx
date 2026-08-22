import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { siteEntered } from "@/store/uiSlice";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SESSION_KEY = "nvn-loader-seen";

export function Loader() {
  const dispatch = useAppDispatch();
  const reducedMotion = usePrefersReducedMotion();
  // Skip the intro loader for returning visitors within the same
  // browser session — the reveal is beautiful, but seeing it every
  // page-load in the same tab is friction, not craft.
  const alreadySeen = typeof window !== "undefined" && window.sessionStorage.getItem(SESSION_KEY) === "1";
  const [done, setDone] = useState(alreadySeen);

  useEffect(() => {
    if (alreadySeen) {
      dispatch(siteEntered());
      return;
    }
    const delay = reducedMotion ? 150 : 450;
    const timer = window.setTimeout(() => {
      setDone(true);
      window.sessionStorage.setItem(SESSION_KEY, "1");
      window.setTimeout(() => dispatch(siteEntered()), 350);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [dispatch, reducedMotion, alreadySeen]);

  if (alreadySeen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-nvn-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: done ? "none" : "auto" }}
    >
      <motion.span
        className="font-display text-6xl tracking-[0.1em] text-nvn-white md:text-7xl"
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        NV<span className="text-nvn-red">N</span>
      </motion.span>
      <motion.div
        className="absolute bottom-16 h-px w-40 origin-left bg-nvn-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: done ? 1 : 0.85 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="h-full w-full origin-left bg-nvn-red"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </motion.div>
  );
}
