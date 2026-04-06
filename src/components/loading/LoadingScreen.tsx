"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
 *  LOADING SCREEN
 *  Precision-engineered preloader with
 *  mechanical counter animation.
 * ───────────────────────────────────────────── */

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulate asset loading with accelerating progress
    let frame = 0;
    const totalFrames = 60; // ~1 second at 60fps
    let rafId: number;

    const tick = () => {
      frame++;
      const t = frame / totalFrames;
      // Smoothstep easing — no stutter
      const eased = t * t * (3 - 2 * t);
      setProgress(Math.min(Math.round(eased * 100), 100));

      if (frame < totalFrames) {
        rafId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 800);
        }, 400);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-700 bg-background flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-8">
            {/* Counter */}
            <div className="font-mono text-6xl md:text-8xl font-bold text-foreground tabular-nums">
              {String(progress).padStart(3, "0")}
            </div>

            {/* Progress bar */}
            <div className="w-48 h-px bg-border relative">
              <div
                className="absolute left-0 top-0 h-full bg-accent transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Label */}
            <div className="font-mono-accent text-muted text-[10px] tracking-[0.3em]">
              LOADING 25 YEARS OF DESIGN HISTORY
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
