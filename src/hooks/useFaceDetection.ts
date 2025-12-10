import { useState, useEffect, useCallback } from 'react';
import * as faceapi from 'face-api.js';

interface FaceData {
  descriptor: Float32Array;
  name: string;
  timestamp: number;
}

const MODEL_URL = '/models';

export const useFaceDetection = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Error loading face detection models:', err);
        setError('Erro ao carregar modelos de detecção facial');
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const detectFace = useCallback(async (
    video: HTMLVideoElement
  ): Promise<faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>> | null> => {
    if (!isModelLoaded) return null;

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection || null;
  }, [isModelLoaded]);

  const saveFace = useCallback((name: string, descriptor: Float32Array) => {
    const faces = getFaces();
    const newFace: FaceData = {
      descriptor,
      name,
      timestamp: Date.now(),
    };
    faces.push(newFace);
    localStorage.setItem('faceid_faces', JSON.stringify(faces.map(f => ({
      ...f,
      descriptor: Array.from(f.descriptor)
    }))));
  }, []);

  const getFaces = useCallback((): FaceData[] => {
    const stored = localStorage.getItem('faceid_faces');
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((f: any) => ({
      ...f,
      descriptor: new Float32Array(f.descriptor)
    }));
  }, []);

  const matchFace = useCallback((descriptor: Float32Array): { name: string; distance: number } | null => {
    const faces = getFaces();
    if (faces.length === 0) return null;

    let bestMatch: { name: string; distance: number } | null = null;
    const threshold = 0.6;

    for (const face of faces) {
      const distance = faceapi.euclideanDistance(descriptor, face.descriptor);
      if (distance < threshold && (!bestMatch || distance < bestMatch.distance)) {
        bestMatch = { name: face.name, distance };
      }
    }

    return bestMatch;
  }, [getFaces]);

  return {
    isModelLoaded,
    isLoading,
    error,
    detectFace,
    saveFace,
    getFaces,
    matchFace,
  };
};
