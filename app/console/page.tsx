"use client";

import NewSession from "@/components/console/home/new-session";
import History from "@/components/console/home/history";

export default function Console() {
  return (
    <>
      <div className="w-full h-full z-20 grid grid-cols-2 grid-rows-2 gap-4">
        <NewSession className="animate-fade-in" />
        <History className="row-span-2 animate-fade-in" />
      </div>
      <div className="absolute w-screen h-screen left-0 bottom-0 bg-[url('/backgrounds/hero.svg')] bg-cover bg-bottom z-1 animate-fade-in" />
    </>
  );
}
