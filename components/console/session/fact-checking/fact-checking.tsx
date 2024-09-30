"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  ScrollShadow,
} from "@nextui-org/react";
import { MdOutlineFactCheck } from "react-icons/md";

import { cn } from "@/lib/utils";

export default function FactChecking({ className }: { className?: string }) {
  return (
    <Card className="w-full h-full">
      <CardHeader className="font-bold flex items-center gap-2">
        <MdOutlineFactCheck size={20} />
        <p>Fact Checking</p>
      </CardHeader>
      <Divider />
      <CardBody>
        <ScrollShadow hideScrollBar className="w-full h-full">
          <p className="text-sm"></p>
        </ScrollShadow>
      </CardBody>
    </Card>
  );
}
