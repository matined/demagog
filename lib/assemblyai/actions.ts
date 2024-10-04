"use server";

import { AssemblyAI } from "assemblyai";

export async function getTemporaryToken(): Promise<string> {
  const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY!,
  });

  const token = await client.realtime.createTemporaryToken({
    expires_in: 3600,
  });
  return token;
}
