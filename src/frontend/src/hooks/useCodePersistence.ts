import { useCallback } from "react";
import { useEditorStore } from "../store/editorStore";
import { useAuth } from "./useAuth";

const GUEST_STORAGE_KEY = "codex-guest-snippets";
const AUTH_STORAGE_KEY = "codex-auth-snippets";

function readSnippets(key: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeSnippet(key: string, languageId: string, code: string): void {
  const snippets = readSnippets(key);
  snippets[languageId] = code;
  try {
    localStorage.setItem(key, JSON.stringify(snippets));
  } catch {
    // ignore quota errors
  }
}

export function useCodePersistence() {
  const { isAuthenticated } = useAuth();
  const { setEditorCode, getEditorCode, currentLanguageId } = useEditorStore();

  const storageKey = isAuthenticated ? AUTH_STORAGE_KEY : GUEST_STORAGE_KEY;

  const saveCode = useCallback(
    async (languageId?: string, code?: string): Promise<void> => {
      const targetLanguageId = languageId ?? currentLanguageId;
      const targetCode = code ?? getEditorCode(targetLanguageId);
      writeSnippet(storageKey, targetLanguageId, targetCode);
    },
    [storageKey, currentLanguageId, getEditorCode],
  );

  const loadCode = useCallback(
    (languageId: string): string | null => {
      const snippets = readSnippets(storageKey);
      return snippets[languageId] ?? null;
    },
    [storageKey],
  );

  const loadAndApplyCode = useCallback(
    (languageId: string): void => {
      const code = loadCode(languageId);
      if (code !== null) {
        setEditorCode(languageId, code);
      }
    },
    [loadCode, setEditorCode],
  );

  return { saveCode, loadCode, loadAndApplyCode };
}
