import { useState, useRef, useEffect } from "react";
import { Terminal, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  output: string[];
  setOutput: React.Dispatch<React.SetStateAction<string[]>>;
}

export function SerialMonitor({ output, setOutput }: Props) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [output]);

  const send = () => {
    if (!input.trim()) return;
    setOutput((prev) => [...prev, `> ${input}`]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center gap-2 border-b border-border px-3 py-1.5">
        <Terminal className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-semibold text-foreground">Serial Monitor</span>
        <span className="text-[10px] text-muted-foreground ml-auto">9600 baud</span>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="font-mono text-[11px] text-foreground/80 space-y-0.5">
          {output.length === 0 && <p className="text-muted-foreground italic">No output yet. Click "Simulate" to start.</p>}
          {output.map((line, i) => (
            <div key={i} className={line.startsWith(">") ? "text-primary" : ""}>{line}</div>
          ))}
          <div ref={endRef} />
        </div>
      </ScrollArea>
      <div className="flex gap-1 border-t border-border p-2">
        <Input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="Send to serial..."
          className="h-7 text-xs font-mono"
        />
        <Button size="sm" variant="outline" className="h-7 px-2" onClick={send}>
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
