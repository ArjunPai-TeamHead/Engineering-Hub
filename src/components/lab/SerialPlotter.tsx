import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  data: string[];
}

export function SerialPlotter({ data }: Props) {
  const numericData = useMemo(() => {
    return data
      .filter(line => !line.startsWith("[") && !line.startsWith(">"))
      .map(line => {
        const num = parseFloat(line);
        return isNaN(num) ? null : num;
      })
      .filter((n): n is number => n !== null)
      .slice(-60);
  }, [data]);

  const max = numericData.length > 0 ? Math.max(...numericData) : 100;
  const min = numericData.length > 0 ? Math.min(...numericData) : 0;
  const range = max - min || 1;

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-1">
        <span className="text-xs font-semibold text-foreground">Serial Plotter</span>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
          <span>Min: {min.toFixed(1)}</span>
          <span>Max: {max.toFixed(1)}</span>
          <span>{numericData.length} pts</span>
        </div>
      </div>
      <div className="flex-1 p-2">
        {numericData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
            Send numeric data via Serial to plot
          </div>
        ) : (
          <svg viewBox={`0 0 ${numericData.length} 100`} className="h-full w-full" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              points={numericData.map((v, i) => `${i},${100 - ((v - min) / range) * 100}`).join(" ")}
            />
            {/* Grid */}
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1={0} y1={y} x2={numericData.length} y2={y} stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="2 2" />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}
