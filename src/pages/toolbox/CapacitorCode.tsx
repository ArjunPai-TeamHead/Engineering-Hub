import { useState } from "react";
import { Disc, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const toleranceCodes: Record<string, string> = {
  J: "±5%", K: "±10%", M: "±20%", Z: "+80%/-20%",
};

const CapacitorCode = () => {
  const [code, setCode] = useState("");

  let result = "";
  const cleaned = code.trim().toUpperCase();
  if (cleaned.length >= 3) {
    const digits = cleaned.slice(0, 2);
    const multiplier = parseInt(cleaned[2]);
    const tolChar = cleaned[3] || "";
    if (!isNaN(parseInt(digits)) && !isNaN(multiplier)) {
      const pF = parseInt(digits) * Math.pow(10, multiplier);
      const tolerance = toleranceCodes[tolChar] || "";
      if (pF >= 1e6) result = `${(pF / 1e6).toFixed(2)} µF ${tolerance}`;
      else if (pF >= 1e3) result = `${(pF / 1e3).toFixed(1)} nF ${tolerance}`;
      else result = `${pF} pF ${tolerance}`;
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <Link to="/workshop" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Workshop
      </Link>
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2"><Disc className="h-6 w-6 text-primary" /></div>
        <h1 className="text-2xl font-bold text-foreground">Capacitor Code Calculator</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Enter capacitor marking</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Code (e.g. 104, 473K)</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="104" className="font-mono text-lg" />
          </div>
          {result && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">Capacitance</p>
              <p className="text-3xl font-bold font-mono text-primary">{result}</p>
            </div>
          )}
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Format:</strong> First 2 digits = significant, 3rd digit = multiplier (10^n pF)</p>
            <p><strong>Example:</strong> 104 = 10 × 10⁴ pF = 100 nF = 0.1 µF</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CapacitorCode;
