import {
  Check,
  ClipboardCopy,
  Download,
  Loader2,
  Minus,
  Play,
  Plus,
  Save,
  Share2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getLanguageById } from "../../config/languages";
import { useAuth } from "../../hooks/useAuth";
import { useCodePersistence } from "../../hooks/useCodePersistence";
import { useEditorStore } from "../../store/editorStore";

interface EditorToolbarProps {
  onRun: () => void;
}

export function EditorToolbar({ onRun }: EditorToolbarProps) {
  const {
    currentLanguageId,
    fontSize,
    setFontSize,
    tabSize,
    setTabSize,
    isRunning,
    clearOutput,
    getEditorCode,
  } = useEditorStore();
  const { isAuthenticated } = useAuth();
  const { saveCode } = useCodePersistence();
  const [saved, setSaved] = useState(false);

  const language = getLanguageById(currentLanguageId);

  const handleCopy = async () => {
    const code = getEditorCode(currentLanguageId);
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleDownload = () => {
    if (!language) return;
    const code = getEditorCode(currentLanguageId);
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `main.${language.fileExtension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded main.${language.fileExtension}`);
  };

  const handleSave = async () => {
    await saveCode();
    setSaved(true);
    toast.success("Code saved ✓");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleShare = async () => {
    const code = getEditorCode(currentLanguageId);
    const params = new URLSearchParams({
      lang: currentLanguageId,
      code: btoa(unescape(encodeURIComponent(code))),
    });
    const shareUrl = `${window.location.origin}/?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch {
      toast.error("Failed to copy share link");
    }
  };

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-2 border-b border-border shrink-0 overflow-x-auto bg-card"
      data-ocid="editor.toolbar"
    >
      {/* Language + version badge */}
      <div className="flex items-center gap-1.5 mr-2 shrink-0">
        <span
          className="text-sm font-mono font-semibold text-primary"
          data-ocid="toolbar.language_name"
        >
          {language?.name ?? "—"}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-secondary/50">
          v{language?.version ?? "—"}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border mx-1 shrink-0" />

      {/* Run button */}
      <button
        type="button"
        onClick={onRun}
        disabled={isRunning}
        data-ocid="toolbar.run_button"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold text-background bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_10px_rgba(34,211,238,0.3)] hover:shadow-[0_0_16px_rgba(34,211,238,0.5)] shrink-0"
      >
        {isRunning ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Play size={12} />
        )}
        {isRunning ? "Running…" : "Run"}
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-border mx-1 shrink-0" />

      {/* Clear output */}
      <button
        type="button"
        onClick={clearOutput}
        data-ocid="toolbar.clear_button"
        className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent hover:border-border transition-all duration-200 shrink-0"
        title="Clear output"
      >
        <Trash2 size={12} />
        <span className="hidden sm:inline">Clear</span>
      </button>

      {/* Copy code */}
      <button
        type="button"
        onClick={handleCopy}
        data-ocid="toolbar.copy_button"
        className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent hover:border-border transition-all duration-200 shrink-0"
        title="Copy code"
      >
        <ClipboardCopy size={12} />
        <span className="hidden sm:inline">Copy</span>
      </button>

      {/* Download */}
      <button
        type="button"
        onClick={handleDownload}
        data-ocid="toolbar.download_button"
        className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent hover:border-border transition-all duration-200 shrink-0"
        title={`Download .${language?.fileExtension ?? "txt"}`}
      >
        <Download size={12} />
        <span className="hidden sm:inline">Download</span>
      </button>

      {/* Save (authenticated only) */}
      {isAuthenticated && (
        <button
          type="button"
          onClick={handleSave}
          data-ocid="toolbar.save_button"
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all duration-200 shrink-0"
          title="Save code"
        >
          {saved ? (
            <Check size={12} className="text-primary" />
          ) : (
            <Save size={12} />
          )}
          <span className="hidden sm:inline">{saved ? "Saved!" : "Save"}</span>
        </button>
      )}

      {/* Share */}
      <button
        type="button"
        onClick={handleShare}
        data-ocid="toolbar.share_button"
        className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent hover:border-border transition-all duration-200 shrink-0"
        title="Share code"
      >
        <Share2 size={12} />
        <span className="hidden sm:inline">Share</span>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Font size controls */}
      <div
        className="flex items-center gap-0.5 shrink-0"
        data-ocid="toolbar.fontsize_controls"
      >
        <button
          type="button"
          onClick={() => setFontSize(fontSize - 1)}
          data-ocid="toolbar.fontsize_decrease"
          className="flex items-center justify-center w-6 h-6 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors duration-200"
          title="Decrease font size"
          aria-label="Decrease font size"
        >
          <Minus size={10} />
        </button>
        <span className="text-[10px] font-mono text-muted-foreground min-w-[22px] text-center">
          {fontSize}
        </span>
        <button
          type="button"
          onClick={() => setFontSize(fontSize + 1)}
          data-ocid="toolbar.fontsize_increase"
          className="flex items-center justify-center w-6 h-6 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors duration-200"
          title="Increase font size"
          aria-label="Increase font size"
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Tab size toggle */}
      <div
        className="flex items-center gap-0.5 ml-1 shrink-0"
        data-ocid="toolbar.tabsize_toggle"
      >
        {([2, 4] as const).map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setTabSize(size)}
            data-ocid={`toolbar.tabsize_${size}`}
            className={[
              "px-1.5 py-0.5 rounded text-[10px] font-mono transition-all duration-200",
              tabSize === size
                ? "bg-primary/20 text-primary border border-primary/40"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-transparent",
            ].join(" ")}
            title={`Tab size: ${size} spaces`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
