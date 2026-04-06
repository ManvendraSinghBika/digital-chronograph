"use client";

import { useState, useCallback } from "react";
import {
  Hero,
  ChronographCanvas,
  EraSkeuomorphism,
  EraMinimalism,
  EraModern,
  Navigation,
  LoadingScreen,
  ChronographWidget,
} from "@/components";

/* ─────────────────────────────────────────────
 *  THE DIGITAL CHRONOGRAPH
 *  Main page orchestration — wires all sections
 *  into a single, continuous cinematic shot.
 * ───────────────────────────────────────────── */

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {/* ── Loading Screen ── */}
      {!isLoaded && <LoadingScreen onComplete={handleLoadComplete} />}

      {/* ── Side Navigation ── */}
      <Navigation />

      {/* ── Main Content Flow ── */}
      <main className="relative">
        {/* HERO */}
        <div id="hero">
          <Hero />
        </div>

        {/* CHRONOGRAPH — GSAP Canvas Scrubbing */}
        <div id="chronograph">
          <ChronographCanvas
            className="relative z-10"
          />
        </div>

        {/* ERA 01: Skeuomorphism · 2000–2010 */}
        <EraSkeuomorphism />

        {/* ERA 02: Minimalism · 2010–2020 */}
        <EraMinimalism />

        {/* ERA 03: Modern · 2020–Present */}
        <EraModern />

        {/* THE CHRONOGRAPH ITSELF — thesis made tangible */}
        <section className="relative z-20 bg-background py-32 px-6 md:px-16 lg:px-24 border-t border-border" id="chronograph-widget">
          <div className="max-w-7xl mx-auto">
             <div className="mb-20">
               <span className="font-mono-accent text-accent tracking-[0.2em] text-[10px]">THE ARTIFACT</span>
               <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                 The Chronograph Itself
               </h2>
               <p className="mt-6 max-w-2xl text-muted text-lg leading-relaxed">
                 Every design era produced its own way of measuring precision.
                 This instrument — built with the same modern stack this site runs on —
                 is the final artifact. Start it. Feel the milliseconds.
               </p>
             </div>
             <ChronographWidget />
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="relative py-24 px-6 md:px-16 lg:px-24 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <div className="font-mono-accent text-accent tracking-[0.2em] text-[10px] whitespace-nowrap">
                THE DIGITAL CHRONOGRAPH
              </div>
              <div className="mt-4 text-lg md:text-xl text-foreground/60 max-w-md leading-relaxed">
                The way we design screens is the way we design everything.
              </div>
            </div>
            <div className="flex flex-col items-end gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById("hero");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-mono-accent text-[10px] text-accent tracking-[0.15em] hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Back to top"
              >
                ↑ BACK TO TOP
              </button>
              <div className="font-mono-accent text-[10px] text-muted tracking-[0.15em]">
                A DESIGN ESSAY BY MSB
              </div>
              <div className="flex gap-4 font-mono-accent text-[9px] text-muted/40">
                <span>NEXT.JS</span>
                <span>·</span>
                <span>GSAP</span>
                <span>·</span>
                <span>MOTION</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
