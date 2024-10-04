import { useCallback, useEffect, useState } from "react";
import { Accordion, AccordionItem, Divider, Spinner } from "@nextui-org/react";
import { toast } from "sonner";
import { FaCheck, FaExclamation, FaQuestion } from "react-icons/fa";
import Markdown from "react-markdown";

import { cn } from "@/lib/utils";
import {
  FactCheck,
  Statement as StatementType,
} from "@/lib/types/fact-checking";
import { factCheckStatement } from "@/lib/fact-checking/actions";

export default function Statement({
  className,
  statement,
}: {
  className?: string;
  statement: StatementType;
}) {
  const [factCheck, setFactCheck] = useState<FactCheck | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleFactCheck = useCallback(async () => {
    if (factCheck != null || isChecked) return;

    setIsChecked(true);

    const formData = new FormData();
    formData.append("statement", statement.statement);
    formData.append("content", statement.context);

    try {
      const fc = await factCheckStatement(formData);

      if (fc != null) setFactCheck(fc);
    } catch {
      console.error("Failed to fact check statement");
      toast.error("There was an error while fact checking a statement");
    }
  }, [statement, factCheck, isChecked]);

  useEffect(() => {
    handleFactCheck();
  }, [handleFactCheck]);

  return (
    <Accordion
      variant="shadow"
      className={cn("mb-4", className)}
      itemClasses={{
        title: "text-sm font-normal",
        content: "text-sm text-left text-gray-500",
      }}
    >
      <AccordionItem
        key="1"
        aria-label={statement.context}
        title={
          <div className="flex justify-between items-center">
            <p>{statement.statement}</p>
          </div>
        }
        startContent={
          factCheck ? (
            factCheck.truthness === "TRUE" ? (
              <FaCheck size={16} className="mx-1 text-green-500" />
            ) : factCheck.truthness === "PARTIAL" ? (
              <FaQuestion size={16} className="mx-1 text-yellow-500" />
            ) : (
              <FaExclamation size={16} className="mx-1 text-red-500" />
            )
          ) : (
            <div className="relative w-full h-full flex justify-content items-center">
              <Spinner size="sm" className="" />
            </div>
          )
        }
      >
        <div className="w-full flex flex-col gap-3">
          <div>
            <h3 className="text-normal font-bold mb-1">Statement</h3>
            <p>{statement.context}</p>
          </div>
          <Divider />
          <div>
            <h3 className="text-normal font-bold mb-1">
              Fact Check Justification
            </h3>
            <Markdown>{factCheck?.justification}</Markdown>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
