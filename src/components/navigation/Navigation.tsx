"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ─────────────────────────────────────────────
 *  NAVIGATION
 *  Fixed side navigation with era indicators
 *  and scroll-progress awareness.
 * ───────────────────────────────────────────── */

const NAV_ITEMS = [
  { id: "hero", label: "INTRO", era: null },
  { id: "chronograph", label: "CHRONOGRAPH", era: null },
  { id: "era-2000s", label: "2000s", era: "skeuomorphism" },
  { id: "era-2010s", label: "2010s", era: "minimalism" },
  { id: "era-modern", label: "MODERN", era: "modern" },
] as const;

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    // Create scroll triggers for each section
    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(item.id),
        onEnterBack: () => setActiveSection(item.id),
      });
      triggers.push(st);
    });

    // Fade in nav after hero
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: 2,
          ease: "power2.out",
        }
      );
    }

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: el, offsetY: 0 },
        ease: "power3.inOut",
      });
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        ref={navRef}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] opacity-0 hidden lg:flex flex-col gap-4"
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={cn(
              "group flex items-center gap-3 transition-all duration-300",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
            aria-label={`Navigate to ${item.label}`}
          >
            {/* Indicator dot */}
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-500",
                activeSection === item.id
                  ? "bg-accent scale-125"
                  : "bg-muted/50 group-hover:bg-muted"
              )}
            />
            {/* Label */}
            <span
              className={cn(
                "font-mono-accent text-[9px] tracking-[0.15em] transition-all duration-300",
                activeSection === item.id
                  ? "opacity-100 text-accent translate-x-0"
                  : "opacity-0 text-muted -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0"
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Mobile Navigation — fixed bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden glass border-t border-border pb-safe">
        <div className="flex justify-around items-center pt-3 pb-8 px-2 max-w-md mx-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 transition-colors duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded",
                activeSection === item.id ? "text-accent" : "text-muted"
              )}
              aria-label={`Navigate to ${item.label}`}
            >
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-500",
                  activeSection === item.id ? "bg-accent" : "bg-muted/50"
                )}
              />
              <span className="font-mono-accent text-[8px] tracking-[0.1em]">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
