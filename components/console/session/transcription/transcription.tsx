"use client";

import React, { useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  ScrollShadow,
} from "@nextui-org/react";
import { toast } from "sonner";
import { MdOutlineSpeakerNotes } from "react-icons/md";

import { useSession } from "@/lib/hooks/use-session";
import { transcribeAudio } from "@/lib/transcription";
import { cn } from "@/lib/utils";
import { useTranscription } from "@/lib/hooks/use-transcription";
import Utterance from "./utterance";

export default function Transcription({ className }: { className?: string }) {
  const { utterances, extendUtterances } = useTranscription();
  const { session } = useSession();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRecordingRef = useRef(session.isRecording);
  const bottomRef = useRef<null | HTMLDivElement>(null);

  const handleTranscription = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.webm");

    if (session.config.language !== "auto")
      formData.append("language", session.config.language);
    else formData.append("language_detection", "true");

    formData.append("speakerCount", session.config.speakerCount.toString());

    transcribeAudio(formData)
      .then((utterances) => {
        extendUtterances(utterances);
      })
      .catch(() => {
        toast.error("Transcription failed.");
      });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        handleTranscription(audioBlob);

        audioChunksRef.current = [];

        if (isRecordingRef.current) {
          startRecording();
        } else {
          // Stop all media tracks if not continuing
          if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
            mediaRecorderRef.current.stream
              .getTracks()
              .forEach((track) => track.stop());
          }
        }
      };

      mediaRecorderRef.current.start();

      timerRef.current = setTimeout(() => {
        stopRecording();
      }, 20000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("There was an error accessing microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    }
  };

  useEffect(() => {
    isRecordingRef.current = session.isRecording;

    if (session.isRecording) startRecording();
    else stopRecording();
  }, [session.isRecording]);

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
          {utterances.length === 0 && session.isRecording && (
            <p className="mt-12 text-center text-gray-500 animate-pulse">
              Listening. Wait a moment for the first transcription...
            </p>
          )}
          {utterances.length === 0 && !session.isRecording && (
            <p className="mt-12 text-center text-gray-500">
              Resume the session to start transribing.
            </p>
          )}
          {utterances.map((utterance, index) => (
            <Utterance key={index} utterance={utterance} className="mb-2" />
          ))}
          <div ref={bottomRef} />
        </ScrollShadow>
      </CardBody>
    </Card>
  );
}
