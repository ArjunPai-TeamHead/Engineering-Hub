import { BrainCircuit } from "lucide-react";

const Core = () => (
  <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
    <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "0 0 20px hsl(346 77% 50% / 0.3)" }}>
      <BrainCircuit className="h-10 w-10 text-rose" />
    </div>
    <h1 className="text-3xl font-bold text-foreground">The Core</h1>
    <p className="max-w-md text-muted-foreground">
      AI engineering assistant — error translation, component substitution, and project ideas. Coming soon.
    </p>
    <span className="rounded-full border border-rose/30 bg-rose/10 px-3 py-1 text-xs font-medium text-rose">
      Coming Soon
    </span>
  </div>
);

export default Core;
