import { useNavigate } from "@tanstack/react-router";
import { LogIn, X } from "lucide-react";
import { useState } from "react";

export function GuestBanner() {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  return (
    <div
      className="flex items-center justify-between px-4 py-2 text-sm border-b border-border"
      style={{ background: "oklch(0.25 0.04 200 / 0.8)" }}
      data-ocid="guest.banner"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-primary shrink-0">
          <LogIn size={14} />
        </span>
        <span className="text-muted-foreground truncate">
          You're in{" "}
          <span className="text-foreground font-medium">Guest Mode</span> — your
          code is saved locally.{" "}
          <button
            type="button"
            className="text-primary underline underline-offset-2 hover:text-accent transition-colors duration-200 cursor-pointer"
            onClick={() => navigate({ to: "/login" })}
            data-ocid="guest.signin_link"
          >
            Sign in
          </button>{" "}
          to sync across devices.
        </span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="ml-3 shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded p-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Dismiss guest banner"
        data-ocid="guest.banner_dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
