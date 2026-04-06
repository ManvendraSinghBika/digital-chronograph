"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
 *  ERA: MINIMALISM · 2010–2020
 *  The Porsche 991 · Scandinavian Minimalism
 *
 *  Visual Language:
 *    - Clean typography, generous whitespace
 *    - Sticky Scroll Reveal for content hierarchy
 *    - Muted palette with subtle blue accents
 *    - Functional simplicity
 * ───────────────────────────────────────────── */

/* ── Aceternity Sticky Scroll content items ── */
const STICKY_CONTENT = [
  {
    title: "The Classical Return",
    description:
      "Then we grew up. The 991 returned to the classical silhouette and said: the car doesn't need decoration. The driving does. Its interior — a clean, vertically oriented center console — was physical minimalism. Every knob earned its place.",
    content: (
      <div className="relative h-full w-full overflow-hidden rounded-md">
        <Image
          src="/images/991-interior.jpg"
          alt="Porsche 991 interior — minimalist driver-focused cockpit"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={75}
          loading="lazy"
        />
      </div>
    ),
  },
  {
    title: "Flat Design Revolution",
    description:
      "iOS 7 stripped away every shadow, every texture, every faux-leather stitch. What was left? Typography. White space. The content itself. Jony Ive said: the interface should defer to the content. He was right.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,#06b6d4,#0ea5e9)] text-white">
        <span className="font-mono text-[10px] tracking-[0.3em] opacity-60">
          FLAT DESIGN · 2013
        </span>
      </div>
    ),
  },
  {
    title: "Scandinavian Functionalism",
    description:
      "Architecture followed the same instinct. Scandinavian functionalism — light, oak, concrete, floor-to-ceiling glass — created spaces that feel breathable. The buildings started looking like websites. Or maybe we started building websites that looked like buildings.",
    content: (
      <div className="relative h-full w-full overflow-hidden rounded-md">
        <Image
          src="/images/scandinavian-space.jpg"
          alt="Scandinavian minimalist interior — concrete, oak, and floor-to-ceiling glass"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={75}
          loading="lazy"
        />
      </div>
    ),
  },
  {
    title: "Responsive & Mobile-First",
    description:
      "Mobile-first design forced a reckoning with information density. Every element had to earn its place on a 4-inch screen. The 991's dashboard philosophy — nothing unnecessary — became the web's guiding principle.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,#0f172a,#1e3a5f)] text-white">
        <div className="text-center">
          <div className="font-mono text-[10px] tracking-[0.3em] opacity-60 mb-2">
            RESPONSIVE ERA · 2015
          </div>
          <div className="flex gap-6 font-mono text-[10px] opacity-40">
            <span>3.8L FLAT-6</span>
            <span>·</span>
            <span>350 HP</span>
            <span>·</span>
            <span>4.0s</span>
          </div>
        </div>
      </div>
    ),
  },
];

/* ── Text Generate Effect — words fade in sequentially ── */
function TextGenerate({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLSpanElement>(".tg-word");
    gsap.fromTo(
      words,
      { opacity: 0.1, y: 4 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.04,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [text]);

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-x-[0.3em]", className)}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="tg-word text-foreground">
          {word}
        </span>
      ))}
    </div>
  );
}

/* ─── MAIN SECTION ─── */
export default function EraMinimalism() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      id="era-2010s"
      className="relative min-h-screen bg-background"
      data-era="minimalism"
    >
      {/* Section Header */}
      <div className="px-6 md:px-16 lg:px-24 pt-32 pb-16">
        <span className="font-mono-accent text-sky-400/60 tracking-[0.2em]">
          ERA 02 — THE ERA OF REFINEMENT
        </span>
        <h2 className="mt-4 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]">
          <span className="text-gradient">Minimalism</span>
          <br />
          <span className="text-sky-400/30 text-3xl md:text-4xl font-light">
            2010 — 2020
          </span>
        </h2>
      </div>

      {/* Text Generate Hero Quote */}
      <div className="px-6 md:px-16 lg:px-24 pb-20">
        <TextGenerate
          text="Then we grew up. iOS 7 stripped every shadow, every texture, every faux-leather stitch. What was left? Typography. White space. The content itself. The best interface became no interface at all."
          className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed max-w-4xl"
        />
      </div>

      {/* ── Aceternity Sticky Scroll Reveal ── */}
      <div className="px-6 md:px-16 lg:px-24">
        <StickyScroll
          content={STICKY_CONTENT}
          contentClassName="rounded-xl border border-sky-400/10"
        />
      </div>

      {/* ── Bottom Feature Grid ── */}
      <div className="px-6 md:px-16 lg:px-24 py-24 grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
        {[
          { label: "Typography", value: "Helvetica Neue → SF Pro", icon: "Aa" },
          { label: "Color Palette", value: "Monochrome + One Accent", icon: "◐" },
          { label: "Layout", value: "Grid Systems · 12-Col", icon: "▦" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-background p-10 flex flex-col gap-4"
          >
            <span className="text-3xl text-sky-400/40">{item.icon}</span>
            <span className="font-mono-accent text-sky-400/60 text-[10px]">
              {item.label}
            </span>
            <span className="text-foreground text-lg font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
