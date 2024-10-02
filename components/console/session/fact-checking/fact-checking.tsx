"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  ScrollShadow,
} from "@nextui-org/react";
import { MdOutlineFactCheck } from "react-icons/md";
import { TranscriptUtterance } from "assemblyai";

import { cn } from "@/lib/utils";
import { useSession } from "@/lib/hooks/use-session";
import { useTranscription } from "@/lib/hooks/use-transcription";
import { useFactChecking } from "@/lib/hooks/use-fact-checking";
import { detectStatements } from "@/lib/fact-checking/actions";
import { toast } from "sonner";
import Statement from "./statement";

export default function FactChecking({ className }: { className?: string }) {
  const { utterances } = useTranscription();
  const { statements, extendStatements } = useFactChecking();
  const { session } = useSession();
  const [analizedUtterances, setAnalizedUtterances] = useState<number>(0);

  const analyzeUtterance = async (utterance: TranscriptUtterance) => {
    const formData = new FormData();
    formData.append("language", session.config.language || "en");
    formData.append("text", utterance.text);

    detectStatements(formData)
      .then((statements) => {
        extendStatements(statements);
      })
      .catch(() => {
        console.error("Fact checking failed.");
        toast.error("Fact checking failed.");
      });
  };

  useEffect(() => {
    const newUtterances = utterances.slice(analizedUtterances);

    if (newUtterances.length === 0) return;

    newUtterances.forEach((utterance) => {
      analyzeUtterance(utterance);
    });

    setAnalizedUtterances(utterances.length);
  }, [utterances]);

  return (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader className="font-bold flex items-center gap-2">
        <MdOutlineFactCheck size={20} />
        <p>Fact Checking</p>
      </CardHeader>
      <Divider />
      <CardBody className="relative w-full h-full">
        <ScrollShadow hideScrollBar className="absolute inset-0 p-4">
          {statements.length === 0 && session.isRecording && (
            <p className="mt-12 text-center text-gray-500 animate-pulse">
              Waiting for the first statement...
            </p>
          )}
          {statements.length === 0 && !session.isRecording && (
            <p className="mt-12 text-center text-gray-500">
              Resume the session to start fact-checking.
            </p>
          )}
          {statements.map((statement, index) => (
            <Statement
              key={index}
              className="mb-4 animate-fade-in-up"
              statement={statement}
            />
          ))}
        </ScrollShadow>
      </CardBody>
    </Card>
  );
}
