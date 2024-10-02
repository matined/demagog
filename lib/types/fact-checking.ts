interface Statement {
  statement: string;
  context: string;
  topic: string;
}

interface FactCheck {
  truthness: "TRUE" | "PARTIAL" | "FALSE";
  justification: string;
}

export type { Statement, FactCheck };
