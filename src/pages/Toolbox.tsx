import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Palette,
  Calculator,
  Zap,
  Lightbulb,
  Battery,
  Timer,
  Binary,
  Table2,
  Ruler,
  Regex,
  CircuitBoard,
} from "lucide-react";

const tools = [
  { icon: Palette, title: "Resistor Color Code", description: "Visual band-to-value calculator", path: "/toolbox/resistor" },
  { icon: Calculator, title: "Ohm's Law", description: "Calculate V, I, R, and P", path: "/toolbox/ohms-law" },
  { icon: Zap, title: "Voltage Divider", description: "Output voltage from two resistors", path: "/toolbox/voltage-divider" },
  { icon: Lightbulb, title: "LED Resistor", description: "Series resistor for LEDs", path: "/toolbox/led-resistor" },
  { icon: Battery, title: "Battery Life", description: "Estimate runtime from capacity", path: "/toolbox/battery-life" },
  { icon: Timer, title: "555 Timer", description: "Frequency and duty cycle calculator", path: "/toolbox/555-timer" },
  { icon: Binary, title: "Base Converter", description: "Hex / Binary / Decimal / Octal", path: "/toolbox/base-converter" },
  { icon: Table2, title: "ASCII Table", description: "Full ASCII reference", path: "/toolbox/ascii-table" },
  { icon: Ruler, title: "Unit Converter", description: "Length, temperature, pressure", path: "/toolbox/unit-converter" },
  { icon: Regex, title: "Regex Tester", description: "Test patterns for serial parsing", path: "/toolbox/regex-tester" },
  { icon: CircuitBoard, title: "PCB Trace Width", description: "IPC-2221 trace width calculator", path: "/toolbox/trace-width" },
];

const Toolbox = () => (
  <div className="mx-auto max-w-5xl p-6">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground">The Toolbox</h1>
      <p className="mt-2 text-muted-foreground">Essential engineering calculators and utilities.</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, i) => (
        <motion.div key={tool.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
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
        </motion.div>
      ))}
    </div>
  </div>
);

export default Toolbox;
