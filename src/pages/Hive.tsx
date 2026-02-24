import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Hash, Users, Zap, Send, LogIn, Loader2, ChevronDown, ChevronRight, 
  Volume2, Smile, Plus, Paperclip, Image as ImageIcon, Headphones, Video, PhoneOff, Mic, MicOff
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { HiveChannelSidebar } from "@/components/hive/HiveChannelSidebar";
import { HiveMessageArea } from "@/components/hive/HiveMessageArea";
import { HiveMemberList } from "@/components/hive/HiveMemberList";
import { HiveVoicePanel } from "@/components/hive/HiveVoicePanel";

export interface Channel { id: string; name: string; description: string; member_count: number; }
export interface Message { 
  id: string; channel_id: string; user_id: string; content: string; created_at: string; 
  attachment_url?: string; attachment_name?: string;
  profiles?: { display_name: string; volts: number; }; 
  user_roles?: { role: string; }; 
  reactions?: { emoji: string; count: number; reacted: boolean }[];
}

export const roleColor: Record<string, string> = { 
  apprentice: "text-muted-foreground", journeyman: "text-green-400", master: "text-amber-400", admin: "text-rose-400" 
};
export const roleDot: Record<string, string> = { 
  apprentice: "bg-muted-foreground", journeyman: "bg-green-500", master: "bg-amber-500", admin: "bg-rose-500" 
};

const Hive = () => {
  const { user, profile, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  const [voiceChannel, setVoiceChannel] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from("hive_channels").select("*").order("name").then(({ data }) => {
      if (data) { setChannels(data); setActiveChannel(data[0]); }
    });
  }, []);

  const loadMessages = useCallback(async () => {
    if (!activeChannel) return;
    setLoadingMessages(true); setMessages([]);
    const { data } = await supabase.from("hive_messages").select("*").eq("channel_id", activeChannel.id).order("created_at", { ascending: true }).limit(50);
    if (!data) { setLoadingMessages(false); return; }
    const userIds = [...new Set(data.map((m) => m.user_id))];
    if (userIds.length === 0) { setMessages([]); setLoadingMessages(false); return; }
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, volts").in("user_id", userIds),
      supabase.from("user_roles").select("user_id, role").in("user_id", userIds),
    ]);
    const profileMap = Object.fromEntries((profiles || []).map((p) => [p.user_id, p]));
    const roleMap = Object.fromEntries((roles || []).map((r) => [r.user_id, r]));
    setMessages(data.map((m) => ({ 
      ...m, 
      profiles: profileMap[m.user_id] || { display_name: "Engineer", volts: 0 }, 
      user_roles: roleMap[m.user_id] || { role: "apprentice" } 
    })));
    setLoadingMessages(false);
  }, [activeChannel]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  useEffect(() => {
    if (!activeChannel) return;
    const channel = supabase.channel(`hive:${activeChannel.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "hive_messages", filter: `channel_id=eq.${activeChannel.id}` },
        async (payload) => {
          const [{ data: profileData }, { data: roleData }] = await Promise.all([
            supabase.from("profiles").select("display_name, volts").eq("user_id", payload.new.user_id).single(),
            supabase.from("user_roles").select("role").eq("user_id", payload.new.user_id).single(),
          ]);
          setMessages((prev) => [...prev, { 
            ...(payload.new as Message), 
            profiles: profileData || { display_name: "Engineer", volts: 0 }, 
            user_roles: roleData || { role: "apprentice" } 
          }]);
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeChannel]);

  const sendMessage = async () => {
    if (!msg.trim() || !user || !activeChannel) return;
    setSending(true);
    const { error } = await supabase.from("hive_messages").insert({ channel_id: activeChannel.id, user_id: user.id, content: msg.trim() });
    if (error) toast({ title: "Failed to send", description: error.message, variant: "destructive" });
    else setMsg("");
    setSending(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !activeChannel) return;
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("chat-uploads").upload(filePath, file);
    if (uploadError) { toast({ title: "Upload failed", variant: "destructive" }); return; }
    const { data: urlData } = supabase.storage.from("chat-uploads").getPublicUrl(filePath);
    await supabase.from("hive_messages").insert({ 
      channel_id: activeChannel.id, user_id: user.id, 
      content: `📎 ${file.name}`, 
      attachment_url: urlData.publicUrl, 
      attachment_name: file.name 
    });
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] bg-[hsl(225,25%,6%)] overflow-hidden">
      <HiveChannelSidebar 
        channels={channels} 
        activeChannel={activeChannel} 
        setActiveChannel={setActiveChannel} 
        profile={profile} 
        role={role}
        voiceChannel={voiceChannel}
        setVoiceChannel={setVoiceChannel}
      />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Channel header */}
        <div className="h-12 border-b border-[hsl(225,12%,14%)] px-4 flex items-center gap-3 bg-[hsl(225,20%,8%)] shrink-0">
          <Hash className="h-5 w-5 text-[hsl(220,10%,45%)]" />
          <span className="font-semibold text-[hsl(210,20%,95%)] text-[15px]">{activeChannel?.name}</span>
          <Separator orientation="vertical" className="h-5 bg-[hsl(225,12%,18%)]" />
          <span className="text-sm text-[hsl(220,10%,45%)] truncate flex-1">{activeChannel?.description}</span>
          <Button variant="ghost" size="sm" onClick={() => setShowMembers(!showMembers)} className="text-[hsl(220,10%,55%)] hover:text-[hsl(210,20%,95%)] hover:bg-[hsl(225,15%,14%)]">
            <Users className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <HiveMessageArea 
            messages={messages} 
            loadingMessages={loadingMessages} 
            activeChannel={activeChannel} 
          />

          {showMembers && (
            <HiveMemberList profile={profile} role={role} />
          )}
        </div>

        {/* Voice panel */}
        {voiceChannel && (
          <HiveVoicePanel 
            channelName={channels.find(c => c.id === voiceChannel)?.name || "Voice"} 
            muted={muted} 
            setMuted={setMuted} 
            onDisconnect={() => setVoiceChannel(null)} 
          />
        )}

        {/* Message input */}
        <div className="px-4 pb-6 pt-1 shrink-0">
          {user ? (
            <div className="rounded-lg bg-[hsl(225,15%,13%)] px-4 py-2.5 flex items-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="text-[hsl(220,10%,50%)] hover:text-[hsl(210,20%,80%)] transition-colors">
                <Plus className="h-5 w-5" />
              </button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
              <Input
                placeholder={`Message #${activeChannel?.name || "general"}`}
                value={msg} onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 text-[hsl(210,20%,93%)] placeholder:text-[hsl(220,10%,40%)]"
                disabled={sending}
              />
              <button className="text-[hsl(220,10%,50%)] hover:text-[hsl(210,20%,80%)] transition-colors">
                <Smile className="h-5 w-5" />
              </button>
              <Button size="icon" onClick={sendMessage} disabled={sending || !msg.trim()} className="h-8 w-8 rounded-md bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,58%)]">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg bg-[hsl(225,15%,13%)] p-3">
              <p className="text-sm text-[hsl(220,10%,55%)] flex-1">Sign in to join the conversation</p>
              <Button size="sm" onClick={() => navigate("/auth")} className="bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,58%)]">
                <LogIn className="h-4 w-4 mr-1" /> Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hive;
