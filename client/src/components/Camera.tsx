import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Camera as CameraIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CameraProps {
  onReady: () => void;
}

export function Camera({ onReady }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permission, setPermission] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function requestCameraAccess() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user',
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setPermission('granted');
        setError(null);
        onReady();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermission('denied');
      setError('Could not access camera. Please check permissions and try again.');
    }
  }

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
      {permission === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button 
            onClick={requestCameraAccess}
            className="flex items-center gap-2"
          >
            <CameraIcon className="h-4 w-4" />
            Enable Camera
          </Button>
        </div>
      )}

      {permission === 'denied' && error && (
        <Alert variant="destructive" className="absolute inset-x-0 top-4 mx-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${permission !== 'granted' ? 'hidden' : ''}`}
        autoPlay
        playsInline
        muted
      />
    </div>
  );
}