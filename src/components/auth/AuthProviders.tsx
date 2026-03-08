import {
  Mail, Phone, Shield, Wallet, Globe, GitBranch, MessageSquare,
  Facebook, Github, Key, Linkedin, BookOpen, Tv, Hash, Music,
  Briefcase, Video,
} from "lucide-react";

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
  { name: "X / Twitter", icon: Hash },
  { name: "Slack (OIDC)", icon: Hash },
  { name: "Spotify", icon: Music },
  { name: "WorkOS", icon: Briefcase },
  { name: "Zoom", icon: Video },
];

interface AuthProvidersProps {
  onSelect: (name: string, enabled: boolean) => void;
}

const AuthProviders = ({ onSelect }: AuthProvidersProps) => {
  return (
    <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
      {providers.map((provider) => {
        const Icon = provider.icon;
        const enabled = !!provider.enabled;

        return (
          <button
            key={provider.name}
            type="button"
            onClick={() => onSelect(provider.name, enabled)}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
              enabled
                ? "auth-glass-green-item hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] cursor-pointer"
                : "auth-glass-dark-item hover:bg-white/[0.03] cursor-pointer"
            }`}
          >
            <div className={`rounded-lg p-2 ${
              enabled
                ? "bg-emerald-500/15 border border-emerald-500/20"
                : "bg-white/5 border border-white/5"
            }`}>
              <Icon className={`h-4 w-4 ${enabled ? "text-emerald-400" : "text-white/30"}`} />
            </div>
            <span className={`text-sm font-medium flex-1 text-left ${
              enabled ? "text-emerald-300" : "text-white/30"
            }`}>
              {provider.name}
            </span>
            <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${
              enabled
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "bg-white/5 text-white/20 border border-white/5"
            }`}>
              {enabled ? "Enabled" : "Disabled"}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AuthProviders;
