import React from "react";

interface TranscriptionContext {
  transcription: string;
  setTranscription: (transcription: string) => void;
  appendTranscription: (transcription: string) => void;
}

const TranscriptionContext = React.createContext<
  TranscriptionContext | undefined
>(undefined);

export function useTranscription(): TranscriptionContext {
  const context = React.useContext(TranscriptionContext);
  if (!context)
    throw new Error(
      "useTranscription must be used within a TranscriptionProvider"
    );

  return context;
}

interface TranscriptionProviderProps {
  children: React.ReactNode;
}

export const TranscriptionProvider = ({
  children,
}: TranscriptionProviderProps) => {
  const [transcription, setTranscription] = React.useState("");

  const appendTranscription = (newTranscription: string) => {
    setTranscription(
      (prevTranscription) => prevTranscription + " " + newTranscription
    );
  };

  return (
    <TranscriptionContext.Provider
      value={{ transcription, setTranscription, appendTranscription }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};
