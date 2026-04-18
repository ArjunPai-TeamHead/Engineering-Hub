import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ZoneCard } from "@/components/landing/ZoneCard";
import { useAuth } from "@/hooks/useAuth";
import {
  Cpu, MessageSquare, GraduationCap, BrainCircuit,
  ShoppingCart, Wrench, Wifi, ArrowRight, Sparkles, Shield, Users, Zap,
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

const whyFeatures = [
  { icon: Sparkles, title: "AI That Speaks Hardware", text: "The Core understands datasheets, decodes compiler errors, and recommends component substitutions — no more Stack Overflow rabbit-holes." },
  { icon: GraduationCap, title: "Learn by Doing", text: "Hands-on Academy courses with photo-graded projects. Build real circuits, snap a photo, get instant AI feedback." },
  { icon: ShoppingCart, title: "Build to Cart in Seconds", text: "Browse 100+ components with live pricing, save wishlists, track orders end-to-end. Tax + shipping calculated upfront." },
  { icon: Users, title: "A Community That Builds", text: "The Hive connects you with engineers worldwide. Share schematics, ask questions, earn Volts for helping others." },
  { icon: Wrench, title: "Tools, Not Tabs", text: "27 calculators (Ohm's law, voltage divider, LED resistor, PCB trace width…) all in one place. No more browser tab chaos." },
  { icon: Shield, title: "Built for Trust", text: "End-to-end encrypted uploads, RBAC for sensitive data, role-based permissions, and a private Cloud Database for your projects." },
];

const testimonials = [
  { name: "Aarav Mehta", role: "Final-year ECE student, IIT Bombay", text: "The AI grading on photo submissions is wild. I uploaded my LED circuit and it caught a wrong resistor placement instantly. Saved me hours.", avatar: "AM" },
  { name: "Priya Sharma", role: "Robotics teacher, Bengaluru", text: "I assign Academy courses to my class and review their progress in one dashboard. The Hub makes my life so much easier.", avatar: "PS" },
  { name: "Karan Verma", role: "Hobbyist & maker", text: "I used to spend 30 minutes price-comparing on Robu vs Amazon. The Depot does it instantly. Just one button to checkout the whole BOM.", avatar: "KV" },
];

const Index = () => {
  const { user } = useAuth();
  const ctaTo = user ? "/lab" : "/signup";
  const ctaLabel = user ? "Start Building" : "Get Started — Sign Up";

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
            <Link to={ctaTo}>
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Why EngiNexus */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <Badge text="Why EngiNexus" />
          <h2 className="mb-3 mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Everything an engineer needs.
            <span className="text-gradient"> One platform.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stop juggling 12 browser tabs. EngiNexus brings simulation, learning, components, AI, and community into one tightly integrated workspace.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 transition-colors"
            >
              <div className="mb-3 inline-flex rounded-2xl bg-primary/10 p-2.5">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative mx-auto max-w-6xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <Badge text="Loved by makers" />
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            What engineers are saying
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
            >
              <p className="text-sm text-foreground/90 italic leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold text-foreground">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Zones Grid */}
      <section className="relative mx-auto max-w-6xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
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

      {/* Bottom CTA */}
      <section className="relative mx-auto max-w-3xl px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card/50 to-accent/5 p-10 backdrop-blur-sm"
        >
          <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
            Ready to build something amazing?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of engineers who use EngiNexus daily. Sign up free — no credit card required.
          </p>
          <Button size="lg" className="gap-2 rounded-full px-8 text-base font-semibold shadow-lg" asChild>
            <Link to={ctaTo}>
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

const Badge = ({ text }: { text: string }) => (
  <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-primary border border-primary/20">
    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
    {text}
  </div>
);

export default Index;
