"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
 *  ERA: MODERN · 2020–PRESENT
 *  The Porsche Taycan & 992 · Brutalism · Glassmorphism
 *
 *  Visual Language:
 *    - Bento Grid layout
 *    - Aurora/Glassmorphism backgrounds
 *    - Vortex shader for aerodynamic visualization
 *    - Industrial weight + digital transparency
 * ───────────────────────────────────────────── */

/* ── Aurora Background (Glassmorphism ambient glow) ── */
function AuroraBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Aurora layers */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -inset-[100px] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 80, 255, 0.4), transparent), radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255, 77, 0, 0.2), transparent), radial-gradient(ellipse 80% 60% at 20% 80%, rgba(0, 200, 255, 0.15), transparent)",
            animation: "aurora-transform 15s ease-in-out infinite alternate",
          }}
        />
      </div>
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ── Vortex Shader (CSS-based simulation for the Taycan aero section) ── */
function VortexEffect() {
  const vortexRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = vortexRef.current;
    if (!el) return;

    gsap.to(el, {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      <div
        ref={vortexRef}
        className="absolute inset-0"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, rgba(255, 77, 0, 0.3), transparent, rgba(120, 80, 255, 0.2), transparent)",
          filter: "blur(40px)",
        }}
      />
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="font-mono-accent text-accent text-[10px]">
            AERODYNAMIC EFFICIENCY
          </span>
          <div className="mt-2 text-4xl md:text-5xl font-bold text-foreground">
            0.22 C<sub className="text-lg">d</sub>
          </div>
          <span className="font-mono-accent text-muted text-[10px]">
            TAYCAN TURBO GT
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Glowing Effect Wrapper ── */
function GlowCard({
  children,
  className,
  glowColor = "var(--accent)",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  return (
    <div
      className={cn(
        "relative group rounded-2xl overflow-hidden",
        className
      )}
    >
      {/* Glow border */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${glowColor}, transparent 60%)`,
        }}
      />
      {/* Content */}
      <div className="relative glass-elevated rounded-2xl h-full">
        {children}
      </div>
    </div>
  );
}

/* ─── BENTO GRID — Brutalist Modular Layout ─── */
function BentoGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cells = grid.querySelectorAll<HTMLElement>(".bento-cell");
    gsap.fromTo(
      cells,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 75%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      }
    );
  }, []);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)] md:auto-rows-[minmax(200px,auto)]"
    >
      {/* ── Cell 1: Taycan Hero (large) ── */}
      <GlowCard className="bento-cell md:col-span-2 md:row-span-2">
        <div className="relative h-full overflow-hidden">
          {/* Background image */}
          <Image
            src="/images/taycan-cockpit.jpg"
            alt="Porsche Taycan curved digital instrument cluster"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={75}
            loading="lazy"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="relative p-8 h-full flex flex-col justify-between">
            <div>
              <span className="font-mono-accent text-accent text-[10px]">
                ELECTRIC FUTURE
              </span>
              <h3 className="mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Porsche Taycan
              </h3>
              <p className="mt-3 text-muted text-sm leading-relaxed max-w-sm">
                The digital-first future. A curved glass cockpit that IS a
                screen. Where mechanical precision meets electric silence.
              </p>
            </div>
            <div className="flex gap-6 font-mono-accent text-[10px] text-muted">
              <div>
                <div className="text-foreground text-lg font-bold">938</div>
                <div>HP · TURBO GT</div>
              </div>
              <div>
                <div className="text-foreground text-lg font-bold">2.1s</div>
                <div>0-60 MPH</div>
              </div>
              <div>
                <div className="text-foreground text-lg font-bold">161</div>
                <div>MPH TOP</div>
              </div>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* ── Cell 2: 992 Light Bar ── */}
      <GlowCard className="bento-cell" glowColor="rgba(255, 77, 0, 0.6)">
        <div className="p-6 h-full flex flex-col justify-between">
          <span className="font-mono-accent text-accent text-[10px]">
            992 LIGHT SIGNATURE
          </span>
          <div>
            {/* Simulated light bar */}
            <div className="w-full h-1 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent mb-3" />
            <span className="text-sm text-muted">
              Brutalist continuous light bar
            </span>
          </div>
        </div>
      </GlowCard>

      {/* ── Cell 3: Material Language ── */}
      <GlowCard className="bento-cell" glowColor="rgba(120, 80, 255, 0.5)">
        <div className="p-6 h-full flex flex-col justify-between">
          <span className="font-mono-accent text-purple-400/60 text-[10px]">
            GLASSMORPHISM
          </span>
          <div>
            <div className="glass rounded-lg p-3 text-sm text-foreground/80">
              Transparency + Blur = Depth
            </div>
          </div>
        </div>
      </GlowCard>

      {/* ── Cell 4: Bento Grid Concept ── */}
      <GlowCard className="bento-cell md:col-span-2">
        <div className="p-6 h-full flex flex-col justify-between">
          <span className="font-mono-accent text-accent text-[10px]">
            LAYOUT PARADIGM
          </span>
          <div>
            <h4 className="text-xl font-bold text-foreground">Bento Grids</h4>
            <p className="mt-2 text-sm text-muted">
              Modular organization inherited from Brutalist architecture —
              repeating functional modules of concrete and glass,
              translated to pixels. Like this grid you&apos;re looking at right now.
            </p>
          </div>
        </div>
      </GlowCard>

      {/* ── Cell 5: Architecture ── */}
      <GlowCard className="bento-cell">
        <div className="p-6 h-full flex flex-col justify-between">
          <span className="font-mono-accent text-muted text-[10px]">
            BRUTALISM · 2020s
          </span>
          <div className="text-4xl text-foreground/20 font-bold">▦</div>
          <span className="text-sm text-muted">
            Industrial Functionalism
          </span>
        </div>
      </GlowCard>

      {/* ── Cell 6: Digital Engineering ── */}
      <GlowCard className="bento-cell md:col-span-2 lg:col-span-1">
        <div className="p-6 h-full flex flex-col justify-between">
          <span className="font-mono-accent text-cyan-400/60 text-[10px]">
            DESIGN ENGINEER
          </span>
          <p className="text-sm text-muted">
            The hybrid role we now occupy: creative vision meets
            technical rigor. You curate the intent. The tools assemble the form.
          </p>
        </div>
      </GlowCard>
    </div>
  );
}

/* ─── MAIN SECTION ─── */
export default function EraModern() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <AuroraBackground>
      <section
        ref={sectionRef}
        id="era-modern"
        className="relative min-h-screen py-32 px-6 md:px-16 lg:px-24"
        data-era="modern"
      >
        {/* Background grid */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        {/* Section Header */}
        <div className="relative z-10 mb-20">
          <span className="font-mono-accent text-accent tracking-[0.2em]">
            ERA 03 — THE MODERN SYNTHESIS
          </span>
          <h2 className="mt-4 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]">
            <span className="text-gradient-accent">Digital</span>
            <br />
            <span className="text-gradient">Brutalism</span>
          </h2>
          <p className="mt-6 max-w-2xl text-muted text-lg leading-relaxed">
            Now we build with both. Industrial weight meets digital transparency.
            The Taycan&apos;s curved glass cockpit is a Bento Grid — every element
            modular, every surface translucent but structurally honest. This
            section you&apos;re reading? It&apos;s built with the same principle.
          </p>
        </div>

        {/* ── Bento Grid ── */}
        <div className="relative z-10 mb-32">
          <BentoGrid />
        </div>

        {/* ── Vortex / Aerodynamic Section ── */}
        <div className="relative z-10 mb-32">
          <div className="text-center mb-12">
            <span className="font-mono-accent text-accent tracking-[0.2em]">
              AERODYNAMIC SIMULATION — VORTEX SHADER
            </span>
          </div>
          <VortexEffect />
        </div>

        {/* ── Closing Statement ── */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <blockquote className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
            <span className="text-gradient">
              &ldquo;The way we design screens is the way we design
              cars, buildings, and everything in between. The medium changes.
              The instinct doesn&apos;t.&rdquo;
            </span>
          </blockquote>
          <div className="mt-8 font-mono-accent text-muted">
            THE DIGITAL CHRONOGRAPH · 2000–PRESENT
          </div>
        </div>
      </section>
    </AuroraBackground>
  );
}
