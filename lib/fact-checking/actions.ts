"use server";

import { Groq } from "groq-sdk";
import { Statement, FactCheck } from "../types/fact-checking";
import { FACT_DETECTION_SYSTEM_PROMPTS } from "./data";

const groq = new Groq();

export async function detectStatements(
  formData: FormData
): Promise<Statement[]> {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          FACT_DETECTION_SYSTEM_PROMPTS[formData.get("language") as string],
      },
      {
        role: "user",
        content: formData.get("text") as string,
      },
    ],
    model: "llama-3.2-11b-text-preview",
    temperature: 0,
    max_tokens: 400,
    top_p: 1,
    stream: false,
    response_format: {
      type: "json_object",
    },
    stop: null,
  });

  const response = JSON.parse(chatCompletion.choices[0].message.content!);

  return response.statements;
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
  } catch (error) {
    console.error("Failed to fact check a statement");
    return null;
  }
}
