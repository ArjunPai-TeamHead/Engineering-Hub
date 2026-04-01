import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Zap, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/logo.jpeg";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    if (password.length < 8) {
      setFieldError("Password must be at least 8 characters.");
      return;
    }
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setFieldError("Password must contain both letters and numbers.");
      return;
    }
    if (password !== confirmPassword) {
      setFieldError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setFieldError(error.message);
      return;
    }

    toast({ title: "Password updated!", description: "You can now sign in with your new password." });
    navigate("/", { replace: true });
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/60">Invalid or expired reset link.</p>
          <Button variant="outline" onClick={() => navigate("/signin")}>
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <img src={logoImg} alt="EngiNexus" className="h-14 w-14 rounded-2xl object-cover" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">EngiNexus</h1>
            <p className="text-xs text-white/50">Engineering Intelligence Platform</p>
          </div>
        </div>

        <div className="auth-glass-dark rounded-3xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white tracking-tight">Set new password</h2>
            <p className="text-sm text-white/40 mt-1">Must contain letters and numbers, min 8 characters</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-emerald-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/[0.08] focus:border-emerald-500/30 text-white placeholder:text-white/30 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-emerald-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/[0.08] focus:border-emerald-500/30 text-white placeholder:text-white/30 transition-all text-sm"
              />
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
              {loading ? "Updating..." : (
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Update Password
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
