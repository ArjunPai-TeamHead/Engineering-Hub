import { useState, useCallback } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Breadboard } from "./Breadboard";
import { ComponentPalette } from "./ComponentPalette";
import { MonacoCodeEditor } from "./MonacoCodeEditor";
import { SerialMonitor } from "./SerialMonitor";
import { GPIOMatrix } from "./GPIOMatrix";
import { SerialPlotter } from "./SerialPlotter";
import { BoardSelector } from "./BoardSelector";
import {
  Play, Square, RotateCcw, Download, Upload, Share2, Settings,
  ZoomIn, ZoomOut, Undo2, Redo2, Maximize2, Bug, Wifi, WifiOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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

type SimState = "idle" | "running" | "paused" | "error";

interface BoardDef {
  id: string;
  name: string;
  mcu: string;
  clock: string;
  lang: string;
}

const BOARDS: BoardDef[] = [
  { id: "arduino-uno", name: "Arduino Uno", mcu: "ATmega328P", clock: "16 MHz", lang: "cpp" },
  { id: "arduino-mega", name: "Arduino Mega", mcu: "ATmega2560", clock: "16 MHz", lang: "cpp" },
  { id: "arduino-nano", name: "Arduino Nano", mcu: "ATmega328P", clock: "16 MHz", lang: "cpp" },
  { id: "esp32", name: "ESP32", mcu: "Xtensa LX6", clock: "240 MHz", lang: "cpp" },
  { id: "esp8266", name: "ESP8266", mcu: "Tensilica L106", clock: "80 MHz", lang: "cpp" },
  { id: "rpi-pico", name: "Raspberry Pi Pico", mcu: "RP2040", clock: "133 MHz", lang: "python" },
  { id: "rpi-pico-w", name: "Pico W", mcu: "RP2040 + CYW43", clock: "133 MHz", lang: "python" },
  { id: "stm32-blue", name: "STM32 Blue Pill", mcu: "STM32F103", clock: "72 MHz", lang: "cpp" },
  { id: "attiny85", name: "ATtiny85", mcu: "ATtiny85", clock: "8 MHz", lang: "cpp" },
  { id: "microbit", name: "micro:bit v2", mcu: "nRF52833", clock: "64 MHz", lang: "python" },
];

const DEFAULT_CPP = `void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("LED ON");
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
}
`;

const DEFAULT_PYTHON = `from machine import Pin
import time

led = Pin(25, Pin.OUT)

while True:
    led.value(1)
    print("LED ON")
    time.sleep(1)
    led.value(0)
    print("LED OFF")
    time.sleep(1)
`;

export function SimulatorWorkspace() {
  const { toast } = useToast();
  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<PlacedComponent | null>(null);
  const [board, setBoard] = useState(BOARDS[0]);
  const [language, setLanguage] = useState<"cpp" | "python">("cpp");
  const [code, setCode] = useState(DEFAULT_CPP);
  const [serialOutput, setSerialOutput] = useState<string[]>([]);
  const [simState, setSimState] = useState<SimState>("idle");
  const [bottomTab, setBottomTab] = useState("serial");
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [simTime, setSimTime] = useState(0);

  const handleBoardChange = useCallback((boardId: string) => {
    const b = BOARDS.find(x => x.id === boardId);
    if (!b) return;
    setBoard(b);
    const lang = b.lang as "cpp" | "python";
    setLanguage(lang);
    setCode(lang === "python" ? DEFAULT_PYTHON : DEFAULT_CPP);
    toast({ title: `Board: ${b.name}`, description: `${b.mcu} @ ${b.clock}` });
  }, [toast]);

  const handleDropComponent = useCallback((componentId: string, name: string, category: string, x: number, y: number) => {
    setPlacedComponents((prev) => [...prev, {
      id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      componentId, name, x, y, category,
    }]);
  }, []);

  const handleSimulate = () => {
    if (simState === "running") {
      setSimState("paused");
      setSerialOutput(p => [...p, "[SIM] Paused"]);
      return;
    }
    setSimState("running");
    setSerialOutput(p => [...p,
      `[SIM] Compiling for ${board.name} (${board.mcu})...`,
      `[SIM] Flash complete — virtual MCU running @ ${board.clock}`,
      "[SIM] Serial output active",
    ]);
    toast({ title: "⚡ Simulation Started", description: `Running on ${board.name}` });
  };

  const handleStop = () => {
    setSimState("idle");
    setSerialOutput(p => [...p, "[SIM] Stopped"]);
    setSimTime(0);
  };

  const handleReset = () => {
    setPlacedComponents([]);
    setWires([]);
    setSelectedComponent(null);
    setSerialOutput([]);
    setSimState("idle");
    setSimTime(0);
    setZoom(100);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-[calc(100vh-3rem)] flex-col bg-background">
        {/* ─── Top Toolbar ─── */}
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <BoardSelector boards={BOARDS} value={board.id} onChange={handleBoardChange} />
            <div className="h-5 w-px bg-border" />
            <Badge variant={simState === "running" ? "default" : simState === "error" ? "destructive" : "secondary"} className="text-[10px] font-mono">
              {simState === "idle" ? "Ready" : simState === "running" ? "Running" : simState === "paused" ? "Paused" : "Error"}
            </Badge>
            {simState === "running" && (
              <span className="text-[10px] text-muted-foreground font-mono">{simTime}ms</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Sim controls */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className={`h-8 w-8 rounded-lg ${simState === "running" ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"}`}
                  onClick={handleSimulate}
                >
                  {simState === "running" ? <Square className="h-3.5 w-3.5 text-white" /> : <Play className="h-3.5 w-3.5 text-white" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{simState === "running" ? "Pause" : "Start Simulation"}</TooltipContent>
            </Tooltip>

            {simState !== "idle" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg" onClick={handleStop}>
                    <Square className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop</TooltipContent>
              </Tooltip>
            )}

            <div className="h-5 w-px bg-border mx-1" />

            {/* Canvas controls */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => setZoom(z => Math.min(200, z + 10))}>
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            <span className="text-[10px] text-muted-foreground font-mono w-8 text-center">{zoom}%</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => setZoom(z => Math.max(50, z - 10))}>
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <div className="h-5 w-px bg-border mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => setWifiEnabled(w => !w)}>
                  {wifiEnabled ? <Wifi className="h-3.5 w-3.5 text-emerald-500" /> : <WifiOff className="h-3.5 w-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{wifiEnabled ? "WiFi On" : "WiFi Off"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg">
                  <Bug className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Debug Mode</TooltipContent>
            </Tooltip>

            <div className="h-5 w-px bg-border mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save Project</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg">
                  <Upload className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Load Project</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg">
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={handleReset}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset All</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* ─── Main Workspace ─── */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* LEFT: Code Editor */}
          <ResizablePanel defaultSize={38} minSize={20}>
            <div className="flex h-full flex-col">
              {/* File tabs bar */}
              <div className="flex items-center border-b border-border bg-muted/30 px-1">
                <div className="flex items-center gap-0.5 overflow-x-auto py-1">
                  <div className="flex items-center gap-1.5 rounded-md bg-background px-3 py-1 text-xs font-medium text-foreground border border-border/50">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    {language === "cpp" ? "sketch.ino" : "main.py"}
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md px-3 py-1 text-xs text-muted-foreground hover:bg-muted/50 cursor-pointer">
                    diagram.json
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md px-3 py-1 text-xs text-muted-foreground hover:bg-muted/50 cursor-pointer">
                    libraries.txt
                  </div>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 overflow-hidden">
                <MonacoCodeEditor
                  code={code}
                  setCode={setCode}
                  language={language}
                />
              </div>

              {/* Bottom diagnostic panels */}
              <div className="h-44 border-t border-border">
                <Tabs value={bottomTab} onValueChange={setBottomTab} className="h-full flex flex-col">
                  <div className="flex items-center border-b border-border bg-muted/20">
                    <TabsList className="h-8 bg-transparent rounded-none border-0 p-0 gap-0">
                      <TabsTrigger value="serial" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[11px] px-3 h-8">
                        Serial Monitor
                      </TabsTrigger>
                      <TabsTrigger value="plotter" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[11px] px-3 h-8">
                        Plotter
                      </TabsTrigger>
                      <TabsTrigger value="gpio" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[11px] px-3 h-8">
                        GPIO
                      </TabsTrigger>
                      <TabsTrigger value="debug" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[11px] px-3 h-8">
                        Debug
                      </TabsTrigger>
                    </TabsList>
                    <div className="ml-auto pr-2">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {board.mcu} • {board.clock}
                      </span>
                    </div>
                  </div>
                  <TabsContent value="serial" className="flex-1 m-0">
                    <SerialMonitor output={serialOutput} setOutput={setSerialOutput} />
                  </TabsContent>
                  <TabsContent value="plotter" className="flex-1 m-0">
                    <SerialPlotter data={serialOutput} />
                  </TabsContent>
                  <TabsContent value="gpio" className="flex-1 m-0">
                    <GPIOMatrix />
                  </TabsContent>
                  <TabsContent value="debug" className="flex-1 m-0">
                    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                      Debug console — breakpoints and variable inspection coming soon
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* RIGHT: Simulation Canvas + Component Palette */}
          <ResizablePanel defaultSize={62}>
            <div className="flex h-full flex-col">
              {/* Simulation info bar */}
              <div className="flex items-center justify-between border-b border-border px-3 py-1 bg-muted/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">Simulation</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {placedComponents.length} parts • {wires.length} wires
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Undo2 className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Redo2 className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Maximize2 className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Fullscreen</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Canvas */}
                <div className="flex-1" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}>
                  <Breadboard
                    placedComponents={placedComponents}
                    wires={wires}
                    setWires={setWires}
                    selectedComponent={selectedComponent}
                    setSelectedComponent={setSelectedComponent}
                    setPlacedComponents={setPlacedComponents}
                  />
                </div>

                {/* Component palette */}
                <div className="w-60 shrink-0 border-l border-border">
                  <ComponentPalette onDrop={handleDropComponent} />
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
}
