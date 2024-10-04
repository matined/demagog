interface Statement {
  statement: string;
  reason: string;
  context: string;
}

interface FactCheck {
  truthness: "TRUE" | "PARTIAL" | "FALSE";
  justification: string;
}

export type { Statement, FactCheck };
