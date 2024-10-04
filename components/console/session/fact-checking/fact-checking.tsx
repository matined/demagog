"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  ScrollShadow,
  Spinner,
} from "@nextui-org/react";
import { MdOutlineFactCheck } from "react-icons/md";

import { cn } from "@/lib/utils";
import { useSession } from "@/lib/hooks/use-session";
import { useFactChecking } from "@/lib/hooks/use-fact-checking";
import Statement from "./statement";

export default function FactChecking({ className }: { className?: string }) {
  const { statements } = useFactChecking();
  const { session } = useSession();

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
            <div className="mt-12 flex flex-col justify-content items-center gap-4 animate-pulse">
              <Spinner />
              <p className="text-gray-500">
                Waiting for the first statement...
              </p>
            </div>
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
