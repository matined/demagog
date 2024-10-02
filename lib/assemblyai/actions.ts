import { AssemblyAI } from "assemblyai";

const assemblyai = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function getTemporaryToken(): Promise<string> {
  const token = await assemblyai.realtime.createTemporaryToken({
    expires_in: 3600,
  });
  return token;
}
