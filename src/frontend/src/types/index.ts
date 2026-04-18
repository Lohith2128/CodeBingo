export interface Language {
  id: string;
  name: string;
  version: string;
  pistonLanguage: string;
  monacoLanguage: string;
  fileExtension: string;
  starterCode: string;
  icon: string;
  isPreview?: boolean; // HTML/CSS render in iframe instead of console
}

export interface CodeSnippet {
  languageId: string;
  code: string;
  savedAt: number; // timestamp ms
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  executionTimeMs: number | null;
  exitCode: number | null;
  error?: string;
}

export interface UserSession {
  principalId: string;
  displayName: string;
  avatarUrl?: string;
}

export interface PistonExecuteRequest {
  language: string;
  version: string;
  files: Array<{ name: string; content: string }>;
  stdin?: string;
}

export interface PistonExecuteResponse {
  run?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
  };
  message?: string;
}
