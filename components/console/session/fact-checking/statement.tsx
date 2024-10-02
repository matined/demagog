import { useEffect, useState } from "react";
import { Accordion, AccordionItem, Card, Chip } from "@nextui-org/react";
import { toast } from "sonner";
import { MdOutlineTopic } from "react-icons/md";
import { FaCheck, FaExclamation, FaQuestion } from "react-icons/fa";

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

  const handleFactCheck = async () => {
    if (factCheck != null) return;

    const formData = new FormData();
    formData.append("statement", statement.statement);
    formData.append("content", statement.context);

    factCheckStatement(formData)
      .then((fc) => {
        if (fc != null) setFactCheck(fc);
      })
      .catch(() => {
        console.error("Failed to fact check statement");
        toast.error("Failed to fact check a statement");
      });
  };

  useEffect(() => {
    handleFactCheck();
  }, []);

  return (
    <Card
      className={cn(
        "w-full grid grid-cols-[3fr_minmax(250px,1fr)] overflow-hidden",
        factCheck?.truthness == "FALSE" && "border border-red-500",
        className
      )}
    >
      <Accordion
        variant="shadow"
        itemClasses={{
          title: "text-sm font-normal",
          content: "text-sm text-left text-gray-500",
        }}
      >
        <AccordionItem
          key="1"
          aria-label={statement.context}
          title={<span>{statement.statement} </span>}
        >
          {statement.context}
        </AccordionItem>
      </Accordion>
      <div className="text-xs p-2 flex flex-col justify-between">
        {/* <Chip
          variant="bordered"
          size="sm"
          startContent={<MdOutlineTopic size={14} />}
        >
          {statement.topic}
        </Chip> */}
        {factCheck ? (
          factCheck.truthness === "TRUE" ? (
            <Chip
              endContent={<FaCheck size={14} className="mx-1" />}
              variant="light"
              size="sm"
              className="text-green-500 self-end"
            >
              True
            </Chip>
          ) : factCheck.truthness === "PARTIAL" ? (
            <Chip
              endContent={<FaQuestion size={14} className="mx-1" />}
              variant="light"
              size="sm"
              className="text-yellow-500 self-end"
            >
              Partially true
            </Chip>
          ) : (
            <Chip
              endContent={<FaExclamation size={14} className="mx-1" />}
              variant="light"
              size="sm"
              className="text-red-500 self-end"
            >
              Fack-checked
            </Chip>
          )
        ) : (
          <span className="text-gray-500">Fact-checking in progress...</span>
        )}
      </div>
    </Card>
  );
}
