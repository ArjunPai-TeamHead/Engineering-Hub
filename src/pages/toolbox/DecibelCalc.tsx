import { useState } from "react";
import { Volume2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DecibelCalc = () => {
  const [powerIn, setPowerIn] = useState("");
  const [powerOut, setPowerOut] = useState("");
  const [voltIn, setVoltIn] = useState("");
  const [voltOut, setVoltOut] = useState("");
  const [dbVal, setDbVal] = useState("");

  const Pi = parseFloat(powerIn), Po = parseFloat(powerOut);
  const Vi = parseFloat(voltIn), Vo = parseFloat(voltOut);
  const dB = parseFloat(dbVal);

  const powerDb = !isNaN(Pi) && !isNaN(Po) && Pi > 0 ? 10 * Math.log10(Po / Pi) : NaN;
  const voltDb = !isNaN(Vi) && !isNaN(Vo) && Vi > 0 ? 20 * Math.log10(Vo / Vi) : NaN;
  const powerRatio = !isNaN(dB) ? Math.pow(10, dB / 10) : NaN;
  const voltRatio = !isNaN(dB) ? Math.pow(10, dB / 20) : NaN;

  return (
    <div className="mx-auto max-w-xl p-6">
      <Link to="/workshop" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Workshop
      </Link>
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2"><Volume2 className="h-6 w-6 text-primary" /></div>
        <h1 className="text-2xl font-bold text-foreground">Decibel Calculator</h1>
      </div>

      <Tabs defaultValue="ratio-to-db">
        <TabsList className="mb-4">
          <TabsTrigger value="ratio-to-db">Ratio → dB</TabsTrigger>
          <TabsTrigger value="db-to-ratio">dB → Ratio</TabsTrigger>
        </TabsList>

        <TabsContent value="ratio-to-db">
          <Card>
            <CardHeader><CardTitle className="text-base">Power Ratio</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>P₁ (input)</Label><Input type="number" value={powerIn} onChange={(e) => setPowerIn(e.target.value)} /></div>
                <div><Label>P₂ (output)</Label><Input type="number" value={powerOut} onChange={(e) => setPowerOut(e.target.value)} /></div>
              </div>
              {!isNaN(powerDb) && <p className="text-center font-mono text-xl text-primary font-bold">{powerDb.toFixed(3)} dB</p>}
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader><CardTitle className="text-base">Voltage Ratio</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>V₁ (input)</Label><Input type="number" value={voltIn} onChange={(e) => setVoltIn(e.target.value)} /></div>
                <div><Label>V₂ (output)</Label><Input type="number" value={voltOut} onChange={(e) => setVoltOut(e.target.value)} /></div>
              </div>
              {!isNaN(voltDb) && <p className="text-center font-mono text-xl text-primary font-bold">{voltDb.toFixed(3)} dB</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="db-to-ratio">
          <Card>
            <CardHeader><CardTitle className="text-base">dB to Ratio</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Decibels (dB)</Label><Input type="number" value={dbVal} onChange={(e) => setDbVal(e.target.value)} /></div>
              {!isNaN(powerRatio) && (
                <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <p className="text-sm text-muted-foreground">Power ratio: <span className="font-mono font-bold text-primary">{powerRatio.toFixed(4)}</span></p>
                  <p className="text-sm text-muted-foreground">Voltage ratio: <span className="font-mono font-bold text-primary">{voltRatio.toFixed(4)}</span></p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DecibelCalc;
