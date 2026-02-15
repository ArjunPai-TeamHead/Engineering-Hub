import { MessageSquare } from "lucide-react";

const Hive = () => (
  <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
    <div className="rounded-xl border border-border bg-card p-4 glow-accent">
      <MessageSquare className="h-10 w-10 text-accent" />
    </div>
    <h1 className="text-3xl font-bold text-foreground">The Hive</h1>
    <p className="max-w-md text-muted-foreground">
      Real-time engineering community with code-block chat, threaded conversations, and reputation tracking. Coming soon.
    </p>
    <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
      Coming Soon
    </span>
  </div>
);

export default Hive;
