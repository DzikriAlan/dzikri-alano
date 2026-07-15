"use client";

// 1. Import External Library
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Shared elegant gray theme so every section reads as one continuous system.
export const PARTICLE_THEME = {
  color: "#8F8F8F",
  secondaryColor: "#5E5E5E",
  cubeColor: "#8F8F8F",
} as const;

/** Normalized click position (-1 to 1 on both axes) within a section, plus an id so repeat clicks at the same spot still retrigger the cube. */
export interface ClickTarget {
  readonly xNorm: number;
  readonly yNorm: number;
  readonly id: number;
}

// 7. Props
interface ParticleFieldProps {
  readonly color?: string;
  readonly secondaryColor?: string;
  /** Particle count at desktop viewport width; scales down on smaller screens. */
  readonly density?: number;
  readonly speed?: number;
  readonly interactive?: boolean;
  /** Point size in world units. Defaults to a small, elegant dot. */
  readonly particleSize?: number;
  /** Pauses the render loop (without destroying the WebGL context) when false. */
  readonly active?: boolean;
  /** Renders a scroll-driven wireframe cube alongside the particles. */
  readonly withCube?: boolean;
  readonly cubeColor?: string;
  /** Where the user last clicked inside this section; pulls the cube toward that spot. */
  readonly clickTarget?: ClickTarget | null;
  /** Varies the cube's idle sweep pattern/speed so neighboring sections don't move in lockstep. */
  readonly cubeSeed?: number;
}

interface FieldProps {
  readonly color: string;
  readonly secondaryColor: string;
  readonly count: number;
  readonly speed: number;
  readonly interactive: boolean;
  readonly particleSize: number;
}

interface ScrollCubeProps {
  readonly color: string;
  readonly clickTarget: ClickTarget | null | undefined;
  readonly seed: number;
}

const CLICK_ATTRACTION_HOLD_SECONDS = 1.6;

function ScrollCube({ color, clickTarget, seed }: ScrollCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const prevScrollY = useRef(0);
  const clickState = useRef<{ x: number; y: number; startedAt: number } | null>(null);
  const lastClickId = useRef<number | null>(null);

  const scale = viewport.height * 0.14;
  // Sweep amplitude spans nearly the full section, edge to edge.
  const sweepX = viewport.width * 0.42;
  const sweepY = viewport.height * 0.3;

  // Each section gets its own frequency, phase and spin rate so cubes never move in lockstep.
  const freqX = 0.28 + seed * 0.09;
  const freqY = 0.21 + seed * 0.07;
  const phaseX = seed * 2.4;
  const phaseY = seed * 1.7;
  const spinRate = 1 + seed * 0.35;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const scrollY = window.scrollY;
    const scrollDelta = scrollY - prevScrollY.current;
    prevScrollY.current = scrollY;

    // Fast idle spin so the cube always feels alive, plus an extra kick from scroll velocity.
    meshRef.current.rotation.x += delta * 1.4 * spinRate + scrollDelta * 0.01;
    meshRef.current.rotation.y += delta * 1.1 * spinRate + scrollDelta * 0.008;
    meshRef.current.rotation.z += delta * 0.7 * spinRate;

    if (clickTarget && clickTarget.id !== lastClickId.current) {
      lastClickId.current = clickTarget.id;
      clickState.current = {
        x: clickTarget.xNorm * viewport.width * 0.5,
        y: clickTarget.yNorm * viewport.height * 0.5,
        startedAt: elapsed,
      };
    }

    const idleX = Math.sin(elapsed * freqX + scrollY * 0.0015 + phaseX) * sweepX;
    const idleY = Math.cos(elapsed * freqY + scrollY * 0.001 + phaseY) * sweepY;

    let desiredX = idleX;
    let desiredY = idleY;

    if (clickState.current) {
      const age = elapsed - clickState.current.startedAt;
      const influence = Math.max(0, 1 - age / CLICK_ATTRACTION_HOLD_SECONDS);
      desiredX = idleX + (clickState.current.x - idleX) * influence;
      desiredY = idleY + (clickState.current.y - idleY) * influence;
      if (influence <= 0) clickState.current = null;
    }

    // Snappy easing toward the desired spot keeps the motion lively rather than sluggish.
    meshRef.current.position.x += (desiredX - meshRef.current.position.x) * 0.09;
    meshRef.current.position.y += (desiredY - meshRef.current.position.y) * 0.09;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.32} />
    </mesh>
  );
}

