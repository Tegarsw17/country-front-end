// components/dashboard/GlobeHero.tsx
"use client";

import * as THREE from "three";
import { useRef, useReducer, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Physics, RigidBody, BallCollider, RapierRigidBody } from "@react-three/rapier";
import { Effects } from "./Effects";

// --- TEXTURE UTILS (Tetap sama, dirapikan Type-nya) ---

const textureCache: Map<string, THREE.Texture> = new Map();

interface FlagDef {
  name: string;
  colors: string[];
}

const flagDefinitions: FlagDef[] = [
  { name: "Indonesia", colors: ["#ff0000", "#ffffff"] },
  { name: "USA", colors: ["#3c3b6e", "#ffffff", "#b22234"] },
  { name: "Germany", colors: ["#000000", "#dd0000", "#ffce00"] },
  { name: "France", colors: ["#0055a4", "#ffffff", "#ef4135"] },
  { name: "Italy", colors: ["#009246", "#ffffff", "#ce2b37"] },
  { name: "UK", colors: ["#012169", "#ffffff", "#c8102e"] },
  { name: "Japan", colors: ["#ffffff", "#ff0000"] }, 
  { name: "Singapore", colors: ["#ef3340", "#ffffff"] }, // Mock SGP
];

function drawHorizontalStripes(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, size: number, colors: string[]) {
  const stripeHeight = size / colors.length;
  colors.forEach((col, index) => {
    ctx.fillStyle = col;
    ctx.fillRect(0, index * stripeHeight, size, stripeHeight);
  });
}

function drawVerticalStripes(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, size: number, colors: string[]) {
  const stripeWidth = size / colors.length;
  colors.forEach((col, index) => {
    ctx.fillStyle = col;
    ctx.fillRect(index * stripeWidth, 0, stripeWidth, size);
  });
}

function createFlagTexture(flag: FlagDef | undefined): THREE.Texture | null {
  if (!flag) return null;

  const cacheKey = `${flag.name}:${flag.colors.join(",")}`;
  const cached = textureCache.get(cacheKey);
  if (cached) return cached;

  const size = 512;
  // @ts-ignore: OffscreenCanvas check
  const canvas = typeof  OffscreenCanvas !== "undefined"
    // @ts-ignore
    ? new OffscreenCanvas(size, size)
    : document.createElement("canvas");
  
  if (typeof document !== 'undefined' && canvas instanceof HTMLCanvasElement) {
      canvas.width = size;
      canvas.height = size;
  }

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null; // Simplifikasi type
  if (!ctx) return null;

  const { name, colors } = flag;

  // Logic gambar bendera (Sama seperti sebelumnya, disederhanakan switch-nya)
  if (["Indonesia", "Germany", "Singapore"].includes(name)) {
      drawHorizontalStripes(ctx, size, colors);
  } else if (["France", "Italy"].includes(name)) {
      drawVerticalStripes(ctx, size, colors);
  } else if (name === "Japan") {
      ctx.fillStyle = colors[0];
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = colors[1];
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size * 0.25, 0, Math.PI * 2);
      ctx.fill();
  } else if (name === "USA") {
      // Simplified US Flag
      const [blue, white, red] = colors;
      drawHorizontalStripes(ctx, size, Array(13).fill(null).map((_, i) => i % 2 === 0 ? red : white));
      ctx.fillStyle = blue;
      ctx.fillRect(0, 0, size * 0.45, size * 0.54); // Canton
  } else if (name === "UK") {
      ctx.fillStyle = colors[0];
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = colors[1]; // White cross
      ctx.fillRect(size/2 - size*0.15, 0, size*0.3, size);
      ctx.fillRect(0, size/2 - size*0.15, size, size*0.3);
      ctx.fillStyle = colors[2]; // Red cross
      ctx.fillRect(size/2 - size*0.08, 0, size*0.16, size);
      ctx.fillRect(0, size/2 - size*0.08, size, size*0.16);
  } else {
      drawHorizontalStripes(ctx, size, colors);
  }

  const tex = new THREE.CanvasTexture(canvas as any);
  tex.colorSpace = THREE.SRGBColorSpace; // Penting agar warna akurat
  tex.anisotropy = 4;
  textureCache.set(cacheKey, tex);
  return tex;
}

