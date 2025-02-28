import { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

interface HandTrackerProps {
  isTracking: boolean;
  onHandData: (data: any) => void;
}

export function HandTracker({ isTracking, onHandData }: HandTrackerProps) {
  const modelRef = useRef<handpose.HandPose>();
  const requestRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isTracking) {
      onHandData({});
      return;
    }

    async function initializeTracker() {
      await tf.ready();
      modelRef.current = await handpose.load();
      console.log('HandPose model loaded');

      const video = document.querySelector('video');
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      // Set canvas size to match video
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      async function detectHands() {
        if (!modelRef.current || !video || !ctx) return;

        try {
          const predictions = await modelRef.current.estimateHands(video);

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (predictions.length > 0) {
            const landmarks = predictions[0].landmarks;

            // Draw hand landmarks
            ctx.fillStyle = '#00ff00';
            ctx.strokeStyle = '#00ff00';

            // Draw dots for each landmark
            landmarks.forEach((point: number[]) => {
              ctx.beginPath();
              ctx.arc(
                point[0] * canvas.width, 
                point[1] * canvas.height, 
                4, 0, 2 * Math.PI
              );
              ctx.fill();
            });

            // Connect landmarks with lines
            ctx.beginPath();
            landmarks.forEach((point: number[], index: number) => {
              if (index === 0) {
                ctx.moveTo(point[0] * canvas.width, point[1] * canvas.height);
              } else {
                ctx.lineTo(point[0] * canvas.width, point[1] * canvas.height);
              }
            });
            ctx.stroke();

            // Send normalized coordinates
            onHandData({
              landmarks: landmarks.map((point: number[]) => [
                point[0], // Already normalized between 0-1
                point[1], // Already normalized between 0-1
                point[2]  // Z-coordinate
              ]),
              gestures: interpretGestures(landmarks)
            });
          } else {
            onHandData({});
          }
        } catch (error) {
          console.error('Hand detection error:', error);
        }

        requestRef.current = requestAnimationFrame(detectHands);
      }

      detectHands();
    }

    initializeTracker();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isTracking, onHandData]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        display: isTracking ? 'block' : 'none',
        opacity: 0.7 
      }}
    />
  );
}

function interpretGestures(landmarks: number[][]) {
  // Basic gesture detection based on finger positions
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const distance = Math.sqrt(
    Math.pow(thumbTip[0] - indexTip[0], 2) +
    Math.pow(thumbTip[1] - indexTip[1], 2)
  );

  const gestures = [];

  if (distance < 0.1) { // Now using normalized coordinates (0-1)
    gestures.push({ type: 'pinch', confidence: 1 - distance * 10 });
  }

  // Add more gesture detection logic here
  return gestures;
}