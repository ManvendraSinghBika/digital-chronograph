"use client";

import { useRef, useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
 *  MAGNETIC CURSOR
 *  Physics-based custom cursor with magnetic pull and morphing.
 *  Based on ReactBits magnetic-cursor logic.
 * ───────────────────────────────────────────── */

const MAGNETIC_DISTANCE = 120; // px — pull radius
const SPRING_CONFIG = { damping: 25, stiffness: 300, mass: 0.5 };

interface MagneticTarget {
  element: HTMLElement;
  rect: DOMRect;
  label?: string;
}

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const isVisibleRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  // SSR-safe mount & touch detection using useSyncExternalStore
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isTouchDevice = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(pointer: coarse)").matches,
    () => false
  );

  // Cached magnetic targets — updated on scroll/resize, not every mousemove
  const magneticTargetsRef = useRef<MagneticTarget[]>([]);

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed / spring-based position
  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  // Cursor size
  const cursorSize = useMotionValue(12);
  const springSize = useSpring(cursorSize, { damping: 20, stiffness: 400 });

  // Cache magnetic targets and update on scroll/resize
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let debounceTimer: ReturnType<typeof setTimeout>;
    const updateTargets = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        magneticTargetsRef.current = Array.from(
          document.querySelectorAll<HTMLElement>("[data-magnetic]")
        ).map((el) => ({
          element: el,
          rect: el.getBoundingClientRect(),
          label: el.dataset.magneticLabel,
        }));
      }, 100);
    };
    // Initial cache
    magneticTargetsRef.current = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]")
    ).map((el) => ({
      element: el,
      rect: el.getBoundingClientRect(),
      label: el.dataset.magneticLabel,
    }));

    window.addEventListener("scroll", updateTargets, { passive: true });
    window.addEventListener("resize", updateTargets);

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("scroll", updateTargets);
      window.removeEventListener("resize", updateTargets);
    };
  }, []);

  useEffect(() => {
    // Don't show on touch devices
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      const x = e.clientX;
      const y = e.clientY;

      let attracted = false;

      magneticTargetsRef.current.forEach(({ element: el, label }) => {
        // Use fresh rect for accuracy during interaction
        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          (x - elCenterX) ** 2 + (y - elCenterY) ** 2
        );

        if (distance < MAGNETIC_DISTANCE) {
          attracted = true;

          // Interpolate toward element center
          const pull = 1 - distance / MAGNETIC_DISTANCE;
          const attractX = x + (elCenterX - x) * pull * 0.4;
          const attractY = y + (elCenterY - y) * pull * 0.3;

          mouseX.set(attractX);
          mouseY.set(attractY);

          // Morph cursor
          cursorSize.set(Math.max(40, rect.width * 0.6));
          setIsHovering(true);
          setCursorLabel(label || null);

          // Apply magnetic pull via CSS custom properties
          const offsetX = (x - elCenterX) * pull * 0.15;
          const offsetY = (y - elCenterY) * pull * 0.15;
          el.style.setProperty("--mag-x", `${offsetX}px`);
          el.style.setProperty("--mag-y", `${offsetY}px`);
          el.style.transform = `translate(var(--mag-x, 0px), var(--mag-y, 0px))`;
        } else {
          // Reset element position when cursor leaves
          el.style.setProperty("--mag-x", "0px");
          el.style.setProperty("--mag-y", "0px");
          el.style.transform = "";
          el.style.transition = "transform 0.4s ease-out";
        }
      });

      if (!attracted) {
        mouseX.set(x);
        mouseY.set(y);
        cursorSize.set(12);
        setIsHovering(false);
        setCursorLabel(null);
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };
    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, cursorSize]);

  // Don't render until mounted (SSR-safe) or on touch devices
  if (!isMounted || isTouchDevice) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[600] pointer-events-none mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          width: springSize,
          height: springSize,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        <div
          className={`w-full h-full rounded-full transition-colors duration-200 flex items-center justify-center ${
            isHovering ? "bg-accent" : "bg-foreground"
          }`}
        >
          <AnimatePresence>
            {cursorLabel && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-background text-[9px] font-mono-accent whitespace-nowrap"
              >
                {cursorLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 z-[599] pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          opacity: isVisible ? 0.3 : 0,
          borderColor: isHovering
            ? "var(--accent)"
            : "var(--foreground)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="w-full h-full rounded-full border border-current" />
      </motion.div>
    </>
  );
}
