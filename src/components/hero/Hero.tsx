"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import CinematicToggle from "@/components/cinematic/CinematicToggle";

type HeroProps = {
  cinematicActive: boolean;
  onToggleCinematic: () => void;
};

/* ─────────────────────────────────────────────
 *  HERO SECTION
 *  The opening cinematic — precision-engineered
 *  entrance with the Digital Brutalist aesthetic.
 * ───────────────────────────────────────────── */

export default function Hero({ cinematicActive, onToggleCinematic }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
      delay: 0.3,
    });

    // Line sweep
    tl.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left" },
      { scaleX: 1, duration: 1.2 }
    );

    // Meta text
    tl.fromTo(
      metaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.6"
    );

    // Title — split into lines
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll(".hero-char");
      tl.fromTo(
        chars,
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.03, duration: 1 },
        "-=0.5"
      );
    }

    // Subtitle
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.4"
    );
  }, []);

  const titleText = "HOW WE LEARNED TO SEE";

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-end pb-16 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-overlay opacity-30" />

      {/* Ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-10"
        style={{
          background:
            "radial-gradient(ellipse, var(--accent) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 md:px-16 lg:px-24 py-8 z-10">
        <div className="font-mono-accent text-muted text-[10px] tracking-[0.3em]">
          THE DIGITAL CHRONOGRAPH
        </div>
        <div className="font-mono-accent text-muted text-[10px] tracking-[0.2em]">
          2000 — PRESENT
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Meta line */}
        <div ref={metaRef} className="mb-6 flex items-center gap-4">
          <span className="font-mono-accent text-accent tracking-[0.2em]">
            A DESIGN ESSAY
          </span>
          <span className="font-mono-accent text-muted text-[10px]">
            PORSCHE · INTERFACES · ARCHITECTURE
          </span>
        </div>

        {/* Main title */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-[8rem] xl:text-[10rem] font-bold tracking-tighter leading-[0.85] overflow-hidden"
        >
          {titleText.split(" ").map((word, wi) => (
            <span key={wi} className="inline-block mr-[0.25em] last:mr-0">
              {word.split("").map((char, ci) => (
                <span key={ci} className="hero-char inline-block">
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Accent line */}
        <div
          ref={lineRef}
          className="mt-8 h-px w-full bg-linear-to-r from-accent via-accent/40 to-transparent"
        />

        {/* Subtitle */}
        <div ref={subtitleRef} className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <p className="text-muted text-lg md:text-xl max-w-xl leading-relaxed">
            The cockpits Stuttgart built and the screens we designed followed
            the same instincts, at the same time, for the same reasons.
            Scroll to trace the lineage.
          </p>
          <div className="flex flex-col items-end gap-3">
            <CinematicToggle isActive={cinematicActive} onToggle={onToggleCinematic} />
            <div
              className={[
                "w-px h-12 bg-accent/40 animate-pulse transition-opacity duration-300",
                cinematicActive ? "opacity-0" : "opacity-100",
              ].join(" ")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
