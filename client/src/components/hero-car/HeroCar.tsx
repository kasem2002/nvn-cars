import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Car } from "./Car";

/**
 * Reads window scroll and maps the hero section's visible progress
 * (0 at the top, 1 as the section leaves the viewport) into a ref.
 */
function useHeroScrollProgress() {
  const progressRef = useRef(0);
  useEffect(() => {
    function read() {
      const hero = document.getElementById("home");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const total = rect.height + window.innerHeight * 0.4;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      progressRef.current = scrolled / total;
    }
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);
  return progressRef;
}

function CarRig({ progressRef, reducedMotion }: { progressRef: React.RefObject<number>; reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  // Lerp target for smooth follow of the scroll value
  const smoothed = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const raw = progressRef.current ?? 0;
    // Smoothly chase the raw scroll value so motion never feels jittery.
    smoothed.current += (raw - smoothed.current) * Math.min(1, delta * 4);

    if (reducedMotion) {
      groupRef.current.rotation.y = -0.75;
      groupRef.current.position.y = 0;
      return;
    }

    // Base 3/4 rear-angle view. As you scroll, the car rotates so
    // the front comes around toward the camera and tilts up slightly.
    const t = smoothed.current;
    groupRef.current.rotation.y = -0.75 + t * 3.4;
    groupRef.current.rotation.x = t * 0.12;
    groupRef.current.position.y = -0.3 + t * 0.4;
    groupRef.current.position.x = 0.3 - t * 1.6;
  });

  return (
    <group ref={groupRef} position={[0.3, -0.3, 0]}>
      <Car />
    </group>
  );
}

function Scene({ progressRef, reducedMotion }: { progressRef: React.RefObject<number>; reducedMotion: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.2, 7]} fov={35} />

      <ambientLight intensity={0.35} />
      {/* Cold rim from behind-left */}
      <directionalLight position={[-6, 4, -3]} intensity={1.1} color="#6a7a8a" />
      {/* Warm key from front-right */}
      <directionalLight position={[6, 5, 4]} intensity={1.4} color="#fff2d6" />
      {/* Brand accent from below-right (subtle red rim) */}
      <pointLight position={[3, -2, 2]} intensity={2} color="#E10600" distance={8} />

      <Environment preset="night" />

      <CarRig progressRef={progressRef} reducedMotion={reducedMotion} />
    </>
  );
}

/**
 * Full-width 3D car layer for the hero section.
 * - Renders behind the hero text, above the background.
 * - Rotates and drifts as the visitor scrolls through the hero.
 * - Skipped entirely on small screens and when prefers-reduced-motion is set,
 *   so the hero stays fast and calm where it needs to be.
 */
export default function HeroCar() {
  const progressRef = useHeroScrollProgress();
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Skip WebGL on very small viewports (mobile) — the CSS gradient hero
    // is already effective there, and 3D is expensive on those devices.
    if (window.innerWidth < 900) return;
    setReady(true);
  }, []);

  // R3F's internal use-measure occasionally reports the container as 0x0
  // during the initial Suspense reveal, which leaves the WebGL drawing
  // buffer stuck at 300x150. Nudging a resize event once the tree is
  // fully mounted forces a re-measure with the real container size.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
    return () => clearTimeout(t);
  }, [ready]);

  if (!ready) return null;

  return (
    <div className="r3f-canvas-fill pointer-events-none absolute inset-0 z-[1]" style={{ width: "100%", height: "100%" }}>
      <Canvas
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.2, 7], fov: 35 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        resize={{ scroll: true, debounce: 0 }}
      >
        <Scene progressRef={progressRef} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
