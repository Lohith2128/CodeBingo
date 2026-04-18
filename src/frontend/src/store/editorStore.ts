import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LANGUAGE_ID, LANGUAGES } from "../config/languages";
import type { ExecutionResult, UserSession } from "../types";

interface EditorStore {
  // Current language selection
  currentLanguageId: string;
  setCurrentLanguageId: (id: string) => void;

  // Code per language (keyed by language id)
  editorCode: Record<string, string>;
  setEditorCode: (languageId: string, code: string) => void;
  getEditorCode: (languageId: string) => string;

  // Editor settings
  fontSize: number;
  setFontSize: (size: number) => void;
  tabSize: 2 | 4;
  setTabSize: (size: 2 | 4) => void;

  // Execution state
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  executionResult: ExecutionResult | null;
  setExecutionResult: (result: ExecutionResult | null) => void;
  clearOutput: () => void;

  // User session (null = guest)
  userSession: UserSession | null;
  setUserSession: (session: UserSession | null) => void;
}

const defaultCodeMap: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.id, l.starterCode]),
);

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      currentLanguageId: DEFAULT_LANGUAGE_ID,
      setCurrentLanguageId: (id) => set({ currentLanguageId: id }),

      editorCode: { ...defaultCodeMap },
      setEditorCode: (languageId, code) =>
        set((state) => ({
          editorCode: { ...state.editorCode, [languageId]: code },
        })),
      getEditorCode: (languageId) => {
        const state = get();
        return (
          state.editorCode[languageId] ??
          LANGUAGES.find((l) => l.id === languageId)?.starterCode ??
          ""
        );
      },

      fontSize: 14,
      setFontSize: (size) =>
        set({ fontSize: Math.max(10, Math.min(24, size)) }),

      tabSize: 4,
      setTabSize: (size) => set({ tabSize: size }),

      isRunning: false,
      setIsRunning: (running) => set({ isRunning: running }),

      executionResult: null,
      setExecutionResult: (result) => set({ executionResult: result }),
      clearOutput: () => set({ executionResult: null }),

      userSession: null,
      setUserSession: (session) => set({ userSession: session }),
    }),
    {
      name: "codex-editor-store",
      partialize: (state) => ({
        currentLanguageId: state.currentLanguageId,
        editorCode: state.editorCode,
        fontSize: state.fontSize,
        tabSize: state.tabSize,
      }),
    },
  ),
);
