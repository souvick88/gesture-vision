import { useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';

interface Scene3DProps {
  mode: 'cube' | 'particles';
  handData: {
    landmarks?: number[][];
    gestures?: { type: string; confidence: number }[];
  };
}

export function Scene3D({ mode, handData }: Scene3DProps) {
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const scaleRef = useRef(1);

  useEffect(() => {
    if (handData.landmarks && handData.landmarks.length > 0) {
      // Update rotation based on hand position
      const palm = handData.landmarks[0];
      rotationRef.current = {
        x: (palm[1] - 0.5) * Math.PI,
        y: (palm[0] - 0.5) * Math.PI,
        z: 0
      };

      // Update scale based on pinch gesture
      if (handData.gestures?.some(g => g.type === 'pinch')) {
        const pinchGesture = handData.gestures.find(g => g.type === 'pinch');
        if (pinchGesture) {
          scaleRef.current = 0.5 + pinchGesture.confidence;
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

    p5.rotateX(rotationRef.current.x);
    p5.rotateY(rotationRef.current.y);
    p5.rotateZ(rotationRef.current.z);

    const size = 100 * scaleRef.current;

    if (mode === 'cube') {
      p5.push();
      p5.fill(200, 100, 200);
      p5.box(size);
      p5.pop();
    } else {
      // Particle system
      p5.push();
      for (let i = 0; i < 1000; i++) {
        const angle = p5.random(p5.TWO_PI);
        const radius = p5.random(size);
        const x = p5.cos(angle) * radius;
        const y = p5.sin(angle) * radius;
        const z = p5.random(-size/2, size/2);

        p5.stroke(255);
        p5.strokeWeight(2);
        p5.point(x, y, z);
      }
      p5.pop();
    }
  };

  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden bg-black">
      <Sketch setup={setup} draw={draw} />
    </div>
  );
}