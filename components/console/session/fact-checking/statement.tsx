import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, Card, Chip } from "@nextui-org/react";
import { MdOutlineTopic } from "react-icons/md";

import {
  FactCheck,
  Statement as StatementType,
} from "@/lib/types/fact-checking";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
    const formData = new FormData();
    formData.append("statement", statement.statement);
    formData.append("content", statement.context);

    factCheckStatement(formData)
      .then((fc) => {
        if (fc != null) {
          setFactCheck(fc);
        } else {
          toast.error("Failed to fact check a statement");
        }
      })
      .catch(() => {
        console.error("Failed to fact check statement");
      });
  };

  useEffect(() => {
    handleFactCheck()
      .then((fc) => {
        if (fc != null) {
          setFactCheck(fc);
        } else toast.error("Failed to fact check a statement");
      })
      .catch(() => console.error("Failed to fact check statement"));

    console.log("factCheck", factCheck);
  }, []);

  return (
    <Card
      isPressable
      className={cn(
        "w-full grid grid-cols-[3fr_minmax(350px,1fr)] overflow-hidden",
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
      <div className="text-xs p-2 flex">
        <Chip
          variant="bordered"
          size="sm"
          startContent={<MdOutlineTopic size={14} />}
        >
          {statement.topic}
        </Chip>
      </div>
    </Card>
  );
}
