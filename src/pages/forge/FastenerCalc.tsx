import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const fasteners = [
  { size: "M2", diameter: "2.0mm", headDia: "3.8mm", holeClearance: "2.4mm", tapDrill: "1.6mm", commonUse: "Raspberry Pi Pico, small PCBs" },
  { size: "M2.5", diameter: "2.5mm", headDia: "4.5mm", holeClearance: "2.9mm", tapDrill: "2.05mm", commonUse: "Raspberry Pi 4, most SBCs" },
  { size: "M3", diameter: "3.0mm", headDia: "5.5mm", holeClearance: "3.4mm", tapDrill: "2.5mm", commonUse: "Arduino Uno/Mega, enclosures" },
  { size: "M4", diameter: "4.0mm", headDia: "7.0mm", holeClearance: "4.5mm", tapDrill: "3.3mm", commonUse: "Large enclosures, motors" },
  { size: "M5", diameter: "5.0mm", headDia: "8.5mm", holeClearance: "5.5mm", tapDrill: "4.2mm", commonUse: "Heavy-duty mounting" },
];

const FastenerCalc = () => (
  <div className="mx-auto max-w-3xl p-6">
    <Button variant="ghost" size="sm" asChild className="mb-4">
      <Link to="/forge"><ArrowLeft className="mr-2 h-4 w-4" />The Forge</Link>
    </Button>
    <h1 className="mb-2 text-2xl font-bold text-foreground">Fastener Calculator</h1>
    <p className="mb-6 text-muted-foreground">Metric screw sizing reference for electronics enclosures</p>

    <div className="space-y-3">
      {fasteners.map((f) => (
        <Card key={f.size}>
          <CardHeader className="pb-2"><CardTitle className="text-base font-mono">{f.size}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Diameter</span><span className="font-mono">{f.diameter}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Head Ø</span><span className="font-mono">{f.headDia}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Clearance Hole</span><span className="font-mono">{f.holeClearance}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tap Drill</span><span className="font-mono">{f.tapDrill}</span></div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Common use: {f.commonUse}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default FastenerCalc;
