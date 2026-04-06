"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP time is in seconds, Lenis expects ms
    });

    // Disable Lenis' own internal RAF — GSAP drives it now
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(lenis.raf as unknown as gsap.TickerCallback);
    };
  }, []);

  return <>{children}</>;
}
