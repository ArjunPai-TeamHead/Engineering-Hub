import { useState, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Zap, Mail, Lock, Eye, EyeOff, X, AtSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EngineeringAnimation from "@/components/auth/EngineeringAnimation";
import logoImg from "@/assets/logo.jpeg";

const SignIn = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  }, []);

  const resolveEmail = async (input: string): Promise<string | null> => {
    const trimmed = input.trim();
    if (trimmed.includes("@")) return trimmed;
    // Look up username in profiles
    const { data } = await supabase
      .from("profiles")
      .select("user_id")
      .ilike("username", trimmed)
      .maybeSingle();
    if (!data) return null;
    // We can't get the email from profiles, so use a workaround:
    // Try to get it from auth - but we don't have admin access.
    // Instead, we'll store email lookup - but actually we need to sign in differently.
    // The cleanest approach: look up the user's email from the profiles table if stored,
    // or use the auth admin API. Since we can't do that client-side, 
    // let's check if the user object has email in metadata.
    // Actually, let's just query the user's email from the auth user directly.
    // We need to add email to profiles or use an edge function.
    // For now, let's return null and handle it with a message.
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    if (forgotMode) {
      if (!identifier.trim()) {
        setFieldError("Please enter your email address.");
        triggerShake();
        return;
      }
      setLoading(true);
      try {
        await supabase.auth.resetPasswordForEmail(identifier, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        setResetSent(true);
        toast({ title: "Reset email sent", description: "Check your inbox for a password reset link." });
      } catch {
        setFieldError("Something went wrong. Please try again.");
        triggerShake();
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password || password.length < 6) {
      setFieldError("Password must be at least 6 characters.");
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      let email = identifier.trim();

      // If it doesn't look like an email, resolve username
      if (!email.includes("@")) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("user_id")
          .ilike("username", email)
          .maybeSingle();

        if (!profileData) {
          setFieldError("No account found with that username.");
          triggerShake();
          setLoading(false);
          return;
        }

        // We need the email. Let's try signing in with a lookup edge function,
        // or use a workaround: query with service role.
        // Simplest: store email in profiles, or use an edge function.
        // For now, let's use an edge function approach.
        const { data: fnData, error: fnError } = await supabase.functions.invoke("resolve-username", {
          body: { username: email },
        });

        if (fnError || !fnData?.email) {
          setFieldError("Could not resolve username. Try using your email instead.");
          triggerShake();
          setLoading(false);
          return;
        }
        email = fnData.email;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error) {
        toast({ title: "Welcome back!", description: "Signed in successfully." });
        navigate(from, { replace: true });
        return;
      }

      if (error.message.toLowerCase().includes("rate limit")) {
        setFieldError("Too many attempts. Please wait a minute and try again.");
      } else {
        setFieldError("Invalid email/username or password.");
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
            <img src={logoImg} alt="EngiNexus" className="h-14 w-14 rounded-2xl object-cover" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">EngiNexus</h1>
              <p className="text-sm text-emerald-400/70 font-medium">Engineering Intelligence Platform</p>
            </div>
          </div>

          <div className={`auth-glass-dark rounded-3xl p-8 transition-all ${shake ? "animate-shake" : ""}`}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white tracking-tight">
                {forgotMode ? "Reset password" : "Sign in"}
              </h2>
              <p className="text-sm text-white/40 mt-1">
                {forgotMode
                  ? "Enter your email and we'll send a reset link"
                  : "Use your email or username to continue"}
              </p>
            </div>

            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                  <p className="text-sm text-emerald-400">Reset link sent! Check your email inbox.</p>
                </div>
                <button
                  onClick={() => { setForgotMode(false); setResetSent(false); }}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative group">
                  {identifier.includes("@") ? (
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-emerald-400" />
                  ) : (
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-emerald-400" />
                  )}
                  <Input
                    type="text"
                    placeholder="Email or username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/[0.08] focus:border-emerald-500/30 text-white placeholder:text-white/30 transition-all text-sm"
                  />
                </div>

                {!forgotMode && (
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
                )}

                {!forgotMode && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => { setForgotMode(true); setFieldError(null); }}
                      className="text-xs text-white/40 hover:text-emerald-400 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {fieldError && (
                  <div className="text-sm text-red-400 flex items-start gap-2 px-1">
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
                    <span className="flex items-center gap-2">
                      {forgotMode ? "Sending..." : "Signing in..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      {forgotMode ? "Send Reset Link" : "Sign In"}
                    </span>
                  )}
                </Button>

                {forgotMode && (
                  <button
                    type="button"
                    onClick={() => { setForgotMode(false); setFieldError(null); }}
                    className="w-full text-sm text-white/40 hover:text-emerald-400 transition-colors mt-2"
                  >
                    Back to sign in
                  </button>
                )}
              </form>
            )}

            {!forgotMode && !resetSent && (
              <p className="text-sm text-white/40 text-center mt-6">
                Don't have an account?{" "}
                <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                  Sign up
                </Link>
              </p>
            )}
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
