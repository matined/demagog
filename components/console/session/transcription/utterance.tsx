"use client";

import { TranscriptUtterance } from "assemblyai";

import { cn } from "@/lib/utils";

export default function Utterance({
  className,
  utterance,
}: {
  className?: string;
  utterance: TranscriptUtterance;
}) {
  return (
    <div
      className={cn(
        "flex items-center space-x-2 animate-fade-in-up border-l-2 border-primary pl-2",
        className
      )}
    >
      <span>{utterance.text}</span>
    </div>
  );
}
