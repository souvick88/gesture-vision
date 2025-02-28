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

  // Map hand position to object position
  const position = {
    x: (palm.x - 0.5) * 2,
    y: -(palm.y - 0.5) * 2,
    z: palm.z
  };

  // Calculate rotation based on palm orientation
  const rotation = {
    x: Math.atan2(palm.y, palm.z),
    y: Math.atan2(palm.x, palm.z),
    z: Math.atan2(thumb.y - palm.y, thumb.x - palm.x)
  };

  // Calculate scale based on pinch gesture
  const pinchDistance = Math.sqrt(
    Math.pow(thumb.x - index.x, 2) +
    Math.pow(thumb.y - index.y, 2)
  );
  const scale = Math.max(0.5, Math.min(2, 1 + (1 - pinchDistance) * 2));

  return {
    position,
    rotation,
    scale
  };
}
