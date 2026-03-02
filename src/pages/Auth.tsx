import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BrainCircuit, Mail, Lock, User, Eye, EyeOff, Zap, Phone, Shield, Wallet,
  Github, MessageSquare, Facebook, Figma, GitBranch, Globe, Key, Linkedin,
  BookOpen, Tv, Hash, Music, Briefcase, Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

const authProviders = [
  { name: "Email", icon: Mail, enabled: true },
  { name: "Phone", icon: Phone, enabled: false },
  { name: "SAML 2.0", icon: Shield, enabled: false },
  { name: "Web3 Wallet", icon: Wallet, enabled: false },
  { name: "Apple", icon: Globe, enabled: false },
  { name: "Azure", icon: Globe, enabled: false },
  { name: "Bitbucket", icon: GitBranch, enabled: false },
  { name: "Discord", icon: MessageSquare, enabled: false },
  { name: "Facebook", icon: Facebook, enabled: false },
  { name: "Figma", icon: Figma, enabled: false },
  { name: "GitHub", icon: Github, enabled: false },
  { name: "GitLab", icon: GitBranch, enabled: false },
  { name: "Google", icon: Globe, enabled: false },
  { name: "Kakao", icon: MessageSquare, enabled: false },
  { name: "KeyCloak", icon: Key, enabled: false },
  { name: "LinkedIn (OIDC)", icon: Linkedin, enabled: false },
  { name: "Notion", icon: BookOpen, enabled: false },
  { name: "Twitch", icon: Tv, enabled: false },
  { name: "X / Twitter (OAuth 2.0)", icon: Hash, enabled: false },
  { name: "Twitter (Deprecated)", icon: Hash, enabled: false },
  { name: "Slack (OIDC)", icon: Hash, enabled: false },
  { name: "Slack (Deprecated)", icon: Hash, enabled: false },
  { name: "Spotify", icon: Music, enabled: false },
  { name: "WorkOS", icon: Briefcase, enabled: false },
  { name: "Zoom", icon: Video, enabled: false },
];

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        // Try to sign up first
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split("@")[0] },
          },
        });

        if (signUpError) {
          // If user already exists, try signing in automatically
          if (
            signUpError.message.toLowerCase().includes("already registered") ||
            signUpError.message.toLowerCase().includes("already exists") ||
            signUpError.message.toLowerCase().includes("user already")
          ) {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) {
              // Account exists but wrong password
              if (
                signInError.message.toLowerCase().includes("invalid") ||
                signInError.message.toLowerCase().includes("credentials")
              ) {
                throw new Error("Account already exists but the password is incorrect. Try logging in instead.");
              }
              throw signInError;
            }
            toast({ title: "Welcome back!", description: "You already had an account — signed you in." });
            navigate(from);
            return;
          }
          throw signUpError;
        }

        // With auto-confirm, user is immediately signed in
        if (signUpData.session) {
          toast({ title: "Account created!", description: "Welcome to EngiNexus." });
          navigate(from);
        } else {
          // Fallback: user might already exist (Supabase returns fake success)
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) {
            throw new Error("Account may already exist. Try logging in with the correct password.");
          }
          toast({ title: "Welcome back!", description: "Signed you in." });
          navigate(from);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("invalid")) {
            throw new Error("Invalid email or password. Check your credentials and try again.");
          }
          throw error;
        }
        navigate(from);
      }
    } catch (err: unknown) {
      toast({
        title: "Authentication failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="rounded-2xl bg-primary/10 p-3">
              <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground">EngiNexus</h1>
              <p className="text-xs text-muted-foreground">Engineering Intelligence Platform</p>
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login" ? "Sign in to your workspace" : "Join and start building"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="displayName">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    placeholder="circuit_wizard"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-9 rounded-xl h-11"
                  />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="engineer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 rounded-xl h-11"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-9 pr-10 rounded-xl h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full rounded-xl h-11 font-semibold" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚡</span>
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  {mode === "login" ? "Sign In" : "Create Account"}
                </span>
              )}
            </Button>
          </form>

          {/* Auth Providers Section */}
          <div className="mt-5">
            <div className="relative mb-4">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                authentication providers
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-xl mb-3"
              onClick={() => setShowProviders(!showProviders)}
            >
              {showProviders ? "Hide Providers" : "View All Providers"}
            </Button>

            {showProviders && (
              <ScrollArea className="h-[320px] rounded-xl border border-border p-1">
                <div className="grid grid-cols-1 gap-1.5 p-2">
                  {authProviders.map((provider) => {
                    const Icon = provider.icon;
                    return (
                      <button
                        key={provider.name}
                        type="button"
                        className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50 cursor-default"
                      >
                        <div className="rounded-md bg-muted p-1.5 shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground flex-1 truncate">
                          {provider.name}
                        </span>
                        <Badge
                          variant={provider.enabled ? "default" : "secondary"}
                          className="text-[10px] px-2 py-0.5 shrink-0"
                        >
                          {provider.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-primary hover:underline font-medium"
              >
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
