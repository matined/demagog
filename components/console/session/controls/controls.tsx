"use client";

import { BiSolidRightArrow } from "react-icons/bi";
import { FaStop } from "react-icons/fa6";
import { Button, Card, CardBody, cn, Divider } from "@nextui-org/react";

import ExitButton from "../exit-button";
import Configuration from "../configuration";
import { useSession } from "@/lib/hooks/use-session";

interface StartStopProps {
  className?: string;
}

export default function Controls({
  className,
}: StartStopProps): React.ReactNode {
  const { session, startRecording, stopRecording } = useSession();

  return (
    <Card className={cn("w-full h-full", className)}>
      <CardBody className="grid grid-cols-[1fr_10px_2fr_10px_1fr]">
        <div className="h-full flex items-center justify-start">
          <Button
            size="lg"
            startContent={
              session.isRecording ? <FaStop /> : <BiSolidRightArrow />
            }
            className={cn(
              "bg-gradient-to-tr text-white shadow-lg",
              session.isRecording
                ? "from-red-500 to-secondary"
                : "from-primary to-secondary"
            )}
            onPress={() => {
              if (session.isRecording) stopRecording();
              else startRecording();
            }}
          >
            {session.isRecording ? "Pause session" : "Resume session"}
          </Button>
        </div>
        <Divider orientation="vertical" />
        <Configuration className="justify-center" />
        <Divider orientation="vertical" />
        <div className="flex items-center justify-end">
          <ExitButton />
        </div>
      </CardBody>
    </Card>
  );
}
