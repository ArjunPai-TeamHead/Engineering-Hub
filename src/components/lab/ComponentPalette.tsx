import { useState } from "react";
import { Search, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { components, categories } from "@/data/componentLibrary";

interface Props {
  onDrop: (componentId: string, name: string, category: string, x: number, y: number) => void;
}

export function ComponentPalette({ onDrop }: Props) {
  const [search, setSearch] = useState("");
  const [expandedCat, setExpandedCat] = useState<string | null>("Microcontrollers");

  const filtered = components.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedByCat = categories.reduce<Record<string, typeof components>>((acc, cat) => {
    const items = filtered.filter((c) => c.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const handleDragStart = (e: React.DragEvent, comp: typeof components[0]) => {
    e.dataTransfer.setData("application/component", JSON.stringify({
      componentId: comp.id, name: comp.name, category: comp.category,
    }));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="p-2 border-b border-border">
        <p className="text-xs font-semibold text-foreground mb-1.5">Components</p>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="h-7 pl-7 text-xs" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-1">
          {Object.entries(groupedByCat).map(([cat, items]) => (
            <div key={cat} className="mb-1">
              <button
                onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
                className="w-full flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground rounded"
              >
                <span className={`transition-transform ${expandedCat === cat ? "rotate-90" : ""}`}>▸</span>
                {cat} ({items.length})
              </button>
              {expandedCat === cat && items.map((comp) => (
                <div
                  key={comp.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, comp)}
                  className="flex items-center gap-1.5 px-2 py-1 mx-1 rounded text-xs text-foreground/80 hover:bg-muted cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                  <span className="truncate">{comp.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
