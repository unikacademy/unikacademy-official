"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Torus } from "@react-three/drei";
import * as THREE from "three";
import HeroParticles from "./HeroParticles";

// ─── Floating Glass Sphere ───────────────────────────────────────────────────

interface SphereProps {
  position: [number, number, number];
  radius: number;
  speedX: number;
  speedY: number;
  isMobile: boolean;
}

function GlassSphere({
  position,
  radius,
  speedX,
  speedY,
  isMobile,
}: SphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const basePos = useRef(new THREE.Vector3(...position));

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    // Gentle floating motion
    meshRef.current.position.y =
      basePos.current.y + Math.sin(t * speedY) * 0.25;
    meshRef.current.position.x =
      basePos.current.x + Math.cos(t * speedX) * 0.15;
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x += 0.002;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      {isMobile ? (
        // Cheaper material on mobile
        <meshStandardMaterial
          color="#c0a84f"
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.25}
        />
      ) : (
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.5}
          chromaticAberration={0.02}
          anisotropy={0.1}
          distortion={0.08}
          distortionScale={0.2}
          temporalDistortion={0.1}
          color="#c0a84f"
          transmission={0.9}
          roughness={0}
          metalness={0.1}
        />
      )}
    </mesh>
  );
}

// ─── Torus Ring ──────────────────────────────────────────────────────────────

function TorusRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.06;
      ref.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <mesh ref={ref} rotation={[1.1, 0.3, 0]}>
      <Torus args={[3.5, 0.015, 16, 100]} />
      <meshBasicMaterial color="#c0a84f" transparent opacity={0.12} wireframe />
    </mesh>
  );
}

// ─── Mouse-responsive Group ──────────────────────────────────────────────────

function SceneContent({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Lerp group rotation toward mouse — smooth parallax
    groupRef.current.rotation.y +=
      (mouse.current.x * 0.18 - groupRef.current.rotation.y) * 4 * delta;
    groupRef.current.rotation.x +=
      (-mouse.current.y * 0.12 - groupRef.current.rotation.x) * 4 * delta;
  });

  const particleCount = isMobile ? 80 : 200;

  return (
    <group ref={groupRef}>
      <HeroParticles count={particleCount} />
      <TorusRing />
      <GlassSphere
        position={[-2.5, 0.8, -3]}
        radius={0.7}
        speedX={0.4}
        speedY={0.6}
        isMobile={isMobile}
      />
      <GlassSphere
        position={[2.8, -0.6, -4]}
        radius={0.5}
        speedX={0.3}
        speedY={0.5}
        isMobile={isMobile}
      />
      <GlassSphere
        position={[0.5, 1.5, -5]}
        radius={0.35}
        speedX={0.5}
        speedY={0.35}
        isMobile={isMobile}
      />
    </group>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function HeroScene() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Canvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      camera={{ position: [0, 0, 6], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 4]} color="#c0a84f" intensity={1.2} />
      <pointLight position={[-5, -3, 2]} color="#133a67" intensity={0.6} />
      <SceneContent isMobile={isMobile} />
    </Canvas>
  );
}
