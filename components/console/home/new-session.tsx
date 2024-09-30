"use client";

import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Image,
} from "@nextui-org/react";

import { FaChevronDown } from "react-icons/fa6";
import { useSession } from "@/lib/hooks/use-session";
import { useRouter } from "next/navigation";

interface NewSessionProps {
  setAdvancedConfiguration: (advancedConfiguration: boolean) => void;
}

export default function NewSession({
  setAdvancedConfiguration,
}: NewSessionProps): React.ReactNode {
  const { startRecording } = useSession();
  const router = useRouter();

  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-32 flex flex-col items-center gap-8">
      <Image src="/logo/icon.png" alt="logo" className="w-44 drop-shadow-lg" />
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
          <DropdownMenu aria-label="Merge options" className="max-w-[300px]">
            <DropdownItem
              key="quick"
              description="Let us handle the setup for you."
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
  );
}
