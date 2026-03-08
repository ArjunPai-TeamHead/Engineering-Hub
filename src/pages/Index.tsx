import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ZoneCard } from "@/components/landing/ZoneCard";
import {
  Cpu, MessageSquare, GraduationCap, BrainCircuit,
  ShoppingCart, Wrench, Wifi, Zap, ArrowRight,
} from "lucide-react";
import logoImg from "@/assets/logo.jpeg";

const zones = [
  { icon: Cpu, title: "The Lab", description: "Browser-based circuit simulation with drag-and-drop components and real-time code editing.", color: "hsl(160, 84%, 39%)", path: "/lab" },
  { icon: MessageSquare, title: "The Hive", description: "Discord-style community built for engineers — with code blocks, schematics, and reputation.", color: "hsl(199, 89%, 48%)", path: "/hive" },
  { icon: GraduationCap, title: "The Academy", description: "Interactive courses for IoT, Robotics, and AI with hands-on simulator integration.", color: "hsl(265, 83%, 57%)", path: "/academy" },
  { icon: BrainCircuit, title: "The Core", description: "AI assistant that reads datasheets, debugs code, and suggests component alternatives.", color: "hsl(346, 77%, 50%)", path: "/core" },
  { icon: ShoppingCart, title: "The Depot", description: "One-click BOM purchasing with live pricing and stock from electronics vendors.", color: "hsl(38, 92%, 50%)", path: "/depot" },
  { icon: Wrench, title: "The Workshop", description: "Essential calculators, fabrication tools, and engineering utilities.", color: "hsl(215, 90%, 52%)", path: "/workshop" },
  { icon: Wifi, title: "The Grid", description: "IoT bridge connecting your browser to real hardware via MQTT and Web Serial.", color: "hsl(265, 83%, 57%)", path: "/grid" },
];

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" />

      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full glass px-4 py-2 text-sm font-medium text-foreground/80">
            <img src={logoImg} alt="Logo" className="h-6 w-6 rounded-full object-cover" />
            The Engineering Platform
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-7xl">
            Build. Learn.
            <span className="text-gradient"> Engineer.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The all-in-one hub for hardware engineers — simulate circuits, learn IoT, collaborate with peers, and get AI-powered help.
          </p>
          <Button size="lg" className="gap-2 rounded-full px-8 text-base font-semibold shadow-lg" asChild>
            <Link to="/lab">
              Start Building <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className="absolute -bottom-4 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </section>

      {/* Zones Grid */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
            7 Zones. One Platform.
          </h2>
          <p className="text-muted-foreground">Everything an engineer needs, from prototype to production.</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {zones.map((zone, i) => (
            <ZoneCard key={zone.title} {...zone} delay={i * 0.06} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
