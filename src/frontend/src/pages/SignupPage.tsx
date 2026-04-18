import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Code2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  function getPasswordStrength(): {
    label: string;
    color: string;
    width: string;
  } {
    if (password.length === 0) return { label: "", color: "", width: "0%" };
    if (password.length < 6)
      return { label: "Weak", color: "bg-destructive", width: "25%" };
    if (password.length < 10)
      return { label: "Fair", color: "bg-chart-2", width: "50%" };
    if (password.length < 14)
      return { label: "Good", color: "bg-chart-3", width: "75%" };
    return { label: "Strong", color: "bg-primary", width: "100%" };
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = "Full name is required";
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }
    if (!password) {
      next.password = "Password is required";
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }
    if (!confirmPassword) {
      next.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    try {
      login();
      navigate({ to: "/" });
    } catch {
      setSubmitError("Failed to create account. Please try again.");
    }
  }

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 fade-in">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground font-display tracking-tight">
            CodeForge
          </span>
        </div>

        {/* Card */}
        <div className="glass-dark rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-foreground font-display mb-1">
            Create an account
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Join CodeForge and save your code across sessions
          </p>

          {submitError && (
            <div
              data-ocid="signup.error_state"
              className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 mb-4"
            >
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-destructive text-sm">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Full name
              </label>
              <input
                id="signup-name"
                data-ocid="signup.fullname_input"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => {
                  if (!fullName.trim()) {
                    setErrors((p) => ({
                      ...p,
                      fullName: "Full name is required",
                    }));
                  } else {
                    setErrors(({ fullName: _f, ...rest }) => rest);
                  }
                }}
                placeholder="Jane Doe"
                className={`w-full bg-black/30 border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-smooth focus:ring-2 focus:ring-primary/60 focus:border-primary/60 ${
                  errors.fullName ? "border-destructive/60" : "border-border"
                }`}
              />
              {errors.fullName && (
                <p
                  data-ocid="signup.fullname_field_error"
                  className="mt-1 text-xs text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Email
              </label>
              <input
                id="signup-email"
                data-ocid="signup.email_input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  if (!email.trim()) {
                    setErrors((p) => ({ ...p, email: "Email is required" }));
                  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    setErrors((p) => ({
                      ...p,
                      email: "Enter a valid email address",
                    }));
                  } else {
                    setErrors(({ email: _e, ...rest }) => rest);
                  }
                }}
                placeholder="you@example.com"
                className={`w-full bg-black/30 border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-smooth focus:ring-2 focus:ring-primary/60 focus:border-primary/60 ${
                  errors.email ? "border-destructive/60" : "border-border"
                }`}
              />
              {errors.email && (
                <p
                  data-ocid="signup.email_field_error"
                  className="mt-1 text-xs text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  data-ocid="signup.password_input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => {
                    if (!password) {
                      setErrors((p) => ({
                        ...p,
                        password: "Password is required",
                      }));
                    } else if (password.length < 8) {
                      setErrors((p) => ({
                        ...p,
                        password: "Password must be at least 8 characters",
                      }));
                    } else {
                      setErrors(({ password: _p, ...rest }) => rest);
                    }
                  }}
                  placeholder="Min. 8 characters"
                  className={`w-full bg-black/30 border rounded-lg px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-smooth focus:ring-2 focus:ring-primary/60 focus:border-primary/60 ${
                    errors.password ? "border-destructive/60" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  data-ocid="signup.toggle_password_button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Strength:{" "}
                    <span className="font-medium text-foreground">
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}
              {errors.password && (
                <p
                  data-ocid="signup.password_field_error"
                  className="mt-1 text-xs text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="signup-confirm"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="signup-confirm"
                  data-ocid="signup.confirm_password_input"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => {
                    if (!confirmPassword) {
                      setErrors((p) => ({
                        ...p,
                        confirmPassword: "Please confirm your password",
                      }));
                    } else if (password !== confirmPassword) {
                      setErrors((p) => ({
                        ...p,
                        confirmPassword: "Passwords do not match",
                      }));
                    } else {
                      setErrors(({ confirmPassword: _c, ...rest }) => rest);
                    }
                  }}
                  placeholder="Re-enter password"
                  className={`w-full bg-black/30 border rounded-lg px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-smooth focus:ring-2 focus:ring-primary/60 focus:border-primary/60 ${
                    errors.confirmPassword
                      ? "border-destructive/60"
                      : "border-border"
                  }`}
                />
                <button
                  type="button"
                  data-ocid="signup.toggle_confirm_button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                {confirmPassword &&
                  password === confirmPassword &&
                  !errors.confirmPassword && (
                    <CheckCircle2 className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 text-accent pointer-events-none" />
                  )}
              </div>
              {errors.confirmPassword && (
                <p
                  data-ocid="signup.confirm_field_error"
                  className="mt-1 text-xs text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              data-ocid="signup.submit_button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-semibold transition-smooth hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a
                href="/login"
                data-ocid="signup.login_link"
                className="text-primary hover:underline font-medium transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate({ to: "/login" });
                }}
              >
                Sign in
              </a>
            </p>
          </div>

          {/* Guest mode */}
          <div className="mt-3 text-center">
            <button
              type="button"
              data-ocid="signup.guest_mode_button"
              onClick={() => navigate({ to: "/" })}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Continue as guest
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-4">
          Secured by <span className="text-primary/70">Internet Identity</span>{" "}
          — no passwords stored
        </p>
      </div>
    </div>
  );
}
