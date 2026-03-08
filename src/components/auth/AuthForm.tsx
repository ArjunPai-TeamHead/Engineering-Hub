import { User, AtSign, Mail, Lock, Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AuthFormProps {
  fullName: string;
  setFullName: (v: string) => void;
  username: string;
  setUsername: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  usernameAvailable: boolean | null;
  checkingUsername: boolean;
  fieldError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm = ({
  fullName, setFullName,
  username, setUsername,
  email, setEmail,
  password, setPassword,
  usernameAvailable, checkingUsername,
  fieldError, onSubmit,
}: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form id="auth-form" onSubmit={onSubmit} className="space-y-3">
      {/* Full Name */}
      <div className="relative group">
        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 transition-colors group-focus-within:text-emerald-400" />
        <Input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus:bg-white/[0.08] focus:border-emerald-500/30 text-white placeholder:text-white/30 transition-all text-sm"
        />
      </div>

      {/* Username */}
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

      {/* Email */}
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

      {/* Password */}
      <div className="relative group">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
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
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {/* Error message */}
      {fieldError && (
        <div className="text-sm text-destructive flex items-start gap-2 px-1">
          <X className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{fieldError}</span>
        </div>
      )}
    </form>
  );
};

export default AuthForm;
