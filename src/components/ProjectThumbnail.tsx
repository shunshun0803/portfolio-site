import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ---- Soulslike: Diamond octahedron + orbiting ring ----
function SoulslikeScene({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = hovered ? 2.2 : 0.7;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * speed;
      groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.9;
      ringRef.current.rotation.z = t * 0.4;
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        <mesh>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#0ea5e9"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.82, 0]} />
          <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.2} />
        </mesh>
      </group>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.018, 12, 80]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// ---- Game AI: Neural network of connected nodes ----
const NODE_POSITIONS: [number, number, number][] = [
  [0, 0, 0],
  [-0.8, 0.7, 0.2],
  [0.8, 0.6, -0.1],
  [-0.6, -0.7, -0.2],
  [0.7, -0.6, 0.3],
  [0, 1.1, -0.3],
  [0, -1.1, 0.2],
];
const EDGES: [number, number][] = [
  [0,1],[0,2],[0,3],[0,4],[1,5],[2,5],[3,6],[4,6],[1,3],[2,4],[5,6]
];

function NeuralNetScene({ hovered }: { hovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const lineGeo = useMemo(() => {
    const pts: number[] = [];
    EDGES.forEach(([a, b]) => {
      pts.push(...NODE_POSITIONS[a], ...NODE_POSITIONS[b]);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = hovered ? 1.6 : 0.4;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * speed;
      groupRef.current.rotation.x = t * speed * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {NODE_POSITIONS.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[i === 0 ? 0.18 : 0.12, 12, 12]} />
          <meshStandardMaterial
            color="#A855F7"
            emissive="#9333ea"
            emissiveIntensity={i === 0 ? 0.8 : 0.4}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      ))}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#A855F7" transparent opacity={0.4} />
      </lineSegments>
    </group>
  );
}

// ---- Portfolio: TorusKnot + double wireframe ----
function PortfolioScene({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = hovered ? 2.0 : 0.6;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * speed * 0.5;
      meshRef.current.rotation.y = t * speed;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = -t * speed * 0.3;
      wireRef.current.rotation.y = t * speed * 0.7;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.6, 0.2, 80, 12]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0ea5e9"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={wireRef}>
        <torusKnotGeometry args={[0.62, 0.21, 40, 8]} />
        <meshBasicMaterial color="#A855F7" wireframe transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// ---- Scene selector ----
const scenes: Record<string, React.FC<{ hovered: boolean }>> = {
  'soulslike-boss':    SoulslikeScene,
  'game-ai-research':  NeuralNetScene,
  'portfolio-site':    PortfolioScene,
};

interface ProjectThumbnailProps {
  projectId: string;
  hovered: boolean;
}

export function ProjectThumbnail({ projectId, hovered }: ProjectThumbnailProps) {
  const Scene = scenes[projectId] ?? PortfolioScene;

  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      frameloop="always"
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 3]} intensity={2.5} color="#38BDF8" />
      <pointLight position={[-3, -2, -3]} intensity={1.5} color="#A855F7" />
      <Scene hovered={hovered} />
    </Canvas>
  );
}
