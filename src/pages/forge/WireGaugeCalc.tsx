import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const awgTable = [
  { gauge: 30, diameter: 0.255, resistance: 338.6, maxCurrent: 0.14 },
  { gauge: 28, diameter: 0.321, resistance: 212.9, maxCurrent: 0.23 },
  { gauge: 26, diameter: 0.405, resistance: 133.9, maxCurrent: 0.36 },
  { gauge: 24, diameter: 0.511, resistance: 84.22, maxCurrent: 0.58 },
  { gauge: 22, diameter: 0.644, resistance: 52.96, maxCurrent: 0.92 },
  { gauge: 20, diameter: 0.812, resistance: 33.31, maxCurrent: 1.46 },
  { gauge: 18, diameter: 1.024, resistance: 20.95, maxCurrent: 2.32 },
  { gauge: 16, diameter: 1.291, resistance: 13.18, maxCurrent: 3.69 },
  { gauge: 14, diameter: 1.628, resistance: 8.286, maxCurrent: 5.87 },
  { gauge: 12, diameter: 2.053, resistance: 5.211, maxCurrent: 9.33 },
  { gauge: 10, diameter: 2.588, resistance: 3.277, maxCurrent: 15.0 },
];

const WireGaugeCalc = () => {
  const [current, setCurrent] = useState("1");

  const currentVal = parseFloat(current) || 0;
  const recommended = awgTable.find((w) => w.maxCurrent >= currentVal);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/forge"><ArrowLeft className="mr-2 h-4 w-4" />The Forge</Link>
      </Button>
      <h1 className="mb-2 text-2xl font-bold text-foreground">Wire Gauge Calculator</h1>
      <p className="mb-6 text-muted-foreground">Find the right AWG wire size for your current requirements</p>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Label>Current Draw (Amps)</Label>
          <Input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className="mt-1" placeholder="1.0" />
          {recommended && (
            <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-foreground">Recommended: AWG {recommended.gauge}</p>
              <p className="text-xs text-muted-foreground">
                Diameter: {recommended.diameter}mm · Max: {recommended.maxCurrent}A · Resistance: {recommended.resistance} Ω/km
              </p>
            </div>
          )}
          {!recommended && currentVal > 0 && (
            <p className="mt-4 text-sm text-destructive">Current too high for standard hookup wire. Consider thicker gauge or multiple runs.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">AWG Reference Table</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4">AWG</th><th className="pb-2 pr-4">Ø (mm)</th><th className="pb-2 pr-4">Ω/km</th><th className="pb-2">Max A</th>
              </tr></thead>
              <tbody>
                {awgTable.map((w) => (
                  <tr key={w.gauge} className={`border-b border-border/50 ${recommended?.gauge === w.gauge ? "bg-primary/5" : ""}`}>
                    <td className="py-2 pr-4 font-mono">{w.gauge}</td>
                    <td className="py-2 pr-4 font-mono">{w.diameter}</td>
                    <td className="py-2 pr-4 font-mono">{w.resistance}</td>
                    <td className="py-2 font-mono">{w.maxCurrent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WireGaugeCalc;
