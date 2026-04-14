import { useState, useEffect, useRef } from "react";
import { BrainCircuit, Send, Sparkles, Code, Lightbulb, Bug, FileText, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const capabilities = [
  { icon: Bug, title: "Error Translator", description: "Paste a compiler error → plain English", prompt: "Explain this error: avrdude: stk500_getsync() attempt 1 of 10: not in sync: resp=0x00" },
  { icon: Code, title: "Code Translation", description: "Convert between Python and C++", prompt: "Convert this Arduino C++ code to MicroPython: void setup() { Serial.begin(9600); }" },
  { icon: Sparkles, title: "Component Substitution", description: '"What can I use instead of X?"', prompt: "What can I use instead of a L298N motor driver?" },
  { icon: Lightbulb, title: "Idea Generator", description: '"I have a servo and LDR, what can I build?"', prompt: "I have a servo motor, LDR, and Arduino Uno. What interesting projects can I build?" },
  { icon: FileText, title: "Code Optimizer", description: "Suggest memory/speed improvements", prompt: "How can I optimize this code for lower memory usage on an Arduino Uno?" },
  { icon: FileText, title: "Documentation Writer", description: "Auto-generate code comments", prompt: "Add comprehensive comments to this Arduino code: void loop() { int val = analogRead(A0); if(val > 512) { digitalWrite(13, HIGH); } else { digitalWrite(13, LOW); } }" },
];

const Core = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: Message = { role: "user", content: content.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    let assistantContent = "";

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        setMessages(prev => [...prev, { role: "assistant", content: "Please sign in to use The Core." }]);
        setLoading(false);
        return;
      }

      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

      const resp = await fetch(`${SUPABASE_URL}/functions/v1/core-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        if (resp.status === 429) {
          toast({ title: "Rate limit reached", description: "Please wait a moment before sending another message.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "AI credits exhausted", description: "Please add credits to continue using The Core.", variant: "destructive" });
        } else {
          toast({ title: "AI error", description: errData.error || "Something went wrong", variant: "destructive" });
        }
        setLoading(false);
        return;
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamDone = false;

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const chunk = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (chunk) {
              assistantContent += chunk;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      toast({ title: "Connection error", description: "Could not reach The Core. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (content: string) => {
    if (!content.includes("```") && !content.includes("**") && !content.includes("\n")) {
      return <p>{content}</p>;
    }
    return (
      <div className="space-y-1">
        {content.split(/(\`\`\`[\s\S]*?\`\`\`)/g).map((part, i) => {
          if (part.startsWith("```")) {
            const code = part.replace(/^```\w*\n?/, "").replace(/```$/, "");
            return (
              <pre key={i} className="rounded-md border border-border bg-muted p-3 font-mono text-xs overflow-x-auto my-2">
                <code>{code}</code>
              </pre>
            );
          }
          return (
            <div key={i}>
              {part.split("\n").map((line, j) => {
                if (!line) return <div key={j} className="h-1" />;
                // Sanitize: only allow strong and em tags
                const boldLine = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
                const sanitized = DOMPurify.sanitize(boldLine, { ALLOWED_TAGS: ["strong", "em"] });
                if (line.match(/^\d+\.\s/)) return <p key={j} className="ml-2" dangerouslySetInnerHTML={{ __html: sanitized }} />;
                if (line.startsWith("- ") || line.startsWith("• ")) return <p key={j} className="ml-2" dangerouslySetInnerHTML={{ __html: "• " + DOMPurify.sanitize(boldLine.slice(2), { ALLOWED_TAGS: ["strong", "em"] }) }} />;
                return <p key={j} dangerouslySetInnerHTML={{ __html: sanitized }} />;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <div className="border-b border-border px-6 py-3 flex items-center gap-3">
        <div className="rounded-lg bg-rose/10 p-1.5" style={{ boxShadow: "0 0 12px hsl(346 77% 50% / 0.2)" }}>
          <BrainCircuit className="h-5 w-5 text-rose" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">The Core</h1>
          <p className="text-xs text-muted-foreground">AI Engineering Assistant · Powered by Lovable AI</p>
        </div>
        <Badge variant="outline" className="ml-auto text-xs text-accent border-accent/30">Live AI</Badge>
      </div>

      {messages.length === 0 && (
        <div className="px-6 pt-4">
          <p className="text-xs text-muted-foreground mb-3">Try one of these or ask anything engineering-related:</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {capabilities.map((cap) => (
              <button
                key={cap.title}
                onClick={() => sendMessage(cap.prompt)}
                className="rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-rose/30 hover:shadow-sm"
              >
                <cap.icon className="mb-1 h-4 w-4 text-rose" />
                <p className="text-xs font-semibold text-foreground">{cap.title}</p>
                <p className="text-[10px] text-muted-foreground">{cap.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
              m.role === "user"
                ? "bg-accent/10 text-foreground border border-accent/20"
                : "bg-card border border-border text-foreground"
            }`}>
              {m.content === "" && loading && i === messages.length - 1 ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-xs">Thinking...</span>
                </div>
              ) : (
                renderMessage(m.content)
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about circuits, code, components, errors..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }}}
            className="flex-1"
            disabled={loading}
          />
          <Button
            size="icon"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-rose hover:bg-rose/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Specialized in Arduino, Raspberry Pi, ESP32 · Circuits · C++ / Python
        </p>
      </div>
    </div>
  );
};

export default Core;
