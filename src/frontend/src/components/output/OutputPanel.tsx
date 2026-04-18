import { Button } from "@/components/ui/button";
import { Eye, Loader2, Terminal, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { getLanguageById } from "../../config/languages";
import { useEditorStore } from "../../store/editorStore";
import type { ExecutionResult } from "../../types";

// ─── ExecutionResultDisplay ──────────────────────────────────────────────────

interface ExecutionResultDisplayProps {
  result: ExecutionResult;
}

function ExecutionResultDisplay({ result }: ExecutionResultDisplayProps) {
  const hasStdout = result.stdout.trim().length > 0;
  const hasStderr = result.stderr.trim().length > 0;
  const hasError = !!result.error;

  return (
    <div className="fade-in flex flex-col gap-3">
      {hasError && !hasStderr && (
        <div
          data-ocid="output.error_state"
          className="text-destructive-foreground bg-destructive/20 border border-destructive/40 rounded px-3 py-2 code-block text-sm"
        >
          <span className="font-semibold text-destructive">Error: </span>
          {result.error}
        </div>
      )}

      {hasStdout && (
        <pre
          data-ocid="output.stdout"
          className="code-block text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed"
        >
          {result.stdout}
        </pre>
      )}

      {hasStderr && (
        <pre
          data-ocid="output.stderr"
          className="code-block text-sm whitespace-pre-wrap break-words leading-relaxed"
          style={{ color: "oklch(0.65 0.21 22)" }}
        >
          {result.stderr}
        </pre>
      )}

      {!hasStdout && !hasStderr && !hasError && (
        <p className="text-muted-foreground text-sm code-block italic">
          (no output)
        </p>
      )}

      {result.executionTimeMs !== null && (
        <p
          data-ocid="output.exec_time"
          className="text-xs code-block mt-1 border-t border-border/40 pt-2"
          style={{ color: "oklch(0.72 0.18 200)" }}
        >
          ⏱ Executed in {result.executionTimeMs}ms
        </p>
      )}
    </div>
  );
}

// ─── Live Preview ─────────────────────────────────────────────────────────────

interface LivePreviewProps {
  languageId: string;
  code: string;
}

function LivePreview({ languageId, code }: LivePreviewProps) {
  const srcDoc =
    languageId === "css"
      ? `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>${code}</style>
</head>
<body>
  <div class="container"><h1>Live CSS Preview</h1><p>Edit your CSS to see changes here.</p></div>
</body>
</html>`
      : code;

  return (
    <iframe
      data-ocid="output.preview_iframe"
      srcDoc={srcDoc}
      title="Live Preview"
      sandbox="allow-scripts"
      className="w-full flex-1 rounded border border-border/30 bg-white"
      style={{ minHeight: 0 }}
    />
  );
}

// ─── Running Indicator ────────────────────────────────────────────────────────

function RunningIndicator() {
  return (
    <div
      data-ocid="output.loading_state"
      className="flex items-center gap-3 py-6 px-2"
    >
      <Loader2
        className="w-5 h-5 animate-spin"
        style={{ color: "oklch(0.72 0.18 200)" }}
      />
      <span
        className="code-block text-sm font-medium animate-pulse"
        style={{ color: "oklch(0.72 0.18 200)" }}
      >
        Running...
      </span>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      data-ocid="output.empty_state"
      className="flex flex-col items-center justify-center flex-1 gap-3 py-12 px-4 text-center"
    >
      <Terminal className="w-8 h-8 text-muted-foreground/40" />
      <p className="text-muted-foreground/50 text-sm code-block">
        Run your code to see output
      </p>
    </div>
  );
}

// ─── OutputPanel ─────────────────────────────────────────────────────────────

export function OutputPanel() {
  const {
    executionResult,
    isRunning,
    clearOutput,
    currentLanguageId,
    getEditorCode,
  } = useEditorStore();

  const language = getLanguageById(currentLanguageId);
  const isPreview = language?.isPreview ?? false;
  const currentCode = getEditorCode(currentLanguageId);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    if (executionResult && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [executionResult]);

  return (
    <div
      data-ocid="output.panel"
      className="flex flex-col h-full glass-dark rounded-l border-l border-border/30"
      style={{ background: "oklch(0.10 0 0 / 0.95)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b shrink-0"
        style={{ borderColor: "oklch(0.72 0.18 200 / 0.2)" }}
      >
        <div className="flex items-center gap-2">
          {isPreview ? (
            <Eye
              className="w-4 h-4"
              style={{ color: "oklch(0.72 0.18 200)" }}
            />
          ) : (
            <Terminal
              className="w-4 h-4"
              style={{ color: "oklch(0.72 0.18 200)" }}
            />
          )}
          <span
            className="text-sm font-semibold tracking-wide font-display"
            style={{ color: "oklch(0.72 0.18 200)" }}
          >
            {isPreview ? "Preview" : "Output"}
          </span>
          {isRunning && (
            <span
              className="ml-2 text-xs code-block animate-pulse"
              style={{ color: "oklch(0.72 0.18 200 / 0.7)" }}
            >
              ● RUNNING
            </span>
          )}
        </div>

        {!isPreview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-ocid="output.clear_button"
            onClick={clearOutput}
            disabled={!executionResult && !isRunning}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Body */}
      {isPreview ? (
        <div className="flex flex-col flex-1 p-3 gap-2 min-h-0">
          <LivePreview languageId={currentLanguageId} code={currentCode} />
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex flex-col flex-1 overflow-y-auto px-4 py-3 min-h-0"
          style={{ scrollbarGutter: "stable" }}
        >
          {isRunning ? (
            <RunningIndicator />
          ) : executionResult ? (
            <ExecutionResultDisplay result={executionResult} />
          ) : (
            <EmptyState />
          )}
        </div>
      )}
    </div>
  );
}
