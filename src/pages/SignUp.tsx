import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, User, AtSign, Mail, Lock, Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PasswordStrengthBar from "@/components/auth/PasswordStrengthBar";
import EngineeringAnimation from "@/components/auth/EngineeringAnimation";
import logoImg from "@/assets/logo.jpeg";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    const timeout = setTimeout(async () => {
      setCheckingUsername(true);
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", username)
        .maybeSingle();
      setUsernameAvailable(!data);
      setCheckingUsername(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [username]);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    if (!fullName.trim()) {
      setFieldError("Please enter your full name.");
      triggerShake();
      return;
    }

    if (username.length < 3) {
      setFieldError("Username must be at least 3 characters.");
      triggerShake();
      return;
    }

    if (usernameAvailable === false) {
      setFieldError("That username is taken. Please choose another.");
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: fullName.trim(),
            username: username,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes("rate limit")) {
          setFieldError("Too many attempts. Please wait a minute and try again.");
        } else if (signUpError.message.toLowerCase().includes("already registered")) {
          setFieldError("An account with this email already exists. Please sign in instead.");
        } else {
          setFieldError(signUpError.message);
        }
        triggerShake();
        return;
      }

      if (signUpData?.session) {
        toast({ title: "Welcome!", description: "Your account has been created." });
        navigate("/");
        return;
      }

      if (signUpData?.user && !signUpData.session) {
        // Try auto sign-in (if auto-confirm is enabled)
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInError) {
          toast({ title: "Welcome!", description: "Your account has been created." });
          navigate("/");
          return;
        }
        // Email confirmation required
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link. Please verify your email to sign in.",
        });
        navigate("/signin");
        return;
      }
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
              <h2 className="text-xl font-semibold text-white tracking-tight">Create account</h2>
              <p className="text-sm text-white/40 mt-1">Join the engineering community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-emerald-400" />
                <Input
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/[0.08] focus:border-emerald-500/30 text-white placeholder:text-white/30 transition-all text-sm"
                />
              </div>

              <div className="relative group">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-emerald-400" />
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  className="pl-10 pr-10 h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/[0.08] focus:border-emerald-500/30 text-white placeholder:text-white/30 transition-all text-sm"
                />
                {username.length >= 3 && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {checkingUsername ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : usernameAvailable ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : usernameAvailable === false ? (
                      <X className="h-4 w-4 text-destructive" />
                    ) : null}
                  </div>
                )}
              </div>

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

              <PasswordStrengthBar password={password} />

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
                  <span className="flex items-center gap-2">Creating account...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Create Account
                  </span>
                )}
              </Button>
            </form>

            <p className="text-sm text-white/40 text-center mt-6">
              Already have an account?{" "}
              <Link to="/signin" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                Sign in
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

export default SignUp;
