import { useState, useEffect, useRef, useCallback } from "react";
import {
  Hash, Users, Send, LogIn, Loader2, ChevronDown, ChevronRight,
  Volume2, Smile, Plus, AtSign, Paperclip, Mic, MicOff, PhoneOff,
  Settings, Search, Bell, Pin, UserPlus, Edit2, Trash2, Reply,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export interface Channel { id: string; name: string; description: string; member_count: number; }
export interface Message {
  id: string; channel_id: string; user_id: string; content: string; created_at: string;
  attachment_url?: string; attachment_name?: string;
  profiles?: { display_name: string; volts: number; avatar_url?: string };
  user_roles?: { role: string };
  reactions?: { emoji: string; user_ids: string[] }[];
}

export const roleColor: Record<string, string> = {
  apprentice: "text-[hsl(220,10%,65%)]", journeyman: "text-green-400", master: "text-amber-400", admin: "text-rose-400"
};
export const roleDot: Record<string, string> = {
  apprentice: "bg-[hsl(220,10%,45%)]", journeyman: "bg-green-500", master: "bg-amber-500", admin: "bg-rose-500"
};

const voiceChannels = [
  { id: "vc-general", name: "General" },
  { id: "vc-study", name: "Study Room" },
  { id: "vc-collab", name: "Collaboration" },
];

const EMOJI_LIST = ["👍", "❤️", "😂", "🔥", "🎉", "💡", "⚡", "🚀"];

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
  const [textCollapsed, setTextCollapsed] = useState(false);
  const [voiceCollapsed, setVoiceCollapsed] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);
  const [emojiPicker, setEmojiPicker] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Load channels
  useEffect(() => {
    supabase.from("hive_channels").select("*").order("name").then(({ data }) => {
      if (data) { setChannels(data); setActiveChannel(data[0]); }
    });
  }, []);

  // Load members
  useEffect(() => {
    supabase.from("profiles").select("user_id, display_name, volts, avatar_url").limit(50).then(({ data }) => {
      if (data) setMembers(data);
    });
  }, []);

  // Load messages
  const loadMessages = useCallback(async () => {
    if (!activeChannel) return;
    setLoadingMessages(true); setMessages([]);
    const { data } = await supabase.from("hive_messages").select("*").eq("channel_id", activeChannel.id).order("created_at", { ascending: true }).limit(100);
    if (!data) { setLoadingMessages(false); return; }
    const userIds = [...new Set(data.map(m => m.user_id))];
    if (!userIds.length) { setMessages([]); setLoadingMessages(false); return; }
    const [{ data: profiles }, { data: roles }, { data: reactions }] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, volts, avatar_url").in("user_id", userIds),
      supabase.from("user_roles").select("user_id, role").in("user_id", userIds),
      supabase.from("hive_reactions").select("*").in("message_id", data.map(m => m.id)),
    ]);
    const profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]));
    const roleMap = Object.fromEntries((roles || []).map(r => [r.user_id, r]));

    // Group reactions
    const reactionMap: Record<string, { emoji: string; user_ids: string[] }[]> = {};
    (reactions || []).forEach(r => {
      if (!reactionMap[r.message_id]) reactionMap[r.message_id] = [];
      const existing = reactionMap[r.message_id].find(e => e.emoji === r.emoji);
      if (existing) existing.user_ids.push(r.user_id);
      else reactionMap[r.message_id].push({ emoji: r.emoji, user_ids: [r.user_id] });
    });

    setMessages(data.map(m => ({
      ...m,
      profiles: profileMap[m.user_id] || { display_name: "Engineer", volts: 0 },
      user_roles: roleMap[m.user_id] || { role: "apprentice" },
      reactions: reactionMap[m.id] || [],
    })));
    setLoadingMessages(false);
  }, [activeChannel]);

  useEffect(() => { loadMessages(); }, [loadMessages]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Realtime messages
  useEffect(() => {
    if (!activeChannel) return;
    const channel = supabase.channel(`hive:${activeChannel.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "hive_messages", filter: `channel_id=eq.${activeChannel.id}` },
        async (payload) => {
          const [{ data: pd }, { data: rd }] = await Promise.all([
            supabase.from("profiles").select("display_name, volts, avatar_url").eq("user_id", payload.new.user_id).single(),
            supabase.from("user_roles").select("role").eq("user_id", payload.new.user_id).single(),
          ]);
          setMessages(prev => [...prev, {
            ...(payload.new as Message),
            profiles: pd || { display_name: "Engineer", volts: 0 },
            user_roles: rd || { role: "apprentice" },
            reactions: [],
          }]);
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeChannel]);

  // Typing indicator via presence
  useEffect(() => {
    if (!activeChannel || !user) return;
    const ch = supabase.channel(`typing:${activeChannel.id}`, { config: { presence: { key: user.id } } });
    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState();
      const typing = Object.values(state).flat().filter((p: any) => p.typing && p.user_id !== user.id).map((p: any) => p.display_name);
      setTypingUsers(typing);
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeChannel, user]);

  const broadcastTyping = () => {
    if (!activeChannel || !user || !profile) return;
    const ch = supabase.channel(`typing:${activeChannel.id}`);
    ch.track({ user_id: user.id, display_name: profile.display_name, typing: true });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      ch.track({ user_id: user.id, display_name: profile.display_name, typing: false });
    }, 3000);
  };

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

  const toggleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;
    const msg = messages.find(m => m.id === messageId);
    const existing = msg?.reactions?.find(r => r.emoji === emoji && r.user_ids.includes(user.id));
    if (existing) {
      await supabase.from("hive_reactions").delete().eq("message_id", messageId).eq("user_id", user.id).eq("emoji", emoji);
    } else {
      await supabase.from("hive_reactions").insert({ message_id: messageId, user_id: user.id, emoji });
    }
    setEmojiPicker(null);
    loadMessages();
  };

  const deleteMessage = async (messageId: string) => {
    await supabase.from("hive_messages").delete().eq("id", messageId);
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const getInitials = (name: string) => name?.slice(0, 2).toUpperCase() || "EN";
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (iso: string) => {
    const d = new Date(iso); const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const y = new Date(today); y.setDate(y.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return "Yesterday";
    return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  };
  const isImageUrl = (url?: string) => url && /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);

  // Group messages by date
  const grouped: { date: string; msgs: Message[] }[] = [];
  let lastDate = "";
  messages.forEach(m => {
    const date = formatDate(m.created_at);
    if (date !== lastDate) { grouped.push({ date, msgs: [] }); lastDate = date; }
    grouped[grouped.length - 1].msgs.push(m);
  });

  return (
    <div className="flex h-[calc(100vh-3rem)] bg-[hsl(var(--background))] overflow-hidden">
      {/* Channel sidebar */}
      <div className="w-60 shrink-0 bg-sidebar flex flex-col hidden md:flex border-r border-sidebar-border">
        <div className="h-12 px-4 border-b border-sidebar-border flex items-center justify-between shadow-sm cursor-pointer hover:bg-sidebar-accent transition-colors">
          <h2 className="text-[15px] font-bold text-sidebar-foreground">EngiNexus Hive</h2>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>

        <ScrollArea className="flex-1 px-2 py-3">
          {/* Text */}
          <button onClick={() => setTextCollapsed(!textCollapsed)} className="flex items-center gap-1 px-1 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground w-full mb-0.5">
            {textCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            Text Channels
          </button>
          {!textCollapsed && channels.map(ch => (
            <button key={ch.id} onClick={() => setActiveChannel(ch)}
              className={`w-full flex items-center gap-2 rounded px-2 py-1.5 text-[15px] transition-colors mb-px group ${
                activeChannel?.id === ch.id ? "bg-sidebar-accent text-sidebar-foreground font-medium" : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}>
              <Hash className="h-4 w-4 shrink-0 opacity-70" />
              <span className="truncate">{ch.name}</span>
            </button>
          ))}

          {/* Voice */}
          <div className="mt-4">
            <button onClick={() => setVoiceCollapsed(!voiceCollapsed)} className="flex items-center gap-1 px-1 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground w-full mb-0.5">
              {voiceCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              Voice Channels
            </button>
            {!voiceCollapsed && voiceChannels.map(vc => (
              <button key={vc.id} onClick={() => setVoiceChannel(voiceChannel === vc.id ? null : vc.id)}
                className={`w-full flex items-center gap-2 rounded px-2 py-1.5 text-[15px] transition-colors mb-px ${
                  voiceChannel === vc.id ? "bg-sidebar-accent text-sidebar-foreground font-medium" : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}>
                <Volume2 className="h-4 w-4 shrink-0 opacity-70" />
                <span className="truncate">{vc.name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* User panel */}
        {profile && (
          <div className="border-t border-sidebar-border px-2 py-2 flex items-center gap-2 bg-sidebar">
            <div className="relative">
              <Avatar className="h-8 w-8">
                {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
                <AvatarFallback className={`text-[10px] font-bold ${roleDot[role || "apprentice"]} text-primary-foreground`}>
                  {getInitials(profile.display_name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-sidebar bg-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">{profile.display_name}</p>
              <p className="text-[10px] text-muted-foreground">Online</p>
            </div>
            <div className="flex items-center gap-0.5 text-[10px] text-amber font-mono">
              <span>⚡</span>{profile.volts}
            </div>
          </div>
        )}
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <div className="h-12 border-b border-border px-4 flex items-center gap-3 bg-card shrink-0">
          <Hash className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-foreground text-[15px]">{activeChannel?.name}</span>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm text-muted-foreground truncate flex-1">{activeChannel?.description}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Pin className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setShowMembers(!showMembers)}>
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Messages */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-1">
              {loadingMessages && <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
              {!loadingMessages && !messages.length && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Hash className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">Welcome to #{activeChannel?.name}!</h3>
                  <p className="text-sm text-muted-foreground">This is the start of the #{activeChannel?.name} channel.</p>
                </div>
              )}
              {grouped.map(group => (
                <div key={group.date}>
                  <div className="flex items-center gap-3 my-4">
                    <Separator className="flex-1" />
                    <span className="text-[11px] font-semibold text-muted-foreground px-1">{group.date}</span>
                    <Separator className="flex-1" />
                  </div>
                  {group.msgs.map((m, idx) => {
                    const displayName = m.profiles?.display_name || "Engineer";
                    const userRole = m.user_roles?.role || "apprentice";
                    const prev = idx > 0 ? group.msgs[idx - 1] : null;
                    const isSame = prev?.user_id === m.user_id;
                    const timeDiff = prev ? (new Date(m.created_at).getTime() - new Date(prev.created_at).getTime()) / 60000 : 999;
                    const isGrouped = isSame && timeDiff < 5;

                    return (
                      <div key={m.id}
                        className={`group flex gap-4 rounded px-2 py-0.5 hover:bg-accent/30 relative ${isGrouped ? "" : "mt-4"}`}
                        onMouseEnter={() => setHoveredMsg(m.id)}
                        onMouseLeave={() => { setHoveredMsg(null); setEmojiPicker(null); }}>
                        {isGrouped ? (
                          <div className="w-10 shrink-0 flex items-center justify-center">
                            <span className="text-[10px] text-transparent group-hover:text-muted-foreground">{formatTime(m.created_at)}</span>
                          </div>
                        ) : (
                          <Avatar className="h-10 w-10 shrink-0 mt-0.5 cursor-pointer hover:opacity-80">
                            {m.profiles?.avatar_url && <AvatarImage src={m.profiles.avatar_url} />}
                            <AvatarFallback className={`text-xs font-bold ${roleDot[userRole]} text-primary-foreground`}>
                              {getInitials(displayName)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1 min-w-0">
                          {!isGrouped && (
                            <div className="flex items-baseline gap-2">
                              <span className={`text-[15px] font-medium cursor-pointer hover:underline ${roleColor[userRole]}`}>{displayName}</span>
                              <span className="text-[11px] text-muted-foreground">
                                {formatDate(m.created_at) === "Today" ? `Today at ${formatTime(m.created_at)}` : `${formatDate(m.created_at)} at ${formatTime(m.created_at)}`}
                              </span>
                            </div>
                          )}
                          {/* Content with @mentions highlighted */}
                          <div className="text-[15px] text-foreground/85 whitespace-pre-wrap break-words leading-relaxed">
                            {m.content.includes("```") ? (
                              m.content.split("```").map((part, j) =>
                                j % 2 === 0 ? <span key={j}>{renderMentions(part)}</span> : (
                                  <pre key={j} className="my-1.5 rounded border border-border bg-muted p-3 font-mono text-sm overflow-x-auto">
                                    <code>{part.replace(/^(cpp|python|rust|js|ts)\n/, "")}</code>
                                  </pre>
                                ))
                            ) : renderMentions(m.content)}
                          </div>
                          {/* Attachment */}
                          {m.attachment_url && (
                            isImageUrl(m.attachment_url) ? (
                              <img src={m.attachment_url} alt={m.attachment_name || "attachment"} className="mt-1.5 max-w-sm rounded-lg border border-border max-h-80 object-cover" />
                            ) : (
                              <a href={m.attachment_url} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-2 rounded-lg bg-muted border border-border px-3 py-2 text-sm text-primary hover:underline">
                                📎 {m.attachment_name || "Download file"}
                              </a>
                            )
                          )}
                          {/* Reactions */}
                          {m.reactions && m.reactions.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {m.reactions.map(r => (
                                <button key={r.emoji} onClick={() => toggleReaction(m.id, r.emoji)}
                                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border transition-colors ${
                                    r.user_ids.includes(user?.id || "") ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground hover:bg-accent"
                                  }`}>
                                  <span>{r.emoji}</span>
                                  <span className="font-mono">{r.user_ids.length}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Action bar */}
                        {hoveredMsg === m.id && (
                          <div className="absolute -top-3 right-2 flex items-center gap-0.5 bg-card border border-border rounded-md shadow-md p-0.5">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button onClick={() => setEmojiPicker(emojiPicker === m.id ? null : m.id)} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground">
                                  <Smile className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Add Reaction</TooltipContent>
                            </Tooltip>
                            {m.user_id === user?.id && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button onClick={() => deleteMessage(m.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        )}
                        {/* Emoji picker */}
                        {emojiPicker === m.id && (
                          <div className="absolute -top-10 right-2 flex gap-1 bg-card border border-border rounded-lg shadow-lg p-1.5 z-10">
                            {EMOJI_LIST.map(e => (
                              <button key={e} onClick={() => toggleReaction(m.id, e)} className="text-lg hover:scale-125 transition-transform p-0.5">
                                {e}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Members panel */}
          {showMembers && (
            <div className="w-60 shrink-0 bg-card border-l border-border hidden lg:block">
              <ScrollArea className="h-full p-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Members — {members.length}
                </h3>
                {members.map(m => (
                  <div key={m.user_id} className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-accent/30 cursor-pointer">
                    <Avatar className="h-8 w-8">
                      {m.avatar_url && <AvatarImage src={m.avatar_url} />}
                      <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                        {getInitials(m.display_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground truncate">{m.display_name}</span>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Voice panel */}
        {voiceChannel && (
          <div className="border-t border-border bg-card px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-500">Voice Connected</span>
              <span className="text-xs text-muted-foreground">— {voiceChannels.find(v => v.id === voiceChannel)?.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMuted(!muted)}>
                {muted ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4 text-foreground" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setVoiceChannel(null)}>
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="px-4 py-1 text-xs text-muted-foreground">
            <span className="font-medium">{typingUsers.join(", ")}</span> {typingUsers.length === 1 ? "is" : "are"} typing...
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-6 pt-1 shrink-0">
          {user ? (
            <div className="rounded-lg bg-muted px-4 py-2.5 flex items-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="text-muted-foreground hover:text-foreground transition-colors">
                <Plus className="h-5 w-5" />
              </button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
              <Input
                placeholder={`Message #${activeChannel?.name || "general"}`}
                value={msg} onChange={(e) => { setMsg(e.target.value); broadcastTyping(); }}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 text-foreground placeholder:text-muted-foreground"
                disabled={sending}
              />
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Smile className="h-5 w-5" />
              </button>
              <Button size="icon" onClick={sendMessage} disabled={sending || !msg.trim()} className="h-8 w-8 rounded-md">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground flex-1">Sign in to join the conversation</p>
              <Button size="sm" onClick={() => navigate("/auth")}>
                <LogIn className="h-4 w-4 mr-1" /> Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function renderMentions(text: string) {
  const parts = text.split(/(@\w+)/g);
  return parts.map((part, i) =>
    part.startsWith("@") ? (
      <span key={i} className="bg-primary/10 text-primary rounded px-1 font-medium cursor-pointer hover:underline">{part}</span>
    ) : part
  );
}

export default Hive;
