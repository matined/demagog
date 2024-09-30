"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Card,
  CardBody,
  CardHeader,
  Button,
  CardFooter,
} from "@nextui-org/react";

import { useSession } from "@/lib/hooks/use-session";
import { IoLanguage, IoPeople, IoTimer } from "react-icons/io5";
import { MdHearing } from "react-icons/md";

export default function AdvancedConfiguration({
  className,
  setAdvancedConfiguration,
}: {
  className: string;
  setAdvancedConfiguration: (value: boolean) => void;
}): React.ReactNode {
  const { session, startRecording, setConfig } = useSession();

  return (
    <Card className={`mt-2 flex flex-col gap-2 w-full ${className}`}>
      <CardHeader className="flex flex-col gap-2">
        <p className="font-bold text-foreground">Session Settings</p>
      </CardHeader>
      <CardBody className="flex flex-col gap-2">
        <Autocomplete
          variant="bordered"
          size="md"
          label="Language"
          startContent={<IoLanguage size={20} />}
          selectedKey={session.config.language}
          onSelectionChange={(e) => {
            setConfig({ ...session.config, language: e as string });
          }}
        >
          <AutocompleteItem key="auto" value="auto">
            Automatic
          </AutocompleteItem>
          <AutocompleteItem key="en" value="en">
            English
          </AutocompleteItem>
          <AutocompleteItem key="pl" value="pl">
            Polish
          </AutocompleteItem>
          <AutocompleteItem key="de" value="de">
            German
          </AutocompleteItem>
          <AutocompleteItem key="es" value="es">
            Spanish
          </AutocompleteItem>
          <AutocompleteItem key="fr" value="fr">
            French
          </AutocompleteItem>
        </Autocomplete>
        <Input
          defaultValue={session.config.speakerCount?.toString()}
          label="Number of speakers"
          size="md"
          variant="bordered"
          startContent={<IoPeople size={20} />}
          onChange={(e) =>
            setConfig({ ...session.config, speakerCount: +e.target.value })
          }
        />
        <Input
          defaultValue={session.config.chunkSize?.toString()}
          label="Chunk size"
          size="md"
          variant="bordered"
          startContent={<IoTimer size={20} />}
          onChange={(e) =>
            setConfig({ ...session.config, chunkSize: +e.target.value })
          }
        />
        <Input
          defaultValue={session.config.sensitivity?.toString()}
          label="Sensitivity"
          size="md"
          variant="bordered"
          startContent={<MdHearing size={20} />}
          onChange={(e) =>
            setConfig({ ...session.config, sensitivity: +e.target.value })
          }
        />
      </CardBody>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="light"
          color="default"
          onPress={() => {
            setAdvancedConfiguration(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onPress={() => {
            setAdvancedConfiguration(false);

            setTimeout(() => {
              startRecording();
            }, 500);
          }}
          className="bg-tertiary text-white"
        >
          Start Session
        </Button>
      </CardFooter>
    </Card>
  );
}
