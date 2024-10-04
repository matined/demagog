"use client";

import { Utterance as UtteranceType } from "@/lib/types/transcription";

import { cn } from "@/lib/utils";

export default function Utterance({
  className,
  utterance,
  text,
}: {
  className?: string;
  utterance?: UtteranceType;
  text?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center space-x-2 animate-fade-in-up border-l-2 border-primary pl-2",
        className
      )}
    >
      <span>
        {utterance?.text}
        {text}
      </span>
    </div>
  );
}
