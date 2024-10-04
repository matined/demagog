export const STATEMENT_DETECTION_SYSTEM_PROMPT: string =
  'Detect statements that require fact-checking during a live interview by analyzing the transcription of the speech. Identify assertions that should be verified and respond in a structured format.\n\n# Steps\n\n1. **Analyze Transcription**: Review the provided transcription of the speech thoroughly.\n2. **Identify Fact-Check Triggers**: Look for statements that contain numbers, statistics, historical claims, bold assertions, or any other claims that can be verified.\n3. **Extract Statements**: Pull out entire sentences or phrases for each identified trigger that requires fact-checking.\n4. **Provide Context**: Note any relevant context around the statement that may affect its meaning or verification process.\n5. **Output Result**: Format your findings in a structured JSON format.\n\n# Output Format\n\nThe output should be a JSON object containing an array of objects. Each object should have the following keys:\n- `"statement"`: The exact text of the statement that needs fact-checking.\n- `"reason"`: A brief explanation of why the statement was flagged for fact-checking.\n- `"context"`: Additional context, if necessary, to understand the statement.\n\nExample:\n```json\n{\n  "statements": [\n    {\n      "statement": "[Extracted statement from transcription]",\n      "reason": "Contains statistical data.",\n      "context": "The speaker was discussing economic growth."\n    }\n  ]\n}\n```\n\n# Examples\n\n**Input:**\n"According to recent studies, 70% of adults suffer from chronic stress."\n\n**Output:**\n```json\n{\n  "statements": [\n    {\n      "statement": "According to recent studies, 70% of adults suffer from chronic stress.",\n      "reason": "Contains statistical data.",\n      "context": "The speaker was discussing health issues in modern society."\n    }\n  ]\n}\n```\n\n# Notes\n\n- Ensure the JSON format is correct and includes all necessary information for each statement.\n- Consider ambiguous claims that could cause confusion or misinterpretation without verification.\n- Statements making controversial or surprising claims should also be flagged.\n- If there\'s no statement return an empty array. Do not force statements. Detect only strong statements that need to be fact-checked.';

export const STATEMENT_DETECTION_RESPONSE_SCHEMA = {
  type: "json_schema",
  json_schema: {
    name: "statements_schema",
    strict: true,
    schema: {
      type: "object",
      properties: {
        statements: {
          type: "array",
          description: "A list of statements with reason and context.",
          items: {
            type: "object",
            properties: {
              statement: {
                type: "string",
                description: "The actual statement made.",
              },
              reason: {
                type: "string",
                description: "The rationale behind the statement.",
              },
              context: {
                type: "string",
                description:
                  "Additional information regarding the context of the statement.",
              },
            },
            required: ["statement", "reason", "context"],
            additionalProperties: false,
          },
        },
      },
      required: ["statements"],
      additionalProperties: false,
    },
  },
};
