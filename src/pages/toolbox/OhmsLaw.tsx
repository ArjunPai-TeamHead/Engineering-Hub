import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const OhmsLaw = () => {
  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [resistance, setResistance] = useState("");

  const v = parseFloat(voltage);
  const i = parseFloat(current);
  const r = parseFloat(resistance);

  const results: { label: string; value: string }[] = [];
  if (!isNaN(v) && !isNaN(i)) results.push({ label: "Resistance", value: `${(v / i).toFixed(4)} Ω` }, { label: "Power", value: `${(v * i).toFixed(4)} W` });
  if (!isNaN(v) && !isNaN(r)) results.push({ label: "Current", value: `${(v / r * 1000).toFixed(4)} mA` }, { label: "Power", value: `${(v * v / r).toFixed(4)} W` });
  if (!isNaN(i) && !isNaN(r)) results.push({ label: "Voltage", value: `${(i * r).toFixed(4)} V` }, { label: "Power", value: `${(i * i * r).toFixed(4)} W` });

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/toolbox" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Toolbox
      </Link>
      <Card>
        <CardHeader><CardTitle>Ohm's Law Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Enter any two values to calculate the rest.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Voltage (V)</Label><Input type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} placeholder="V" /></div>
            <div><Label>Current (A)</Label><Input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="A" /></div>
            <div><Label>Resistance (Ω)</Label><Input type="number" value={resistance} onChange={(e) => setResistance(e.target.value)} placeholder="Ω" /></div>
          </div>
          {results.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((r, i) => (
                <div key={i} className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-center">
                  <div className="text-xs text-muted-foreground">{r.label}</div>
                  <div className="text-xl font-bold text-primary">{r.value}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OhmsLaw;
