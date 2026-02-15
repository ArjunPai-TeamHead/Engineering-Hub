import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RegexTester = () => {
  const [pattern, setPattern] = useState("\\d+");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Sensor reading: 42.5°C at pin A0, 1023 raw");

  let matches: RegExpMatchArray[] = [];
  let error = "";
  try {
    const re = new RegExp(pattern, flags);
    matches = [...text.matchAll(re)];
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/toolbox" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Toolbox
      </Link>
      <Card>
        <CardHeader><CardTitle>Regex Tester</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_80px]">
            <div><Label>Pattern</Label><Input value={pattern} onChange={(e) => setPattern(e.target.value)} className="font-mono" placeholder="\\d+" /></div>
            <div><Label>Flags</Label><Input value={flags} onChange={(e) => setFlags(e.target.value)} className="font-mono" placeholder="g" /></div>
          </div>
          <div><Label>Test String</Label><Textarea value={text} onChange={(e) => setText(e.target.value)} className="font-mono" rows={3} /></div>
          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">{matches.length} match{matches.length !== 1 ? "es" : ""}</div>
              {matches.map((m, i) => (
                <div key={i} className="rounded border border-border bg-muted p-2 font-mono text-sm">
                  <span className="text-primary font-semibold">{m[0]}</span>
                  <span className="ml-2 text-xs text-muted-foreground">index {m.index}</span>
                  {m.length > 1 && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      Groups: {m.slice(1).map((g, j) => <span key={j} className="ml-1 rounded bg-primary/10 px-1">{g ?? "undefined"}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegexTester;
