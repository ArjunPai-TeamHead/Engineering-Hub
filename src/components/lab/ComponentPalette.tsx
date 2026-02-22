import { useState } from "react";
import { Search, Cpu, Zap, Radio, Gauge, MonitorSmartphone, Cog, Battery, Cable, CircuitBoard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { components, categories } from "@/data/componentLibrary";

const categoryIcons: Record<string, React.ElementType> = {
  Microcontrollers: Cpu, Passive: Zap, Active: Radio, Sensors: Gauge,
  Displays: MonitorSmartphone, "Motors & Actuators": Cog, Communication: Radio,
  ICs: CircuitBoard, Power: Battery, Connectors: Cable, Prototyping: CircuitBoard,
};

interface Props {
  onDrop: (componentId: string, name: string, category: string, x: number, y: number) => void;
}

export function ComponentPalette({ onDrop }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = components
    .filter(c => category === "all" || c.category === category)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  const handleDragStart = (e: React.DragEvent, comp: typeof components[0]) => {
    e.dataTransfer.setData("application/component", JSON.stringify({ componentId: comp.id, name: comp.name, category: comp.category }));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="p-3 space-y-2 border-b border-border">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-8 text-xs rounded-lg">
            <SelectValue placeholder="Components" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Components</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs rounded-lg" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-3 gap-1 p-2">
          {filtered.map(comp => {
            const Icon = categoryIcons[comp.category] || CircuitBoard;
            return (
              <div
                key={comp.id}
                draggable
                onDragStart={(e) => handleDragStart(e, comp)}
                onClick={() => onDrop(comp.id, comp.name, comp.category, 200 + Math.random() * 200, 150 + Math.random() * 150)}
                className="flex flex-col items-center gap-1 rounded-xl p-2 cursor-grab active:cursor-grabbing hover:bg-muted/60 transition-colors group"
                title={comp.description}
              >
                <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[10px] text-center text-muted-foreground leading-tight line-clamp-2">{comp.name}</span>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
