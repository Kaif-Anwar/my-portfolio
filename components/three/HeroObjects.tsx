"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import type { Group } from "three";

export function HeroObjects({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<Group>(null);
  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  useFrame((state) => {
    if (!groupRef.current) return;
    const progress = progressRef.current;
    const t = state.clock.elapsedTime;

    // Fade and move 3D objects away as user scrolls past hero
    const fade = Math.max(0, 1 - progress * 3);
    groupRef.current.rotation.y = t * 0.15 + progress * Math.PI * 0.5;
    groupRef.current.position.y = -progress * 3;
    groupRef.current.position.x = -progress * 5;
    groupRef.current.visible = fade > 0.05;
  });

  const fade = Math.max(0, 1 - scrollProgress * 3);
  const orbOpacity = fade * 0.85;

  return (
    <group ref={groupRef}>
      {fade > 0.05 && (
        <>
          <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
            <Sphere args={[1.2, 64, 64]} position={[-2.5, 0.5, -1]}>
              <MeshDistortMaterial
                color="#22d3ee"
                attach="material"
                distort={0.35}
                speed={2}
                roughness={0.2}
                metalness={0.8}
                transparent
                opacity={orbOpacity}
              />
            </Sphere>
          </Float>

          <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
            <mesh position={[2.8, -0.3, -2]} rotation={[0.4, 0.6, 0]}>
              <torusKnotGeometry args={[0.7, 0.22, 128, 16]} />
              <meshStandardMaterial
                color="#67e8f9"
                metalness={0.7}
                roughness={0.25}
                transparent
                opacity={orbOpacity}
              />
            </mesh>
          </Float>

          <Float speed={1.8} rotationIntensity={0.3} floatIntensity={1}>
            <mesh position={[0.5, 1.8, -3]} rotation={[0.2, 0.8, 0.1]}>
              <icosahedronGeometry args={[0.9, 1]} />
              <meshStandardMaterial
                color="#0ea5e9"
                wireframe
                transparent
                opacity={orbOpacity * 0.85}
              />
            </mesh>
          </Float>

          {Array.from({ length: 40 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.sin(i * 1.7) * 6) % 5,
                (Math.cos(i * 2.1) * 4) % 3,
                -4 - (i % 5),
              ]}
            >
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial
                color="#22d3ee"
                transparent
                opacity={orbOpacity * 0.4}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}
