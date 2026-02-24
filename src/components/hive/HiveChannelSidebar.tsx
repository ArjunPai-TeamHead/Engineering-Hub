import { useState } from "react";
import { Hash, ChevronDown, ChevronRight, Volume2, Zap, Headphones, Video } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Channel } from "@/pages/Hive";
import { roleDot } from "@/pages/Hive";

interface Props {
  channels: Channel[];
  activeChannel: Channel | null;
  setActiveChannel: (ch: Channel) => void;
  profile: any;
  role: string | null;
  voiceChannel: string | null;
  setVoiceChannel: (id: string | null) => void;
}

const voiceChannels = [
  { id: "vc-general", name: "General" },
  { id: "vc-study", name: "Study Room" },
  { id: "vc-collab", name: "Collaboration" },
];

export function HiveChannelSidebar({ channels, activeChannel, setActiveChannel, profile, role, voiceChannel, setVoiceChannel }: Props) {
  const [textCollapsed, setTextCollapsed] = useState(false);
  const [voiceCollapsed, setVoiceCollapsed] = useState(false);

  const getInitials = (name: string) => name?.slice(0, 2).toUpperCase() || "EN";

  return (
    <div className="w-60 shrink-0 bg-[hsl(225,22%,9%)] flex flex-col hidden md:flex">
      {/* Server header */}
      <div className="h-12 px-4 border-b border-[hsl(225,12%,6%)] flex items-center justify-between shadow-sm cursor-pointer hover:bg-[hsl(225,20%,11%)] transition-colors">
        <h2 className="text-[15px] font-bold text-[hsl(210,20%,95%)]">EngiNexus Hive</h2>
        <ChevronDown className="h-4 w-4 text-[hsl(220,10%,55%)]" />
      </div>

      <ScrollArea className="flex-1 px-2 py-3">
        {/* Text Channels */}
        <button onClick={() => setTextCollapsed(!textCollapsed)} className="flex items-center gap-1 px-1 py-1 text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,50%)] hover:text-[hsl(210,20%,80%)] w-full mb-0.5">
          {textCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          Text Channels
        </button>
        {!textCollapsed && channels.map((ch) => (
          <button
            key={ch.id} onClick={() => setActiveChannel(ch)}
            className={`w-full flex items-center gap-2 rounded px-2 py-1.5 text-[15px] transition-colors mb-px group ${
              activeChannel?.id === ch.id 
                ? "bg-[hsl(225,15%,16%)] text-[hsl(210,20%,95%)] font-medium" 
                : "text-[hsl(220,10%,50%)] hover:text-[hsl(210,20%,82%)] hover:bg-[hsl(225,15%,13%)]"
            }`}
          >
            <Hash className="h-4 w-4 shrink-0 opacity-70" />
            <span className="truncate">{ch.name}</span>
          </button>
        ))}

        {/* Voice Channels */}
        <div className="mt-4">
          <button onClick={() => setVoiceCollapsed(!voiceCollapsed)} className="flex items-center gap-1 px-1 py-1 text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,50%)] hover:text-[hsl(210,20%,80%)] w-full mb-0.5">
            {voiceCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            Voice Channels
          </button>
          {!voiceCollapsed && voiceChannels.map((vc) => (
            <button
              key={vc.id} onClick={() => setVoiceChannel(voiceChannel === vc.id ? null : vc.id)}
              className={`w-full flex items-center gap-2 rounded px-2 py-1.5 text-[15px] transition-colors mb-px ${
                voiceChannel === vc.id 
                  ? "bg-[hsl(225,15%,16%)] text-[hsl(210,20%,95%)] font-medium" 
                  : "text-[hsl(220,10%,50%)] hover:text-[hsl(210,20%,82%)] hover:bg-[hsl(225,15%,13%)]"
              }`}
            >
              <Volume2 className="h-4 w-4 shrink-0 opacity-70" />
              <span className="truncate">{vc.name}</span>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* User panel */}
      {profile && (
        <div className="border-t border-[hsl(225,12%,6%)] px-2 py-2 flex items-center gap-2 bg-[hsl(225,25%,7%)]">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback className={`text-[10px] font-bold ${roleDot[role || "apprentice"]} text-white`}>
                {getInitials(profile.display_name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[hsl(225,25%,7%)] bg-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[hsl(210,20%,95%)] truncate">{profile.display_name}</p>
            <p className="text-[10px] text-[hsl(220,10%,50%)]">Online</p>
          </div>
          <div className="flex items-center gap-0.5 text-[10px] text-amber-400 font-mono">
            <Zap className="h-3 w-3" />{profile.volts}
          </div>
        </div>
      )}
    </div>
  );
}
