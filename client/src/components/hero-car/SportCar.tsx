import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { OBJLoader } from "three-stdlib";

const MODEL_URL = "/models/sport-car.obj";

/**
 * Loads the OBJ sport car and applies materials. The source model
 * ships without a companion MTL, so we assign materials ourselves
 * by matching object names (body / wheel / tire / glass / light).
 * Everything else gets a neutral metallic paint fallback.
 *
 * NOTE: this model file is a ripped GTA V asset kept in
 * client/public/models/ for local prototyping only — it is
 * gitignored and must not ship on a public deployment.
 */
export function SportCar() {
  const obj = useLoader(OBJLoader, MODEL_URL);

  const prepared = useMemo(() => {
    const cloned = obj.clone(true);

    const bodyPaint = new THREE.MeshPhysicalMaterial({
      color: "#ecedec",
      metalness: 0.4,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.6,
    });

    const carbon = new THREE.MeshStandardMaterial({
      color: "#111114",
      metalness: 0.55,
      roughness: 0.5,
    });

    const rubber = new THREE.MeshStandardMaterial({
      color: "#0a0a0a",
      metalness: 0.05,
      roughness: 0.9,
    });

    const rim = new THREE.MeshStandardMaterial({
      color: "#8a6b2f",
      metalness: 0.95,
      roughness: 0.28,
    });

    const glass = new THREE.MeshPhysicalMaterial({
      color: "#0a0f1a",
      metalness: 0.15,
      roughness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.75,
      thickness: 0.2,
      ior: 1.45,
      envMapIntensity: 2,
    });

    const headlight = new THREE.MeshStandardMaterial({
      color: "#f4efdc",
      emissive: "#fff5d6",
      emissiveIntensity: 1.6,
      metalness: 0.2,
      roughness: 0.15,
    });

    const taillight = new THREE.MeshStandardMaterial({
      color: "#8a0400",
      emissive: "#E10600",
      emissiveIntensity: 1.9,
    });

    const chrome = new THREE.MeshStandardMaterial({
      color: "#8a8a8a",
      metalness: 1,
      roughness: 0.15,
    });

    cloned.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const name = (child.name || "").toLowerCase();

      if (/tire|tyre|rubber/.test(name)) {
        child.material = rubber;
      } else if (/rim|wheel|hub|spoke|disc|brake/.test(name)) {
        child.material = /brake|caliper|pad/.test(name) ? chrome : rim;
      } else if (/glass|window|windshield|windscreen/.test(name)) {
        child.material = glass;
      } else if (/tail|rear.*light|stop.*light|brakelight/.test(name)) {
        child.material = taillight;
      } else if (/light|lamp|head/.test(name)) {
        child.material = headlight;
      } else if (/black|carbon|plastic|bumper|grill|vent|splitter|diffuser|wing|spoiler|mirror|door.*handle/.test(name)) {
        child.material = carbon;
      } else {
        child.material = bodyPaint;
      }
      child.castShadow = true;
      child.receiveShadow = true;
    });

    // Center the model at origin and scale it so the longest axis
    // is a known size, regardless of the source model's units.
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    cloned.position.sub(center);
    const longest = Math.max(size.x, size.y, size.z);
    if (longest > 0) {
      const targetLongest = 4.6;
      const s = targetLongest / longest;
      cloned.scale.multiplyScalar(s);
    }
    // Sit the car on the ground plane (y = -0.5) rather than centered.
    const scaledBox = new THREE.Box3().setFromObject(cloned);
    cloned.position.y -= scaledBox.min.y + 0.5;

    return cloned;
  }, [obj]);

  return <primitive object={prepared} />;
}
