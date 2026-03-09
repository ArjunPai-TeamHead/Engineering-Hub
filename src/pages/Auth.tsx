import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/auth/AuthForm";
import AuthProviders from "@/components/auth/AuthProviders";
import PasswordStrengthBar from "@/components/auth/PasswordStrengthBar";
import EngineeringAnimation from "@/components/auth/EngineeringAnimation";
import logoImg from "@/assets/logo.jpeg";

const Auth = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

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

  const handleProviderSelect = (name: string, enabled: boolean) => {
    if (!enabled) {
      toast({
        title: "Provider not available",
        description: "This provider is not enabled yet. Please use one of the green options.",
        variant: "destructive",
      });
      return;
    }
    setSelectedProvider(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (!signInError) {
        navigate(from);
        return;
      }

      if (signInError.message.toLowerCase().includes("invalid")) {
        // Attempt signup — use generic error to prevent email enumeration
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: fullName || email.split("@")[0],
              username: username || email.split("@")[0].replace(/\./g, "_"),
            },
          },
        });

        if (signUpError) {
          if (signUpError.message.toLowerCase().includes("rate limit")) {
            setFieldError("Too many attempts. Please wait a minute and try again.");
          } else {
            // Generic message to prevent enumeration
            setFieldError("Invalid email or password.");
          }
          triggerShake();
          return;
        }

        if (signUpData?.session) {
          toast({ title: "Welcome!", description: "Your account is ready." });
          navigate(from);
          return;
        }

        if (signUpData?.user && !signUpData.session) {
          const { error: retryError } = await supabase.auth.signInWithPassword({ email, password });
          if (!retryError) {
            toast({ title: "Welcome!", description: "Your account is ready." });
            navigate(from);
            return;
          }
          // Generic message — don't reveal whether account exists
          setFieldError("Invalid email or password.");
          triggerShake();
          return;
        }
      }

      if (signInError.message.toLowerCase().includes("rate limit")) {
        setFieldError("Too many attempts. Please wait a minute and try again.");
      } else {
        setFieldError("Invalid email or password.");
      }
      triggerShake();
    } catch {
      // Silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/3 blur-[120px] pointer-events-none" />

      {/* Left Panel - Auth (always visible) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img src={logoImg} alt="Logo" className="h-12 w-12 rounded-2xl object-cover" />
            <p className="text-[11px] text-white/40">Engineering Intelligence Platform</p>
          </div>

          {!selectedProvider ? (
            <div className={`auth-glass-dark rounded-3xl p-6 transition-transform ${shake ? "animate-shake" : ""}`}>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-white tracking-tight">Sign in</h2>
                <p className="text-sm text-white/40 mt-1">Choose your authentication method</p>
              </div>
              <AuthProviders onSelect={handleProviderSelect} />
            </div>
          ) : (
            <div className={`auth-glass-dark rounded-3xl p-8 transition-all ${shake ? "animate-shake" : ""}`}>
              <button
                onClick={() => setSelectedProvider(null)}
                className="text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors mb-4 flex items-center gap-1"
              >
                ← Back to providers
              </button>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white tracking-tight">Welcome</h2>
                <p className="text-sm text-white/40 mt-1">Enter your details to continue</p>
              </div>

              <AuthForm
                fullName={fullName}
                setFullName={setFullName}
                username={username}
                setUsername={setUsername}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                usernameAvailable={usernameAvailable}
                checkingUsername={checkingUsername}
                fieldError={fieldError}
                onSubmit={handleSubmit}
              />

              <PasswordStrengthBar password={password} />

              <Button
                type="submit"
                form="auth-form"
                className="w-full rounded-2xl h-12 font-semibold text-sm mt-4 bg-emerald-500/80 hover:bg-emerald-500 text-white border border-emerald-400/30 backdrop-blur-sm transition-all"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">Authenticating...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Continue
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Engineering Animation (always visible on lg+) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative">
        <EngineeringAnimation />
      </div>
    </div>
  );
};

export default Auth;
