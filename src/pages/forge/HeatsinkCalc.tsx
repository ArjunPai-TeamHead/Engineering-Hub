import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const HeatsinkCalc = () => {
  const [power, setPower] = useState("2");
  const [tJunction, setTJunction] = useState("150");
  const [tAmbient, setTAmbient] = useState("25");
  const [thetaJC, setThetaJC] = useState("5");

  const p = parseFloat(power) || 0;
  const tj = parseFloat(tJunction) || 150;
  const ta = parseFloat(tAmbient) || 25;
  const rjc = parseFloat(thetaJC) || 0;

  const totalThermalBudget = p > 0 ? (tj - ta) / p : 0;
  const heatsinkRequired = totalThermalBudget - rjc;
  const needsHeatsink = heatsinkRequired < 50;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/forge"><ArrowLeft className="mr-2 h-4 w-4" />The Forge</Link>
      </Button>
      <h1 className="mb-2 text-2xl font-bold text-foreground">Heatsink Calculator</h1>
      <p className="mb-6 text-muted-foreground">Determine if your component needs a heatsink and what thermal resistance is required</p>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Power Dissipation (W)</Label><Input type="number" value={power} onChange={(e) => setPower(e.target.value)} className="mt-1" /></div>
            <div><Label>Max Junction Temp (°C)</Label><Input type="number" value={tJunction} onChange={(e) => setTJunction(e.target.value)} className="mt-1" /></div>
            <div><Label>Ambient Temperature (°C)</Label><Input type="number" value={tAmbient} onChange={(e) => setTAmbient(e.target.value)} className="mt-1" /></div>
            <div><Label>θ Junction-Case (°C/W)</Label><Input type="number" value={thetaJC} onChange={(e) => setThetaJC(e.target.value)} className="mt-1" /></div>
          </div>

          {p > 0 && (
            <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Thermal Budget</span><span className="font-mono text-foreground">{totalThermalBudget.toFixed(1)} °C/W</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Required Heatsink θ</span><span className="font-mono text-foreground">{heatsinkRequired.toFixed(1)} °C/W</span></div>
              <div className={`mt-2 rounded-md p-3 text-sm font-medium ${needsHeatsink ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                {needsHeatsink
                  ? `Heatsink required — select one with θ ≤ ${heatsinkRequired.toFixed(1)} °C/W`
                  : "No heatsink needed — natural convection is sufficient"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatsinkCalc;
