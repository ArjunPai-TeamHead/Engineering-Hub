import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const categories: Record<string, Record<string, number>> = {
  Length: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
  Temperature: {}, // handled separately
  Pressure: { Pa: 1, kPa: 1000, atm: 101325, psi: 6894.757, bar: 100000, mmHg: 133.322 },
};

function convertTemp(val: number, from: string, to: string): number {
  let celsius = from === "°C" ? val : from === "°F" ? (val - 32) * 5 / 9 : val - 273.15;
  return to === "°C" ? celsius : to === "°F" ? celsius * 9 / 5 + 32 : celsius + 273.15;
}

const UnitConverter = () => {
  const [cat, setCat] = useState("Length");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState("1");

  const isTemp = cat === "Temperature";
  const units = isTemp ? ["°C", "°F", "K"] : Object.keys(categories[cat]);

  const valN = parseFloat(value);
  let result: number | null = null;
  if (!isNaN(valN) && from && to) {
    if (isTemp) {
      result = convertTemp(valN, from, to);
    } else {
      const factors = categories[cat];
      if (factors[from] && factors[to]) result = (valN * factors[from]) / factors[to];
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/toolbox" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Toolbox
      </Link>
      <Card>
        <CardHeader><CardTitle>Unit Converter</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {Object.keys(categories).map((c) => (
              <button key={c} onClick={() => { setCat(c); setFrom(""); setTo(""); }} className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>Value</Label><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} /></div>
            <div>
              <Label>From</Label>
              <Select value={from} onValueChange={setFrom}><SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger><SelectContent>{units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select>
            </div>
            <div>
              <Label>To</Label>
              <Select value={to} onValueChange={setTo}><SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger><SelectContent>{units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          {result !== null && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
              <div className="text-sm text-muted-foreground">{value} {from} =</div>
              <div className="text-3xl font-bold text-primary">{result.toFixed(6)} {to}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitConverter;
