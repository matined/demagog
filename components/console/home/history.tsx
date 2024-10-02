import { Card, cn, CardHeader, Divider, CardBody } from "@nextui-org/react";
import { FaHistory } from "react-icons/fa";

export default function History({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader className="font-bold flex items-center gap-2">
        <FaHistory size={20} />
        <p>History</p>
      </CardHeader>
      <Divider />
      <CardBody></CardBody>
    </Card>
  );
}
