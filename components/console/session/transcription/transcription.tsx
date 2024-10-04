"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  ScrollShadow,
  Spinner,
} from "@nextui-org/react";
import { toast } from "sonner";
import { MdOutlineSpeakerNotes } from "react-icons/md";
import { RealtimeTranscriber } from "assemblyai/streaming";
import RecordRTC from "recordrtc";
import { nanoid } from "nanoid";

import { useSession } from "@/lib/hooks/use-session";
import { cn } from "@/lib/utils";
import { useTranscription } from "@/lib/hooks/use-transcription";
import Utterance from "./utterance";
import { getTemporaryToken } from "@/lib/assemblyai/actions";
import { useMicrophone } from "@/lib/hooks/use-microphone";

export default function Transcription({ className }: { className?: string }) {
  const { utterances, extendUtterances } = useTranscription();
  const { session } = useSession();
  const { stream } = useMicrophone();
  const bottomRef = useRef<null | HTMLDivElement>(null);

  const realtimeTranscriber = useRef<RealtimeTranscriber | null>(null);
  const recorder = useRef<RecordRTC | null>(null);
  const [transcript, setTranscript] = useState<string>("");

  const startTranscription = useCallback(async () => {
    realtimeTranscriber.current = new RealtimeTranscriber({
      token: await getTemporaryToken(),
      sampleRate: 16_000,
    });

    realtimeTranscriber.current.on("transcript", (transcript) => {
      if (transcript.message_type == "FinalTranscript") {
        extendUtterances([
          {
            id: nanoid(),
            text: transcript.text,
            audio_start: transcript.audio_start,
            audio_end: transcript.audio_end,
          },
        ]);
        setTranscript("");
      } else if (transcript.message_type == "PartialTranscript") {
        setTranscript(transcript.text);
      }
    });

    realtimeTranscriber.current.on("error", (event) => {
      console.error(event);
      realtimeTranscriber.current?.close();
      realtimeTranscriber.current = null;
      toast.error("There was an error while transcribing.");
    });

    realtimeTranscriber.current.on("close", (code, reason) => {
      console.log(`Connection closed: ${code} ${reason}`);
      realtimeTranscriber.current = null;
    });

    await realtimeTranscriber.current.connect();

    recorder.current = new RecordRTC(stream!, {
      type: "audio",
      mimeType: "audio/webm;codecs=pcm",
      recorderType: RecordRTC.StereoAudioRecorder,
      timeSlice: 250,
      desiredSampRate: 16000,
      numberOfAudioChannels: 1,
      bufferSize: 4096,
      audioBitsPerSecond: 128000,
      ondataavailable: async (blob: Blob) => {
        if (!realtimeTranscriber.current) return;
        const buffer = await blob.arrayBuffer();
        realtimeTranscriber.current.sendAudio(buffer);
      },
    });
    recorder.current?.startRecording();
  }, [stream, extendUtterances]);

  const endTranscription = useCallback(async () => {
    await realtimeTranscriber.current?.close();
    realtimeTranscriber.current = null;

    recorder.current?.pauseRecording();
    recorder.current = null;
  }, []);

  useEffect(() => {
    if (session.isRecording) startTranscription();
    else endTranscription();
  }, [session.isRecording, startTranscription, endTranscription]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [utterances]);

  return (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader className="font-bold flex items-center gap-2">
        <MdOutlineSpeakerNotes size={20} />
        <p>Transcription</p>
      </CardHeader>
      <Divider />
      <CardBody className="relative w-full h-full overflow-hidden">
        <ScrollShadow hideScrollBar className="absolute inset-3">
          {utterances.length === 0 &&
            transcript == "" &&
            session.isRecording && (
              <div className="mt-12 flex flex-col justify-content items-center gap-4 animate-pulse">
                <Spinner />
                <p className="text-gray-500">Listening to the speech...</p>
              </div>
            )}
          {utterances.length === 0 &&
            transcript == "" &&
            !session.isRecording && (
              <div className="mt-12 flex flex-col justify-content items-center gap-4">
                <p className="text-gray-500">
                  Resume the session to start transribing.
                </p>
              </div>
            )}
          {utterances.map((utterance) => (
            <Utterance
              key={utterance.id}
              utterance={utterance}
              className="mb-2"
            />
          ))}
          <Utterance key="realtime" text={transcript} className="mb-2" />
          <div ref={bottomRef} />
        </ScrollShadow>
      </CardBody>
    </Card>
  );
}
