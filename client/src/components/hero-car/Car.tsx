import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Stylized modern GT car — clean minimal silhouette rendered with
 * proper automotive clearcoat paint. Owns being an artistic
 * representation instead of trying (and failing) to be photoreal.
 * No brand marks or model-specific shapes are replicated.
 */

function CarPaint(props: JSX.IntrinsicElements["meshPhysicalMaterial"]) {
  return (
    <meshPhysicalMaterial
      color="#ecedec"
      metalness={0.35}
      roughness={0.35}
      clearcoat={1}
      clearcoatRoughness={0.06}
      envMapIntensity={1.6}
      {...props}
    />
  );
}

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      {/* tyre */}
      <mesh>
        <cylinderGeometry args={[0.44, 0.44, 0.32, 44]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.05} roughness={0.9} />
      </mesh>
      {/* rim well */}
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.03, 36]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      {/* rim face */}
      <mesh position={[0, 0.185, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.02, 36]} />
        <meshStandardMaterial color="#8a6b2f" metalness={0.95} roughness={0.22} />
      </mesh>
      {/* spokes */}
      {Array.from({ length: 5 }).map((_, j) => {
        const angle = (j / 5) * Math.PI * 2;
        return (
          <group key={j} rotation={[0, -angle, 0]}>
            <mesh position={[0.13, 0.19, 0]}>
              <boxGeometry args={[0.3, 0.015, 0.06]} />
              <meshStandardMaterial color="#a68542" metalness={0.9} roughness={0.25} />
            </mesh>
          </group>
        );
      })}
      {/* hub */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 20]} />
        <meshStandardMaterial color="#5a4520" metalness={0.85} roughness={0.35} />
      </mesh>
      {/* brake caliper */}
      <mesh position={[0, 0.12, 0]} rotation={[0, Math.PI * 0.3, 0]}>
        <boxGeometry args={[0.24, 0.09, 0.11]} />
        <meshStandardMaterial color="#d9a900" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function Car() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.9) * 0.02;
  });

  // Top-down car silhouette extruded downward — gives a body that
  // narrows at the nose and tail like a real car (not a rectangle).
  const bodyShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.15, -0.7);
    s.bezierCurveTo(-2.35, -0.35, -2.35, 0.35, -2.15, 0.7);
    s.lineTo(-1.4, 0.9);
    s.bezierCurveTo(-0.5, 1.0, 0.5, 1.0, 1.4, 0.9);
    s.lineTo(2.0, 0.65);
    s.bezierCurveTo(2.25, 0.4, 2.25, -0.4, 2.0, -0.65);
    s.lineTo(1.4, -0.9);
    s.bezierCurveTo(0.5, -1.0, -0.5, -1.0, -1.4, -0.9);
    s.closePath();
    return s;
  }, []);

  const lowerBody = useMemo(
    () =>
      new THREE.ExtrudeGeometry(bodyShape, {
        depth: 0.65,
        bevelEnabled: true,
        bevelSize: 0.14,
        bevelThickness: 0.14,
        bevelSegments: 8,
        curveSegments: 32,
      }),
    [bodyShape]
  );

  // Greenhouse (roof) silhouette — narrower, further back
  const roofShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.3, -0.55);
    s.bezierCurveTo(-1.45, -0.25, -1.45, 0.25, -1.3, 0.55);
    s.lineTo(-0.6, 0.7);
    s.bezierCurveTo(0.1, 0.75, 0.7, 0.6, 0.85, 0.5);
    s.bezierCurveTo(1.0, 0.35, 1.0, -0.35, 0.85, -0.5);
    s.bezierCurveTo(0.7, -0.6, 0.1, -0.75, -0.6, -0.7);
    s.closePath();
    return s;
  }, []);

  const roofGeom = useMemo(
    () =>
      new THREE.ExtrudeGeometry(roofShape, {
        depth: 0.55,
        bevelEnabled: true,
        bevelSize: 0.12,
        bevelThickness: 0.14,
        bevelSegments: 10,
        curveSegments: 32,
      }),
    [roofShape]
  );

  return (
    <group ref={groupRef}>
      {/* Ground shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
        <circleGeometry args={[3.0, 64]} />
        <meshBasicMaterial color="#000" transparent opacity={0.5} />
      </mesh>

      {/* Main body (extruded top-down silhouette, laid flat) */}
      <mesh
        geometry={lowerBody}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.45, 0]}
        castShadow
      >
        <CarPaint />
      </mesh>

      {/* Roof / greenhouse */}
      <mesh
        geometry={roofGeom}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-0.15, 0.28, 0]}
        castShadow
      >
        <CarPaint />
      </mesh>

      {/* Windshield / greenhouse glass — a smoothed dark dome sitting on the roof */}
      <mesh position={[-0.05, 0.75, 0]} scale={[1.3, 0.45, 0.85]}>
        <sphereGeometry args={[1, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#080a12"
          metalness={0.2}
          roughness={0.05}
          transmission={0.55}
          transparent
          opacity={0.85}
          thickness={0.2}
          ior={1.45}
          envMapIntensity={2}
        />
      </mesh>

      {/* Rocker panels (dark carbon strip along the sides) */}
      {[-0.95, 0.95].map((z) => (
        <RoundedBox key={z} args={[3.6, 0.16, 0.08]} radius={0.04} position={[0, -0.36, z]}>
          <meshStandardMaterial color="#0d0d0d" metalness={0.4} roughness={0.55} />
        </RoundedBox>
      ))}

      {/* Front splitter */}
      <RoundedBox args={[0.32, 0.06, 1.9]} radius={0.02} position={[2.05, -0.44, 0]}>
        <meshStandardMaterial color="#080808" metalness={0.35} roughness={0.55} />
      </RoundedBox>

      {/* Rear diffuser */}
      <RoundedBox args={[0.32, 0.06, 1.9]} radius={0.02} position={[-2.1, -0.44, 0]}>
        <meshStandardMaterial color="#080808" metalness={0.35} roughness={0.55} />
      </RoundedBox>

      {/* Headlights — recessed into the front fenders */}
      {[-0.72, 0.72].map((z) => (
        <group key={z} position={[2.12, 0.05, z]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.08, 24]} />
            <meshStandardMaterial
              color="#f5efdc"
              emissive="#fff5d6"
              emissiveIntensity={2.4}
              metalness={0.2}
              roughness={0.1}
            />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.04, 0, 0]}>
            <torusGeometry args={[0.16, 0.03, 12, 24]} />
            <meshStandardMaterial color="#141414" metalness={0.6} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* Front intakes (twin black voids either side of splitter) */}
      {[-0.55, 0.55].map((z) => (
        <RoundedBox key={z} args={[0.08, 0.14, 0.5]} radius={0.03} position={[2.15, -0.25, z]}>
          <meshStandardMaterial color="#020202" metalness={0.1} roughness={0.9} />
        </RoundedBox>
      ))}

      {/* Side vents on rear haunches — brand-red accent */}
      {[-1.0, 1.0].map((z) => (
        <RoundedBox key={z} args={[0.55, 0.14, 0.03]} radius={0.02} position={[-1.15, 0.05, z]}>
          <meshStandardMaterial color="#E10600" metalness={0.4} roughness={0.35} emissive="#3a0100" emissiveIntensity={0.4} />
        </RoundedBox>
      ))}

      {/* Tail-light bar */}
      <RoundedBox args={[0.03, 0.13, 1.55]} radius={0.02} position={[-2.18, 0.28, 0]}>
        <meshStandardMaterial color="#8a0400" emissive="#E10600" emissiveIntensity={2.2} />
      </RoundedBox>

      {/* Rear wing */}
      <group position={[-1.65, 1.0, 0]}>
        <RoundedBox args={[0.6, 0.06, 1.75]} radius={0.03}>
          <meshStandardMaterial color="#141416" metalness={0.75} roughness={0.3} />
        </RoundedBox>
        {[-0.87, 0.87].map((z) => (
          <RoundedBox key={z} args={[0.55, 0.32, 0.03]} radius={0.02} position={[0, -0.08, z]}>
            <meshStandardMaterial color="#141416" metalness={0.75} roughness={0.3} />
          </RoundedBox>
        ))}
        {[-0.48, 0.48].map((z) => (
          <RoundedBox key={z} args={[0.12, 0.36, 0.06]} radius={0.02} position={[0.05, -0.22, z]}>
            <meshStandardMaterial color="#141416" metalness={0.75} roughness={0.3} />
          </RoundedBox>
        ))}
      </group>

      {/* Wheels */}
      <Wheel position={[1.4, -0.42, 0.96]} />
      <Wheel position={[1.4, -0.42, -0.96]} />
      <Wheel position={[-1.4, -0.42, 0.96]} />
      <Wheel position={[-1.4, -0.42, -0.96]} />
    </group>
  );
}
