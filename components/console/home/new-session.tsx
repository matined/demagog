"use client";

import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";

import { FaMicrophone } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import { useSession } from "@/lib/hooks/use-session";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import AdvancedConfiguration from "./advanced-configuration";

interface NewSessionProps {
  className?: string;
}

export default function NewSession({
  className,
}: NewSessionProps): React.ReactNode {
  const [advancedConfiguration, setAdvancedConfiguration] = useState(false);
  const topRef = useRef<null | HTMLDivElement>(null);
  const bottomRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (advancedConfiguration) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [advancedConfiguration]);

  const { startRecording } = useSession();
  const router = useRouter();

  return (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader className="font-bold flex items-center gap-2">
        <FaMicrophone size={20} />
        <p>New Session</p>
      </CardHeader>
      <Divider />
      <CardBody className="relative w-full h-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-3 flex flex-col justify-center items-center gap-8",
            advancedConfiguration ? "translate-y-[-100%]" : ""
          )}
          ref={topRef}
        >
          <Image
            src="/logo/icon.png"
            alt="logo"
            className="w-44 drop-shadow-lg"
          />
          <ButtonGroup variant="flat" size="lg" className="drop-shadow-lg">
            <Button
              className="bg-secondary text-white"
              onPress={() => {
                startRecording();
                router.push("/console/session");
              }}
            >
              Start a Quick Session
            </Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger className="bg-secondary text-white">
                <Button isIconOnly>
                  <FaChevronDown />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Merge options"
                className="max-w-[300px]"
              >
                <DropdownItem
                  key="quick"
                  description="Let us handle the setup for you."
                  onPress={() => router.push("/console/session")}
                >
                  Quick Session
                </DropdownItem>
                <DropdownItem
                  key="advanced"
                  description="Set up your own session with custom settings."
                  onPress={() => setAdvancedConfiguration(true)}
                >
                  Advanded Configuration
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </div>
        <div
          className="absolute inset-3 flex flex-col justify-center items-center gap-8 translate-y-[100%]"
          ref={bottomRef}
        >
          <AdvancedConfiguration
            className="w-4/5"
            setAdvancedConfiguration={setAdvancedConfiguration}
          />
        </div>
      </CardBody>
    </Card>
  );
}
