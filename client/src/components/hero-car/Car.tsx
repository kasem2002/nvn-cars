import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Stylized modern track-focused GT — white paint, bronze wheels,
 * fastback silhouette with a big rear wing. Built entirely from
 * primitives so it ships without external 3D assets, and drawn from
 * generic GT design language (round headlights, front splitter, rear
 * wing) rather than any specific trademarked model or badge.
 */
export function Car({ headlightOn = true }: { headlightOn?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.9) * 0.02;
  });

  // Body cross-section (side profile) used to LatheGeometry-extrude
  // the main shell — gives us a curved fastback silhouette that's
  // impossible with boxes alone.
  const bodyShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.15, 0);
    s.lineTo(-2.05, 0.28);
    s.bezierCurveTo(-1.7, 0.9, -1.15, 1.12, -0.55, 1.14);
    s.bezierCurveTo(0.1, 1.14, 0.65, 1.04, 1.15, 0.72);
    s.lineTo(1.9, 0.5);
    s.bezierCurveTo(2.05, 0.35, 2.12, 0.2, 2.15, 0);
    s.lineTo(-2.15, 0);
    return s;
  }, []);

  const bodyGeom = useMemo(() => {
    const geom = new THREE.ExtrudeGeometry(bodyShape, {
      depth: 1.75,
      bevelEnabled: true,
      bevelSize: 0.18,
      bevelThickness: 0.18,
      bevelSegments: 6,
      curveSegments: 24,
    });
    geom.translate(0, 0, -0.875);
    geom.computeVertexNormals();
    return geom;
  }, [bodyShape]);

  // Front splitter shape — a thin flat plate under the nose.
  return (
    <group ref={groupRef}>
      {/* Ground shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
        <circleGeometry args={[2.9, 64]} />
        <meshBasicMaterial color="#000" transparent opacity={0.5} />
      </mesh>

      {/* Main curved body shell (white metallic) */}
      <mesh geometry={bodyGeom} position={[0, -0.4, 0]} castShadow>
        <meshStandardMaterial color="#ecedec" metalness={0.55} roughness={0.28} envMapIntensity={1.4} />
      </mesh>

      {/* Lower body / rocker panels (dark carbon-look) */}
      <mesh position={[0, -0.34, 0]}>
        <boxGeometry args={[3.9, 0.18, 1.86]} />
        <meshStandardMaterial color="#141416" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Front splitter (aggressive front lip) */}
      <mesh position={[1.95, -0.42, 0]}>
        <boxGeometry args={[0.32, 0.06, 1.9]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Rear diffuser */}
      <mesh position={[-2.0, -0.42, 0]}>
        <boxGeometry args={[0.32, 0.06, 1.9]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Windshield — angled forward */}
      <mesh position={[0.7, 0.55, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.05, 0.9, 1.5]} />
        <meshPhysicalMaterial
          color="#0a0f1a"
          metalness={0.1}
          roughness={0.06}
          transmission={0.7}
          transparent
          opacity={0.75}
          thickness={0.1}
          ior={1.4}
        />
      </mesh>

      {/* Fastback rear window — long shallow slope */}
      <mesh position={[-0.85, 0.5, 0]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[0.05, 1.3, 1.5]} />
        <meshPhysicalMaterial
          color="#0a0f1a"
          metalness={0.1}
          roughness={0.06}
          transmission={0.7}
          transparent
          opacity={0.75}
          thickness={0.1}
          ior={1.4}
        />
      </mesh>

      {/* Side glass */}
      {[-0.88, 0.88].map((z) => (
        <mesh key={z} position={[-0.05, 0.6, z]}>
          <boxGeometry args={[1.9, 0.35, 0.02]} />
          <meshPhysicalMaterial
            color="#080a12"
            metalness={0.1}
            roughness={0.05}
            transmission={0.55}
            transparent
            opacity={0.85}
            thickness={0.1}
          />
        </mesh>
      ))}

      {/* Roof line (subtle dark trim strip) */}
      <mesh position={[-0.15, 1.06, 0]}>
        <boxGeometry args={[1.7, 0.03, 1.4]} />
        <meshStandardMaterial color="#ecedec" metalness={0.55} roughness={0.28} />
      </mesh>

      {/* Hood centre stripe (subtle graphic accent, not a badge) */}
      <mesh position={[1.35, 0.7, 0]}>
        <boxGeometry args={[0.9, 0.005, 0.25]} />
        <meshStandardMaterial color="#141416" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Round headlight housings + inner lens */}
      {[-0.68, 0.68].map((z) => (
        <group key={z} position={[2.0, 0.28, z]}>
          {/* housing bezel */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.19, 0.045, 12, 24]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.75} roughness={0.25} />
          </mesh>
          {/* lens */}
          <mesh position={[0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.17, 24]} />
            <meshStandardMaterial
              color="#f4efe0"
              emissive={headlightOn ? "#fff5d6" : "#111"}
              emissiveIntensity={headlightOn ? 2.1 : 0}
              metalness={0.2}
              roughness={0.15}
            />
          </mesh>
        </group>
      ))}

      {/* Front air intakes (dark inlets flanking the splitter) */}
      {[-0.55, 0.55].map((z) => (
        <mesh key={z} position={[2.05, -0.2, z]}>
          <boxGeometry args={[0.06, 0.18, 0.4]} />
          <meshStandardMaterial color="#050505" metalness={0.2} roughness={0.85} />
        </mesh>
      ))}

      {/* Side intakes on the rear haunches (brand-red accent) */}
      {[-0.92, 0.92].map((z) => (
        <mesh key={z} position={[-1.1, 0.05, z]}>
          <boxGeometry args={[0.35, 0.12, 0.03]} />
          <meshStandardMaterial color="#E10600" metalness={0.3} roughness={0.4} emissive="#3a0100" emissiveIntensity={0.35} />
        </mesh>
      ))}

      {/* Rear tail-light bar (red strip across the back) */}
      <mesh position={[-2.13, 0.35, 0]}>
        <boxGeometry args={[0.03, 0.12, 1.5]} />
        <meshStandardMaterial color="#8a0400" emissive="#E10600" emissiveIntensity={2.1} />
      </mesh>

      {/* Rear wing — big track-style wing on twin stanchions */}
      <group position={[-1.55, 1.02, 0]}>
        {/* wing plane */}
        <mesh>
          <boxGeometry args={[0.55, 0.05, 1.7]} />
          <meshStandardMaterial color="#141416" metalness={0.75} roughness={0.3} />
        </mesh>
        {/* endplates */}
        {[-0.85, 0.85].map((z) => (
          <mesh key={z} position={[0, -0.05, z]}>
            <boxGeometry args={[0.5, 0.28, 0.03]} />
            <meshStandardMaterial color="#141416" metalness={0.75} roughness={0.3} />
          </mesh>
        ))}
        {/* stanchions */}
        {[-0.45, 0.45].map((z) => (
          <mesh key={z} position={[0.05, -0.22, z]}>
            <boxGeometry args={[0.12, 0.35, 0.05]} />
            <meshStandardMaterial color="#141416" metalness={0.75} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Wheels — bronze alloys with visible spokes */}
      {[
        [1.35, -0.42, 0.94],
        [1.35, -0.42, -0.94],
        [-1.35, -0.42, 0.94],
        [-1.35, -0.42, -0.94],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
          {/* tyre */}
          <mesh>
            <cylinderGeometry args={[0.42, 0.42, 0.3, 40]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.05} roughness={0.9} />
          </mesh>
          {/* inner tyre wall */}
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.03, 32]} />
            <meshStandardMaterial color="#050505" metalness={0.1} roughness={0.9} />
          </mesh>
          {/* rim disc */}
          <mesh position={[0, 0.17, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
            <meshStandardMaterial color="#8a6b2f" metalness={0.9} roughness={0.28} />
          </mesh>
          {/* spokes (thin bars radiating from center) */}
          {Array.from({ length: 7 }).map((_, j) => {
            const angle = (j / 7) * Math.PI * 2;
            return (
              <mesh
                key={j}
                position={[Math.cos(angle) * 0.14, 0.18, Math.sin(angle) * 0.14]}
                rotation={[0, -angle, 0]}
              >
                <boxGeometry args={[0.26, 0.015, 0.05]} />
                <meshStandardMaterial color="#a68542" metalness={0.9} roughness={0.28} />
              </mesh>
            );
          })}
          {/* central hub */}
          <mesh position={[0, 0.185, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.03, 20]} />
            <meshStandardMaterial color="#5a4520" metalness={0.85} roughness={0.35} />
          </mesh>
          {/* brake caliper (yellow — reads as high-perf) */}
          <mesh position={[0, 0.12, 0]} rotation={[0, Math.PI * 0.35, 0]}>
            <boxGeometry args={[0.2, 0.08, 0.1]} />
            <meshStandardMaterial color="#d9a900" metalness={0.6} roughness={0.4} emissive="#3a2b00" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
