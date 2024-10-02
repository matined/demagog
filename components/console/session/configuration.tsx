"use client";

import React from "react";
import { IoLanguage, IoPeople, IoTimer } from "react-icons/io5";
import { MdHearing } from "react-icons/md";
import {
  Autocomplete,
  AutocompleteItem,
  cn,
  Input,
  Tooltip,
} from "@nextui-org/react";
import { useSession } from "@/lib/hooks/use-session";

export default function Configuration({
  className,
}: {
  className?: string;
}): React.ReactNode {
  const { session, setConfig } = useSession();

  const tooltipContent = (header: string, description: string) => (
    <div className="flex flex-col gap-2">
      <div className="px-1 py-2">
        <div className="text-small font-bold">{header}</div>
        <div className="text-tiny whitespace-pre-line">{description}</div>
      </div>
    </div>
  );

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <Tooltip
        showArrow={true}
        offset={25}
        content={tooltipContent(
          "Language",
          "Choose the language speakers speak in\nand that will be used in transcription"
        )}
      >
        <Autocomplete
          variant="bordered"
          size="sm"
          label="Language"
          startContent={<IoLanguage size={20} />}
          selectedKey={session.config.language}
          onSelectionChange={(e) =>
            setConfig({ ...session.config, language: e as string })
          }
          classNames={{
            base: "max-w-44",
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
      </Tooltip>
      <Tooltip
        showArrow={true}
        offset={25}
        content={tooltipContent(
          "Speakers",
          "Choose the expected number of speakers"
        )}
      >
        <Input
          defaultValue={session.config.speakerCount?.toString()}
          type="number"
          label="Speakers"
          size="sm"
          variant="bordered"
          startContent={<IoPeople size={20} />}
          onChange={(e) =>
            setConfig({
              ...session.config,
              speakerCount: +e.target.value,
            })
          }
          className="max-w-28"
        />
      </Tooltip>
      <Tooltip
        showArrow={true}
        offset={25}
        content={tooltipContent(
          "Chunk size",
          "Choose the number of seconds\nto split the audio into"
        )}
      >
        <Input
          type="number"
          defaultValue={session.config.chunkSize?.toString()}
          label="Chunk size"
          size="sm"
          variant="bordered"
          startContent={<IoTimer size={20} />}
          onChange={(e) =>
            setConfig({ ...session.config, chunkSize: +e.target.value })
          }
          className="max-w-28"
        />
      </Tooltip>
      <Tooltip
        showArrow={true}
        offset={25}
        content={tooltipContent(
          "Sensitive",
          "Choose the sensitivity of\nthe speech-to-text engine"
        )}
      >
        <Input
          defaultValue={session.config.chunkSize?.toString()}
          type="number"
          label="Sensitivity"
          size="sm"
          variant="bordered"
          startContent={<MdHearing size={20} />}
          onChange={(e) =>
            setConfig({ ...session.config, chunkSize: +e.target.value })
          }
          className="max-w-28"
        />
      </Tooltip>
    </div>
  );
}
