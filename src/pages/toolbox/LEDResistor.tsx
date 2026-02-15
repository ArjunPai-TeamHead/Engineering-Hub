import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const LEDResistor = () => {
  const [vs, setVs] = useState("5");
  const [vf, setVf] = useState("2");
  const [iLed, setILed] = useState("20");

  const vsN = parseFloat(vs);
  const vfN = parseFloat(vf);
  const iN = parseFloat(iLed) / 1000;
  const r = !isNaN(vsN) && !isNaN(vfN) && !isNaN(iN) && iN > 0 ? (vsN - vfN) / iN : null;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/toolbox" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Toolbox
      </Link>
      <Card>
        <CardHeader><CardTitle>LED Series Resistor Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">R = (Vs - Vf) / I</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Supply Voltage (V)</Label><Input type="number" value={vs} onChange={(e) => setVs(e.target.value)} /></div>
            <div><Label>LED Forward Voltage (V)</Label><Input type="number" value={vf} onChange={(e) => setVf(e.target.value)} /></div>
            <div><Label>LED Current (mA)</Label><Input type="number" value={iLed} onChange={(e) => setILed(e.target.value)} /></div>
          </div>
          {r !== null && r > 0 && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
              <div className="text-sm text-muted-foreground">Required Resistor</div>
              <div className="text-3xl font-bold text-primary">{r.toFixed(1)} Ω</div>
              <div className="text-sm text-muted-foreground">Power: {((vsN - vfN) * iN * 1000).toFixed(1)} mW</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LEDResistor;
