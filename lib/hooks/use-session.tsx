import React from "react";

import { SessionConfig, SessionData } from "@/lib/types/session";

const LOCAL_STORAGE_KEY = "session-data";

interface SessionContext {
  session: SessionData;
  startRecording: () => void;
  stopRecording: () => void;
  setConfig: (config: SessionConfig) => void;
}

const SessionContext = React.createContext<SessionContext | undefined>(
  undefined
);

export function useSession(): SessionContext {
  const context = React.useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within a SessionProvider");

  return context;
}

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({
  children,
}: SessionProviderProps): React.ReactNode {
  const [session, setSession] = React.useState<SessionData>({
    isRecording: false,
    config: {
      language: "auto",
      speakerCount: 2,
      chunkSize: 10,
      sensitivity: 0.7,
    },
  });

  React.useEffect(() => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (value) setSession(JSON.parse(value));
  }, []);

  const startRecording = (): void => {
    setSession({ ...session, isRecording: true });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
  };

  const stopRecording = (): void => {
    setSession({ ...session, isRecording: false });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
  };

  const setConfig = (config: SessionConfig): void => {
    setSession({ ...session, config });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        startRecording,
        stopRecording,
        setConfig,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
