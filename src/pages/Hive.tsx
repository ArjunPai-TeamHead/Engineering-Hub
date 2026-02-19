import { useState, useEffect, useRef } from "react";
import { MessageSquare, Hash, Users, Zap, Trophy, Send, LogIn, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Channel {
  id: string;
  name: string;
  description: string;
  member_count: number;
}

interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    display_name: string;
    volts: number;
  };
  user_roles?: {
    role: string;
  };
}

const roleColor: Record<string, string> = {
  apprentice: "text-muted-foreground",
  journeyman: "text-accent",
  master: "text-amber",
  admin: "text-rose",
};

const roleLabel: Record<string, string> = {
  apprentice: "Apprentice",
  journeyman: "Journeyman",
  master: "Master",
  admin: "Admin",
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch channels
  useEffect(() => {
    supabase.from("hive_channels").select("*").order("name").then(({ data }) => {
      if (data) {
        setChannels(data);
        setActiveChannel(data[0]);
      }
    });
  }, []);

  // Fetch messages when channel changes
  useEffect(() => {
    if (!activeChannel) return;
    setLoadingMessages(true);
    setMessages([]);

    supabase
      .from("hive_messages")
      .select("*")
      .eq("channel_id", activeChannel.id)
      .order("created_at", { ascending: true })
      .limit(50)
      .then(async ({ data }) => {
        if (!data) { setLoadingMessages(false); return; }

        // Enrich with profiles & roles
        const userIds = [...new Set(data.map((m) => m.user_id))];
        const [{ data: profiles }, { data: roles }] = await Promise.all([
          supabase.from("profiles").select("user_id, display_name, volts").in("user_id", userIds),
          supabase.from("user_roles").select("user_id, role").in("user_id", userIds),
        ]);

        const profileMap = Object.fromEntries((profiles || []).map((p) => [p.user_id, p]));
        const roleMap = Object.fromEntries((roles || []).map((r) => [r.user_id, r]));

        const enriched: Message[] = data.map((m) => ({
          ...m,
          profiles: profileMap[m.user_id] || { display_name: "Engineer", volts: 0 },
          user_roles: roleMap[m.user_id] || { role: "apprentice" },
        }));

        setMessages(enriched);
        setLoadingMessages(false);
      });
  }, [activeChannel]);

  // Real-time subscription
  useEffect(() => {
    if (!activeChannel) return;

    const channel = supabase
      .channel(`hive:${activeChannel.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "hive_messages", filter: `channel_id=eq.${activeChannel.id}` },
        async (payload) => {
          // Fetch profile for new message
          const { data: profileData } = await supabase
            .from("profiles")
            .select("display_name, volts")
            .eq("user_id", payload.new.user_id)
            .single();
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", payload.new.user_id)
            .single();

          const newMsg: Message = {
            ...(payload.new as Message),
            profiles: profileData || { display_name: "Engineer", volts: 0 },
            user_roles: roleData || { role: "apprentice" },
          };
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeChannel]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!msg.trim() || !user || !activeChannel) return;
    setSending(true);

    const { error } = await supabase.from("hive_messages").insert({
      channel_id: activeChannel.id,
      user_id: user.id,
      content: msg.trim(),
    });

    if (error) {
      toast({ title: "Failed to send message", description: error.message, variant: "destructive" });
    } else {
      setMsg("");
    }
    setSending(false);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return d.toLocaleDateString();
  };

  const renderMessageContent = (content: string) => {
    if (!content.includes("```")) return <span>{content}</span>;
    return (
      <div>
        {content.split("```").map((part, j) =>
          j % 2 === 0 ? <span key={j}>{part}</span> : (
            <pre key={j} className="my-2 rounded-md border border-border bg-muted p-3 font-mono text-xs overflow-x-auto">
              <code>{part.replace(/^(cpp|python|rust|js|ts)\n/, "")}</code>
            </pre>
          )
        )}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Channel sidebar */}
      <div className="w-56 shrink-0 border-r border-border bg-card p-3 overflow-y-auto hidden md:block">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          <h2 className="text-sm font-bold text-foreground">Channels</h2>
        </div>
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(ch)}
            className={`mb-1 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors ${activeChannel?.id === ch.id ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted"}`}
          >
            <span className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" />{ch.name}</span>
          </button>
        ))}

        {/* Leaderboard */}
        <div className="mt-6 rounded-lg border border-border bg-muted/50 p-3">
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Trophy className="h-3.5 w-3.5 text-amber" /> Leaderboard
          </div>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <p className="italic">Login to see rankings</p>
          </div>
        </div>

        {/* Auth status */}
        {profile && (
          <div className="mt-3 rounded-lg border border-accent/20 bg-accent/5 p-3">
            <p className="text-xs font-semibold text-foreground">{profile.display_name}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{role || "apprentice"}</p>
            <div className="flex items-center gap-1 mt-1">
              <Zap className="h-3 w-3 text-amber" />
              <span className="text-xs font-mono text-amber">{profile.volts}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-border px-4 py-2 flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-foreground text-sm">{activeChannel?.name}</span>
          <span className="text-xs text-muted-foreground">{activeChannel?.description}</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> Live
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loadingMessages && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loadingMessages && messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No messages yet — be the first!</p>
            </div>
          )}

          {messages.map((m) => {
            const displayName = m.profiles?.display_name || "Engineer";
            const volts = m.profiles?.volts || 0;
            const userRole = m.user_roles?.role || "apprentice";
            const isOwn = m.user_id === user?.id;

            return (
              <div key={m.id} className={`group ${isOwn ? "pl-8" : ""}`}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">{displayName}</span>
                  <Badge variant="outline" className={`text-[10px] ${roleColor[userRole]}`}>
                    {roleLabel[userRole] || userRole}
                  </Badge>
                  <span className="flex items-center gap-0.5 text-[10px] text-amber font-mono">
                    <Zap className="h-2.5 w-2.5" />{volts}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{formatTime(m.created_at)}</span>
                </div>
                <div className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap">
                  {renderMessageContent(m.content)}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-3">
          {user ? (
            <div className="flex gap-2">
              <Input
                placeholder={`Message #${activeChannel?.name || "general"}...`}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                className="flex-1"
                disabled={sending}
              />
              <Button size="icon" onClick={sendMessage} disabled={sending || !msg.trim()} className="bg-accent hover:bg-accent/90">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground flex-1">Sign in to join the conversation</p>
              <Button size="sm" onClick={() => navigate("/auth")} className="bg-accent hover:bg-accent/90">
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
