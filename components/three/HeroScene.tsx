"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh, Points as ThreePoints } from "three";
import * as THREE from "three";

/**
 * Computed once at module load, not during render -- React's purity rules forbid calling
 * impure functions like Math.random() while rendering (even inside useMemo), since the
 * component must be idempotent. This static decorative geometry never needs to change
 * per-render/per-instance, so hoisting it out entirely is both correct and cheaper.
 */
function generateStarPositions(count: number): Float32Array {
  const array = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 8 + Math.random() * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    array[i * 3 + 2] = radius * Math.cos(phi);
  }
  return array;
}

/**
 * Procedural banded-planet texture drawn on a canvas (no external image asset needed).
 * Deterministic (sine-based bands, not Math.random) and built once at module load --
 * same "never during render" rule as the starfield above.
 */
function createPlanetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  const base = ctx.createLinearGradient(0, 0, 0, canvas.height);
  base.addColorStop(0, "#4c1d95");
  base.addColorStop(0.3, "#6d28d9");
  base.addColorStop(0.55, "#4338ca");
  base.addColorStop(0.78, "#1e3a8a");
  base.addColorStop(1, "#0f1f4d");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y++) {
    const band = Math.sin(y * 0.12) * 0.5 + Math.sin(y * 0.31 + 1.4) * 0.3;
    if (band > 0.28) {
      ctx.fillStyle = `rgba(216, 180, 254, ${0.1 + band * 0.12})`;
      ctx.fillRect(0, y, canvas.width, 1);
    } else if (band < -0.32) {
      ctx.fillStyle = `rgba(6, 10, 35, ${0.15 + Math.abs(band) * 0.15})`;
      ctx.fillRect(0, y, canvas.width, 1);
    }
  }

  // Soft polar darkening for a spherical, lit-globe feel instead of a flat disc.
  const vignette = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    canvas.height * 0.1,
    canvas.width / 2,
    canvas.height / 2,
    canvas.height * 0.75,
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(4,6,18,0.35)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

const STAR_POSITIONS = generateStarPositions(2000);
const PLANET_TEXTURE = createPlanetTexture();

const FRESNEL_VERTEX_SHADER = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRESNEL_FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
    gl_FragColor = vec4(glowColor, clamp(intensity, 0.0, 1.0));
  }
`;

function StarPoints() {
  const pointsRef = useRef<ThreePoints>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[STAR_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#eef1ff" size={0.045} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

/** Fresnel rim-light glow shell -- the classic trick that makes a bare sphere read as "a planet with an atmosphere" instead of a flat-shaded ball. */
function AtmosphereGlow({ color }: { color: string }) {
  return (
    <mesh scale={1.12}>
      <sphereGeometry args={[1.6, 64, 64]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        uniforms={{ glowColor: { value: new THREE.Color(color) } }}
        vertexShader={FRESNEL_VERTEX_SHADER}
        fragmentShader={FRESNEL_FRAGMENT_SHADER}
      />
    </mesh>
  );
}

function Planet() {
  const groupRef = useRef<Group>(null);
  const planetMeshRef = useRef<Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (planetMeshRef.current) planetMeshRef.current.rotation.y += delta * 0.08;
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.05;
    pointer.current.x = state.pointer.x;
    pointer.current.y = state.pointer.y;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.current.y * 0.15,
      0.05,
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -pointer.current.x * 0.1,
      0.05,
    );
  });

  return (
    <group ref={groupRef}>
      <mesh ref={planetMeshRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial
          map={PLANET_TEXTURE}
          emissive="#312e81"
          emissiveIntensity={0.15}
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>
      <AtmosphereGlow color="#a855f7" />
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.3, 0.02, 16, 100]} />
        <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]} scale={1.15}>
        <torusGeometry args={[2.3, 0.01, 16, 100]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.18} />
      <pointLight position={[6, 4, 6]} intensity={140} color="#f5f0ff" decay={2} />
      <pointLight position={[-6, -2, -4]} intensity={40} color="#60a5fa" decay={2} />
      <pointLight position={[0, -5, 3]} intensity={20} color="#ffd166" decay={2} />
      <StarPoints />
      <Planet />
    </Canvas>
  );
}
