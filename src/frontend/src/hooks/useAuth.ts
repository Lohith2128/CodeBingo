import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect } from "react";
import { useEditorStore } from "../store/editorStore";

export function useAuth() {
  const { login, clear, loginStatus, identity, isAuthenticated } =
    useInternetIdentity();
  const setUserSession = useEditorStore((s) => s.setUserSession);

  const isLoading = loginStatus === "logging-in";

  useEffect(() => {
    if (isAuthenticated && identity) {
      const principalId = identity.getPrincipal().toText();
      setUserSession({
        principalId,
        displayName: `${principalId.slice(0, 5)}...${principalId.slice(-3)}`,
      });
    } else if (!isAuthenticated) {
      setUserSession(null);
    }
  }, [isAuthenticated, identity, setUserSession]);

  const handleLogin = useCallback(() => {
    login();
  }, [login]);

  const handleLogout = useCallback(() => {
    clear();
    setUserSession(null);
  }, [clear, setUserSession]);

  return {
    isAuthenticated,
    isLoading,
    identity,
    login: handleLogin,
    logout: handleLogout,
    loginStatus,
  } as const;
}
