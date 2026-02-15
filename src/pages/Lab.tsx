import { Cpu } from "lucide-react";

const Lab = () => (
  <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
    <div className="rounded-xl border border-border bg-card p-4 glow-primary">
      <Cpu className="h-10 w-10 text-primary" />
    </div>
    <h1 className="text-3xl font-bold text-foreground">The Lab</h1>
    <p className="max-w-md text-muted-foreground">
      Browser-based circuit simulation is coming soon. The component library and interactive breadboard are under development.
    </p>
    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
      Coming Soon
    </span>
  </div>
);

export default Lab;
