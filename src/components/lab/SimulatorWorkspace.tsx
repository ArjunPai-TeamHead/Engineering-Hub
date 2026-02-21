import { useState, useCallback } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Breadboard } from "./Breadboard";
import { ComponentPalette } from "./ComponentPalette";
import { CodeEditor } from "./CodeEditor";
import { SerialMonitor } from "./SerialMonitor";
import { GPIOMatrix } from "./GPIOMatrix";
import { Cpu, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface PlacedComponent {
  id: string;
  componentId: string;
  name: string;
  x: number;
  y: number;
  category: string;
}

export interface Wire {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
}

export function SimulatorWorkspace() {
  const { toast } = useToast();
  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<PlacedComponent | null>(null);
  const [code, setCode] = useState(`// Arduino Sketch\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}\n`);
  const [serialOutput, setSerialOutput] = useState<string[]>([]);
  const [language, setLanguage] = useState<"cpp" | "python">("cpp");

  const handleDropComponent = useCallback((componentId: string, name: string, category: string, x: number, y: number) => {
    const newComp: PlacedComponent = {
      id: `placed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      componentId, name, x, y, category,
    };
    setPlacedComponents((prev) => [...prev, newComp]);
  }, []);

  const handleSimulate = () => {
    toast({
      title: "⚡ WASM Simulation Engine",
      description: "Real-time circuit simulation is under development. The Rust-based WASM engine will enable physics-accurate emulation.",
    });
    setSerialOutput((prev) => [...prev, "[SIM] Compilation started...", "[SIM] Flash complete — simulation engine not yet available", "[SIM] Visit The Grid for OTA updates when hardware is connected"]);
  };

  const handleReset = () => {
    setPlacedComponents([]);
    setWires([]);
    setSelectedComponent(null);
    setSerialOutput([]);
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Top toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-card">
        <div className="flex items-center gap-3">
          <Cpu className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">The Lab — Simulator</h1>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {placedComponents.length} components
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
          </Button>
          <Button size="sm" onClick={handleSimulate} className="bg-primary hover:bg-primary/90">
            <Play className="h-3.5 w-3.5 mr-1" /> Simulate
          </Button>
        </div>
      </div>

      {/* Main content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left: Component Palette */}
        <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
          <ComponentPalette onDrop={handleDropComponent} />
        </ResizablePanel>
        <ResizableHandle withHandle />

        {/* Center: Breadboard */}
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={65}>
              <Breadboard
                placedComponents={placedComponents}
                wires={wires}
                setWires={setWires}
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
                setPlacedComponents={setPlacedComponents}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35}>
              <Tabs defaultValue="serial" className="h-full flex flex-col">
                <TabsList className="mx-2 mt-1 w-fit">
                  <TabsTrigger value="serial" className="text-xs">Serial Monitor</TabsTrigger>
                  <TabsTrigger value="gpio" className="text-xs">GPIO Matrix</TabsTrigger>
                </TabsList>
                <TabsContent value="serial" className="flex-1 m-0"><SerialMonitor output={serialOutput} setOutput={setSerialOutput} /></TabsContent>
                <TabsContent value="gpio" className="flex-1 m-0"><GPIOMatrix /></TabsContent>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />

        {/* Right: Code Editor */}
        <ResizablePanel defaultSize={35} minSize={20}>
          <CodeEditor code={code} setCode={setCode} language={language} setLanguage={setLanguage} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
