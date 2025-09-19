"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AutoScrollMD({show}: {show: boolean}) {
  const [speed, setSpeed] = useState(20); // default speed (pixels/second)
  const requestRef = useRef<number | null>(null);
  const lastTime = useRef<number  | null>(null);

  useEffect(() => {
    if(!show) {
        requestRef.current = null;
        lastTime.current = null;
        return;
    }

    const step = (time: number) => {
      if (!lastTime.current) lastTime.current = time;
      const delta = (time - lastTime.current) / 1000; // seconds since last frame
      window.scrollBy(0, speed * delta);
      lastTime.current = time;

      // keep scrolling until bottom
      if (window.innerHeight + window.scrollY < document.body.scrollHeight) {
        requestRef.current = requestAnimationFrame(step);
      }
    };

    requestRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [speed, show]);

  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        fontFamily: "sans-serif",
        zIndex: 9999,
      }}
      className={cn("bg-bars/90 text-primary text-sm items-center justify-center gap-2 w-[300px] fixed  md:bottom-30 md:right-10 ",show && "hidden md:flex ", !show && "hidden ")} 
    >
      <label style={{ fontSize: 14 }}>
        Speed: {speed}px/s
        <input
          type="range"
          min="0"
          max="300"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-150px bg-background"
        />
      </label>
    </div>
  );
}
