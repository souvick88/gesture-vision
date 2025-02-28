interface Transform {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: number;
}

export function mapGestureToTransform(handData: any): Transform {
  const defaultTransform: Transform = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1
  };

  if (!handData.landmarks) {
    return defaultTransform;
  }

  const palm = handData.landmarks[0];
  const thumb = handData.landmarks[4];
  const index = handData.landmarks[8];

  // Map hand position to rotation
  const rotation = {
    x: (palm[1] - 0.5) * Math.PI, // Based on hand vertical position
    y: (palm[0] - 0.5) * Math.PI, // Based on hand horizontal position
    z: Math.atan2(thumb[1] - palm[1], thumb[0] - palm[0]) // Based on thumb orientation
  };

  // Calculate scale based on pinch gesture
  const pinchDistance = Math.sqrt(
    Math.pow(thumb[0] - index[0], 2) +
    Math.pow(thumb[1] - index[1], 2)
  );
  const scale = Math.max(0.5, Math.min(2, 1 + (1 - pinchDistance) * 2));

  return {
    position: { x: 0, y: 0, z: 0 }, // We're not using position in p5.js version
    rotation,
    scale
  };
}