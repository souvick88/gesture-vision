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

  useEffect(() => {
    if (!isTracking) return;

    async function initializeTracker() {
      await tf.ready();
      modelRef.current = await handpose.load();

      const video = document.querySelector('video');
      if (!video) return;

      async function detectHands() {
        if (!modelRef.current || !video) return;

        try {
          const predictions = await modelRef.current.estimateHands(video);

          if (predictions.length > 0) {
            const landmarks = predictions[0].landmarks;
            onHandData({
              landmarks,
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

  return null;
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

  if (distance < 40) { // Threshold in pixels
    gestures.push({ type: 'pinch', confidence: 1 - distance / 40 });
  }

  // Add more gesture detection logic here
  return gestures;
}