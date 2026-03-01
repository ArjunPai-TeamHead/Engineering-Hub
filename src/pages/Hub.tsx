import { LayoutGrid } from "lucide-react";

const Hub = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg bg-primary/10 p-2">
          <LayoutGrid className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">The Hub</h1>
          <p className="text-muted-foreground">Coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Hub;
