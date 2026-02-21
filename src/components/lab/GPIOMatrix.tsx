import { ScrollArea } from "@/components/ui/scroll-area";

const pins = Array.from({ length: 20 }, (_, i) => ({
  name: `D${i}`,
  mode: i === 13 ? "OUTPUT" : i < 2 ? "SERIAL" : "INPUT",
  state: i === 13 ? "HIGH" : "LOW",
}));

const analogPins = Array.from({ length: 6 }, (_, i) => ({
  name: `A${i}`,
  mode: "ANALOG",
  state: `${Math.floor(Math.random() * 1024)}`,
}));

export function GPIOMatrix() {
  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center gap-2 border-b border-border px-3 py-1.5">
        <span className="text-xs font-semibold text-foreground">GPIO State Matrix</span>
        <span className="text-[10px] text-muted-foreground italic ml-auto">Simulation idle</span>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
          {[...pins, ...analogPins].map((pin) => (
            <div
              key={pin.name}
              className={`flex items-center justify-between rounded border px-2 py-1 ${
                pin.state === "HIGH" ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-muted/30 text-muted-foreground"
              }`}
            >
              <span className="font-semibold">{pin.name}</span>
              <span>{pin.state}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
