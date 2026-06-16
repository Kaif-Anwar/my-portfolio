"use client";

import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Stars } from "@react-three/drei";
import type { PerspectiveCamera } from "three";
import { HeroObjects } from "./HeroObjects";

function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const progressRef = useRef(scrollProgress);
  progressRef.current = scrollProgress;

  useFrame((state) => {
    const cam = state.camera as PerspectiveCamera;
    const progress = progressRef.current;
    cam.position.set(0, progress * 1.5, 6 - progress * 2);
    cam.lookAt(0, progress * 0.5, 0);
  });

  return null;
}

function SceneContent({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <color attach="background" args={["#0a0a0f"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#67e8f9" />
      <pointLight position={[-4, 2, 2]} intensity={0.8} color="#22d3ee" />
      <Stars radius={80} depth={40} count={3000} factor={3} fade speed={0.5} />
      <HeroObjects scrollProgress={scrollProgress} />
      <CameraRig scrollProgress={scrollProgress} />
      <Environment preset="city" />
    </>
  );
}

export function ScrollScene() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (reducedMotion) {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,#0f172a,transparent_55%),#0a0a0f]" />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <SceneContent scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
