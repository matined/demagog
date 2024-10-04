"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Statement } from "../types/fact-checking";
import { useTranscription } from "./use-transcription";
import { Utterance } from "../types/transcription";
import { detectStatements } from "../fact-checking/actions";

interface FactCheckingContext {
  statements: Statement[];
  extendStatements: (statements: Statement[]) => void;
}

const FactCheckingContext = React.createContext<
  FactCheckingContext | undefined
>(undefined);

export function useFactChecking(): FactCheckingContext {
  const context = React.useContext(FactCheckingContext);
  if (!context)
    throw new Error(
      "useFactChecking must be used within a FactCheckingProvider"
    );

  return context;
}

interface FactCheckingProviderProps {
  children: React.ReactNode;
}

export const FactCheckingProvider = ({
  children,
}: FactCheckingProviderProps) => {
  const { utterances } = useTranscription();
  const [statements, setStatements] = useState<Statement[]>([]);

  const processedUtteranceIdsRef = useRef<Set<string>>(new Set());

  const extendStatements = (newStatements: Statement[]): void => {
    setStatements([...statements, ...newStatements]);
  };

  const handleUtterance = async (
    utterance: Utterance
  ): Promise<Statement[]> => {
    console.log("Fact checking utterance id:", utterance.id);

    const formData = new FormData();
    formData.append("text", utterance.text);

    try {
      return await detectStatements(formData);
    } catch {
      console.error("Fact checking failed.");
      toast.error("There was an error while fact checking.");
    }

    return [];
  };

  useEffect(() => {
    const processedIds = processedUtteranceIdsRef.current;

    const newUtterances = utterances.filter((u) => !processedIds.has(u.id));

    newUtterances.forEach(async (u) => {
      const newStatements = await handleUtterance(u);
      setStatements((prevStatements) => [...prevStatements, ...newStatements]);

      processedIds.add(u.id);
    });
  }, [utterances]);

  return (
    <FactCheckingContext.Provider value={{ statements, extendStatements }}>
      {children}
    </FactCheckingContext.Provider>
  );
};
