import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BaseConverter = () => {
  const [input, setInput] = useState("255");
  const [base, setBase] = useState<"dec" | "hex" | "bin" | "oct">("dec");

  let decimal = 0;
  try {
    if (base === "dec") decimal = parseInt(input, 10);
    else if (base === "hex") decimal = parseInt(input, 16);
    else if (base === "bin") decimal = parseInt(input, 2);
    else if (base === "oct") decimal = parseInt(input, 8);
  } catch { decimal = NaN; }

  const valid = !isNaN(decimal) && input.trim() !== "";

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/toolbox" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Toolbox
      </Link>
      <Card>
        <CardHeader><CardTitle>Base Converter</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {(["dec", "hex", "bin", "oct"] as const).map((b) => (
              <button
                key={b}
                onClick={() => { setBase(b); setInput(""); }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${base === b ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {b.toUpperCase()}
              </button>
            ))}
          </div>
          <div>
            <Label>Input ({base.toUpperCase()})</Label>
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Enter ${base} value`} className="font-mono" />
          </div>
          {valid && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Decimal", value: decimal.toString(10) },
                { label: "Hexadecimal", value: `0x${decimal.toString(16).toUpperCase()}` },
                { label: "Binary", value: `0b${decimal.toString(2)}` },
                { label: "Octal", value: `0o${decimal.toString(8)}` },
              ].map((r) => (
                <div key={r.label} className="rounded-lg border border-border bg-muted p-3">
                  <div className="text-xs text-muted-foreground">{r.label}</div>
                  <div className="font-mono text-sm font-semibold text-foreground">{r.value}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BaseConverter;
