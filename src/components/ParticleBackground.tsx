import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 220;
const MAX_LINES = 300;
const CONNECT_DIST = 1.8;

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouseWorld = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const { positions, velocities, colors, linePositions } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 2);
    const colors = new Float32Array(COUNT * 3);
    const linePositions = new Float32Array(MAX_LINES * 2 * 3);
    const cyan = new THREE.Color('#FFD200');
    const purple = new THREE.Color('#FF7A18');

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = 0;
      velocities[i * 2]     = (Math.random() - 0.5) * 0.01;
      velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.01;
      const c = Math.random() > 0.55 ? cyan : purple;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, velocities, colors, linePositions };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseWorld.current.x = nx * (viewport.width / 2);
      mouseWorld.current.y = ny * (viewport.height / 2);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [viewport]);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const { x: mx, y: my } = mouseWorld.current;
    const W = viewport.width / 2 + 1.5;
    const H = viewport.height / 2 + 1.5;
    const REP = 2.0;

    // Update particle positions
    for (let i = 0; i < COUNT; i++) {
      const p = i * 3;
      const v = i * 2;

      const dx = pos[p] - mx;
      const dy = pos[p + 1] - my;
      const distSq = dx * dx + dy * dy;

      if (distSq < REP * REP && distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const force = ((REP - dist) / REP) * 0.04;
        velocities[v]     += (dx / dist) * force;
        velocities[v + 1] += (dy / dist) * force;
      }

      velocities[v]     *= 0.97;
      velocities[v + 1] *= 0.97;

      pos[p]     += velocities[v];
      pos[p + 1] += velocities[v + 1];

      if      (pos[p]     >  W) pos[p]     = -W;
      else if (pos[p]     < -W) pos[p]     =  W;
      if      (pos[p + 1] >  H) pos[p + 1] = -H;
      else if (pos[p + 1] < -H) pos[p + 1] =  H;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Build network lines between nearby particles
    const linePosArr = linesRef.current.geometry.attributes.position.array as Float32Array;
    let lineCount = 0;

    outer: for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        if (lineCount >= MAX_LINES) break outer;
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        if (dx * dx + dy * dy < CONNECT_DIST * CONNECT_DIST) {
          const base = lineCount * 6;
          linePosArr[base]     = pos[i * 3];
          linePosArr[base + 1] = pos[i * 3 + 1];
          linePosArr[base + 2] = 0;
          linePosArr[base + 3] = pos[j * 3];
          linePosArr[base + 4] = pos[j * 3 + 1];
          linePosArr[base + 5] = 0;
          lineCount++;
        }
      }
    }

    linesRef.current.geometry.setDrawRange(0, lineCount * 2);
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.06}
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>

      {/* Network lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#FFD200" transparent opacity={0.1} />
      </lineSegments>
    </>
  );
}

export function ParticleBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
