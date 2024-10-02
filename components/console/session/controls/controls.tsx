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
      <CardBody className="flex flex-row justify-between items-center">
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
        <div className="flex flex-row gap-4 h-full">
          <Divider orientation="vertical" />
          <Configuration className="justify-end" />
        </div>
      </CardBody>
    </Card>
  );
}
