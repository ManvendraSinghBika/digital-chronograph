"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
 *  ERA: SKEUOMORPHISM · 2000–2010
 *  The Porsche 996 · High-Tech Architecture
 *
 *  Visual Language:
 *    - Glossy textures, reflective surfaces, depth layers
 *    - 3D Card Effect for schematics
 *    - Canvas Reveal for architectural blueprints
 *    - Warm amber / chrome accent palette
 * ───────────────────────────────────────────── */

/* ── Blueprint Canvas Reveal — Aceternity CanvasRevealEffect over blueprint image ── */

/* ─── MAIN SECTION ─── */
export default function EraSkeuomorphism() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const revealOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Stagger-in animations
    const cards = section.querySelectorAll(".skeuo-card");
    gsap.fromTo(
      cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      }
    );

    // Canvas Reveal — fade overlay out to expose blueprint
    if (revealOverlayRef.current) {
      gsap.fromTo(
        revealOverlayRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: revealOverlayRef.current,
            start: "top 95%",
            end: "center center",
            scrub: true,
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="era-2000s"
      className="relative min-h-screen py-32 px-6 md:px-16 lg:px-24"
      data-era="skeuomorphism"
    >
      {/* Background texture */}
      <div className="absolute inset-0 grid-overlay opacity-40" />

      {/* Section Header */}
      <div className="relative z-10 mb-20">
        <span className="font-mono-accent text-amber-500/80 tracking-[0.2em]">
          ERA 01 — THE MILLENNIUM TRANSITION
        </span>
        <h2 className="mt-4 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]">
          <span className="text-gradient">Skeuomorphism</span>
          <br />
          <span className="text-amber-500/40 text-3xl md:text-4xl font-light">
            2000 — 2010
          </span>
        </h2>
        <p className="mt-6 max-w-2xl text-muted text-lg leading-relaxed">
          We didn&apos;t trust pixels yet. So we made them look like things
          we could touch — brushed aluminum buttons, leather-stitched
          calendars, glossy toggles that caught the light. The screen
          had to earn our trust by pretending to be something else.
        </p>
      </div>

      {/* ── Card Grid — 3D Perspective Cards ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">

        {/* ── Card 1: Porsche 996 (large, spans 2 cols) ── */}
        <CardContainer containerClassName="md:col-span-2 lg:col-span-2 !p-0">
          <CardBody className="skeuo-card h-auto w-full rounded-xl p-8 border border-amber-900/30 bg-gradient-to-br from-[#1a1500] via-[#0d0d0d] to-[#1a0f00]">
            <CardItem translateZ="30" className="w-full">
              <span className="font-mono-accent text-amber-500/60">
                PORSCHE 996 · WATER-COOLED ENGINE
              </span>
            </CardItem>
            <CardItem translateZ="50" className="w-full mt-3">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                The Radical Transition
              </h3>
            </CardItem>
            <CardItem translateZ="40" as="p" className="w-full text-muted leading-relaxed mt-3">
              Porsche did the same thing with metal that Apple did with pixels.
              The 996&apos;s cockpit was an analog instrument cluster dressed in
              chrome and leather — because the driver&apos;s trust had to be
              earned through familiarity. Every gauge was a skeuomorph.
            </CardItem>
            <CardItem translateZ="20" className="w-full mt-4">
              <div className="flex gap-4 font-mono-accent text-[10px] text-muted">
                <span>3.4L FLAT-6</span>
                <span>·</span>
                <span>300 HP</span>
                <span>·</span>
                <span>174 MPH</span>
              </div>
            </CardItem>
            <CardItem translateZ="80" className="w-full mt-8">
              <div className="aspect-[21/9] rounded-lg overflow-hidden border border-amber-900/20 relative">
                <Image
                  src="/images/996-engine-schematic.jpg"
                  alt="Porsche 996 M96 Water-Cooled Flat-Six Engine — Technical Cutaway"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={75}
                  loading="lazy"
                />
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* ── Card 2: High-Tech Architecture ── */}
        <CardContainer containerClassName="!p-0">
          <CardBody className="skeuo-card h-auto w-full rounded-xl p-8 border border-amber-900/30 bg-gradient-to-br from-[#1a1500] via-[#0d0d0d] to-[#1a0f00]">
            <CardItem translateZ="30" className="w-full">
              <span className="font-mono-accent text-amber-500/60">
                HIGH-TECH ARCHITECTURE
              </span>
            </CardItem>
            <CardItem translateZ="50" className="w-full mt-3">
              <h3 className="text-xl font-bold text-foreground">Inside-Out</h3>
            </CardItem>
            <CardItem translateZ="40" as="p" className="w-full mt-3 text-sm text-muted leading-relaxed">
              Norman Foster and Richard Rogers exposed a building&apos;s guts
              as its beauty. Pipes on the outside, structure as ornament.
              The same instinct made us put drop shadows on every button.
            </CardItem>
            <CardItem translateZ="80" className="w-full mt-6">
              <div className="aspect-square rounded-lg overflow-hidden border border-amber-900/20 relative">
                <Image
                  src="/images/lloyds-building.jpg"
                  alt="Lloyd's Building London — High-Tech Architecture by Richard Rogers, 1986"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={75}
                  loading="lazy"
                />
                <span className="absolute bottom-2 left-2 font-mono-accent text-amber-500/70 text-[10px] bg-black/60 px-2 py-1 rounded">
                  [ LLOYD&apos;S BUILDING · 1986 ]
                </span>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* ── Card 3: Material Language ── */}
        <CardContainer containerClassName="!p-0">
          <CardBody className="skeuo-card h-auto w-full rounded-xl p-8 border border-amber-900/30 bg-gradient-to-br from-[#1a1500] via-[#0d0d0d] to-[#1a0f00]">
            <CardItem translateZ="30" className="w-full">
              <span className="font-mono-accent text-amber-500/60">
                MATERIAL LANGUAGE
              </span>
            </CardItem>
            <CardItem translateZ="50" className="w-full mt-3">
              <h3 className="text-xl font-bold">Brushed Chrome</h3>
            </CardItem>
            <CardItem translateZ="40" as="p" className="w-full mt-3 text-sm text-muted leading-relaxed">
              iOS 1–6 and Windows Aero made us believe our screens were
              made of glass and chrome. Every pixel was an act of material theater.
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* ── Card 4: Design DNA (spans 2 cols) ── */}
        <CardContainer containerClassName="md:col-span-2 !p-0">
          <CardBody className="skeuo-card h-auto w-full rounded-xl p-8 border border-amber-900/30 bg-gradient-to-br from-[#1a1500] via-[#0d0d0d] to-[#1a0f00]">
            <CardItem translateZ="30" className="w-full">
              <span className="font-mono-accent text-amber-500/60">
                DESIGN DNA
              </span>
            </CardItem>
            <CardItem translateZ="60" className="w-full mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {["Gradients", "Drop Shadows", "Textures"].map((item) => (
                  <div key={item} className="text-center">
                    <div className="aspect-square rounded-lg bg-gradient-to-b from-amber-800/30 to-amber-900/10 border border-amber-800/20 mb-3 flex items-center justify-center">
                      <span className="text-amber-500/50 text-2xl">◆</span>
                    </div>
                    <span className="font-mono-accent text-[10px] text-muted">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>

      {/* ── Canvas Reveal — Architectural Blueprint ── */}
      <div className="relative z-10">
        <span className="font-mono-accent text-amber-500/60 mb-4 block">
          ARCHITECTURAL BLUEPRINT — CANVAS REVEAL
        </span>
        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-amber-900/20">
          {/* Background image revealed underneath */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/blueprint-hightech.jpg)" }}
            role="img"
            aria-label="High-Tech Architecture Blueprint — Centre Pompidou"
          />
          {/* Aceternity dot-matrix reveal overlay */}
          <div ref={revealOverlayRef} className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={0.6}
              containerClassName="bg-[#0d0d0d]"
              colors={[
                [255, 166, 0],
                [200, 120, 0],
              ]}
              dotSize={3}
              showGradient={false}
            />
          </div>
          {/* Label */}
          <div className="absolute bottom-4 left-4 z-10 font-mono-accent text-amber-400/60">
            BLUEPRINT · REVEAL
          </div>
        </div>
      </div>
    </section>
  );
}
