import { Link } from "react-router-dom";
import {
  Cpu, MessageSquare, GraduationCap, BrainCircuit, ShoppingCart,
  Wrench, Database, LayoutGrid, ExternalLink, Briefcase,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const sections = [
  { icon: Cpu, title: "The Lab", path: "/lab", color: "text-emerald-500", bg: "bg-emerald-500/10",
    summary: "Browser-based circuit simulator. Drop components, write code, see how your circuit behaves before touching hardware." },
  { icon: GraduationCap, title: "The Academy", path: "/academy", color: "text-violet-500", bg: "bg-violet-500/10",
    summary: "Interactive courses for Arduino, ESP32, Raspberry Pi, IoT, AI, and Robotics. Photo-graded projects with AI feedback." },
  { icon: BrainCircuit, title: "The Core", path: "/core", color: "text-rose-500", bg: "bg-rose-500/10",
    summary: "AI engineering assistant. Decode compiler errors, suggest part substitutes, generate project ideas. Pick from Gemini or GPT-5 models." },
  { icon: ShoppingCart, title: "The Depot", path: "/depot", color: "text-amber-500", bg: "bg-amber-500/10",
    summary: "Browse 100+ components with live pricing from Robu and Amazon. Build a cart, checkout with GST + shipping calculated." },
  { icon: Wrench, title: "The Workshop", path: "/workshop", color: "text-blue-500", bg: "bg-blue-500/10",
    summary: "27 engineering calculators: Ohm's law, voltage divider, LED resistor, 555 timer, PCB trace width, capacitor codes, and more." },
  { icon: MessageSquare, title: "The Hive", path: "/hive", color: "text-sky-500", bg: "bg-sky-500/10",
    summary: "Discord-style community for engineers. Share schematics, ask questions, earn Volts for helping others." },
  { icon: Database, title: "Cloud Database", path: "/cloud", color: "text-purple-500", bg: "bg-purple-500/10",
    summary: "Save your code snippets, project files, and images securely in the cloud. Access them from any device." },
  { icon: Briefcase, title: "Settings → Jobs", path: "/settings/jobs", color: "text-orange-500", bg: "bg-orange-500/10",
    summary: "Open positions at EngiNexus: Robotics Mentor, Delivery, Sales, IT Engineering, Content, and more. Apply with your resume." },
];

const Hub = () => (
  <div className="mx-auto max-w-6xl p-6">
    <div className="mb-6 flex items-center gap-3">
      <div className="rounded-2xl bg-primary/10 p-2.5">
        <LayoutGrid className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">The Hub</h1>
        <p className="text-muted-foreground">A guided tour of every section in EngiNexus</p>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {sections.map((s) => (
        <Link key={s.title} to={s.path}>
          <Card className="h-full hover:border-primary/30 transition-colors cursor-pointer group">
            <CardContent className="p-5 flex gap-4">
              <div className={`rounded-2xl ${s.bg} p-3 h-fit`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.summary}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  </div>
);

export default Hub;
