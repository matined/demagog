"use client";

import React, { useEffect, useRef } from "react";
import { MdOutlineSpeakerNotes } from "react-icons/md";

import { useSession } from "@/lib/hooks/use-session";
import { transcribeAudio } from "@/lib/transcription";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  ScrollShadow,
} from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { useTranscription } from "@/lib/hooks/use-transcription";

export default function Transcription({ className }: { className?: string }) {
  const { transcription, setTranscription } = useTranscription();
  const { session } = useSession();
  const isActive = useRef(true);
  const frzTranscript = useRef<string>("");
  const curTranscript = useRef<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const mimeType = useRef<string>("");

  useEffect(() => {
    if (session.isRecording) startRecording();
    else stopRecording();
  }, [session.isRecording]);

  const resetAndInitializeRecorder = (): void => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      streamRef.current = stream;
      isActive.current = true;
      const options = { mimeType: mimeType.current };
      if (mimeType && mimeType.current === "") {
        let options = { mimeType: "" };
        if (MediaRecorder.isTypeSupported("audio/webm")) {
          options = { mimeType: "audio/webm" };
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          options = { mimeType: "audio/mp4" };
        } else {
          mimeType.current = "audio/webm";
        }

        mimeType.current = options.mimeType;
      }
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      chunksRef.current = [];
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start(5000);
    });
  };

  const handleDataAvailable = async (event: BlobEvent): Promise<void> => {
    if (!isActive.current || event.data.size === 0) {
      return;
    }

    chunksRef.current.push(event.data);
    const audioBlob = new Blob(chunksRef.current, { type: mimeType.current });
    const formData = new FormData();
    formData.append("audio", audioBlob);
    console.log("Transcribing audio...");
    const { transcript: new_transcription, rtf } = await transcribeAudio({
      formData: formData,
      timestamp: Date.now(),
      noSpeechProb: 1 - session.config.sensitivity,
      language: session.config.language,
    });

    curTranscript.current = new_transcription;

    const audio_len = chunksRef.current.reduce(
      (acc, chunk) => acc + chunk.size,
      0
    );
    if (audio_len >= 300000) {
      frzTranscript.current += " " + curTranscript.current;
      curTranscript.current = "";
      setTranscription(
        frzTranscript.current.trim() + " " + curTranscript.current.trim()
      );
      resetAndInitializeRecorder();
    }
  };

  const startRecording = (): void => {
    resetAndInitializeRecorder();
  };

  const stopRecording = async (): Promise<void> => {
    isActive.current = false;
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  return (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader className="font-bold flex items-center gap-2">
        <MdOutlineSpeakerNotes size={20} />
        <p>Transcription</p>
      </CardHeader>
      <Divider />
      <CardBody>
        <ScrollShadow hideScrollBar className="w-full h-full">
          <p className="text-sm">{transcription}</p>
        </ScrollShadow>
      </CardBody>
    </Card>
  );
}
