import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const VoltageDivider = () => {
  const [vin, setVin] = useState("5");
  const [r1, setR1] = useState("10000");
  const [r2, setR2] = useState("10000");

  const vinN = parseFloat(vin);
  const r1N = parseFloat(r1);
  const r2N = parseFloat(r2);
  const vout = !isNaN(vinN) && !isNaN(r1N) && !isNaN(r2N) && (r1N + r2N) > 0
    ? (vinN * r2N) / (r1N + r2N) : null;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/toolbox" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Toolbox
      </Link>
      <Card>
        <CardHeader><CardTitle>Voltage Divider Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Vout = Vin × R2 / (R1 + R2)</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Vin (V)</Label><Input type="number" value={vin} onChange={(e) => setVin(e.target.value)} /></div>
            <div><Label>R1 (Ω)</Label><Input type="number" value={r1} onChange={(e) => setR1(e.target.value)} /></div>
            <div><Label>R2 (Ω)</Label><Input type="number" value={r2} onChange={(e) => setR2(e.target.value)} /></div>
          </div>
          {vout !== null && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
              <div className="text-sm text-muted-foreground">Output Voltage</div>
              <div className="text-3xl font-bold text-primary">{vout.toFixed(4)} V</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoltageDivider;
