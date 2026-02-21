import { useState, useEffect, useRef } from "react";
import { MessageSquare, Hash, Users, Zap, Trophy, Send, LogIn, Loader2, ChevronDown, ChevronRight, Volume2, AtSign, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Channel { id: string; name: string; description: string; member_count: number; }
interface Message { id: string; channel_id: string; user_id: string; content: string; created_at: string; profiles?: { display_name: string; volts: number; }; user_roles?: { role: string; }; }

const roleColor: Record<string, string> = { apprentice: "text-muted-foreground", journeyman: "text-accent", master: "text-amber", admin: "text-rose" };
const roleDot: Record<string, string> = { apprentice: "bg-muted-foreground", journeyman: "bg-accent", master: "bg-amber", admin: "bg-rose" };

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
  const [textCollapsed, setTextCollapsed] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("hive_channels").select("*").order("name").then(({ data }) => {
      if (data) { setChannels(data); setActiveChannel(data[0]); }
    });
  }, []);

  useEffect(() => {
    if (!activeChannel) return;
    setLoadingMessages(true); setMessages([]);
    supabase.from("hive_messages").select("*").eq("channel_id", activeChannel.id).order("created_at", { ascending: true }).limit(50)
      .then(async ({ data }) => {
        if (!data) { setLoadingMessages(false); return; }
        const userIds = [...new Set(data.map((m) => m.user_id))];
        const [{ data: profiles }, { data: roles }] = await Promise.all([
          supabase.from("profiles").select("user_id, display_name, volts").in("user_id", userIds),
          supabase.from("user_roles").select("user_id, role").in("user_id", userIds),
        ]);
        const profileMap = Object.fromEntries((profiles || []).map((p) => [p.user_id, p]));
        const roleMap = Object.fromEntries((roles || []).map((r) => [r.user_id, r]));
        setMessages(data.map((m) => ({ ...m, profiles: profileMap[m.user_id] || { display_name: "Engineer", volts: 0 }, user_roles: roleMap[m.user_id] || { role: "apprentice" } })));
        setLoadingMessages(false);
      });
  }, [activeChannel]);

  useEffect(() => {
    if (!activeChannel) return;
    const channel = supabase.channel(`hive:${activeChannel.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "hive_messages", filter: `channel_id=eq.${activeChannel.id}` },
        async (payload) => {
          const [{ data: profileData }, { data: roleData }] = await Promise.all([
            supabase.from("profiles").select("display_name, volts").eq("user_id", payload.new.user_id).single(),
            supabase.from("user_roles").select("role").eq("user_id", payload.new.user_id).single(),
          ]);
          setMessages((prev) => [...prev, { ...(payload.new as Message), profiles: profileData || { display_name: "Engineer", volts: 0 }, user_roles: roleData || { role: "apprentice" } }]);
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeChannel]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!msg.trim() || !user || !activeChannel) return;
    setSending(true);
    const { error } = await supabase.from("hive_messages").insert({ channel_id: activeChannel.id, user_id: user.id, content: msg.trim() });
    if (error) toast({ title: "Failed to send", description: error.message, variant: "destructive" });
    else setMsg("");
    setSending(false);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  };

  // Group messages by user + time proximity
  const groupedMessages: { date: string; msgs: Message[] }[] = [];
  let lastDate = "";
  messages.forEach((m) => {
    const date = formatDate(m.created_at);
    if (date !== lastDate) { groupedMessages.push({ date, msgs: [] }); lastDate = date; }
    groupedMessages[groupedMessages.length - 1].msgs.push(m);
  });

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Discord-style channel sidebar */}
      <div className="w-60 shrink-0 border-r border-border bg-card flex flex-col hidden md:flex">
        {/* Server header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">EngiNexus Hive</h2>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>

        <ScrollArea className="flex-1 px-2 py-2">
          {/* Text Channels */}
          <button onClick={() => setTextCollapsed(!textCollapsed)} className="flex items-center gap-1 px-1 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground w-full">
            {textCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            Text Channels
          </button>
          {!textCollapsed && channels.map((ch) => (
            <button
              key={ch.id} onClick={() => setActiveChannel(ch)}
              className={`w-full flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors mb-0.5 ${activeChannel?.id === ch.id ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
            >
              <Hash className="h-4 w-4 shrink-0 opacity-60" />
              <span className="truncate">{ch.name}</span>
            </button>
          ))}

          {/* Voice Channels placeholder */}
          <div className="mt-4">
            <p className="flex items-center gap-1 px-1 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <ChevronRight className="h-3 w-3" /> Voice Channels
            </p>
            <p className="px-3 py-1 text-xs text-muted-foreground/60 italic">Coming soon</p>
          </div>
        </ScrollArea>

        {/* User panel at bottom */}
        {profile && (
          <div className="border-t border-border px-2 py-2 flex items-center gap-2 bg-muted/30">
            <Avatar className="h-8 w-8">
              <AvatarFallback className={`text-[10px] font-bold ${roleDot[role || "apprentice"]} text-white`}>
                {getInitials(profile.display_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{profile.display_name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{role || "apprentice"}</p>
            </div>
            <div className="flex items-center gap-0.5 text-[10px] text-amber font-mono">
              <Zap className="h-3 w-3" />{profile.volts}
            </div>
          </div>
        )}
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Channel header */}
        <div className="border-b border-border px-4 py-2.5 flex items-center gap-3">
          <Hash className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-foreground">{activeChannel?.name}</span>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm text-muted-foreground truncate flex-1">{activeChannel?.description}</span>
          <Button variant="ghost" size="sm" onClick={() => setShowMembers(!showMembers)} className="text-muted-foreground">
            <Users className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Messages */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-1">
              {loadingMessages && <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
              {!loadingMessages && messages.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Hash className="h-16 w-16 mx-auto mb-4 opacity-10" />
                  <h3 className="text-lg font-semibold text-foreground">Welcome to #{activeChannel?.name}!</h3>
                  <p className="text-sm">This is the start of the channel. Say hello!</p>
                </div>
              )}
              {groupedMessages.map((group) => (
                <div key={group.date}>
                  <div className="flex items-center gap-3 my-4">
                    <Separator className="flex-1" />
                    <span className="text-xs font-semibold text-muted-foreground">{group.date}</span>
                    <Separator className="flex-1" />
                  </div>
                  {group.msgs.map((m, idx) => {
                    const displayName = m.profiles?.display_name || "Engineer";
                    const userRole = m.user_roles?.role || "apprentice";
                    const prevMsg = idx > 0 ? group.msgs[idx - 1] : null;
                    const isSameUser = prevMsg?.user_id === m.user_id;
                    const timeDiff = prevMsg ? (new Date(m.created_at).getTime() - new Date(prevMsg.created_at).getTime()) / 60000 : 999;
                    const isGrouped = isSameUser && timeDiff < 5;

                    return (
                      <div key={m.id} className={`group flex gap-3 rounded px-2 py-0.5 hover:bg-muted/30 ${isGrouped ? "" : "mt-3"}`}>
                        {isGrouped ? (
                          <div className="w-10 shrink-0 flex items-center justify-center">
                            <span className="text-[10px] text-muted-foreground/0 group-hover:text-muted-foreground/60">{formatTime(m.created_at)}</span>
                          </div>
                        ) : (
                          <Avatar className="h-10 w-10 shrink-0 mt-0.5">
                            <AvatarFallback className={`text-xs font-bold ${roleDot[userRole]} text-white`}>
                              {getInitials(displayName)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1 min-w-0">
                          {!isGrouped && (
                            <div className="flex items-baseline gap-2">
                              <span className={`text-sm font-semibold ${roleColor[userRole]}`}>{displayName}</span>
                              <span className="text-[10px] text-muted-foreground">{formatTime(m.created_at)}</span>
                            </div>
                          )}
                          <div className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
                            {m.content.includes("```") ? (
                              m.content.split("```").map((part, j) =>
                                j % 2 === 0 ? <span key={j}>{part}</span> : (
                                  <pre key={j} className="my-1 rounded border border-border bg-muted p-2 font-mono text-xs overflow-x-auto"><code>{part.replace(/^(cpp|python|rust|js|ts)\n/, "")}</code></pre>
                                ))
                            ) : m.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Members sidebar */}
          {showMembers && (
            <div className="w-56 shrink-0 border-l border-border bg-card hidden lg:block">
              <ScrollArea className="h-full p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Online — 1</p>
                {profile && (
                  <div className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/50">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`text-[10px] font-bold ${roleDot[role || "apprentice"]} text-white`}>
                          {getInitials(profile.display_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{profile.display_name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{role || "apprentice"}</p>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Message input */}
        <div className="border-t border-border p-3">
          {user ? (
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
              <div className="flex gap-2 items-center">
                <button className="text-muted-foreground hover:text-foreground"><AtSign className="h-5 w-5" /></button>
                <Input
                  placeholder={`Message #${activeChannel?.name || "general"}`}
                  value={msg} onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-0"
                  disabled={sending}
                />
                <button className="text-muted-foreground hover:text-foreground"><Smile className="h-5 w-5" /></button>
                <Button size="icon" onClick={sendMessage} disabled={sending || !msg.trim()} className="h-8 w-8 bg-primary hover:bg-primary/90">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
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
