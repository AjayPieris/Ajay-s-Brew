import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

const COLORS = {
  espresso: "#1A120B",
  roast: "#3C2A21",
  cream: "#F4E9DC",
  gold: "#C9932E",
  caramel: "#B8763E",
  green: "#516138",
  cherry: "#8f2d22",
};

export const journeyStages = [
  { kicker: "01 · Seed & sapling", title: "Grown at 4,000ft", copy: "Shade-grown beneath the silver oak canopy." },
  { kicker: "02 · Flowering", title: "The first bloom", copy: "Arabica flowers perfume the misty estate air." },
  { kicker: "03 · Ripening", title: "Picked at peak red", copy: "Only ripe cherries make the morning harvest." },
  { kicker: "04 · Harvest & drying", title: "Sun-Dried for 12 Days", copy: "Turned slowly under the Chikmagalur sun." },
  { kicker: "05 · Roasting", title: "Roasted in Small Batches", copy: "Heat unlocks caramel, cacao and warm spice." },
  { kicker: "06 · The pour", title: "Poured with Care", copy: "The estate completes its journey in your cup." },
];

function Leaf({ position, rotation = 0, scale = 1 }: { position: [number, number, number]; rotation?: number; scale?: number }) {
  return (
    <mesh position={position} rotation={[0.25, rotation, 0.18]} scale={[0.55 * scale, 0.11 * scale, 0.26 * scale]} castShadow>
      <sphereGeometry args={[1, 12, 8]} />
      <meshStandardMaterial color={COLORS.green} roughness={0.78} />
    </mesh>
  );
}

function Plant({ progress }: { progress: number }) {
  const blossomOpacity = THREE.MathUtils.smoothstep(progress, 0.12, 0.28) * (1 - THREE.MathUtils.smoothstep(progress, 0.36, 0.48));
  const cherryColor = new THREE.Color(COLORS.green).lerp(new THREE.Color(COLORS.cherry), THREE.MathUtils.smoothstep(progress, 0.34, 0.58));
  return (
    <group position={[0, -1.5, 0]} scale={0.85 + progress * 0.45}>
      <mesh position={[0, 1.5, 0]} castShadow><cylinderGeometry args={[0.08, 0.14, 3, 8]} /><meshStandardMaterial color={COLORS.roast} roughness={0.9} /></mesh>
      {[-1, 1].flatMap((side) => [0.7, 1.25, 1.8, 2.35].map((y, i) => (
        <group key={`${side}-${y}`}>
          <mesh position={[side * 0.62, y, 0]} rotation={[0, 0, side * 1.12]} castShadow><cylinderGeometry args={[0.035, 0.05, 1.3, 6]} /><meshStandardMaterial color={COLORS.roast} /></mesh>
          <Leaf position={[side * (0.78 + (i % 2) * 0.15), y + 0.08, 0.08]} rotation={side > 0 ? 0.2 : 2.9} scale={1 + i * 0.05} />
          <mesh position={[side * 0.48, y + 0.18, 0.13]} scale={0.13 + blossomOpacity * 0.09}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={blossomOpacity > 0.15 ? COLORS.cream : cherryColor} emissive={blossomOpacity > 0.15 ? COLORS.cream : COLORS.espresso} emissiveIntensity={blossomOpacity * 0.25} />
          </mesh>
        </group>
      )))}
    </group>
  );
}

function DryingBed({ progress }: { progress: number }) {
  const opacity = THREE.MathUtils.smoothstep(progress, 0.47, 0.58) * (1 - THREE.MathUtils.smoothstep(progress, 0.72, 0.79));
  const beans = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    x: ((i * 37) % 100) / 16 - 3.1,
    z: ((i * 61) % 100) / 18 - 2.7,
    r: (i % 11) * 0.41,
  })), []);
  if (opacity < 0.01) return null;
  return (
    <group position={[0, -1.1, 0]} rotation={[0.15, 0, 0]}>
      <mesh receiveShadow><cylinderGeometry args={[3.7, 3.7, 0.18, 32]} /><meshStandardMaterial color={COLORS.gold} transparent opacity={opacity * 0.5} roughness={1} /></mesh>
      {beans.map((bean, i) => <mesh key={i} position={[bean.x, 0.18, bean.z]} rotation={[1.2, bean.r, 0.2]} scale={[0.12, 0.07, 0.07]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={COLORS.cherry} transparent opacity={opacity} /></mesh>)}
    </group>
  );
}

function Roaster({ progress, time }: { progress: number; time: number }) {
  const opacity = THREE.MathUtils.smoothstep(progress, 0.66, 0.76) * (1 - THREE.MathUtils.smoothstep(progress, 0.88, 0.94));
  if (opacity < 0.01) return null;
  return (
    <group rotation={[0.1, time * 0.35, -0.08]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[1.85, 1.85, 3.2, 24, 1, true]} /><meshStandardMaterial color={COLORS.roast} metalness={0.72} roughness={0.28} transparent opacity={opacity} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0, 0]}><torusGeometry args={[1.86, 0.08, 8, 32]} /><meshStandardMaterial color={COLORS.gold} emissive={COLORS.caramel} emissiveIntensity={1.1} transparent opacity={opacity} /></mesh>
      {Array.from({ length: 24 }, (_, i) => {
        const a = i * 2.4 + time * (0.8 + (i % 3) * 0.1);
        return <mesh key={i} position={[Math.sin(a) * 1.2, Math.cos(a * 1.3) * 1.1, ((i % 7) - 3) * 0.32]} rotation={[a, a * 0.4, 0]} scale={[0.18, 0.1, 0.1]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color={progress > 0.78 ? COLORS.espresso : COLORS.gold} /></mesh>;
      })}
    </group>
  );
}

