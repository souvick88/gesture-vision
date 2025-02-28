import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HandTracker } from "@/components/HandTracker";
import { Scene3D } from "@/components/Scene3D";
import { ControlPanel } from "@/components/ControlPanel";
import { Camera } from "@/components/Camera";

export default function Home() {
  const [mode, setMode] = useState<'cube' | 'particles'>('cube');
  const [isTracking, setIsTracking] = useState(false);
  const [handData, setHandData] = useState<{
    landmarks?: any[];
    gestures?: { type: string; confidence: number }[];
  }>({});

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Hand Gesture 3D Control
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Camera Feed</h2>
            <Camera />
            <HandTracker
              isTracking={isTracking}
              onHandData={setHandData}
            />
          </Card>

          <Card className="p-4">
            <Tabs defaultValue="scene" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="scene">3D Scene</TabsTrigger>
                <TabsTrigger value="debug">Debug View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="scene">
                <Scene3D
                  mode={mode}
                  handData={handData}
                />
              </TabsContent>
              
              <TabsContent value="debug">
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-[400px]">
                  {JSON.stringify(handData, null, 2)}
                </pre>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <ControlPanel
          mode={mode}
          isTracking={isTracking}
          onModeChange={setMode}
          onTrackingToggle={setIsTracking}
        />
      </div>
    </div>
  );
}
