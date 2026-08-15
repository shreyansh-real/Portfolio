import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Center, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Glass Lens (Refractive floating disc as in reference art) ──────────────────
function GlassDisc({
  position,
  rotation,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.1;
    meshRef.current.rotation.y = rotation[1] + Math.cos(t * 0.3) * 0.15;
  });

  return (
    <Float speed={1.5 * speed} rotationIntensity={0.6} floatIntensity={0.8} position={position}>
      <mesh ref={meshRef} rotation={rotation} scale={scale}>
        {/* Flat circular lens with smooth beveled edge */}
        <cylinderGeometry args={[1.4, 1.4, 0.08, 64]} />
        <meshPhysicalMaterial
          color="#dffff"
          emissive="#0e8fa8"
          emissiveIntensity={0.15}
          roughness={0.08}
          metalness={0.1}
          transmission={0.92}
          thickness={0.8}
          ior={1.48}
          transparent
          opacity={0.85}
          reflectivity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
}

// ── Iridescent Glowing Core Orb ───────────────────────────────────────────────
function IridescentOrb({
  position = [0, 0, 0],
  size = 1.1,
}: {
  position?: [number, number, number];
  size?: number;
}) {
  const orbRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (orbRef.current) {
      orbRef.current.rotation.y = t * 0.2;
      orbRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6} position={position}>
      <group>
        {/* Core sphere */}
        <mesh ref={orbRef}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshPhysicalMaterial
            color="#1473e6"
            emissive="#2fe6ff"
            emissiveIntensity={0.45}
            roughness={0.12}
            metalness={0.3}
            transmission={0.7}
            thickness={1.5}
            ior={1.6}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* Outer glass bubble */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[size * 1.35, 48, 48]} />
          <meshPhysicalMaterial
            color="#ffffff"
            emissive="#8ff3ff"
            emissiveIntensity={0.15}
            roughness={0.02}
            metalness={0.05}
            transmission={0.96}
            thickness={0.4}
            ior={1.33}
            transparent
            opacity={0.6}
            clearcoat={1}
          />
        </mesh>
      </group>
    </Float>
  );
}

// ── Secondary Floating Glass Beads ─────────────────────────────────────────────
function GlassOrb({
  position,
  scale = 0.5,
  color = '#8ff3ff',
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2} position={position}>
      <mesh scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive="#2fe6ff"
          emissiveIntensity={0.2}
          roughness={0.05}
          transmission={0.95}
          thickness={0.6}
          ior={1.4}
          transparent
          opacity={0.8}
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
}

// ── 3D Hero Title Typography ──────────────────────────────────────────────────
function Hero3DText({
  fragmentsRef,
}: {
  fragmentsRef: React.MutableRefObject<THREE.Group[]>;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    if (groupRef.current) {
      fragmentsRef.current[0] = groupRef.current;
    }
  }, [fragmentsRef]);

  return (
    <group ref={groupRef} position={[0, 0.4, 0]}>
      <Center>
        <Text
          fontSize={1.15}
          letterSpacing={-0.03}
          lineHeight={1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          SHREYANSH PATEL
          <meshStandardMaterial
            color="#ffffff"
            emissive="#2fe6ff"
            emissiveIntensity={0.18}
            roughness={0.2}
            metalness={0.8}
          />
        </Text>
      </Center>
    </group>
  );
}

// ── Ambient Light Field & Interactive Cursor Parallax ──────────────────────────
function Scene() {
  const sceneGroupRef = useRef<THREE.Group>(null!);
  const fragmentsRef = useRef<THREE.Group[]>([]);
  const { camera, pointer } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 7.5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Smooth mouse parallax
  useFrame(() => {
    if (!sceneGroupRef.current) return;
    const targetX = pointer.x * 0.45;
    const targetY = pointer.y * 0.35;
    sceneGroupRef.current.rotation.y = THREE.MathUtils.lerp(sceneGroupRef.current.rotation.y, targetX, 0.05);
    sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(sceneGroupRef.current.rotation.x, -targetY, 0.05);
  });

  // ScrollTrigger: shatter and disperse on scroll down past hero
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      if (sceneGroupRef.current) {
        tl.to(sceneGroupRef.current.position, {
          z: 3.5,
          y: -1.2,
          ease: 'power2.inOut',
        }, 0);
        tl.to(sceneGroupRef.current.rotation, {
          z: 0.3,
          x: 0.4,
          ease: 'power2.inOut',
        }, 0);
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
      <pointLight position={[-4, -2, 3]} intensity={2.5} color="#2fe6ff" distance={12} />
      <pointLight position={[4, 3, 2]} intensity={2.0} color="#0e8fa8" distance={10} />
      <pointLight position={[0, -4, 2]} intensity={1.5} color="#8ff3ff" distance={8} />

      {/* Floating aqua particles in 3D depth */}
      <Sparkles
        count={70}
        scale={[12, 8, 6]}
        size={2.5}
        speed={0.4}
        opacity={0.6}
        color="#2fe6ff"
      />

      <group ref={sceneGroupRef}>
        {/* Center 3D Typography */}
        <Hero3DText fragmentsRef={fragmentsRef} />

        {/* Hero Glass Refraction Lenses & Orbs (inspired by the reference art) */}
        {/* Main central iridescent blue sphere behind right side of text */}
        <IridescentOrb position={[2.6, 0.2, -0.6]} size={1.25} />

        {/* Large tilted floating glass disc */}
        <GlassDisc
          position={[1.5, 0.3, 0.7]}
          rotation={[0.4, -0.7, 0.3]}
          scale={1.3}
          speed={0.8}
        />

        {/* Secondary tilted glass ring/disc on right */}
        <GlassDisc
          position={[3.8, -0.2, 0.4]}
          rotation={[-0.3, 0.8, -0.4]}
          scale={1.1}
          speed={1.1}
        />

        {/* Left background glass disc */}
        <GlassDisc
          position={[-3.2, -0.5, -0.8]}
          rotation={[0.5, 0.6, -0.2]}
          scale={0.9}
          speed={0.9}
        />

        {/* Floating small glass droplets/orbs */}
        <GlassOrb position={[3.2, -1.6, 0.8]} scale={0.75} color="#2fe6ff" />
        <GlassOrb position={[-2.4, 1.4, -0.4]} scale={0.45} color="#ffffff" />
        <GlassOrb position={[1.8, 1.8, -0.5]} scale={0.35} color="#8ff3ff" />
        <GlassOrb position={[-1.2, -1.8, 0.5]} scale={0.3} color="#2fe6ff" />
      </group>
    </>
  );
}

// ── Error Boundary for 3D Canvas ───────────────────────────────────────────────
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('HeroCanvas WebGL fallback activated:', error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

// ── Public Export ─────────────────────────────────────────────────────────────
export default function HeroCanvas() {
  return (
    <CanvasErrorBoundary>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7.5], fov: 48 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <Scene />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
