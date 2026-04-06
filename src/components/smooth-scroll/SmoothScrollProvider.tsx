"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type LenisRef = React.MutableRefObject<Lenis | null>;

const LenisContext = createContext<LenisRef | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/* ─────────────────────────────────────────────
 *  SMOOTH SCROLL PROVIDER
 *  Lenis-powered universal smooth scroll with
 *  physics-based interpolation & GSAP sync.
 * ───────────────────────────────────────────── */

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const tickerRef = useRef<gsap.TickerCallback | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      // ── Physics tuning ──
      lerp: 0.08,            // Balanced — smooth but responsive, no double-lerp jitter
      duration: 1.4,          // Natural deceleration without fighting GSAP scrub
      smoothWheel: true,      // Smooth mouse wheel scrolling
      wheelMultiplier: 0.8,   // Balanced multiplier
      touchMultiplier: 1.8,   // Generous touch momentum for mobile
      infinite: false,        // No infinite scroll
    });

    lenisRef.current = lenis;

    // ── Sync Lenis → GSAP ScrollTrigger ──
    // Every time Lenis scrolls, tell ScrollTrigger to update
    lenis.on("scroll", ScrollTrigger.update);

    // ── Sync GSAP ticker → Lenis ──
    // Use GSAP's RAF loop so Lenis and ScrollTrigger share the same frame
    tickerRef.current = (time) => {
      lenis.raf(time * 1000); // GSAP time is in seconds, Lenis expects ms
    };

    gsap.ticker.add(tickerRef.current);

    // Disable Lenis' own internal RAF — GSAP drives it now
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
      }
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
