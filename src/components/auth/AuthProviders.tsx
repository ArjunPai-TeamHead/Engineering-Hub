import {
  Mail, Phone, Shield, Wallet, Globe, GitBranch, MessageSquare,
  Facebook, Github, Key, Linkedin, BookOpen, Tv, Hash, Music,
  Briefcase, Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const providers = [
  { name: "Email", icon: Mail, enabled: true },
  { name: "Phone", icon: Phone },
  { name: "SAML 2.0", icon: Shield },
  { name: "Web3 Wallet", icon: Wallet },
  { name: "Apple", icon: Globe },
  { name: "Azure", icon: Globe },
  { name: "Bitbucket", icon: GitBranch },
  { name: "Discord", icon: MessageSquare },
  { name: "Facebook", icon: Facebook },
  { name: "Figma", icon: Globe },
  { name: "GitHub", icon: Github },
  { name: "GitLab", icon: GitBranch },
  { name: "Google", icon: Globe },
  { name: "Kakao", icon: MessageSquare },
  { name: "KeyCloak", icon: Key },
  { name: "LinkedIn (OIDC)", icon: Linkedin },
  { name: "Notion", icon: BookOpen },
  { name: "Twitch", icon: Tv },
  { name: "X / Twitter (OAuth 2.0)", icon: Hash },
  { name: "Twitter (Deprecated)", icon: Hash },
  { name: "Slack (OIDC)", icon: Hash },
  { name: "Slack (Deprecated)", icon: Hash },
  { name: "Spotify", icon: Music },
  { name: "WorkOS", icon: Briefcase },
  { name: "Zoom", icon: Video },
];

const AuthProviders = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-6">
      <div className="relative mb-4">
        <Separator className="bg-border/50" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-[11px] text-muted-foreground uppercase tracking-wider">
          providers
        </span>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full text-xs text-muted-foreground hover:text-foreground mb-2"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Hide" : "View all"} authentication providers
        {expanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
      </Button>

      {expanded && (
        <TooltipProvider delayDuration={200}>
          <ScrollArea className="h-[300px] rounded-xl border border-border/40 bg-background/30">
            <div className="p-2 space-y-0.5">
              {providers.map((provider) => {
                const Icon = provider.icon;
                const enabled = provider.enabled;

                const item = (
                  <div
                    key={provider.name}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      enabled
                        ? "hover:bg-accent/50"
                        : "opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div className={`rounded-lg p-1.5 ${enabled ? "bg-primary/10" : "bg-muted"}`}>
                      <Icon className={`h-4 w-4 ${enabled ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <span className="text-sm font-medium text-foreground flex-1 truncate">
                      {provider.name}
                    </span>
                    <Badge
                      variant={enabled ? "default" : "secondary"}
                      className="text-[10px] px-2 py-0.5 shrink-0"
                    >
                      {enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                );

                if (!enabled) {
                  return (
                    <Tooltip key={provider.name}>
                      <TooltipTrigger asChild>
                        {item}
                      </TooltipTrigger>
                      <TooltipContent side="left" className="text-xs">
                        Coming Soon
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return item;
              })}
            </div>
          </ScrollArea>
        </TooltipProvider>
      )}
    </div>
  );
};

export default AuthProviders;
