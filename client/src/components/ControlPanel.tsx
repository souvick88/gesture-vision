import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Box, Hand, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ControlPanelProps {
  mode: 'cube' | 'particles';
  isTracking: boolean;
  onModeChange: (mode: 'cube' | 'particles') => void;
  onTrackingToggle: (enabled: boolean) => void;
  cameraReady: boolean;
}

export function ControlPanel({
  mode,
  isTracking,
  onModeChange,
  onTrackingToggle,
  cameraReady,
}: ControlPanelProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Hand Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Enable or disable hand gesture tracking
            </p>
          </div>
          <Switch
            checked={isTracking}
            onCheckedChange={onTrackingToggle}
            disabled={!cameraReady}
          />
        </div>

        <div className="space-y-4">
          <Label>Object Mode</Label>
          <div className="flex gap-4">
            <Button
              variant={mode === 'cube' ? 'default' : 'outline'}
              onClick={() => onModeChange('cube')}
              className="relative overflow-hidden transition-all hover:shadow-lg"
            >
              <Box className="mr-2 h-4 w-4" />
              Cube
              {mode === 'cube' && (
                <div className="absolute inset-0 bg-primary/10 animate-pulse" />
              )}
            </Button>
            <Button
              variant={mode === 'particles' ? 'default' : 'outline'}
              onClick={() => onModeChange('particles')}
              className="relative overflow-hidden transition-all hover:shadow-lg"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Particles
              {mode === 'particles' && (
                <div className="absolute inset-0 bg-primary/10 animate-pulse" />
              )}
            </Button>
          </div>
        </div>

        {!cameraReady && (
          <Alert>
            <AlertDescription>
              Enable camera access to start hand tracking
            </AlertDescription>
          </Alert>
        )}

        <div className="rounded-lg bg-muted p-4">
          <h4 className="font-medium mb-3 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Gesture Guide
          </h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 p-2 rounded-md hover:bg-background/50 transition-colors">
              <Hand className="h-5 w-5 text-primary" />
              <span>Open hand to rotate object in 3D space</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-md hover:bg-background/50 transition-colors">
              <Hand className="h-5 w-5 text-primary rotate-90" />
              <span>Pinch gesture to scale object size</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}