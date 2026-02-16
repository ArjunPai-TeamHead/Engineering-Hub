import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Hammer, Ruler, Cable, Thermometer, Wrench, Box, Cpu } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const forgeTools = [
  { icon: Ruler, title: "Mounting Hole Calculator", description: "Arduino/Pi screw hole spacing reference", path: "/forge/mounting-holes", ready: true },
  { icon: Cable, title: "Wire Gauge Calculator", description: "AWG sizing based on current draw", path: "/forge/wire-gauge", ready: true },
  { icon: Thermometer, title: "Heatsink Calculator", description: "Thermal dissipation checker", path: "/forge/heatsink", ready: true },
  { icon: Wrench, title: "Fastener Calculator", description: "M3/M4 screw sizing guide", path: "/forge/fastener", ready: true },
  { icon: Cpu, title: "Connector Matcher", description: "Visual guide to JST/Molex connectors", path: "/forge/connectors", ready: true },
  { icon: Box, title: "STL Viewer", description: "Drag & drop 3D model viewer", path: "#", ready: false },
];

const Forge = () => (
  <div className="mx-auto max-w-5xl p-6">
    <div className="mb-8 flex items-center gap-3">
      <div className="rounded-lg bg-primary/10 p-2 glow-primary">
        <Hammer className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">The Forge</h1>
        <p className="text-muted-foreground">Fabrication tools and hardware reference calculators</p>
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {forgeTools.map((tool, i) => (
        <motion.div key={tool.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          {tool.ready ? (
            <Link to={tool.path}>
              <Card className="group cursor-pointer transition-all hover:border-primary/40 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-2.5"><tool.icon className="h-5 w-5 text-primary" /></div>
                  <div>
                    <CardTitle className="text-base">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ) : (
            <Card className="opacity-60">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-lg bg-muted p-2.5"><tool.icon className="h-5 w-5 text-muted-foreground" /></div>
                <div>
                  <CardTitle className="text-base">{tool.title}</CardTitle>
                  <CardDescription>{tool.description} — Coming Soon</CardDescription>
                </div>
              </CardHeader>
            </Card>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

export default Forge;
