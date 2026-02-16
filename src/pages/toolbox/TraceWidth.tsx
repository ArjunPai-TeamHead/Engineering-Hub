import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TraceWidth = () => {
  const [current, setCurrent] = useState("1");
  const [thickness, setThickness] = useState("1"); // oz/ft²
  const [tempRise, setTempRise] = useState("10");
  const [isExternal, setIsExternal] = useState(true);

  const I = parseFloat(current) || 0;
  const t = parseFloat(thickness) || 1;
  const dT = parseFloat(tempRise) || 10;

  // IPC-2221 formula: A = (I / (k * dT^0.44))^(1/0.725)
  const k = isExternal ? 0.048 : 0.024;
  const area = I > 0 && dT > 0 ? Math.pow(I / (k * Math.pow(dT, 0.44)), 1 / 0.725) : 0;
  const thicknessMils = t * 1.378; // 1 oz = 1.378 mils
  const widthMils = thicknessMils > 0 ? area / thicknessMils : 0;
  const widthMm = widthMils * 0.0254;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/toolbox"><ArrowLeft className="mr-2 h-4 w-4" />Toolbox</Link>
      </Button>
      <h1 className="mb-2 text-2xl font-bold text-foreground">PCB Trace Width Calculator</h1>
      <p className="mb-6 text-muted-foreground">IPC-2221 standard trace width calculation</p>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Current (A)</Label><Input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className="mt-1" /></div>
            <div><Label>Copper Thickness (oz/ft²)</Label><Input type="number" value={thickness} onChange={(e) => setThickness(e.target.value)} className="mt-1" /></div>
            <div><Label>Temp Rise (°C)</Label><Input type="number" value={tempRise} onChange={(e) => setTempRise(e.target.value)} className="mt-1" /></div>
            <div>
              <Label>Layer</Label>
              <div className="mt-1 flex gap-2">
                <button onClick={() => setIsExternal(true)} className={`rounded-md border px-3 py-2 text-sm ${isExternal ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>External</button>
                <button onClick={() => setIsExternal(false)} className={`rounded-md border px-3 py-2 text-sm ${!isExternal ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>Internal</button>
              </div>
            </div>
          </div>

          {I > 0 && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Cross-Section Area</span><span className="font-mono">{area.toFixed(2)} mil²</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Required Width</span><span className="font-mono text-lg font-bold text-primary">{widthMils.toFixed(1)} mil ({widthMm.toFixed(2)} mm)</span></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TraceWidth;
