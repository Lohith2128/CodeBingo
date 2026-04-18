import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Check, Code2, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { LANGUAGES, LANGUAGE_MAP } from "../config/languages";
import { useEditorStore } from "../store/editorStore";

function decodeShareParam(raw: string | null): string {
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return "";
  }
}

export default function SharePage() {
  const navigate = useNavigate();
  const setCurrentLanguageId = useEditorStore((s) => s.setCurrentLanguageId);
  const setEditorCode = useEditorStore((s) => s.setEditorCode);

  const [isReady, setIsReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [langId, setLangId] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawLang = params.get("lang");
    const rawCode = params.get("code");

    const decodedCode = decodeShareParam(rawCode);

    if (!rawLang || !decodedCode) {
      setErrorMsg(
        "This share link is missing required parameters. The link may be malformed or incomplete.",
      );
      return;
    }

    const language = LANGUAGE_MAP[rawLang];
    if (!language) {
      const supported = LANGUAGES.map((l) => l.id).join(", ");
      setErrorMsg(
        `Unknown language "${rawLang}". Supported languages: ${supported}.`,
      );
      return;
    }

    setLangId(rawLang);
    setCode(decodedCode);
    setIsReady(true);
  }, []);

  function openInEditor() {
    if (!langId || !code) return;
    setCurrentLanguageId(langId);
    setEditorCode(langId, code);
    navigate({ to: "/" });
  }

  async function handleCopyCode() {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const language = langId ? LANGUAGE_MAP[langId] : null;

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 fade-in">
        <div
          className="pointer-events-none fixed inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-destructive/5 blur-3xl" />
        </div>
        <div className="w-full max-w-md relative">
          <div
            className="glass-dark rounded-2xl p-8 shadow-xl text-center"
            data-ocid="share.error_state"
          >
            <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h1 className="text-xl font-bold text-foreground font-display mb-2">
              Invalid share link
            </h1>
            <p className="text-muted-foreground text-sm mb-6">{errorMsg}</p>
            <button
              type="button"
              data-ocid="share.back_to_editor_button"
              onClick={() => navigate({ to: "/" })}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-semibold transition-smooth hover:opacity-90"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to editor
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="share.loading_state"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-mono">
            Loading shared code…
          </p>
        </div>
      </div>
    );
  }

  const lineCount = code.split("\n").length;
  const charCount = code.length;

  return (
    <div className="min-h-screen bg-background flex flex-col fade-in">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-20 left-1/4 w-[500px] h-[300px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-cyan-500/4 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-card border-b border-border px-6 py-3 flex items-center gap-4">
        <button
          type="button"
          data-ocid="share.back_button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Editor
        </button>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground font-display">
            CodeForge
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            data-ocid="share.copy_code_button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 text-xs transition-smooth hover:bg-muted/40"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-accent" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy code
              </>
            )}
          </button>

          <button
            type="button"
            data-ocid="share.open_in_editor_button"
            onClick={openInEditor}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-semibold transition-smooth hover:opacity-90"
          >
            Open in Editor
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-8">
        {/* Language badge + meta */}
        <div className="mb-6" data-ocid="share.panel">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl" aria-label={language?.name}>
              {language?.icon}
            </span>
            <div>
              <h1 className="text-xl font-bold text-foreground font-display">
                Shared {language?.name} snippet
              </h1>
              <p className="text-muted-foreground text-sm">
                v{language?.version} · {lineCount} line
                {lineCount !== 1 ? "s" : ""} · {charCount} char
                {charCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground/70">
            This is a read-only preview. Open in editor to run or modify the
            code.
          </p>
        </div>

        {/* Code preview */}
        <div
          className="glass-dark rounded-xl overflow-hidden flex-1"
          data-ocid="share.code_preview"
        >
          {/* Code header bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-black/20">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-chart-2/60" />
                <div className="w-3 h-3 rounded-full bg-chart-3/60" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-1">
                snippet.{language?.fileExtension}
              </span>
            </div>
            <span className="text-xs text-muted-foreground/50 font-mono">
              {language?.name} {language?.version}
            </span>
          </div>

          {/* Code lines */}
          <div className="overflow-auto max-h-[60vh] p-4">
            <pre className="font-mono text-sm text-foreground leading-relaxed whitespace-pre">
              <code>{code}</code>
            </pre>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Want to run, edit, or remix this code?
          </p>
          <button
            type="button"
            data-ocid="share.cta_open_button"
            onClick={openInEditor}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-semibold transition-smooth hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
          >
            <Code2 className="w-4 h-4" />
            Open in CodeForge Editor
          </button>
        </div>
      </main>
    </div>
  );
}
