"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

import { useSession } from "@/lib/hooks/use-session";
import { cn } from "@/lib/utils";
import { useMicrophone } from "@/lib/hooks/use-microphone";

interface AudiobarsProps {
  className?: string;
  barColor?: string;
  minBarHeight?: number;
  maxBarHeight?: number;
}

const Audiobars: React.FC<AudiobarsProps> = ({
  className,
  barColor = "#ff3e3e",
  minBarHeight = 2,
  maxBarHeight = 100,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const { session } = useSession();
  const { stream, audioContext, startMicrophone } = useMicrophone();

  const startVisualization = useCallback(async () => {
    if (!stream || !audioContext) {
      await startMicrophone();
      return;
    }

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const canvasCtx = canvas.getContext("2d");
      if (!canvasCtx) return;

      const resizeCanvas = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      // Resume the audio context if suspended
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      analyserRef.current = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      // Optional: connect the analyser to the destination if needed
      // analyserRef.current.connect(audioContext.destination);

      analyserRef.current.fftSize = 1024;
      analyserRef.current.smoothingTimeConstant = 0.85;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      const visualize = () => {
        if (!canvas || !canvasCtx) return;
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        const draw = () => {
          animationFrameIdRef.current = requestAnimationFrame(draw);
          if (!analyserRef.current || !dataArrayRef.current) return;

          analyserRef.current.getByteFrequencyData(dataArrayRef.current);

          // Optional: Log the data to debug
          // console.log("Audio Data:", dataArrayRef.current);

          canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

          const barWidth = (WIDTH / dataArrayRef.current.length) * 2.5;
          let x = 0;

          for (let i = 0; i < dataArrayRef.current.length; i++) {
            const normalizedValue = dataArrayRef.current[i] / 255;
            const barHeight = session.isRecording
              ? minBarHeight + normalizedValue * (maxBarHeight - minBarHeight)
              : minBarHeight;

            canvasCtx.fillStyle = barColor;

            const y = HEIGHT - barHeight;
            const radius = 5;

            roundRectTop(canvasCtx, x, y, barWidth, barHeight, radius);

            x += barWidth + 1;
          }
        };

        const roundRectTop = (
          ctx: CanvasRenderingContext2D,
          x: number,
          y: number,
          width: number,
          height: number,
          radius: number
        ) => {
          if (radius > width / 2) radius = width / 2;
          if (radius > height) radius = height;
          ctx.beginPath();
          ctx.moveTo(x, y + height);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height);
          ctx.closePath();
          ctx.fill();
        };

        draw();
      };

      visualize();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("There was an error accessing the microphone.");
    }
  }, [
    stream,
    audioContext,
    barColor,
    minBarHeight,
    maxBarHeight,
    session.isRecording,
    startMicrophone,
  ]);

  const stopVisualization = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    window.removeEventListener("resize", () => {});
  }, []);

  useEffect(() => {
    if (session.isRecording) {
      startVisualization();
    } else {
      stopVisualization();
    }

    return () => {
      stopVisualization();
    };
  }, [session.isRecording, startVisualization, stopVisualization]);

  return (
    <div className={cn("text-center w-full", className)}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "200px",
          backgroundColor: "transparent",
          display: "block",
        }}
      ></canvas>
    </div>
  );
};

export default Audiobars;
