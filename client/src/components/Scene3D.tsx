import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef, useMemo, Suspense } from 'react';
import { mapGestureToTransform } from '@/lib/gestureMapping';
import { Mesh, Points, Float32BufferAttribute } from 'three';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface Scene3DProps {
  mode: 'cube' | 'particles';
  handData: {
    landmarks?: number[][];
    gestures?: { type: string; confidence: number }[];
  };
}

function Scene3DContent({ mode, handData }: Scene3DProps) {
  const objectRef = useRef<Mesh>(null);
  const particlesRef = useRef<Points>(null);

  // Create particle positions once and reuse
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(3000);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 3;
      positions[i + 1] = (Math.random() - 0.5) * 3;
      positions[i + 2] = (Math.random() - 0.5) * 3;
    }
    return new Float32BufferAttribute(positions, 3);
  }, []);

  useEffect(() => {
    if (!handData.landmarks || !objectRef.current) return;

    const transform = mapGestureToTransform(handData);

    if (mode === 'cube' && objectRef.current) {
      objectRef.current.rotation.x = transform.rotation.x;
      objectRef.current.rotation.y = transform.rotation.y;
      objectRef.current.rotation.z = transform.rotation.z;
      objectRef.current.position.x = transform.position.x;
      objectRef.current.position.y = transform.position.y;
      objectRef.current.position.z = transform.position.z;
      objectRef.current.scale.setScalar(transform.scale);
    } else if (mode === 'particles' && particlesRef.current) {
      particlesRef.current.rotation.y += 0.01;
    }
  }, [handData, mode]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {mode === 'cube' ? (
        <mesh ref={objectRef}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="purple" />
        </mesh>
      ) : (
        <points ref={particlesRef}>
          <bufferGeometry>
            <primitive 
              object={particlePositions} 
              attach="attributes-position" 
            />
          </bufferGeometry>
          <pointsMaterial 
            size={0.02} 
            color="white" 
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      )}

      <OrbitControls enableZoom={false} />
    </>
  );
}

export function Scene3D(props: Scene3DProps) {
  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden bg-black">
      <ErrorBoundary>
        <Canvas 
          camera={{ position: [0, 0, 5] }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true
          }}
        >
          <Suspense fallback={null}>
            <Scene3DContent {...props} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}