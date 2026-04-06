"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function ChronographWidget() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const requestRef = useRef<number>(undefined);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds
      .toString()
      .padStart(2, "0")}`;
  };

  const updateTimer = () => {
    if (startTimeRef.current) {
      const now = performance.now();
      const newTime = accumulatedTimeRef.current + (now - startTimeRef.current);
      setTime(newTime);
      requestRef.current = requestAnimationFrame(updateTimer);
    }
  };

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      accumulatedTimeRef.current = time;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleLap = () => {
    if (time > 0) {
      setLaps((prev) => [time, ...prev]);
    }
  };
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    accumulatedTimeRef.current = 0;
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Telemetry Header */}
      <div className="w-full flex justify-between items-end border-b border-border/50 pb-2 mb-8">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] tracking-widest text-muted uppercase">System</span>
          <span className="font-sans text-sm font-semibold tracking-wide text-foreground">TELEMETRY CHRONOGRAPH 0.1</span>
        </div>
        <div className="hidden sm:flex flex-col text-right">
          <span className="font-mono text-[10px] tracking-widest text-muted uppercase">Status</span>
          <span className={cn("font-mono text-sm tracking-wide", isRunning ? "text-accent" : "text-foreground")}>
            {isRunning ? "ACTIVE_RECORDING" : "STANDBY"}
          </span>
        </div>
      </div>

      {/* Main Display Container */}
      <div className="w-full relative glass-elevated border-border mb-8 overflow-hidden rounded-none">
        <div className="absolute inset-0 bg-background/80 mix-blend-multiply pointer-events-none" />
        
        {/* Subtle grid lines */}
        <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

        <div className="relative z-10 px-6 py-16 sm:py-24 flex flex-col items-center justify-center text-center">
           <h2 className="text-6xl sm:text-8xl md:text-9xl font-bold font-mono tracking-tighter tabular-nums drop-shadow-2xl">
             {formatTime(time)}
           </h2>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-16 w-full">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex-1 sm:flex-none px-12 py-4 bg-accent hover:opacity-90 text-background font-sans font-bold tracking-widest text-sm uppercase transition-all"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex-1 sm:flex-none px-12 py-4 border-2 border-accent text-accent hover:bg-accent/10 font-sans font-bold tracking-widest text-sm uppercase transition-all"
          >
            Stop
          </button>
        )}
        <button
          onClick={handleLap}
          disabled={!isRunning && time === 0}
          className="flex-1 sm:flex-none px-12 py-4 border border-border text-foreground hover:bg-surface-elevated font-sans font-semibold tracking-widest text-sm uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lap
        </button>
        <button
          onClick={handleReset}
          disabled={time === 0}
          className="w-full sm:w-auto px-6 py-4 border-t sm:border-t-0 sm:border-l border-border text-muted hover:text-foreground font-sans font-medium tracking-widest text-xs uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>

      {/* Lap Times */}
      {laps.length > 0 && (
        <div className="w-full max-w-2xl border-t border-border pt-8">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-sans text-xs tracking-widest text-muted uppercase">Lap History</h3>
             <span className="font-mono text-xs text-muted">COUNT: {laps.length.toString().padStart(2, '0')}</span>
          </div>
          <ul className="flex flex-col gap-1 w-full">
            {laps.map((lapTime, i) => (
              <li 
                key={i} 
                className="flex justify-between items-center py-3 px-4 bg-surface hover:bg-surface-elevated transition-colors"
                style={{ animation: 'aurora-transform 0.4s ease-out' }}
              >
                <span className="font-mono text-sm tracking-widest text-muted">LAP {(laps.length - i).toString().padStart(2, "0")}</span>
                <span className="font-mono text-lg font-bold tabular-nums text-foreground">{formatTime(lapTime)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
