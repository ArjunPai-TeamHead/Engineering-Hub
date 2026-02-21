import { useState } from "react";
import { Radio, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const C = 299792458; // speed of light m/s

const formatSI = (val: number, unit: string) => {
  if (val >= 1e9) return `${(val / 1e9).toFixed(4)} G${unit}`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(4)} M${unit}`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(4)} k${unit}`;
  if (val >= 1) return `${val.toFixed(4)} ${unit}`;
  if (val >= 1e-3) return `${(val * 1e3).toFixed(4)} m${unit}`;
  if (val >= 1e-6) return `${(val * 1e6).toFixed(4)} µ${unit}`;
  if (val >= 1e-9) return `${(val * 1e9).toFixed(4)} n${unit}`;
  return `${val.toExponential(4)} ${unit}`;
};

const FrequencyCalc = () => {
  const [freq, setFreq] = useState("");
  const [wavelength, setWavelength] = useState("");
  const [period, setPeriod] = useState("");

  const f = parseFloat(freq);
  const w = parseFloat(wavelength);
  const t = parseFloat(period);

  let results: { frequency: string; wavelength: string; period: string } | null = null;

  if (!isNaN(f) && f > 0) {
    results = { frequency: formatSI(f, "Hz"), wavelength: formatSI(C / f, "m"), period: formatSI(1 / f, "s") };
  } else if (!isNaN(w) && w > 0) {
    const fCalc = C / w;
    results = { frequency: formatSI(fCalc, "Hz"), wavelength: formatSI(w, "m"), period: formatSI(1 / fCalc, "s") };
  } else if (!isNaN(t) && t > 0) {
    const fCalc = 1 / t;
    results = { frequency: formatSI(fCalc, "Hz"), wavelength: formatSI(C / fCalc, "m"), period: formatSI(t, "s") };
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <Link to="/workshop" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Workshop
      </Link>
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2"><Radio className="h-6 w-6 text-primary" /></div>
        <h1 className="text-2xl font-bold text-foreground">Frequency / Wavelength Calculator</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Enter any one value</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Frequency (Hz)</Label>
            <Input type="number" value={freq} onChange={(e) => { setFreq(e.target.value); setWavelength(""); setPeriod(""); }} placeholder="e.g. 2400000000" />
          </div>
          <div className="space-y-1.5">
            <Label>Wavelength (m)</Label>
            <Input type="number" value={wavelength} onChange={(e) => { setWavelength(e.target.value); setFreq(""); setPeriod(""); }} placeholder="e.g. 0.125" />
          </div>
          <div className="space-y-1.5">
            <Label>Period (s)</Label>
            <Input type="number" value={period} onChange={(e) => { setPeriod(e.target.value); setFreq(""); setWavelength(""); }} placeholder="e.g. 0.001" />
          </div>
          {results && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
              <p className="text-sm"><span className="text-muted-foreground">Frequency:</span> <span className="font-mono font-bold text-primary">{results.frequency}</span></p>
              <p className="text-sm"><span className="text-muted-foreground">Wavelength:</span> <span className="font-mono font-bold text-primary">{results.wavelength}</span></p>
              <p className="text-sm"><span className="text-muted-foreground">Period:</span> <span className="font-mono font-bold text-primary">{results.period}</span></p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FrequencyCalc;