function Cup({ progress }: { progress: number }) {
  const reveal = THREE.MathUtils.smoothstep(progress, 0.84, 0.97);
  if (reveal < 0.01) return null;
  return (
    <group position={[0, -0.4 + (1 - reveal) * 1.2, 0]} rotation={[0.08, -0.16 + (1 - reveal), -0.03]} scale={1.15}>
      <mesh castShadow><cylinderGeometry args={[1.45, 1.08, 1.65, 48, 1, true]} /><meshPhysicalMaterial color={COLORS.cream} roughness={0.3} clearcoat={0.55} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.82, 0]} rotation-x={Math.PI / 2}><circleGeometry args={[1.43, 48]} /><meshStandardMaterial color={COLORS.espresso} roughness={0.15} /></mesh>
      <mesh position={[1.35, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.65, 0.17, 12, 32]} /><meshStandardMaterial color={COLORS.cream} /></mesh>
      <mesh position={[0, 2.25, 0]}><cylinderGeometry args={[0.1, 0.15, 2.8, 12]} /><meshPhysicalMaterial color={COLORS.caramel} transparent opacity={reveal * 0.9} transmission={0.05} /></mesh>
      <mesh position={[0, -0.95, 0]}><cylinderGeometry args={[1.7, 1.7, 0.12, 48]} /><meshStandardMaterial color={COLORS.gold} metalness={0.7} roughness={0.28} /></mesh>
    </group>
  );
}

function Hills() {
  return <group position={[0, -2.5, -8]}>{[-5, -1, 4].map((x, i) => <mesh key={x} position={[x, 0, i]} rotation={[0, 0, -0.08 + i * 0.12]} scale={[5, 2.4 + i, 1]}><coneGeometry args={[1.8, 3, 7]} /><meshStandardMaterial color={i === 1 ? COLORS.roast : COLORS.espresso} roughness={1} /></mesh>)}</group>;
}

function JourneyScene({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const root = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  useFrame(({ camera, scene }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const p = progressRef.current;
    setProgress((old) => Math.abs(old - p) > 0.004 ? p : old);
    setTime((old) => old + delta);
    const cameraTargets = [new THREE.Vector3(0, 0.4, 7.8), new THREE.Vector3(0.5, 0.8, 9), new THREE.Vector3(-0.5, 0.9, 8.4), new THREE.Vector3(0, 6.8, 3.5), new THREE.Vector3(1, 0.5, 8.2), new THREE.Vector3(0.5, 0.2, 7.5)];
    const scaled = p * 5;
    const index = Math.min(4, Math.floor(scaled));
    const local = scaled - index;
    const fallbackTarget = cameraTargets[0] as THREE.Vector3;
    const currentTarget = cameraTargets[index] || fallbackTarget;
    const nextTarget = cameraTargets[index + 1] || currentTarget;
    const target = currentTarget.clone().lerp(nextTarget, local);
    camera.position.lerp(target, 1 - Math.exp(-4 * delta));
    camera.lookAt(0, 0, 0);
    if (root.current) root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, -0.22 + p * 0.5, 1 - Math.exp(-3 * delta));
    scene.background = new THREE.Color(COLORS.espresso).lerp(new THREE.Color(COLORS.roast), THREE.MathUtils.smoothstep(p, 0.75, 1));
  });
  return (
    <>
      <fog attach="fog" args={[COLORS.espresso, 8, 24]} />
      <ambientLight intensity={0.48} color="#334455" />
      <directionalLight position={[5, 7, 5]} intensity={2.6 + progress * 1.5} color="#FFAA55" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[-5, 1, 3]} intensity={1.25} color="#54708a" />
      <Environment><Lightformer intensity={2.2} color="#FFAA55" position={[4, 5, 2]} scale={[6, 6, 1]} /></Environment>
      <Hills />
      <group ref={root}>
        {progress < 0.64 && <Plant progress={progress} />}
        <DryingBed progress={progress} />
        <Roaster progress={progress} time={time} />
        <Cup progress={progress} />
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.65, 0]} receiveShadow><circleGeometry args={[5, 48]} /><meshStandardMaterial color={progress > 0.58 ? COLORS.roast : "#21170e"} roughness={1} /></mesh>
    </>
  );
}

export function CoffeeJourney({ progressRef }: { progressRef: MutableRefObject<number> }) {
  return (
    <Canvas shadows dpr={[1, 1.7]} camera={{ position: [0, 0.4, 7.8], fov: 42 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
      <Suspense fallback={null}><JourneyScene progressRef={progressRef} /></Suspense>
    </Canvas>
  );
}