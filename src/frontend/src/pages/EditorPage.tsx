import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { EditorToolbar } from "../components/editor/EditorToolbar";
import { MonacoEditor } from "../components/editor/MonacoEditor";
import { GuestBanner } from "../components/layout/GuestBanner";
import { ThreeColumnLayout } from "../components/layout/ThreeColumnLayout";
import { LanguageSidebar } from "../components/sidebar/LanguageSidebar";
import { getLanguageById } from "../config/languages";
import { useAuth } from "../hooks/useAuth";
import { useCodeExecution } from "../hooks/useCodeExecution";
import { useEditorStore } from "../store/editorStore";
import type { ExecutionResult } from "../types";

// ---------- Output Panel ----------
function OutputPanel({ result }: { result: ExecutionResult | null }) {
  const { currentLanguageId, isRunning, clearOutput, getEditorCode } =
    useEditorStore();
  const language = getLanguageById(currentLanguageId);
  const isPreview = language?.isPreview ?? false;
  const code = getEditorCode(currentLanguageId);

  // Build preview document for HTML
  const previewSrcDoc = isPreview
    ? language?.id === "css"
      ? `<!DOCTYPE html><html><head><style>${code}</style></head><body><div class="container"><h1>CSS Preview</h1><p>Your styles are applied here.</p></div></body></html>`
      : code
    : "";

  return (
    <div
      className="flex flex-col h-full bg-background"
      data-ocid="output.container"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0 bg-card">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-widest">
            {isPreview ? "Preview" : "Output"}
          </span>
          {isRunning && (
            <span
              className="flex items-center gap-1 text-[10px] font-mono text-primary animate-pulse"
              data-ocid="output.loading_state"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-ping" />
              Running…
            </span>
          )}
          {result && !isRunning && (
            <span
              className={[
                "text-[10px] font-mono px-1.5 py-0.5 rounded border",
                (result.exitCode ?? 0) === 0 && !result.error
                  ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                  : "text-destructive border-destructive/30 bg-destructive/10",
              ].join(" ")}
              data-ocid="output.status_badge"
            >
              {(result.exitCode ?? 0) === 0 && !result.error
                ? "✓ OK"
                : "✗ Error"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {result?.executionTimeMs !== null &&
            result?.executionTimeMs !== undefined && (
              <span className="text-[10px] font-mono text-muted-foreground">
                {result.executionTimeMs}ms
              </span>
            )}
          {result && (
            <button
              type="button"
              onClick={clearOutput}
              data-ocid="output.clear_button"
              className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors duration-200 px-1.5 py-0.5 rounded hover:bg-secondary/60"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-auto min-h-0 p-0"
        data-ocid="output.content"
      >
        {isPreview ? (
          <iframe
            title="Live Preview"
            srcDoc={previewSrcDoc}
            sandbox="allow-scripts"
            className="w-full h-full border-0"
            data-ocid="output.preview_iframe"
          />
        ) : isRunning ? (
          <div
            className="flex items-center justify-center h-full"
            data-ocid="output.running_state"
          >
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-xs font-mono text-muted-foreground">
                Executing…
              </p>
            </div>
          </div>
        ) : result ? (
          <div className="p-4 font-mono text-xs space-y-3">
            {result.error && (
              <div
                className="text-destructive bg-destructive/10 border border-destructive/20 rounded p-2 text-[11px]"
                data-ocid="output.error_state"
              >
                <span className="font-semibold">Error: </span>
                {result.error}
              </div>
            )}
            {result.stdout && (
              <div data-ocid="output.stdout">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                  stdout
                </div>
                <pre className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
                  {result.stdout}
                </pre>
              </div>
            )}
            {result.stderr && (
              <div data-ocid="output.stderr">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                  stderr
                </div>
                <pre className="text-destructive whitespace-pre-wrap break-words leading-relaxed">
                  {result.stderr}
                </pre>
              </div>
            )}
            {!result.stdout && !result.stderr && !result.error && (
              <div className="text-muted-foreground text-[11px]">
                (no output)
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full text-center px-4"
            data-ocid="output.empty_state"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 shadow-[0_0_16px_rgba(34,211,238,0.1)]">
              <span className="text-primary text-lg">▶</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              Press{" "}
              <kbd className="px-1 py-0.5 rounded bg-secondary border border-border text-foreground text-[10px]">
                Run
              </kbd>{" "}
              or{" "}
              <kbd className="px-1 py-0.5 rounded bg-secondary border border-border text-foreground text-[10px]">
                Ctrl+Enter
              </kbd>
            </p>
            <p className="text-[10px] font-mono text-muted-foreground/60 mt-1">
              Output appears here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- EditorPage ----------
export default function EditorPage() {
  const { isAuthenticated } = useAuth();
  const { executeCode } = useCodeExecution();
  const { executionResult, setCurrentLanguageId, setEditorCode } =
    useEditorStore();
  const navigate = useNavigate();

  // Parse ?lang=&code= URL params to pre-populate editor
  const search = useSearch({ strict: false }) as Record<string, string>;

  const didApplyShare = useRef(false);
  useEffect(() => {
    if (didApplyShare.current) return;
    const lang = search.lang as string | undefined;
    const encodedCode = search.code as string | undefined;
    if (lang && encodedCode) {
      try {
        const code = decodeURIComponent(escape(atob(encodedCode)));
        setCurrentLanguageId(lang);
        setEditorCode(lang, code);
        didApplyShare.current = true;
        // Clean URL so refreshing doesn't re-apply
        navigate({ to: "/", replace: true });
        toast.info("Shared code loaded ✓");
      } catch {
        // silently ignore malformed share params
      }
    }
  }, [search.lang, search.code, setCurrentLanguageId, setEditorCode, navigate]);

  // Ctrl+Enter keyboard shortcut
  const handleRun = useCallback(() => {
    executeCode();
  }, [executeCode]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun]);

  const sidebar = <LanguageSidebar />;

  const editor = (
    <div className="flex flex-col h-full">
      {!isAuthenticated && <GuestBanner />}
      <EditorToolbar onRun={handleRun} />
      <MonacoEditor />
    </div>
  );

  const output = <OutputPanel result={executionResult} />;

  return (
    <ThreeColumnLayout sidebar={sidebar} editor={editor} output={output} />
  );
}
