import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wrench, Hammer, Palette, Calculator, Zap, Lightbulb, Battery, Timer,
  Binary, Table2, Ruler, Regex, CircuitBoard, Cable, Thermometer, Box, Cpu,
  Gauge, Disc, Volume2, Radio,
} from "lucide-react";

const calculatorTools = [
  { icon: Palette, title: "Resistor Color Code", description: "Visual band-to-value calculator", path: "/workshop/resistor" },
  { icon: Calculator, title: "Ohm's Law", description: "Calculate V, I, R, and P", path: "/workshop/ohms-law" },
  { icon: Zap, title: "Voltage Divider", description: "Output voltage from two resistors", path: "/workshop/voltage-divider" },
  { icon: Lightbulb, title: "LED Resistor", description: "Series resistor for LEDs", path: "/workshop/led-resistor" },
  { icon: Battery, title: "Battery Life", description: "Estimate runtime from capacity", path: "/workshop/battery-life" },
  { icon: Timer, title: "555 Timer", description: "Frequency and duty cycle calculator", path: "/workshop/555-timer" },
  { icon: Binary, title: "Base Converter", description: "Hex / Binary / Decimal / Octal", path: "/workshop/base-converter" },
  { icon: Table2, title: "ASCII Table", description: "Full ASCII reference", path: "/workshop/ascii-table" },
  { icon: Ruler, title: "Unit Converter", description: "Length, temperature, pressure", path: "/workshop/unit-converter" },
  { icon: Regex, title: "Regex Tester", description: "Test patterns for serial parsing", path: "/workshop/regex-tester" },
  { icon: CircuitBoard, title: "PCB Trace Width", description: "IPC-2221 trace width calculator", path: "/workshop/trace-width" },
  { icon: Gauge, title: "Power Calculator", description: "Wattage from voltage and current", path: "/workshop/power-calc" },
  { icon: Disc, title: "Capacitor Code", description: "Decode ceramic capacitor markings", path: "/workshop/capacitor-code" },
  { icon: Volume2, title: "Decibel Calculator", description: "Power/voltage ratio to dB", path: "/workshop/decibel-calc" },
  { icon: Radio, title: "Frequency Calculator", description: "Frequency, wavelength, period", path: "/workshop/frequency-calc" },
];

const fabricationTools = [
  { icon: Ruler, title: "Mounting Hole Calculator", description: "Arduino/Pi screw hole spacing reference", path: "/workshop/mounting-holes" },
  { icon: Cable, title: "Wire Gauge Calculator", description: "AWG sizing based on current draw", path: "/workshop/wire-gauge" },
  { icon: Thermometer, title: "Heatsink Calculator", description: "Thermal dissipation checker", path: "/workshop/heatsink" },
  { icon: Wrench, title: "Fastener Calculator", description: "M3/M4 screw sizing guide", path: "/workshop/fastener" },
  { icon: Cpu, title: "Connector Matcher", description: "Visual guide to JST/Molex connectors", path: "/workshop/connectors" },
  { icon: Box, title: "STL Viewer", description: "Drag & drop 3D model viewer — Coming Soon", path: "#", disabled: true },
];

const ToolGrid = ({ tools }: { tools: typeof calculatorTools }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {tools.map((tool, i) => (
      <motion.div key={tool.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
        {'disabled' in tool && tool.disabled ? (
          <Card className="opacity-50">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="rounded-lg bg-muted p-2.5"><tool.icon className="h-5 w-5 text-muted-foreground" /></div>
              <div>
                <CardTitle className="text-base">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <Link to={tool.path}>
            <Card className="group cursor-pointer transition-all hover:border-primary/40 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2.5 transition-shadow group-hover:glow-primary">
                  <tool.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        )}
      </motion.div>
    ))}
  </div>
);

const Workshop = () => (
  <div className="mx-auto max-w-5xl p-6">
    <div className="mb-6 flex items-center gap-3">
      <div className="rounded-lg bg-primary/10 p-2 glow-primary">
        <Wrench className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">The Workshop</h1>
        <p className="text-muted-foreground">Calculators, fabrication tools, and engineering utilities</p>
      </div>
    </div>

    <Tabs defaultValue="calculators">
      <TabsList className="mb-6">
        <TabsTrigger value="calculators"><Calculator className="h-4 w-4 mr-1" /> Calculators ({calculatorTools.length})</TabsTrigger>
        <TabsTrigger value="fabrication"><Hammer className="h-4 w-4 mr-1" /> Fabrication ({fabricationTools.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="calculators"><ToolGrid tools={calculatorTools} /></TabsContent>
      <TabsContent value="fabrication"><ToolGrid tools={fabricationTools} /></TabsContent>
    </Tabs>
  </div>
);

export default Workshop;
