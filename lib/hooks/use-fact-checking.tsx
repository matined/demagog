import React from "react";
import { Statement } from "../types/fact-checking";

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
  const [statements, setStatements] = React.useState<Statement[]>([]);

  const extendStatements = (newStatements: Statement[]) => {
    setStatements([...statements, ...newStatements]);
  };

  return (
    <FactCheckingContext.Provider value={{ statements, extendStatements }}>
      {children}
    </FactCheckingContext.Provider>
  );
};
