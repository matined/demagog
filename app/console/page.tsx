"use client";

import React, { useEffect, useState, useRef } from "react";

import NewSession from "@/components/console/home/new-session";
import AdvancedConfiguration from "@/components/console/home/advanced-configuration";

export default function Console() {
  const [advancedConfiguration, setAdvancedConfiguration] = useState(false);
  const topRef = useRef<null | HTMLDivElement>(null);
  const bottomRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (advancedConfiguration) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [advancedConfiguration]);

  return (
    <div className="overflow-hidden">
      <div
        className="relative w-full h-screen bg-[url('/backgrounds/hero.svg')] bg-cover bg-bottom"
        ref={topRef}
      >
        <NewSession setAdvancedConfiguration={setAdvancedConfiguration} />
      </div>
      <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute w-[200%] h-full bg-tertiary -translate-y-[80%] rotate-[5deg]" />
        <AdvancedConfiguration
          className="w-96"
          setAdvancedConfiguration={setAdvancedConfiguration}
        />
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
