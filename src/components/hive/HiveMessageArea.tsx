import { useEffect, useRef } from "react";
import { Hash, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Channel, Message } from "@/pages/Hive";
import { roleColor, roleDot } from "@/pages/Hive";

interface Props {
  messages: Message[];
  loadingMessages: boolean;
  activeChannel: Channel | null;
}

const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
};

const getInitials = (name: string) => name?.slice(0, 2).toUpperCase() || "EN";

export function HiveMessageArea({ messages, loadingMessages, activeChannel }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Group by date
  const groupedMessages: { date: string; msgs: Message[] }[] = [];
  let lastDate = "";
  messages.forEach((m) => {
    const date = formatDate(m.created_at);
    if (date !== lastDate) { groupedMessages.push({ date, msgs: [] }); lastDate = date; }
    groupedMessages[groupedMessages.length - 1].msgs.push(m);
  });

  const isImageUrl = (url?: string) => url && /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);

  return (
    <ScrollArea className="flex-1 bg-[hsl(225,20%,8%)]">
      <div className="p-4 space-y-1">
        {loadingMessages && <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[hsl(220,10%,45%)]" /></div>}
        {!loadingMessages && messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(225,15%,14%)] flex items-center justify-center">
              <Hash className="h-8 w-8 text-[hsl(220,10%,35%)]" />
            </div>
            <h3 className="text-xl font-bold text-[hsl(210,20%,95%)] mb-1">Welcome to #{activeChannel?.name}!</h3>
            <p className="text-sm text-[hsl(220,10%,45%)]">This is the start of the #{activeChannel?.name} channel.</p>
          </div>
        )}
        {groupedMessages.map((group) => (
          <div key={group.date}>
            <div className="flex items-center gap-3 my-4">
              <Separator className="flex-1 bg-[hsl(225,12%,16%)]" />
              <span className="text-[11px] font-semibold text-[hsl(220,10%,45%)] px-1">{group.date}</span>
              <Separator className="flex-1 bg-[hsl(225,12%,16%)]" />
            </div>
            {group.msgs.map((m, idx) => {
              const displayName = m.profiles?.display_name || "Engineer";
              const userRole = m.user_roles?.role || "apprentice";
              const prevMsg = idx > 0 ? group.msgs[idx - 1] : null;
              const isSameUser = prevMsg?.user_id === m.user_id;
              const timeDiff = prevMsg ? (new Date(m.created_at).getTime() - new Date(prevMsg.created_at).getTime()) / 60000 : 999;
              const isGrouped = isSameUser && timeDiff < 5;

              return (
                <div key={m.id} className={`group flex gap-4 rounded px-2 py-0.5 hover:bg-[hsl(225,15%,10%)] ${isGrouped ? "" : "mt-4"}`}>
                  {isGrouped ? (
                    <div className="w-10 shrink-0 flex items-center justify-center">
                      <span className="text-[10px] text-transparent group-hover:text-[hsl(220,10%,40%)]">{formatTime(m.created_at)}</span>
                    </div>
                  ) : (
                    <Avatar className="h-10 w-10 shrink-0 mt-0.5 cursor-pointer hover:opacity-80">
                      <AvatarFallback className={`text-xs font-bold ${roleDot[userRole]} text-white`}>
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 min-w-0">
                    {!isGrouped && (
                      <div className="flex items-baseline gap-2">
                        <span className={`text-[15px] font-medium cursor-pointer hover:underline ${
                          userRole === "admin" ? "text-rose-400" : 
                          userRole === "master" ? "text-amber-400" : 
                          userRole === "journeyman" ? "text-green-400" : 
                          "text-[hsl(210,20%,90%)]"
                        }`}>{displayName}</span>
                        <span className="text-[11px] text-[hsl(220,10%,40%)]">
                          {formatDate(m.created_at) === "Today" ? `Today at ${formatTime(m.created_at)}` : 
                           `${formatDate(m.created_at)} at ${formatTime(m.created_at)}`}
                        </span>
                      </div>
                    )}
                    <div className="text-[15px] text-[hsl(210,18%,82%)] whitespace-pre-wrap break-words leading-relaxed">
                      {m.content.includes("```") ? (
                        m.content.split("```").map((part, j) =>
                          j % 2 === 0 ? <span key={j}>{part}</span> : (
                            <pre key={j} className="my-1.5 rounded border border-[hsl(225,12%,18%)] bg-[hsl(225,20%,6%)] p-3 font-mono text-sm overflow-x-auto">
                              <code>{part.replace(/^(cpp|python|rust|js|ts)\n/, "")}</code>
                            </pre>
                          ))
                      ) : m.content}
                    </div>
                    {/* Attachment */}
                    {m.attachment_url && (
                      isImageUrl(m.attachment_url) ? (
                        <img src={m.attachment_url} alt={m.attachment_name || "attachment"} className="mt-1.5 max-w-sm rounded-lg border border-[hsl(225,12%,18%)] max-h-80 object-cover" />
                      ) : (
                        <a href={m.attachment_url} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-2 rounded-lg bg-[hsl(225,15%,12%)] border border-[hsl(225,12%,18%)] px-3 py-2 text-sm text-[hsl(215,90%,65%)] hover:underline">
                          📎 {m.attachment_name || "Download file"}
                        </a>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
