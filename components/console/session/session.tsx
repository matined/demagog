import { cn } from "@/lib/utils";
import Transcription from "./transcription/transcription";
import Controls from "./controls/controls";
import FactChecking from "./fact-checking/fact-checking";

interface SessionProps {
  className?: string;
  id: string;
}

export default function Session({ className, id }: SessionProps) {
  return (
    <div
      key={`session-${id}`}
      className={cn(
        "w-full h-full grid grid-rows-[1fr_min-content] grid-cols-[3fr_4fr] gap-4",
        className
      )}
    >
      <div className="w-full h-full animate-fade-in">
        <Transcription className="" />
      </div>
      <div className="w-full h-full animate-fade-in">
        <FactChecking />
      </div>
      <div className="w-full h-full col-span-2 animate-fade-in">
        <Controls />
      </div>
    </div>
  );
}
