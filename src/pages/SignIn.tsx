import { useState, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Zap, Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EngineeringAnimation from "@/components/auth/EngineeringAnimation";
import logoImg from "@/assets/logo.jpeg";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error) {
        toast({ title: "Welcome back!", description: "Signed in successfully." });
        navigate(from);
        return;
      }

      if (error.message.toLowerCase().includes("rate limit")) {
        setFieldError("Too many attempts. Please wait a minute and try again.");
      } else {
        setFieldError("Invalid email or password.");
      }
      triggerShake();
    } catch {
      setFieldError("Something went wrong. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/3 blur-[120px] pointer-events-none" />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <img src={logoImg} alt="Logo" className="h-12 w-12 rounded-2xl object-cover" />
            <p className="text-[11px] text-white/40">Engineering Intelligence Platform</p>
          </div>

          <div className={`auth-glass-dark rounded-3xl p-8 transition-all ${shake ? "animate-shake" : ""}`}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white tracking-tight">Sign in</h2>
              <p className="text-sm text-white/40 mt-1">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-emerald-400" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/[0.08] focus:border-emerald-500/30 text-white placeholder:text-white/30 transition-all text-sm"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-emerald-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={`pl-10 pr-10 h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/[0.08] focus:border-emerald-500/30 text-white placeholder:text-white/30 transition-all text-sm ${fieldError ? "border-red-500/50 ring-1 ring-red-500/20" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {fieldError && (
                <div className="text-sm text-destructive flex items-start gap-2 px-1">
                  <X className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{fieldError}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-2xl h-12 font-semibold text-sm mt-4 bg-emerald-500/80 hover:bg-emerald-500 text-white border border-emerald-400/30 backdrop-blur-sm transition-all"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">Signing in...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>

            <p className="text-sm text-white/40 text-center mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center relative">
        <EngineeringAnimation />
      </div>
    </div>
  );
};

export default SignIn;