function useViewportTier() {
  const [tier, setTier] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setTier("mobile");
      else if (width < 1024) setTier("tablet");
      else setTier("desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return tier;
}

function Field({ color, secondaryColor, count, speed, interactive, particleSize }: FieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport, pointer } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  const { positions, colors } = useMemo(() => {
    const nextPositions = new Float32Array(count * 3);
    const nextColors = new Float32Array(count * 3);

    const colorA = new THREE.Color(color);
    const colorB = new THREE.Color(secondaryColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      nextPositions[i3] = (Math.random() - 0.5) * 12;
      nextPositions[i3 + 1] = (Math.random() - 0.5) * 8;
      nextPositions[i3 + 2] = (Math.random() - 0.5) * 6;

      const mixed = colorA.clone().lerp(colorB, Math.random());
      nextColors[i3] = mixed.r;
      nextColors[i3 + 1] = mixed.g;
      nextColors[i3 + 2] = mixed.b;
    }

    return { positions: nextPositions, colors: nextColors };
  }, [count, color, secondaryColor]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const elapsed = state.clock.elapsedTime;
    pointsRef.current.rotation.y += delta * 0.03 * speed;
    pointsRef.current.rotation.x = Math.sin(elapsed * 0.05) * 0.1;

    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const array = positionsAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      array[i3 + 1] += Math.sin(elapsed * speed + i) * 0.0008;
      array[i3] += Math.cos(elapsed * speed * 0.6 + i) * 0.0005;
    }
    positionsAttr.needsUpdate = true;

    if (interactive) {
      targetRotation.current.x = pointer.y * 0.15;
      targetRotation.current.y = pointer.x * 0.2;
      pointsRef.current.rotation.x +=
        (targetRotation.current.x - pointsRef.current.rotation.x) * 0.02;
      pointsRef.current.rotation.y +=
        (targetRotation.current.y - pointsRef.current.rotation.y) * 0.02;
    }
  });

  return (
    <points ref={pointsRef} scale={[viewport.height / 8, viewport.height / 8, 1]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleField({
  color = PARTICLE_THEME.color,
  secondaryColor = PARTICLE_THEME.secondaryColor,
  density = 1400,
  speed = 1,
  interactive = true,
  particleSize = 0.028,
  active = true,
  withCube = false,
  cubeColor = PARTICLE_THEME.cubeColor,
  clickTarget = null,
  cubeSeed = 0,
}: ParticleFieldProps) {
  // 8. State
  const tier = useViewportTier();
  const [reducedMotion, setReducedMotion] = useState(false);

  // 9. Effects
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const listener = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  // 10. Computed / Derived
  const count = useMemo(() => {
    if (tier === "mobile") return Math.round(density * 0.28);
    if (tier === "tablet") return Math.round(density * 0.55);
    return density;
  }, [tier, density]);

  if (reducedMotion) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={tier === "mobile" ? [1, 1.5] : [1, 2]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      frameloop={active ? "always" : "never"}
    >
      <Field
        color={color}
        secondaryColor={secondaryColor}
        count={count}
        speed={speed}
        interactive={interactive && tier !== "mobile"}
        particleSize={particleSize}
      />
      {withCube && <ScrollCube color={cubeColor} clickTarget={clickTarget} seed={cubeSeed} />}
    </Canvas>
  );
}
