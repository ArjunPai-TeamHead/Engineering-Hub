import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ZoneCard } from "@/components/landing/ZoneCard";
import {
  Cpu,
  MessageSquare,
  GraduationCap,
  BrainCircuit,
  ShoppingCart,
  Hammer,
  Wrench,
  Wifi,
  Zap,
  ArrowRight,
} from "lucide-react";

const zones = [
  { icon: Cpu, title: "The Lab", description: "Browser-based circuit simulation with physics-accurate emulation of Arduino & Raspberry Pi.", color: "hsl(160, 84%, 39%)" },
  { icon: MessageSquare, title: "The Hive", description: "Discord-style community built for engineers — with code blocks, schematics, and reputation.", color: "hsl(199, 89%, 48%)" },
  { icon: GraduationCap, title: "The Academy", description: "Interactive courses for IoT, Robotics, and AI with hands-on simulator integration.", color: "hsl(265, 83%, 57%)" },
  { icon: BrainCircuit, title: "The Core", description: "AI assistant that reads datasheets, debugs code, and suggests component alternatives.", color: "hsl(346, 77%, 50%)" },
  { icon: ShoppingCart, title: "The Depot", description: "One-click BOM purchasing with live pricing and stock from electronics vendors.", color: "hsl(38, 92%, 50%)" },
  { icon: Hammer, title: "The Forge", description: "Fabrication tools — 3D STL viewers, case generators, and PCB layout helpers.", color: "hsl(160, 84%, 39%)" },
  { icon: Wrench, title: "The Toolbox", description: "Essential calculators — Ohm's Law, resistor codes, 555 timers, and more.", color: "hsl(199, 89%, 48%)" },
  { icon: Wifi, title: "The Grid", description: "IoT bridge connecting your browser to real hardware via MQTT and Web Serial.", color: "hsl(265, 83%, 57%)" },
];

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Grid pattern background */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />

      {/* Hero */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            The Engineering Platform
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-7xl">
            Build. Learn.
            <span className="text-gradient"> Engineer.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            The all-in-one hub for hardware engineers — simulate circuits, learn IoT, collaborate with peers, and get AI-powered help. No installations required.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="gap-2 glow-primary text-base font-semibold" asChild>
              <Link to="/toolbox">
                Explore Toolbox <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base" asChild>
              <Link to="/academy">Browse Courses</Link>
            </Button>
          </div>
        </motion.div>

        {/* Floating circuit decoration */}
        <motion.div
          className="absolute -bottom-4 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
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
            8 Zones. One Platform.
          </h2>
          <p className="text-muted-foreground">Everything an engineer needs, from prototype to production.</p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {zones.map((zone, i) => (
            <ZoneCard key={zone.title} {...zone} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl px-6"
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground">Ready to start building?</h2>
          <p className="mb-8 text-muted-foreground">
            Jump into the Toolbox — fully functional engineering calculators, available now.
          </p>
          <Button size="lg" className="gap-2 glow-primary font-semibold" asChild>
            <Link to="/toolbox">
              Launch Toolbox <Zap className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
