import { useRef, useState } from "react";
import type { PlacedComponent, Wire } from "./SimulatorWorkspace";

interface Props {
  placedComponents: PlacedComponent[];
  wires: Wire[];
  setWires: React.Dispatch<React.SetStateAction<Wire[]>>;
  selectedComponent: PlacedComponent | null;
  setSelectedComponent: (c: PlacedComponent | null) => void;
  setPlacedComponents: React.Dispatch<React.SetStateAction<PlacedComponent[]>>;
}

const GRID = 12;
const COLS = 63;
const ROWS = 30;
const PAD = 40;
const W = COLS * GRID + PAD * 2;
const H = ROWS * GRID + PAD * 2;

const snap = (v: number) => Math.round(v / GRID) * GRID;

const categoryColors: Record<string, string> = {
  Microcontrollers: "hsl(199 89% 48%)",
  Passive: "hsl(220 10% 46%)",
  Active: "hsl(160 84% 39%)",
  Sensors: "hsl(38 92% 50%)",
  Displays: "hsl(265 83% 57%)",
  "Motors & Actuators": "hsl(346 77% 50%)",
  Communication: "hsl(199 89% 48%)",
  ICs: "hsl(160 84% 39%)",
  Power: "hsl(38 92% 50%)",
  Connectors: "hsl(220 10% 46%)",
  Prototyping: "hsl(220 10% 46%)",
};

export function Breadboard({ placedComponents, wires, setWires, selectedComponent, setSelectedComponent, setPlacedComponents }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [wireStart, setWireStart] = useState<{ x: number; y: number } | null>(null);
  const [dragComp, setDragComp] = useState<string | null>(null);

  const getSVGPoint = (e: React.MouseEvent) => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    return { x: snap(((e.clientX - rect.left) / rect.width) * W - PAD), y: snap(((e.clientY - rect.top) / rect.height) * H - PAD) };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/component");
    if (!data) return;
    const { componentId, name, category } = JSON.parse(data);
    const pt = getSVGPoint(e as unknown as React.MouseEvent);
    const newComp: PlacedComponent = {
      id: `p-${Date.now()}`, componentId, name, category,
      x: Math.max(0, Math.min(pt.x, (COLS - 4) * GRID)),
      y: Math.max(0, Math.min(pt.y, (ROWS - 2) * GRID)),
    };
    setPlacedComponents((prev) => [...prev, newComp]);
  };

  const handleSvgClick = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as Element).classList.contains("grid-hole")) {
      const pt = getSVGPoint(e);
      if (wireStart) {
        const colors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"];
        setWires((prev) => [...prev, { id: `w-${Date.now()}`, from: wireStart, to: pt, color: colors[prev.length % colors.length] }]);
        setWireStart(null);
      } else {
        setWireStart(pt);
      }
      setSelectedComponent(null);
    }
  };

  return (
    <div
      className="h-full w-full overflow-auto bg-muted/30 grid-pattern"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-full min-w-[700px] min-h-[400px]" onClick={handleSvgClick}>
        {/* Breadboard base */}
        <rect x={PAD - 5} y={PAD - 5} width={COLS * GRID + 10} height={ROWS * GRID + 10} rx={6} fill="hsl(40 20% 95%)" stroke="hsl(40 15% 80%)" strokeWidth={1.5} className="dark:fill-[hsl(222,20%,12%)] dark:stroke-[hsl(222,20%,20%)]" />

        {/* Grid holes */}
        {Array.from({ length: COLS }).map((_, col) =>
          Array.from({ length: ROWS }).map((_, row) => (
            <circle
              key={`${col}-${row}`}
              cx={PAD + col * GRID}
              cy={PAD + row * GRID}
              r={2}
              className="grid-hole fill-muted-foreground/20 hover:fill-primary/60 cursor-crosshair"
            />
          ))
        )}

        {/* Power rails */}
        <line x1={PAD} y1={PAD - 2} x2={PAD + (COLS - 1) * GRID} y2={PAD - 2} stroke="hsl(0 72% 51%)" strokeWidth={2} opacity={0.3} />
        <line x1={PAD} y1={PAD + (ROWS - 1) * GRID + 2} x2={PAD + (COLS - 1) * GRID} y2={PAD + (ROWS - 1) * GRID + 2} stroke="hsl(220 89% 48%)" strokeWidth={2} opacity={0.3} />

        {/* Center divider */}
        <line x1={PAD} y1={PAD + Math.floor(ROWS / 2) * GRID} x2={PAD + (COLS - 1) * GRID} y2={PAD + Math.floor(ROWS / 2) * GRID} stroke="hsl(var(--border))" strokeWidth={3} strokeDasharray="6 3" opacity={0.5} />

        {/* Wires */}
        {wires.map((w) => (
          <line key={w.id} x1={PAD + w.from.x} y1={PAD + w.from.y} x2={PAD + w.to.x} y2={PAD + w.to.y} stroke={w.color} strokeWidth={2.5} strokeLinecap="round" className="cursor-pointer hover:stroke-[3.5]" />
        ))}

        {/* Wire being drawn */}
        {wireStart && (
          <circle cx={PAD + wireStart.x} cy={PAD + wireStart.y} r={4} fill="hsl(var(--primary))" className="animate-pulse" />
        )}

        {/* Placed components */}
        {placedComponents.map((comp) => {
          const isSelected = selectedComponent?.id === comp.id;
          const color = categoryColors[comp.category] || "hsl(220 10% 46%)";
          return (
            <g
              key={comp.id}
              transform={`translate(${PAD + comp.x}, ${PAD + comp.y})`}
              onClick={(e) => { e.stopPropagation(); setSelectedComponent(comp); }}
              className="cursor-pointer"
            >
              <rect
                x={-2} y={-2} width={GRID * 4 + 4} height={GRID * 2 + 4} rx={3}
                fill={color} fillOpacity={0.15} stroke={isSelected ? "hsl(var(--primary))" : color} strokeWidth={isSelected ? 2 : 1}
              />
              <rect x={0} y={0} width={GRID * 4} height={GRID * 2} rx={2} fill={color} fillOpacity={0.3} />
              <text x={GRID * 2} y={GRID + 1} textAnchor="middle" dominantBaseline="middle" fontSize={7} fontWeight={600} fill="currentColor" className="fill-foreground">
                {comp.name.length > 12 ? comp.name.slice(0, 11) + "…" : comp.name}
              </text>
              {/* Pins */}
              {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                  <circle cx={i * GRID} cy={-4} r={1.5} fill={color} />
                  <circle cx={i * GRID} cy={GRID * 2 + 4} r={1.5} fill={color} />
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
