import Editor, { type OnMount } from "@monaco-editor/react";
import { useRef } from "react";
import { getLanguageById } from "../../config/languages";
import { useEditorStore } from "../../store/editorStore";

export function MonacoEditor() {
  const { currentLanguageId, getEditorCode, setEditorCode, fontSize, tabSize } =
    useEditorStore();

  const language = getLanguageById(currentLanguageId);
  const code = getEditorCode(currentLanguageId);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    // Apply JetBrains Mono font after mount
    editor.updateOptions({
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontLigatures: true,
    });
  };

  return (
    <div
      className="flex-1 min-h-0 overflow-hidden"
      data-ocid="editor.monaco_container"
    >
      <Editor
        key={currentLanguageId}
        height="100%"
        language={language?.monacoLanguage ?? "plaintext"}
        value={code}
        theme="vs-dark"
        onChange={(value) => {
          if (value !== undefined) {
            setEditorCode(currentLanguageId, value);
          }
        }}
        onMount={handleEditorMount}
        options={{
          fontSize,
          tabSize,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontLigatures: true,
          lineNumbers: "on",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "gutter",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          contextmenu: true,
          suggest: { showKeywords: true },
          quickSuggestions: true,
          autoIndent: "advanced",
          formatOnPaste: true,
          insertSpaces: true,
          detectIndentation: false,
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          folding: true,
          renderWhitespace: "selection",
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            useShadows: false,
          },
        }}
      />
    </div>
  );
}
