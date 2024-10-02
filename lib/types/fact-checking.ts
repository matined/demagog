enum Truthness {
  TRUE = "true",
  PARTIAL = "partial",
  FALSE = "false",
}

interface Statement {
  statement: string;
  context: string;
  topic: string;
}

interface FactCheck {
  truthness: Truthness;
  justification: string;
}

export type { Statement, FactCheck, Truthness };
