import { useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut, Terminal } from "lucide-react";
import { LANGUAGES } from "../../config/languages";
import { useAuth } from "../../hooks/useAuth";
import { useEditorStore } from "../../store/editorStore";

export function LanguageSidebar() {
  const currentLanguageId = useEditorStore((s) => s.currentLanguageId);
  const setCurrentLanguageId = useEditorStore((s) => s.setCurrentLanguageId);
  const userSession = useEditorStore((s) => s.userSession);
  const { isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const initials = userSession?.displayName
    ? userSession.displayName.slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="flex flex-col h-full" data-ocid="sidebar.container">
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-4 py-4 border-b border-border shrink-0"
        data-ocid="sidebar.logo"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
          <Terminal size={16} className="text-primary" />
        </div>
        <div className="min-w-0">
          <span className="font-display font-bold text-base text-foreground tracking-tight">
            CodeForge
          </span>
          <div className="text-[10px] text-muted-foreground font-mono leading-none mt-0.5">
            multi-language IDE
          </div>
        </div>
      </div>

      {/* Language List */}
      <nav
        className="flex-1 overflow-y-auto py-2 px-2 min-h-0"
        data-ocid="sidebar.language_list"
      >
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 pb-1.5 font-mono">
          Languages
        </div>
        {LANGUAGES.map((lang, idx) => {
          const isActive = lang.id === currentLanguageId;
          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => setCurrentLanguageId(lang.id)}
              data-ocid={`sidebar.language_item.${idx + 1}`}
              className={[
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-all duration-200 group relative text-sm",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_8px_rgba(34,211,238,0.15)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent",
              ].join(" ")}
            >
              {/* Active glow bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              )}
              <span
                className="text-base shrink-0 leading-none"
                aria-hidden="true"
              >
                {lang.icon}
              </span>
              <span
                className={[
                  "font-mono text-xs font-medium tracking-wide truncate",
                  isActive ? "text-primary" : "",
                ].join(" ")}
              >
                {lang.name}
              </span>
              {lang.isPreview && (
                <span className="ml-auto text-[9px] font-mono text-muted-foreground/60 shrink-0">
                  live
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div
        className="shrink-0 border-t border-border p-3"
        data-ocid="sidebar.profile_section"
      >
        {isAuthenticated && userSession ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 px-1">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] font-bold font-mono shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-foreground truncate font-mono">
                  {userSession.displayName}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  Authenticated
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              data-ocid="sidebar.logout_button"
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all duration-200"
            >
              <LogOut size={12} />
              Sign out
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary border border-border text-muted-foreground text-[10px] font-bold shrink-0">
                G
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-foreground font-mono">
                  Guest
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Local only
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate({ to: "/login" })}
              disabled={isLoading}
              data-ocid="sidebar.login_button"
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-mono text-primary hover:bg-primary/10 border border-primary/30 hover:border-primary/60 transition-all duration-200 shadow-[0_0_6px_rgba(34,211,238,0.1)] hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] disabled:opacity-50"
            >
              <LogIn size={12} />
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
