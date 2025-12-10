import { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from './ui/button';

interface WebcamCaptureProps {
  onStream?: (video: HTMLVideoElement) => void;
  isScanning?: boolean;
}

const WebcamCapture = ({ onStream, isScanning = false }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  }, []);

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  useEffect(() => {
    if (hasPermission && videoRef.current && onStream) {
      const video = videoRef.current;
      video.onloadedmetadata = () => {
        onStream(video);
      };
    }
  }, [hasPermission, onStream]);

  if (hasPermission === false) {
    return (
      <div className="relative w-full aspect-video bg-secondary rounded-xl flex flex-col items-center justify-center gap-4">
        <CameraOff className="w-16 h-16 text-muted-foreground" />
        <p className="text-muted-foreground text-center px-4">{error}</p>
        <Button onClick={startCamera} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-secondary rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover scale-x-[-1]"
      />
      
      {/* Face detection overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-[15%] border-2 border-primary/50 rounded-xl">
          {/* Corner accents */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
        </div>
        
        {/* Scanning animation */}
        {isScanning && (
          <div className="absolute inset-[15%] overflow-hidden rounded-xl">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
          </div>
        )}
      </div>

      {hasPermission === null && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-muted-foreground">Iniciando câmera...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
