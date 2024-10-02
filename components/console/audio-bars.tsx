"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useSession } from "@/lib/hooks/use-session";
import { cn } from "@/lib/utils";

const Audiobars = ({
  className,
  barColor = "#ff3e3e",
  minBarHeight = 2,
  maxBarHeight = 100,
}: {
  className?: string;
  barColor?: string;
  minBarHeight?: number;
  maxBarHeight?: number;
}) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const { session } = useSession();

  useEffect(() => {
    let analyser;
    let dataArray;
    let source;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");

    // Set canvas dimensions to match its displayed size
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resizeCanvas(); // Initial sizing
    window.addEventListener("resize", resizeCanvas); // Resize on window resize

    // Request microphone access
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        analyser = audioContextRef.current.createAnalyser();
        source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 1024; // Increased fftSize for smoother animation
        analyser.smoothingTimeConstant = 0.85; // Adjusted for smoother animation
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // Start visualization
        visualize();
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
        toast.error("There was an error accessing microphone.");
      });

    const visualize = () => {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      const draw = () => {
        animationFrameIdRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT); // Clear the canvas

        const barWidth = (WIDTH / dataArray.length) * 2.5;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          // Map audio data to bar height
          const normalizedValue = dataArray[i] / 255; // Normalize data between 0 and 1
          const barHeight = session.isRecording
            ? minBarHeight + normalizedValue * (maxBarHeight - minBarHeight)
            : minBarHeight;

          canvasCtx.fillStyle = barColor;

          const y = HEIGHT - barHeight;
          const radius = 5; // Adjust for more or less roundness

          // Draw rounded rectangle (rounded top only)
          roundRectTop(canvasCtx, x, y, barWidth, barHeight, radius);

          x += barWidth + 1;
        }
      };

      // Function to draw rectangles rounded on top only
      const roundRectTop = (ctx, x, y, width, height, radius) => {
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

    // Cleanup function
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [barColor, minBarHeight, maxBarHeight, session.isRecording]);

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
