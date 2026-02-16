import { useState } from "react";
import { BrainCircuit, Send, Sparkles, Code, Lightbulb, Bug, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  { icon: Bug, title: "Error Translator", description: "Paste a compiler error → get plain English" },
  { icon: Code, title: "Code Translation", description: "Convert between Python and C++" },
  { icon: Sparkles, title: "Component Substitution", description: "\"What can I use instead of X?\"" },
  { icon: Lightbulb, title: "Idea Generator", description: "\"I have a servo and LDR, what can I build?\"" },
  { icon: FileText, title: "Code Optimizer", description: "Suggest memory/speed improvements" },
  { icon: FileText, title: "Documentation Writer", description: "Auto-generate code comments" },
];

const mockConversation = [
  { role: "user" as const, content: "I'm getting error: 'avrdude: stk500_getsync() attempt 1 of 10: not in sync: resp=0x00' — what does this mean?" },
  { role: "assistant" as const, content: "This error means your computer can't communicate with the Arduino bootloader. Common fixes:\n\n1. **Wrong board selected** — Go to Tools → Board and select the correct Arduino model\n2. **Wrong COM port** — Check Tools → Port for the correct serial port\n3. **Faulty USB cable** — Try a different cable (some are charge-only)\n4. **Driver issue** — Install CH340 or FTDI drivers if using a clone board\n5. **Reset timing** — Press the reset button right when upload starts" },
];

const Core = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(mockConversation);

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <div className="border-b border-border px-6 py-3 flex items-center gap-3">
        <div className="rounded-lg bg-rose/10 p-1.5" style={{ boxShadow: "0 0 12px hsl(346 77% 50% / 0.2)" }}>
          <BrainCircuit className="h-5 w-5 text-rose" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">The Core</h1>
          <p className="text-xs text-muted-foreground">AI Engineering Assistant</p>
        </div>
        <Badge variant="outline" className="ml-auto text-xs">Enable Cloud for live AI</Badge>
      </div>

      {/* Capabilities */}
      {messages.length <= 2 && (
        <div className="px-6 pt-4">
          <div className="grid gap-2 sm:grid-cols-3">
            {capabilities.map((cap) => (
              <button key={cap.title} className="rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-rose/30 hover:shadow-sm">
                <cap.icon className="mb-1 h-4 w-4 text-rose" />
                <p className="text-xs font-semibold text-foreground">{cap.title}</p>
                <p className="text-[10px] text-muted-foreground">{cap.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
              m.role === "user"
                ? "bg-primary/10 text-foreground"
                : "bg-card border border-border text-foreground"
            }`}>
              {m.content.split("\n").map((line, j) => {
                if (line.startsWith("**") && line.endsWith("**")) {
                  return <p key={j} className="font-semibold mt-1">{line.replace(/\*\*/g, "")}</p>;
                }
                if (line.match(/^\d+\.\s\*\*/)) {
                  const match = line.match(/^(\d+\.)\s\*\*(.+?)\*\*\s*—?\s*(.*)/);
                  if (match) return <p key={j} className="mt-1"><span className="text-muted-foreground">{match[1]}</span> <strong>{match[2]}</strong> — {match[3]}</p>;
                }
                return <p key={j} className={line === "" ? "h-2" : ""}>{line}</p>;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input placeholder="Ask about circuits, code, components..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1" />
          <Button size="icon" className="bg-rose hover:bg-rose/90"><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
};

export default Core;
