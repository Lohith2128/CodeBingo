import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LanguageSummary {
    language: string;
    savedAt: bigint;
}
export interface CodeSnippet {
    code: string;
    language: string;
    savedAt: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCode(language: string): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    listLanguages(): Promise<Array<LanguageSummary>>;
    loadCode(language: string): Promise<CodeSnippet | null>;
    saveCode(language: string, code: string): Promise<void>;
}
