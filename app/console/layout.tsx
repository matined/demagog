"use client";

import Audiobars from "@/components/console/audio-bars";
import { SessionProvider } from "@/lib/hooks/use-session";
import { TranscriptionProvider } from "@/lib/hooks/use-transcription";
import TopBar from "@/components/console/top-bar";

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <TranscriptionProvider>
        <div className="h-screen w-screen overflow-hidden p-8">
          <div className="w-full h-full grid grid-rows-[52px_1fr] gap-4">
            <TopBar />
            {children}
          </div>
          <div className="absolute bottom-0 left-0 w-full z-10">
            <Audiobars
              barColor="#f0613d"
              minBarHeight={10}
              maxBarHeight={150}
            />
          </div>
        </div>
      </TranscriptionProvider>
    </SessionProvider>
  );
}
