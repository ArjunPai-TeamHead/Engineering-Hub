import { useState } from "react";
import { Gauge, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PowerCalc = () => {
  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [resistance, setResistance] = useState("");

  const V = parseFloat(voltage);
  const I = parseFloat(current);
  const R = parseFloat(resistance);

  let power = NaN;
  if (!isNaN(V) && !isNaN(I)) power = V * I;
  else if (!isNaN(V) && !isNaN(R) && R > 0) power = (V * V) / R;
  else if (!isNaN(I) && !isNaN(R)) power = I * I * R;

  return (
    <div className="mx-auto max-w-xl p-6">
      <Link to="/workshop" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Workshop
      </Link>
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2"><Gauge className="h-6 w-6 text-primary" /></div>
        <h1 className="text-2xl font-bold text-foreground">Power Calculator</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Enter any two values</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Voltage (V)</Label>
            <Input type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} placeholder="e.g. 12" />
          </div>
          <div className="space-y-1.5">
            <Label>Current (A)</Label>
            <Input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="e.g. 0.5" />
          </div>
          <div className="space-y-1.5">
            <Label>Resistance (Ω)</Label>
            <Input type="number" value={resistance} onChange={(e) => setResistance(e.target.value)} placeholder="e.g. 24" />
          </div>
          {!isNaN(power) && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">Power</p>
              <p className="text-3xl font-bold font-mono text-primary">{power.toFixed(4)} W</p>
              <p className="text-xs text-muted-foreground mt-1">{(power * 1000).toFixed(2)} mW</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PowerCalc;
