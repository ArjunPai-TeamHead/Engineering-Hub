interface PasswordStrengthBarProps {
  password: string;
}

const getStrength = (password: string): { level: number; label: string; color: string } => {
  if (!password) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: "Weak", color: "bg-destructive" };
  if (score <= 2) return { level: 2, label: "Fair", color: "bg-amber-500" };
  if (score <= 3) return { level: 3, label: "Good", color: "bg-yellow-500" };
  if (score <= 4) return { level: 4, label: "Strong", color: "bg-emerald-500" };
  return { level: 5, label: "Very Strong", color: "bg-emerald-600" };
};

const PasswordStrengthBar = ({ password }: PasswordStrengthBarProps) => {
  if (!password) return null;

  const { level, label, color } = getStrength(password);

  return (
    <div className="mt-2 px-1 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= level ? color : "bg-border"
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
};

export default PasswordStrengthBar;
