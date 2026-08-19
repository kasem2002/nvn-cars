import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefObject, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface Options<T extends HTMLElement> {
  y?: number;
  duration?: number;
  stagger?: number;
  selector?: string;
  targetRef?: RefObject<T>;
}

export function useScrollReveal<T extends HTMLElement>({
  y = 40,
  duration = 0.9,
  stagger = 0.08,
  selector = "[data-reveal]",
  targetRef,
}: Options<T> = {}) {
  const ownRef = useRef<T | null>(null);
  const ref = targetRef ?? ownRef;
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (reducedMotion) {
      gsap.set(root.querySelectorAll(selector), { opacity: 1, y: 0 });
      return;
    }

    const targets = root.querySelectorAll(selector);
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion, y, duration, stagger, selector]);

  return ref;
}
