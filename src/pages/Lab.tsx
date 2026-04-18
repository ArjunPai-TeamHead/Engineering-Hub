import { Cpu, ExternalLink, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Lab = () => (
  <div className="mx-auto max-w-3xl p-6">
    <div className="mb-6 flex items-center gap-3">
      <div className="rounded-2xl bg-emerald-500/10 p-2.5">
        <Cpu className="h-6 w-6 text-emerald-500" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">The Lab</h1>
        <p className="text-muted-foreground">Browser-based circuit simulation</p>
      </div>
    </div>

    <Card className="ios-card border-dashed">
      <CardContent className="py-16 flex flex-col items-center text-center gap-4">
        <div className="rounded-3xl bg-emerald-500/10 p-6">
          <Wrench className="h-12 w-12 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">Simulator Coming Soon</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            We're integrating a powerful in-browser circuit simulator for Arduino, ESP32, and Raspberry Pi.
            In the meantime, you can use Wokwi for a similar experience.
          </p>
        </div>
        <Button asChild className="rounded-2xl gap-2 mt-2">
          <a href="https://wokwi.com" target="_blank" rel="noopener noreferrer">
            Open Wokwi <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default Lab;
