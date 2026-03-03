import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BrainCircuit, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/auth/AuthForm";
import AuthProviders from "@/components/auth/AuthProviders";
import PasswordStrengthBar from "@/components/auth/PasswordStrengthBar";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  // Debounced username availability check
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
    setLoading(true);

    try {
      // Try signing in first (existing user)
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (!signInError) {
        // Successful login
        navigate(from);
        return;
      }

      // If invalid credentials, check if user exists
      if (signInError.message.toLowerCase().includes("invalid")) {
        // Could be wrong password OR no account — try signup
        const { data: signUpData } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: fullName || email.split("@")[0],
              username: username || email.split("@")[0].replace(/\./g, "_"),
            },
          },
        });

        if (signUpData?.session) {
          // New account created and logged in
          toast({ title: "Welcome to EngiNexus!", description: "Your account is ready." });
          navigate(from);
          return;
        }

        if (signUpData?.user && !signUpData.session) {
          // User already exists — password was wrong
          setFieldError("An account with this email already exists. Incorrect password.");
          triggerShake();
          return;
        }
      }

      // Fallback
      setFieldError("Something went wrong. Please try again.");
      triggerShake();
    } catch {
      // Silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="rounded-2xl bg-primary/10 p-3 backdrop-blur-sm">
              <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">EngiNexus</h1>
              <p className="text-xs text-muted-foreground">Engineering Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className={`rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-8 shadow-xl transition-transform ${shake ? "animate-shake" : ""}`}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">Welcome</h2>
            <p className="text-sm text-muted-foreground mt-1">Enter your details to continue</p>
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
            className="w-full rounded-xl h-12 font-semibold text-sm mt-4 transition-all"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Continue
              </span>
            )}
          </Button>

          {/* Providers */}
          <AuthProviders />
        </div>
      </div>
    </div>
  );
};

export default Auth;
