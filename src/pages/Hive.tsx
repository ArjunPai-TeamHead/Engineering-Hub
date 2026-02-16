import { useState } from "react";
import { MessageSquare, Hash, Users, Zap, Trophy, Send } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const channels = [
  { name: "general", description: "General engineering discussion", members: 128, unread: 3 },
  { name: "help", description: "Ask questions, get answers", members: 95, unread: 7 },
  { name: "showcase", description: "Show off your builds", members: 64, unread: 0 },
  { name: "off-topic", description: "Anything goes", members: 42, unread: 1 },
  { name: "iot", description: "Internet of Things projects", members: 56, unread: 0 },
  { name: "robotics", description: "Robots and automation", members: 38, unread: 2 },
];

const mockMessages = [
  { user: "circuit_wizard", role: "Master", volts: 2340, message: "Has anyone tried the new MPU6050 library? The I2C initialization seems cleaner.", time: "2m ago" },
  { user: "new_spark", role: "Apprentice", volts: 45, message: "I keep getting `avrdude: stk500_recv(): programmer is not responding` — any ideas?", time: "5m ago" },
  { user: "robo_builder", role: "Journeyman", volts: 890, message: "```cpp\nServo myServo;\nmyServo.attach(9);\nmyServo.write(90);\n```\nThat should center your servo. Make sure you're using the Servo.h library!", time: "8m ago" },
  { user: "led_queen", role: "Journeyman", volts: 1205, message: "Just finished my NeoPixel matrix display! Posting pics in #showcase 🎉", time: "12m ago" },
];

const roleColor: Record<string, string> = {
  Apprentice: "text-muted-foreground",
  Journeyman: "text-accent",
  Master: "text-amber",
};

const Hive = () => {
  const [activeChannel, setActiveChannel] = useState("general");
  const [msg, setMsg] = useState("");

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Channel sidebar */}
      <div className="w-56 shrink-0 border-r border-border bg-card p-3 overflow-y-auto hidden md:block">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          <h2 className="text-sm font-bold text-foreground">Channels</h2>
        </div>
        {channels.map((ch) => (
          <button
            key={ch.name}
            onClick={() => setActiveChannel(ch.name)}
            className={`mb-1 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors ${activeChannel === ch.name ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted"}`}
          >
            <span className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" />{ch.name}</span>
            {ch.unread > 0 && <Badge className="h-5 min-w-5 justify-center bg-accent text-[10px] text-accent-foreground">{ch.unread}</Badge>}
          </button>
        ))}

        <div className="mt-6 rounded-lg border border-border bg-muted/50 p-3">
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground"><Trophy className="h-3.5 w-3.5 text-amber" /> Leaderboard</div>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between"><span>circuit_wizard</span><span className="font-mono text-amber">2340⚡</span></div>
            <div className="flex justify-between"><span>led_queen</span><span className="font-mono text-amber">1205⚡</span></div>
            <div className="flex justify-between"><span>robo_builder</span><span className="font-mono text-amber">890⚡</span></div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        <div className="border-b border-border px-4 py-2 flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-foreground text-sm">{activeChannel}</span>
          <span className="text-xs text-muted-foreground">
            {channels.find((c) => c.name === activeChannel)?.description}
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> {channels.find((c) => c.name === activeChannel)?.members}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center">
            <Badge variant="outline" className="text-xs">Enable Lovable Cloud for real-time chat</Badge>
          </div>
          {mockMessages.map((m, i) => (
            <div key={i} className="group">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-foreground">{m.user}</span>
                <Badge variant="outline" className={`text-[10px] ${roleColor[m.role]}`}>{m.role}</Badge>
                <span className="flex items-center gap-0.5 text-[10px] text-amber font-mono"><Zap className="h-2.5 w-2.5" />{m.volts}</span>
                <span className="text-[10px] text-muted-foreground ml-auto">{m.time}</span>
              </div>
              <div className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap">
                {m.message.includes("```") ? (
                  <div>
                    {m.message.split("```").map((part, j) =>
                      j % 2 === 0 ? <span key={j}>{part}</span> : (
                        <pre key={j} className="my-2 rounded-md border border-border bg-muted p-3 font-mono text-xs overflow-x-auto">
                          <code>{part.replace(/^cpp\n/, "")}</code>
                        </pre>
                      )
                    )}
                  </div>
                ) : m.message}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-3">
          <div className="flex gap-2">
            <Input placeholder={`Message #${activeChannel}...`} value={msg} onChange={(e) => setMsg(e.target.value)} className="flex-1" />
            <Button size="icon"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hive;
