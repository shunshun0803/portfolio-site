import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { scrollStore } from '../store/scroll';

function CoreObject() {
  const coreGroupRef  = useRef<THREE.Group>(null);
  const sphereRef     = useRef<THREE.Mesh>(null);
  const ringRef       = useRef<THREE.Mesh>(null);
  const ring2Ref      = useRef<THREE.Mesh>(null);
  const particlesRef  = useRef<THREE.Points>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = scrollStore.heroProgress;

    if (coreGroupRef.current) {
      coreGroupRef.current.position.y   = Math.sin(t * 0.5) * 0.1 + p * 1.6;
      coreGroupRef.current.rotation.y   = t * 0.3;
      coreGroupRef.current.rotation.x   = Math.sin(t * 0.2) * 0.15;
      const s = THREE.MathUtils.lerp(coreGroupRef.current.scale.x, 1 - p * 0.35, 0.08);
      coreGroupRef.current.scale.setScalar(s);
    }

    if (sphereRef.current) {
      const mat = sphereRef.current.material as any;
      if (mat.distort !== undefined)
        mat.distort = THREE.MathUtils.lerp(mat.distort, 0.3 + p * 0.65, 0.06);
      if (mat.emissiveIntensity !== undefined)
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.6 + p * 1.8, 0.06);
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.4;
      ringRef.current.rotation.z = t * 0.2;
      const rs = THREE.MathUtils.lerp(ringRef.current.scale.x, 1 + p * 1.4, 0.08);
      ringRef.current.scale.setScalar(rs);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 * (1 - p * 0.95));
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.3;
      ring2Ref.current.rotation.y = t * 0.35;
      const rs = THREE.MathUtils.lerp(ring2Ref.current.scale.x, 1 + p * 1.0, 0.08);
      ring2Ref.current.scale.setScalar(rs);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.5 * (1 - p * 0.95));
    }

    if (particlesRef.current)
      particlesRef.current.rotation.y = t * (0.05 + scrollStore.heroProgress * 0.25);
  });

  const orbitPositions = useMemo(() => {
    const arr = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      const r     = 2.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  return (
    <group>
      <group ref={coreGroupRef}>
        <Sphere ref={sphereRef} args={[1, 64, 64]}>
          <MeshDistortMaterial
            color="#38BDF8"
            emissive="#0ea5e9"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.1}
            distort={0.3}
            speed={1.5}
          />
        </Sphere>
        <Sphere args={[1.02, 16, 16]}>
          <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.1} />
        </Sphere>
      </group>

      <mesh ref={ringRef}>
        <torusGeometry args={[1.6, 0.015, 16, 100]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.7} />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.9, 0.01, 16, 100]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.5} />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[orbitPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#38BDF8" size={0.03} transparent opacity={0.7} />
      </points>
    </group>
  );
}

export function ThreeHeroScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} color="#ffffff" />
        <pointLight position={[5, 5, 5]}   intensity={3.0} color="#38BDF8" />
        <pointLight position={[-5, -3, -5]} intensity={1.8} color="#A855F7" />
        <pointLight position={[0, -4, 2]}  intensity={1.0} color="#22C55E" />
        <CoreObject />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          rotateSpeed={0.4}
        />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.15}
            luminanceSmoothing={0.8}
            intensity={1.8}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
