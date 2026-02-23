import { useState } from "react";
import { Search, Cpu, Zap, Radio, Gauge, MonitorSmartphone, Cog, Battery, Cable, CircuitBoard, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { components, categories, type ComponentItem } from "@/data/componentLibrary";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const categoryIcons: Record<string, React.ElementType> = {
  Microcontrollers: Cpu, Passive: Zap, Active: Radio, Sensors: Gauge,
  Displays: MonitorSmartphone, "Motors & Actuators": Cog, Communication: Radio,
  ICs: CircuitBoard, Power: Battery, Connectors: Cable, Prototyping: CircuitBoard,
};

const categoryColors: Record<string, string> = {
  Microcontrollers: "bg-blue-500/10 text-blue-500",
  Passive: "bg-slate-500/10 text-slate-500",
  Active: "bg-emerald-500/10 text-emerald-500",
  Sensors: "bg-amber-500/10 text-amber-500",
  Displays: "bg-violet-500/10 text-violet-500",
  "Motors & Actuators": "bg-rose-500/10 text-rose-500",
  Communication: "bg-cyan-500/10 text-cyan-500",
  ICs: "bg-teal-500/10 text-teal-500",
  Power: "bg-orange-500/10 text-orange-500",
  Connectors: "bg-gray-500/10 text-gray-500",
  Prototyping: "bg-indigo-500/10 text-indigo-500",
};

interface Props {
  onDrop: (componentId: string, name: string, category: string, x: number, y: number) => void;
}

export function ComponentPalette({ onDrop }: Props) {
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(["Microcontrollers"]));

  const filtered = search
    ? components.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
    : components;

  const grouped = categories.reduce<Record<string, ComponentItem[]>>((acc, cat) => {
    const items = filtered.filter(c => c.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const handleDragStart = (e: React.DragEvent, comp: ComponentItem) => {
    e.dataTransfer.setData("application/component", JSON.stringify({ componentId: comp.id, name: comp.name, category: comp.category }));
    e.dataTransfer.effectAllowed = "copy";
  };

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs rounded-lg"
          />
        </div>
        <div className="mt-1.5 text-[10px] text-muted-foreground">
          {filtered.length} components • Drag to canvas
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-1">
          {Object.entries(grouped).map(([cat, items]) => {
            const Icon = categoryIcons[cat] || CircuitBoard;
            const isOpen = search.length > 0 || openCategories.has(cat);
            return (
              <Collapsible key={cat} open={isOpen} onOpenChange={() => toggleCategory(cat)}>
                <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="flex-1 text-left">{cat}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">{items.length}</span>
                  <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid grid-cols-2 gap-1 px-1 pb-2">
                    {items.map(comp => (
                      <div
                        key={comp.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, comp)}
                        onClick={() => onDrop(comp.id, comp.name, comp.category, 200 + Math.random() * 200, 100 + Math.random() * 100)}
                        className="flex flex-col items-center gap-1 rounded-xl p-2 cursor-grab active:cursor-grabbing hover:bg-muted/60 transition-all group border border-transparent hover:border-border/50"
                        title={`${comp.name}\n${comp.description}\nPins: ${comp.pins.join(", ")}`}
                      >
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${categoryColors[cat] || "bg-muted/50 text-muted-foreground"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] text-center text-muted-foreground leading-tight line-clamp-2 group-hover:text-foreground transition-colors">
                          {comp.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
