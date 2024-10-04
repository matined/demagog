import React from "react";
import { Utterance } from "../types/transcription";

interface TranscriptionContext {
  utterances: Utterance[];
  extendUtterances: (utterances: Utterance[]) => void;
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
  const [utterances, setUtterances] = React.useState<Utterance[]>([]);

  const extendUtterances = (utterances: Utterance[]) => {
    setUtterances((prevUtterances) => [...prevUtterances, ...utterances]);
  };

  return (
    <TranscriptionContext.Provider value={{ utterances, extendUtterances }}>
      {children}
    </TranscriptionContext.Provider>
  );
};
