import { GraduationCap } from "lucide-react";

const Academy = () => (
  <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
    <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "0 0 20px hsl(265 83% 57% / 0.3)" }}>
      <GraduationCap className="h-10 w-10 text-violet" />
    </div>
    <h1 className="text-3xl font-bold text-foreground">The Academy</h1>
    <p className="max-w-md text-muted-foreground">
      Interactive courses for IoT, Robotics, and AI — with skill trees, auto-grading, and daily challenges. Coming soon.
    </p>
    <span className="rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-xs font-medium text-violet">
      Coming Soon
    </span>
  </div>
);

export default Academy;
