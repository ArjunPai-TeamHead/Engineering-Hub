import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu } from "lucide-react";

interface Board {
  id: string;
  name: string;
  mcu: string;
  clock: string;
  lang: string;
}

interface Props {
  boards: readonly Board[];
  value: string;
  onChange: (id: string) => void;
}

export function BoardSelector({ boards, value, onChange }: Props) {
  const current = boards.find(b => b.id === value);

  return (
    <div className="flex items-center gap-2">
      <Cpu className="h-4 w-4 text-primary" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-7 w-44 border-0 bg-muted/50 text-xs font-semibold rounded-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {boards.map(b => (
            <SelectItem key={b.id} value={b.id}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{b.name}</span>
                <span className="text-[10px] text-muted-foreground">{b.mcu}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {current && (
        <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">
          {current.clock}
        </span>
      )}
    </div>
  );
}
