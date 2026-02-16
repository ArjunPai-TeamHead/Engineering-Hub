import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const connectors = [
  { name: "JST-PH 2.0", pitch: "2.0mm", pins: "2-16", voltage: "100V", current: "2A", use: "Li-Po batteries, small sensors", common: true },
  { name: "JST-XH 2.5", pitch: "2.5mm", pins: "2-20", voltage: "250V", current: "3A", use: "Battery packs, internal wiring", common: true },
  { name: "JST-SH 1.0", pitch: "1.0mm", pins: "2-20", voltage: "50V", current: "1A", use: "Qwiic/STEMMA QT (I2C)", common: true },
  { name: "Dupont 2.54", pitch: "2.54mm", pins: "1-40", voltage: "250V", current: "3A", use: "Breadboard jumpers, Arduino headers", common: true },
  { name: "Molex KK 2.54", pitch: "2.54mm", pins: "2-18", voltage: "250V", current: "4A", use: "PC fans, internal connectors", common: false },
  { name: "XT60", pitch: "N/A", pins: "2", voltage: "500V", current: "60A", use: "High-current LiPo (drones, RC)", common: false },
  { name: "Barrel Jack 5.5x2.1", pitch: "N/A", pins: "2", voltage: "12V", current: "2A", use: "Arduino power, adapters", common: true },
  { name: "Screw Terminal 5.08", pitch: "5.08mm", pins: "2-12", voltage: "300V", current: "10A", use: "Motor drivers, power supplies", common: true },
];

const ConnectorMatcher = () => (
  <div className="mx-auto max-w-3xl p-6">
    <Button variant="ghost" size="sm" asChild className="mb-4">
      <Link to="/forge"><ArrowLeft className="mr-2 h-4 w-4" />The Forge</Link>
    </Button>
    <h1 className="mb-2 text-2xl font-bold text-foreground">Connector Matcher</h1>
    <p className="mb-6 text-muted-foreground">Visual guide to common electronics connectors</p>

    <div className="space-y-3">
      {connectors.map((c) => (
        <Card key={c.name}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-mono">{c.name}</CardTitle>
              {c.common && <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">Common</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Pitch</span><span className="font-mono">{c.pitch}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pins</span><span className="font-mono">{c.pins}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Max Voltage</span><span className="font-mono">{c.voltage}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Max Current</span><span className="font-mono">{c.current}</span></div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Use: {c.use}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default ConnectorMatcher;
