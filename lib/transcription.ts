"use server";

import { AssemblyAI, TranscriptUtterance } from "assemblyai";

export async function transcribeAudio(
  formData: FormData
): Promise<TranscriptUtterance[]> {
  const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY!,
  });

  const transcript = await client.transcripts.transcribe({
    audio: formData.get("audio") as Blob,
    language_code: formData.get("language") as string,
    speakers_expected: parseInt(formData.get("speakerCount") as string),
    speaker_labels: true,
  });

  if (transcript.status === "error") {
    console.error(`Transcription failed: ${transcript.error}`);
    throw new Error("Transcription failed");
  }

  return transcript.utterances || [];
}
