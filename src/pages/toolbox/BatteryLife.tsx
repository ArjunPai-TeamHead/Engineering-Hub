import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BatteryLife = () => {
  const [capacity, setCapacity] = useState("2000");
  const [current, setCurrent] = useState("100");

  const cap = parseFloat(capacity);
  const cur = parseFloat(current);
  const hours = !isNaN(cap) && !isNaN(cur) && cur > 0 ? cap / cur : null;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/toolbox" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Toolbox
      </Link>
      <Card>
        <CardHeader><CardTitle>Battery Life Estimator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Battery Capacity (mAh)</Label><Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} /></div>
            <div><Label>Average Current Draw (mA)</Label><Input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} /></div>
          </div>
          {hours !== null && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
              <div className="text-sm text-muted-foreground">Estimated Battery Life</div>
              <div className="text-3xl font-bold text-primary">{hours.toFixed(1)} hours</div>
              <div className="text-sm text-muted-foreground">{(hours / 24).toFixed(1)} days</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BatteryLife;
