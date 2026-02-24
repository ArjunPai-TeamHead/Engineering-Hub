import { Mic, MicOff, Headphones, PhoneOff, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  channelName: string;
  muted: boolean;
  setMuted: (v: boolean) => void;
  onDisconnect: () => void;
}

export function HiveVoicePanel({ channelName, muted, setMuted, onDisconnect }: Props) {
  return (
    <div className="border-t border-[hsl(225,12%,14%)] bg-[hsl(225,22%,8%)] px-4 py-2.5 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-green-400 flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Voice Connected
        </p>
        <p className="text-[11px] text-[hsl(220,10%,45%)] truncate">#{channelName}</p>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-[hsl(220,10%,55%)] hover:text-[hsl(210,20%,90%)] hover:bg-[hsl(225,15%,14%)]" onClick={() => setMuted(!muted)}>
        {muted ? <MicOff className="h-4 w-4 text-rose-400" /> : <Mic className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-[hsl(220,10%,55%)] hover:text-[hsl(210,20%,90%)] hover:bg-[hsl(225,15%,14%)]">
        <Headphones className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-[hsl(220,10%,55%)] hover:text-[hsl(210,20%,90%)] hover:bg-[hsl(225,15%,14%)]">
        <Video className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-rose-500/20" onClick={onDisconnect}>
        <PhoneOff className="h-4 w-4 text-rose-400" />
      </Button>
    </div>
  );
}
