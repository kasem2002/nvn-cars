import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/**
 * Stylized fastback sports-car silhouette (no brand marks).
 * Built from primitives so it ships without external 3D assets.
 * The body proportions evoke a Porsche 911 fastback rather than
 * replicating the real car — this is intentional (trademark).
 */
export function Car({ headlightOn = true }: { headlightOn?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  // Subtle idle float so the car never feels frozen even when
  // the user isn't scrolling.
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.9) * 0.02;
  });

  return (
    <group ref={groupRef}>
      {/* Ground shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
        <circleGeometry args={[2.6, 64]} />
        <meshBasicMaterial color="#000" transparent opacity={0.45} />
      </mesh>

      {/* Lower body (chassis + side skirts) */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <boxGeometry args={[4.3, 0.35, 1.8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Main body — long low fastback shell */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[4.1, 0.55, 1.72]} />
        <meshStandardMaterial color="#141416" metalness={0.85} roughness={0.22} envMapIntensity={1.4} />
      </mesh>

      {/* Rear haunches (subtle wideness above rear wheels) */}
      <mesh position={[-1.2, 0.15, 0]} castShadow>
        <boxGeometry args={[1.4, 0.55, 1.82]} />
        <meshStandardMaterial color="#141416" metalness={0.85} roughness={0.22} envMapIntensity={1.4} />
      </mesh>

      {/* Front hood — slightly lower + shorter */}
      <mesh position={[1.55, 0.08, 0]} castShadow>
        <boxGeometry args={[1.15, 0.4, 1.68]} />
        <meshStandardMaterial color="#141416" metalness={0.85} roughness={0.22} envMapIntensity={1.4} />
      </mesh>

      {/* Cabin / greenhouse — tapered fastback silhouette */}
      <mesh position={[-0.15, 0.62, 0]} castShadow>
        <boxGeometry args={[2.4, 0.55, 1.5]} />
        <meshStandardMaterial color="#141416" metalness={0.85} roughness={0.22} envMapIntensity={1.4} />
      </mesh>

      {/* Roof — narrower, higher, tapers toward the rear */}
      <mesh position={[-0.3, 0.92, 0]}>
        <boxGeometry args={[1.85, 0.05, 1.32]} />
        <meshStandardMaterial color="#0d0d0e" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0.55, 0.62, 0]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.05, 0.75, 1.36]} />
        <meshPhysicalMaterial
          color="#101118"
          metalness={0.1}
          roughness={0.05}
          transmission={0.75}
          transparent
          opacity={0.6}
          thickness={0.1}
        />
      </mesh>

      {/* Rear window (fastback slope) */}
      <mesh position={[-1.05, 0.62, 0]} rotation={[0, 0, 0.7]}>
        <boxGeometry args={[0.05, 1.0, 1.36]} />
        <meshPhysicalMaterial
          color="#101118"
          metalness={0.1}
          roughness={0.05}
          transmission={0.75}
          transparent
          opacity={0.6}
          thickness={0.1}
        />
      </mesh>

      {/* Side windows */}
      {[-0.8, 0.8].map((z) => (
        <mesh key={z} position={[-0.2, 0.7, z]}>
          <boxGeometry args={[1.7, 0.4, 0.02]} />
          <meshPhysicalMaterial
            color="#0a0a10"
            metalness={0.1}
            roughness={0.05}
            transmission={0.6}
            transparent
            opacity={0.75}
            thickness={0.1}
          />
        </mesh>
      ))}

      {/* Headlights */}
      {[-0.6, 0.6].map((z) => (
        <group key={z} position={[2.05, 0.15, z]}>
          <mesh>
            <sphereGeometry args={[0.14, 24, 24]} />
            <meshStandardMaterial
              color="#f6f2e6"
              emissive={headlightOn ? "#fff8d8" : "#111"}
              emissiveIntensity={headlightOn ? 1.7 : 0}
              metalness={0.2}
              roughness={0.15}
            />
          </mesh>
        </group>
      ))}

      {/* Tail lights (brand red) */}
      <mesh position={[-2.06, 0.2, 0]}>
        <boxGeometry args={[0.04, 0.15, 1.4]} />
        <meshStandardMaterial color="#8a0400" emissive="#E10600" emissiveIntensity={1.9} />
      </mesh>

      {/* Wheels + rims — four positions */}
      {[
        [1.3, -0.35, 0.9],
        [1.3, -0.35, -0.9],
        [-1.3, -0.35, 0.9],
        [-1.3, -0.35, -0.9],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
          {/* tyre */}
          <mesh>
            <cylinderGeometry args={[0.36, 0.36, 0.28, 32]} />
            <meshStandardMaterial color="#0b0b0b" metalness={0.1} roughness={0.9} />
          </mesh>
          {/* rim */}
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.02, 24]} />
            <meshStandardMaterial color="#3a3a3a" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* rim center brand accent */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 20]} />
            <meshStandardMaterial color="#E10600" metalness={0.4} roughness={0.3} emissive="#4a0100" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
