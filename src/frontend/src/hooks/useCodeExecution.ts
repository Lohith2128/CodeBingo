import { useCallback } from "react";
import { getLanguageById } from "../config/languages";
import { useEditorStore } from "../store/editorStore";
import type {
  ExecutionResult,
  PistonExecuteRequest,
  PistonExecuteResponse,
} from "../types";

const PISTON_API = "https://emkc.org/api/v2/piston/execute";

export function useCodeExecution() {
  const {
    isRunning,
    setIsRunning,
    setExecutionResult,
    currentLanguageId,
    getEditorCode,
  } = useEditorStore();

  const executeCode = useCallback(
    async (
      languageId?: string,
      code?: string,
    ): Promise<ExecutionResult | null> => {
      const targetLanguageId = languageId ?? currentLanguageId;
      const targetCode = code ?? getEditorCode(targetLanguageId);
      const language = getLanguageById(targetLanguageId);

      if (!language) return null;

      // HTML/CSS: handled via live preview, not Piston
      if (language.isPreview) {
        const result: ExecutionResult = {
          stdout: "",
          stderr: "",
          executionTimeMs: 0,
          exitCode: 0,
          error: "Use the live preview panel for HTML/CSS.",
        };
        setExecutionResult(result);
        return result;
      }

      setIsRunning(true);
      const startTime = performance.now();

      try {
        const fileExtension = language.fileExtension;
        const payload: PistonExecuteRequest = {
          language: language.pistonLanguage,
          version: language.version,
          files: [{ name: `main.${fileExtension}`, content: targetCode }],
        };

        const response = await fetch(PISTON_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const executionTimeMs = Math.round(performance.now() - startTime);

        if (!response.ok) {
          const errorText = await response.text();
          const result: ExecutionResult = {
            stdout: "",
            stderr: errorText,
            executionTimeMs,
            exitCode: 1,
            error: `API error: ${response.status} ${response.statusText}`,
          };
          setExecutionResult(result);
          return result;
        }

        const data: PistonExecuteResponse = await response.json();
        const run = data.run;

        if (!run) {
          const result: ExecutionResult = {
            stdout: "",
            stderr: data.message ?? "Unknown error from execution API.",
            executionTimeMs,
            exitCode: 1,
            error: data.message,
          };
          setExecutionResult(result);
          return result;
        }

        // Merge compile stderr + run stderr
        const compileStderr = data.compile?.stderr ?? "";
        const combinedStderr = compileStderr
          ? `${compileStderr}\n${run.stderr}`.trim()
          : run.stderr;

        const result: ExecutionResult = {
          stdout: run.stdout,
          stderr: combinedStderr,
          executionTimeMs,
          exitCode: run.code,
        };

        setExecutionResult(result);
        return result;
      } catch (err) {
        const executionTimeMs = Math.round(performance.now() - startTime);
        const message = err instanceof Error ? err.message : "Unexpected error";
        const result: ExecutionResult = {
          stdout: "",
          stderr: message,
          executionTimeMs,
          exitCode: 1,
          error: message,
        };
        setExecutionResult(result);
        return result;
      } finally {
        setIsRunning(false);
      }
    },
    [currentLanguageId, getEditorCode, setIsRunning, setExecutionResult],
  );

  return { executeCode, isRunning };
}
