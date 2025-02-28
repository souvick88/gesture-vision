import { useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';

interface Scene3DProps {
  mode: 'cube' | 'particles';
  handData: {
    landmarks?: any[];
    gestures?: { type: string; confidence: number }[];
  };
}

export function Scene3D({ mode, handData }: Scene3DProps) {
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const scaleRef = useRef(1);

  useEffect(() => {
    if (handData.landmarks && handData.landmarks.length > 0) {
      // Update rotation based on palm position (landmarks[0] is the palm base)
      const palm = handData.landmarks[0];

      // Smooth transitions for rotation
      const targetRotation = {
        x: (palm[1] - 0.5) * Math.PI * 4, // Increased range for more responsive rotation
        y: (palm[0] - 0.5) * Math.PI * 4,
        z: 0
      };

      // Smooth interpolation
      rotationRef.current = {
        x: rotationRef.current.x + (targetRotation.x - rotationRef.current.x) * 0.1,
        y: rotationRef.current.y + (targetRotation.y - rotationRef.current.y) * 0.1,
        z: rotationRef.current.z + (targetRotation.z - rotationRef.current.z) * 0.1
      };

      // Update scale based on pinch gesture
      if (handData.gestures?.some(g => g.type === 'pinch')) {
        const pinchGesture = handData.gestures.find(g => g.type === 'pinch');
        if (pinchGesture) {
          const targetScale = 0.5 + pinchGesture.confidence * 2; // Scale between 0.5 and 2.5
          scaleRef.current += (targetScale - scaleRef.current) * 0.1; // Smooth transition
        }
      }
    }
  }, [handData]);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(400, 400, p5.WEBGL).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    p5.background(0);
    p5.lights();

    // Add ambient light for better visibility
    p5.ambientLight(60);
    p5.pointLight(255, 255, 255, 0, 0, 200);

    // Smooth rotation and scale transitions
    p5.push();
    p5.rotateX(rotationRef.current.x);
    p5.rotateY(rotationRef.current.y);
    p5.rotateZ(rotationRef.current.z);

    const size = 100 * scaleRef.current;

    if (mode === 'cube') {
      // Draw cube with wireframe effect
      p5.noStroke();
      p5.fill(200, 100, 200);
      p5.box(size);

      // Add wireframe effect
      p5.stroke(255);
      p5.noFill();
      p5.box(size * 1.001);
    } else {
      // Particle system
      p5.stroke(255);
      p5.strokeWeight(2);

      const particleCount = 1000;
      const time = p5.millis() * 0.001;

      for (let i = 0; i < particleCount; i++) {
        const angle = p5.random(p5.TWO_PI);
        const radius = p5.random(size);

        // Create a dynamic spherical distribution of particles
        const x = p5.cos(angle) * radius;
        const y = p5.sin(angle) * radius;
        const z = p5.random(-size/2, size/2);

        // Add some motion to particles
        const noiseScale = 0.02;
        const offsetX = p5.noise(x * noiseScale + time) * 20 - 10;
        const offsetY = p5.noise(y * noiseScale + time) * 20 - 10;
        const offsetZ = p5.noise(z * noiseScale + time) * 20 - 10;

        p5.point(x + offsetX, y + offsetY, z + offsetZ);
      }
    }
    p5.pop();
  };

  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden bg-black">
      <Sketch setup={setup} draw={draw} />
    </div>
  );
}