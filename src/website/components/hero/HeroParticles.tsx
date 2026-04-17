"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  count?: number;
}

// Generate outside component so it's stable and lint-clean
function buildPositions(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 14;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
  }
  return arr;
}

// Pre-built outside render — stable reference, no re-randomization on re-render
const POSITIONS_200 = buildPositions(200);
const POSITIONS_80 = buildPositions(80);

export default function HeroParticles({ count = 200 }: Props) {
  const meshRef = useRef<THREE.Points>(null);
  const positions = count <= 80 ? POSITIONS_80 : POSITIONS_200;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.04;
      meshRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#c0a84f"
        size={0.025}
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
}
