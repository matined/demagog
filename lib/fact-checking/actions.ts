"use server";

import OpenAI from "openai";

import { Statement, FactCheck } from "../types/fact-checking";
import {
  STATEMENT_DETECTION_SYSTEM_PROMPT,
  STATEMENT_DETECTION_RESPONSE_SCHEMA,
} from "./data";

export async function detectStatements(
  formData: FormData
): Promise<Statement[]> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: STATEMENT_DETECTION_SYSTEM_PROMPT,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: formData.get("text") as string,
          },
        ],
      },
    ],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response_format: STATEMENT_DETECTION_RESPONSE_SCHEMA as any,
  });

  return JSON.parse(response.choices[0].message.content as string).statements;
}

export async function factCheckStatement(
  formData: FormData
): Promise<FactCheck | null> {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        { role: "system", content: "Be precise and concise." },
        {
          role: "user",
          content: `Verify this STATEMENT. Check if it is true.\n\nSTATEMENT: ${formData.get(
            "statement"
          )} ${formData.get(
            "content"
          )}\n\nIn the first line of the answer write TRUE, PARTIAL, FALSE. Than justify in the following lines citing sources.`,
        },
      ],
      max_tokens: 300,
      temperature: 0.1,
      top_p: 0.9,
      return_citations: true,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: "month",
      top_k: 0,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1,
    }),
  };

  try {
    const response = await fetch(
      "https://api.perplexity.ai/chat/completions",
      options
    );
    const data = await response.json();
    const message = data.choices[0].message.content;
    const truthness = message
      .slice(0, message.indexOf("\n"))
      .replace(/\*/g, "")
      .trim();

    const justification = message.slice(message.indexOf("\n") + 1).trim();

    const factCheck: FactCheck = {
      truthness,
      justification,
    };

    return factCheck;
  } catch {
    console.error("Failed to fact check a statement");
    return null;
  }
}
