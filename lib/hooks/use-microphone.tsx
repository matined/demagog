"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useContext,
} from "react";
import { toast } from "sonner";

interface MicrophoneContext {
  stream: MediaStream | null;
  audioContext: AudioContext | null;
  startMicrophone: () => Promise<void>;
  stopMicrophone: () => void;
}

const MicrophoneContext = createContext<MicrophoneContext | undefined>(
  undefined
);

export function useMicrophone(): MicrophoneContext {
  const context = useContext(MicrophoneContext);
  if (!context)
    throw new Error("useMicrophone must be used within a MicrophoneProvider");

  return context;
}

export const MicrophoneProvider = ({ children }: { children: ReactNode }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const startMicrophone = useCallback(async () => {
    try {
      if (stream) return; // Already started
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(mediaStream);
      const context = new (window.AudioContext ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext)();
      setAudioContext(context);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("There was an error accessing the microphone.");
    }
  }, [stream]);

  const stopMicrophone = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
  }, [stream, audioContext]);

  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [stopMicrophone]);

  return (
    <MicrophoneContext.Provider
      value={{
        stream,
        audioContext,
        startMicrophone,
        stopMicrophone,
      }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
};
