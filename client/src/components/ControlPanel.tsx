import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Box, Hand, Loader2 } from "lucide-react";

interface ControlPanelProps {
  mode: 'cube' | 'particles';
  isTracking: boolean;
  onModeChange: (mode: 'cube' | 'particles') => void;
  onTrackingToggle: (enabled: boolean) => void;
}

export function ControlPanel({
  mode,
  isTracking,
  onModeChange,
  onTrackingToggle,
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
          />
        </div>

        <div className="space-y-4">
          <Label>Object Mode</Label>
          <div className="flex gap-4">
            <Button
              variant={mode === 'cube' ? 'default' : 'outline'}
              onClick={() => onModeChange('cube')}
            >
              <Box className="mr-2 h-4 w-4" />
              Cube
            </Button>
            <Button
              variant={mode === 'particles' ? 'default' : 'outline'}
              onClick={() => onModeChange('particles')}
            >
              <Loader2 className="mr-2 h-4 w-4" />
              Particles
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <h4 className="font-medium mb-2">Gesture Guide</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Hand className="h-4 w-4" />
              Open hand to rotate
            </li>
            <li className="flex items-center gap-2">
              <Hand className="h-4 w-4" />
              Pinch to scale
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}