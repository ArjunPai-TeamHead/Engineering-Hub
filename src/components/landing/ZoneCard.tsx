import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ZoneCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  delay: number;
}

export function ZoneCard({ icon: Icon, title, description, color, delay }: ZoneCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
    >
      <div
        className="mb-4 inline-flex rounded-lg p-3 transition-shadow group-hover:glow-primary"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </motion.div>
  );
}
