import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const colorMap: Record<string, { hex: string; value: number; multiplier?: number; tolerance?: string }> = {
  Black:  { hex: "#000000", value: 0, multiplier: 1 },
  Brown:  { hex: "#8B4513", value: 1, multiplier: 10, tolerance: "±1%" },
  Red:    { hex: "#FF0000", value: 2, multiplier: 100, tolerance: "±2%" },
  Orange: { hex: "#FF8C00", value: 3, multiplier: 1e3 },
  Yellow: { hex: "#FFD700", value: 4, multiplier: 1e4 },
  Green:  { hex: "#228B22", value: 5, multiplier: 1e5, tolerance: "±0.5%" },
  Blue:   { hex: "#0000FF", value: 6, multiplier: 1e6, tolerance: "±0.25%" },
  Violet: { hex: "#8B00FF", value: 7, multiplier: 1e7, tolerance: "±0.1%" },
  Grey:   { hex: "#808080", value: 8, multiplier: 1e8, tolerance: "±0.05%" },
  White:  { hex: "#FFFFFF", value: 9, multiplier: 1e9 },
  Gold:   { hex: "#FFD700", value: -1, multiplier: 0.1, tolerance: "±5%" },
  Silver: { hex: "#C0C0C0", value: -1, multiplier: 0.01, tolerance: "±10%" },
};

const bandColors = Object.keys(colorMap).filter((c) => colorMap[c].value >= 0);
const multiplierColors = Object.keys(colorMap).filter((c) => colorMap[c].multiplier !== undefined);
const toleranceColors = Object.keys(colorMap).filter((c) => colorMap[c].tolerance !== undefined);

function formatResistance(ohms: number): string {
  if (ohms >= 1e6) return `${(ohms / 1e6).toFixed(ohms % 1e6 === 0 ? 0 : 2)} MΩ`;
  if (ohms >= 1e3) return `${(ohms / 1e3).toFixed(ohms % 1e3 === 0 ? 0 : 2)} kΩ`;
  return `${ohms} Ω`;
}

const ResistorCalculator = () => {
  const [band1, setBand1] = useState("Brown");
  const [band2, setBand2] = useState("Black");
  const [band3, setBand3] = useState("Red");
  const [bandTol, setBandTol] = useState("Gold");

  const value =
    (colorMap[band1].value * 10 + colorMap[band2].value) *
    (colorMap[band3].multiplier ?? 1);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/toolbox" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Toolbox
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Resistor Color Code Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual resistor */}
          <div className="flex items-center justify-center gap-1 rounded-lg bg-muted p-6">
            <div className="h-6 w-16 rounded-l-full bg-muted-foreground/20" />
            {[band1, band2, band3, bandTol].map((b, i) => (
              <div key={i} className="h-10 w-5 border border-foreground/10" style={{ backgroundColor: colorMap[b]?.hex }} />
            ))}
            <div className="h-6 w-16 rounded-r-full bg-muted-foreground/20" />
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Band 1", value: band1, onChange: setBand1, options: bandColors },
              { label: "Band 2", value: band2, onChange: setBand2, options: bandColors },
              { label: "Multiplier", value: band3, onChange: setBand3, options: multiplierColors },
              { label: "Tolerance", value: bandTol, onChange: setBandTol, options: toleranceColors },
            ].map((s) => (
              <div key={s.label}>
                <Label className="mb-2 block text-xs">{s.label}</Label>
                <Select value={s.value} onValueChange={s.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {s.options.map((c) => (
                      <SelectItem key={c} value={c}>
                        <span className="inline-block h-3 w-3 rounded-full mr-2 border" style={{ backgroundColor: colorMap[c].hex }} />
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
            <div className="text-sm text-muted-foreground">Resistance</div>
            <div className="text-3xl font-bold text-primary">{formatResistance(value)}</div>
            <div className="text-sm text-muted-foreground">{colorMap[bandTol].tolerance}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResistorCalculator;