// --- COMPONENTS ---

// Komponen bola individu
function Sphere({
  position,
  children,
  vec = new THREE.Vector3(),
  r = THREE.MathUtils.randFloatSpread,
  flag,
  ...props
}: {
    position?: [number, number, number];
    vec?: THREE.Vector3;
    r?: (range: number) => number;
    flag?: FlagDef;
    children?: React.ReactNode;
    [key: string]: any;
}) {
  const api = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree(); // Akses ukuran layar real-time

  // 1. Tentukan Titik Tengah (Attractor) secara Dinamis
  // Jika layar lebar (> 10 unit threejs), tarik ke kanan.
  // Jika layar sempit (mobile), tarik ke atas sedikit agar tidak tertutup button.
  const attractor = useMemo(() => {
      if (viewport.width > 12) {
          return new THREE.Vector3(viewport.width / 3, 0, 0); // Kanan Desktop
      } else {
          return new THREE.Vector3(0, 2, -2); // Tengah Atas Mobile
      }
  }, [viewport.width]);

  const flagTexture = useMemo(() => createFlagTexture(flag), [flag]);

  useFrame((state, delta) => {
    delta = Math.min(0.1, delta);
    
    // Physics: Tarik bola ke arah attractor
    if (api.current) {
      const t = api.current.translation();
      vec.set(t.x - attractor.x, t.y - attractor.y, t.z - attractor.z).multiplyScalar(-0.15); // Kekuatan tarikan
      api.current.applyImpulse(vec, true);
      // Tambahkan random drag biar natural
      api.current.setLinearDamping(3); 
    }

    // Visual: Rotasi pelan
    if (meshRef.current) {
       meshRef.current.rotation.y += delta * 0.2;
       meshRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <RigidBody
      linearDamping={4}
      angularDamping={1}
      friction={0.2}
      restitution={0.8} // Memantul dikit
      position={position || [r(10), r(10), r(10)]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[1]} />
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          map={flagTexture || undefined}
          metalness={0.6} // Lebih metalik biar elegan di dark mode
          roughness={0.2} // Lebih glossy
          envMapIntensity={1.5}
        />
        {children}
      </mesh>
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef<RapierRigidBody>(null);
  const { viewport } = useThree();
  
  useFrame(({ mouse }) => {
    // Mouse physics agar bisa nendang bola
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      )
    );
  });
  
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1.5]} />
    </RigidBody>
  );
}

export function GlobeHero() {
  // Jumlah bola
  const spheres = useMemo(() => new Array(8).fill(null).map((_, i) => ({
      flag: flagDefinitions[i % flagDefinitions.length],
      // Spawn acak tapi cenderung di kanan
      pos: [Math.random() * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5] as [number, number, number]
  })), []);

  return (
    <div className="fixed inset-0 -z-10 bg-[#000000]"> 
      <Canvas
        style={{ width: "100%", height: "100%" }}
        flat
        shadows
        dpr={[1, 1.5]} // Performance optimization
        gl={{ antialias: false }}
        camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 60 }} // FOV diperlebar
      >
        {/* -- Lighting: Mood Gelap tapi Glossy -- */}
        {/* Ambient minim agar hitam pekat */}
        <ambientLight intensity={0.2} /> 
        
        {/* Lampu utama dari atas kanan */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        
        {/* Rim light dari belakang bawah untuk siluet */}
        <spotLight position={[-10, -10, -5]} intensity={3} color="#10b981" /> 

        <Physics gravity={[0, 0, 0]}>
          <Pointer />
          {spheres.map((s, i) => (
            <Sphere key={i} position={s.pos} flag={s.flag} />
          ))}
        </Physics>

        {/* -- Reflections -- */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 3, 0, 1]}>
            <Lightformer form="circle" intensity={10} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
            <Lightformer form="ring" color="#10b981" intensity={20} position={[10, 10, 0]} scale={10} />
          </group>
        </Environment>

        {/* Post Processing Effect */}
        <Effects />
      </Canvas>
    </div>
  );
}