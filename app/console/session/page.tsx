import Session from "@/components/console/session/session";
import { nanoid } from "nanoid";

export default function SessionPage() {
  const newId = nanoid();

  return (
    <div className="w-full h-full z-20">
      <Session id={newId} />
    </div>
  );
}
