"use client";

import React from "react";
import { Textarea, Tooltip } from "@nextui-org/react";

import { useSession } from "@/lib/hooks/use-session";
import { cn } from "@/lib/utils";

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
          "Context",
          "Describe the context of the conversation for better results"
        )}
      >
        <Textarea
          variant="faded"
          label="Context"
          placeholder="A conversation between a couple of people."
          value={session.config.context}
          onValueChange={(e) => setConfig({ ...session.config, context: e })}
          maxRows={1}
          className="w-[40rem] h-full"
        />
      </Tooltip>
    </div>
  );
}
