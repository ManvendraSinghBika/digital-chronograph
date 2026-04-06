"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

/* ─────────────────────────────────────────────
 *  SHUTTER TRANSITION
 *  A full-screen "mechanical shutter" overlay that fires
 *  between era sections, simulating Barba.js sync-mode
 *  transitions within the Next.js App Router.
 * ───────────────────────────────────────────── */

interface ShutterTransitionProps {
  /** When `true`, the shutter closes then reopens */
  trigger: boolean;
  /** Called after the shutter is fully closed (swap content here) */
  onMidpoint?: () => void;
  /** Called after the shutter fully reopens */
  onComplete?: () => void;
  /** Number of horizontal slats */
  slats?: number;
}

export default function ShutterTransition({
  trigger,
  onMidpoint,
  onComplete,
  slats = 5,
}: ShutterTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevTrigger = useRef(false);

  useEffect(() => {
    if (trigger && !prevTrigger.current) {
      const container = containerRef.current;
      if (!container) return;

      const slatEls = container.querySelectorAll<HTMLElement>(".shutter-slat");
      const tl = gsap.timeline({
        onComplete: () => onComplete?.(),
      });

      // ── CLOSE — slats slide in from alternating directions ──
      tl.set(container, { pointerEvents: "all" });
      tl.fromTo(
        slatEls,
        {
          scaleY: 0,
          transformOrigin: (i: number) =>
            i % 2 === 0 ? "top" : "bottom",
        },
        {
          scaleY: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power4.inOut",
        }
      );

      // ── MIDPOINT — content swap ──
      tl.call(() => onMidpoint?.());

      // ── OPEN — slats retreat ──
      tl.to(slatEls, {
        scaleY: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power4.inOut",
        delay: 0.15,
      });
      tl.set(container, { pointerEvents: "none" });
    }
    prevTrigger.current = trigger;
  }, [trigger, onMidpoint, onComplete, slats]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[500] pointer-events-none flex flex-col"
      aria-hidden="true"
    >
      {Array.from({ length: slats }).map((_, i) => (
        <div
          key={i}
          className="shutter-slat flex-1 bg-background origin-top"
          style={{ transform: "scaleY(0)" }}
        />
      ))}
    </div>
  );
}
