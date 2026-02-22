import { useState, useCallback } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Breadboard } from "./Breadboard";
import { ComponentPalette } from "./ComponentPalette";
import { CodeEditor } from "./CodeEditor";
import { SerialMonitor } from "./SerialMonitor";
import { GPIOMatrix } from "./GPIOMatrix";
import { Cpu, Play, RotateCcw, Plus, MoreVertical } from "lucide-react";
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
  const [code, setCode] = useState(`void setup() {\n  // put your setup code here, to run once:\n  Serial.begin(9600);\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  // put your main code here, to run repeatedly:\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}\n`);
  const [serialOutput, setSerialOutput] = useState<string[]>([]);
  const [language, setLanguage] = useState<"cpp" | "python">("cpp");
  const [activeTab, setActiveTab] = useState("sketch");

  const handleDropComponent = useCallback((componentId: string, name: string, category: string, x: number, y: number) => {
    const newComp: PlacedComponent = {
      id: `placed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      componentId, name, x, y, category,
    };
    setPlacedComponents((prev) => [...prev, newComp]);
  }, []);

  const handleSimulate = () => {
    toast({ title: "⚡ Simulation Started", description: "WASM compilation engine is under development. Code will flash to virtual MCU soon." });
    setSerialOutput((prev) => [...prev, "[SIM] Compilation started...", "[SIM] Flash complete — virtual MCU running", "[SIM] Serial output will appear here"]);
  };

  const handleReset = () => {
    setPlacedComponents([]);
    setWires([]);
    setSelectedComponent(null);
    setSerialOutput([]);
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col bg-background">
      {/* Wokwi-style split: Code left, Simulation right */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* LEFT: Code Editor with tabs */}
        <ResizablePanel defaultSize={40} minSize={25}>
          <div className="flex h-full flex-col border-r border-border">
            {/* File tabs */}
            <div className="flex items-center border-b border-border bg-muted/30">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                <TabsList className="h-9 bg-transparent rounded-none border-0 p-0">
                  <TabsTrigger value="sketch" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs px-4 h-9">
                    sketch.ino
                  </TabsTrigger>
                  <TabsTrigger value="diagram" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs px-4 h-9">
                    diagram.json
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-1 pr-2">
                <select value={language} onChange={(e) => setLanguage(e.target.value as "cpp" | "python")} className="h-7 rounded-lg border-0 bg-muted px-2 text-[11px] text-muted-foreground">
                  <option value="cpp">C++ (Arduino)</option>
                  <option value="python">MicroPython</option>
                </select>
              </div>
            </div>
            {/* Code area */}
            <div className="flex-1 overflow-hidden">
              <CodeEditor code={code} setCode={setCode} language={language} setLanguage={setLanguage} />
            </div>
            {/* Bottom serial/GPIO */}
            <div className="h-40 border-t border-border">
              <Tabs defaultValue="serial" className="h-full flex flex-col">
                <TabsList className="mx-2 mt-1 w-fit h-7">
                  <TabsTrigger value="serial" className="text-[11px] h-6">Serial Monitor</TabsTrigger>
                  <TabsTrigger value="gpio" className="text-[11px] h-6">GPIO Matrix</TabsTrigger>
                </TabsList>
                <TabsContent value="serial" className="flex-1 m-0"><SerialMonitor output={serialOutput} setOutput={setSerialOutput} /></TabsContent>
                <TabsContent value="gpio" className="flex-1 m-0"><GPIOMatrix /></TabsContent>
              </Tabs>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />

        {/* RIGHT: Simulation viewport + component palette */}
        <ResizablePanel defaultSize={60}>
          <div className="flex h-full flex-col">
            {/* Simulation toolbar */}
            <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Simulation</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {placedComponents.length} parts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" className="h-9 w-9 rounded-full bg-neon hover:bg-neon/90" onClick={handleSimulate}>
                  <Play className="h-4 w-4 text-white" />
                </Button>
                <Button size="icon" variant="outline" className="h-9 w-9 rounded-full" onClick={() => {}}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={handleReset}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Simulation canvas */}
              <div className="flex-1">
                <Breadboard
                  placedComponents={placedComponents}
                  wires={wires}
                  setWires={setWires}
                  selectedComponent={selectedComponent}
                  setSelectedComponent={setSelectedComponent}
                  setPlacedComponents={setPlacedComponents}
                />
              </div>

              {/* Component palette - right side like Tinkercad */}
              <div className="w-56 shrink-0 border-l border-border">
                <ComponentPalette onDrop={handleDropComponent} />
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
