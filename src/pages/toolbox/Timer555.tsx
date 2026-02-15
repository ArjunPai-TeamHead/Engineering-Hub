import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Timer555 = () => {
  const [r1, setR1] = useState("10000");
  const [r2, setR2] = useState("10000");
  const [c, setC] = useState("10");

  const r1N = parseFloat(r1);
  const r2N = parseFloat(r2);
  const cN = parseFloat(c) * 1e-6; // µF to F

  const tHigh = !isNaN(r1N) && !isNaN(r2N) && !isNaN(cN) ? 0.693 * (r1N + r2N) * cN : null;
  const tLow = !isNaN(r2N) && !isNaN(cN) ? 0.693 * r2N * cN : null;
  const freq = tHigh !== null && tLow !== null && (tHigh + tLow) > 0 ? 1 / (tHigh + tLow) : null;
  const duty = tHigh !== null && tLow !== null && (tHigh + tLow) > 0 ? (tHigh / (tHigh + tLow)) * 100 : null;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/toolbox" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Toolbox
      </Link>
      <Card>
        <CardHeader><CardTitle>555 Timer Calculator (Astable)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>R1 (Ω)</Label><Input type="number" value={r1} onChange={(e) => setR1(e.target.value)} /></div>
            <div><Label>R2 (Ω)</Label><Input type="number" value={r2} onChange={(e) => setR2(e.target.value)} /></div>
            <div><Label>C (µF)</Label><Input type="number" value={c} onChange={(e) => setC(e.target.value)} /></div>
          </div>
          {freq !== null && duty !== null && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-center">
                <div className="text-xs text-muted-foreground">Frequency</div>
                <div className="text-xl font-bold text-primary">{freq >= 1000 ? `${(freq / 1000).toFixed(2)} kHz` : `${freq.toFixed(2)} Hz`}</div>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-center">
                <div className="text-xs text-muted-foreground">Duty Cycle</div>
                <div className="text-xl font-bold text-primary">{duty.toFixed(1)}%</div>
              </div>
              <div className="rounded-lg border border-border bg-muted p-3 text-center">
                <div className="text-xs text-muted-foreground">T High</div>
                <div className="font-mono text-sm">{(tHigh! * 1000).toFixed(3)} ms</div>
              </div>
              <div className="rounded-lg border border-border bg-muted p-3 text-center">
                <div className="text-xs text-muted-foreground">T Low</div>
                <div className="font-mono text-sm">{(tLow! * 1000).toFixed(3)} ms</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Timer555;
