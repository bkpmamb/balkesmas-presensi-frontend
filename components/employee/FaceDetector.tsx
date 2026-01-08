// src/components/employee/FaceDetector.tsx
"use client";

import { useEffect, useState } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";

export function useFaceDetector(videoRef: React.RefObject<HTMLVideoElement>) {
  const [faceDetected, setFaceDetected] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const detector = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    detector.setOptions({
      model: "short",
      minDetectionConfidence: 0.6,
    });

    detector.onResults((results) => {
      setFaceDetected(results.detections.length > 0);
      setReady(true);
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await detector.send({ image: videoRef.current! });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, [videoRef]);

  return { faceDetected, ready };
}
