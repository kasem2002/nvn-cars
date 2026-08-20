import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SportCar } from "./SportCar";

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
  const smoothed = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const raw = progressRef.current ?? 0;
    smoothed.current += (raw - smoothed.current) * Math.min(1, delta * 4);
    const t = smoothed.current;

    if (reducedMotion) {
      groupRef.current.rotation.y = -0.6;
      groupRef.current.position.set(0.4, 0, 0);
      return;
    }

    // Slow idle rotation + subtle bob when the user isn't scrolling.
    const idle = clock.getElapsedTime() * 0.08;

    groupRef.current.rotation.y = -0.6 + t * 3.2 + idle;
    groupRef.current.rotation.x = t * 0.08;
    groupRef.current.position.x = 0.4 - t * 1.8;
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.9) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <SportCar />
    </group>
  );
}

function Scene({ progressRef, reducedMotion }: { progressRef: React.RefObject<number>; reducedMotion: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.4, 8]} fov={32} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[-6, 6, -3]} intensity={1.1} color="#6a7a8a" />
      <directionalLight position={[6, 5, 4]} intensity={1.5} color="#fff2d6" castShadow />
      <pointLight position={[3, -1, 2]} intensity={2.2} color="#E10600" distance={9} />

      <Environment preset="night" />

      <ContactShadows position={[0, -0.5, 0]} opacity={0.55} scale={12} blur={2.4} far={4} />

      <CarRig progressRef={progressRef} reducedMotion={reducedMotion} />
    </>
  );
}

export default function HeroCar() {
  const progressRef = useHeroScrollProgress();
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 900) return;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Nudge R3F's ResizeObserver so the WebGL buffer picks up the
    // real container size (which is 0x0 during the Suspense reveal).
    const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
    return () => clearTimeout(t);
  }, [ready]);

  if (!ready) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" style={{ width: "100%", height: "100%" }}>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%", display: "block" }}
        resize={{ scroll: true, debounce: 0 }}
      >
        <Suspense fallback={null}>
          <Scene progressRef={progressRef} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
