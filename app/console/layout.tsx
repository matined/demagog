"use client";

import { Toaster } from "sonner";

import { SessionProvider } from "@/lib/hooks/use-session";
import { TranscriptionProvider } from "@/lib/hooks/use-transcription";
import TopBar from "@/components/console/top-bar";
import { FactCheckingProvider } from "@/lib/hooks/use-fact-checking";

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <TranscriptionProvider>
        <FactCheckingProvider>
          <div className="h-screen w-screen overflow-hidden p-8">
            <Toaster position="top-center" theme="light" richColors />
            <div className="w-full h-full grid grid-rows-[52px_1fr] gap-4">
              <TopBar />
              {children}
            </div>
          </div>
        </FactCheckingProvider>
      </TranscriptionProvider>
    </SessionProvider>
  );
}
