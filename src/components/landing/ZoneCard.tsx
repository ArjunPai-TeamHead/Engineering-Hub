import { forwardRef } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ZoneCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  delay: number;
  path: string;
}

export const ZoneCard = forwardRef<HTMLAnchorElement, ZoneCardProps>(
  ({ icon: Icon, title, description, color, delay, path }, ref) => {
    return (
      <Link to={path} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay }}
          whileHover={{ y: -4 }}
          className="group ios-card p-6 cursor-pointer"
        >
          <div
            className="mb-4 inline-flex rounded-2xl p-3"
            style={{ backgroundColor: `${color}12` }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </motion.div>
      </Link>
    );
  }
);
ZoneCard.displayName = "ZoneCard";
