"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "@/components/smooth-scroll/SmoothScrollProvider";

type CinematicZone = {
  id: string;
  speed: number; // pixels per second
  pauseMs?: number;
};

type UseCinematicScrollOptions = {
  zones: CinematicZone[];
  transitionMs?: number;
  enabled?: boolean;
  killArmDelayMs?: number;
};

type UseCinematicScrollReturn = {
  isActive: boolean;
  start: () => void;
  stop: () => void;
  toggle: () => void;
};

function getBottomLimit() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

export function useCinematicScroll({
  zones,
  transitionMs = 200,
  enabled = true,
  killArmDelayMs = 450,
}: UseCinematicScrollOptions): UseCinematicScrollReturn {
  const lenisRef = useLenis();
  const [isActive, setIsActive] = useState(false);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const currentSpeedRef = useRef(0);
  const pauseUntilRef = useRef<number>(0);
  const pausedZonesRef = useRef<Set<string>>(new Set());
  const activatedAtRef = useRef(0);

  const zonesById = useMemo(() => {
    return zones.filter((zone) => zone.id && zone.speed >= 0);
  }, [zones]);

  const getActiveZone = useCallback((): CinematicZone | null => {
    const probeY = window.innerHeight * 0.35;

    for (const zone of zonesById) {
      const element = document.getElementById(zone.id);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      if (rect.top <= probeY && rect.bottom > probeY) {
        return zone;
      }
    }

    // Fallback to the last zone when we're below all configured sections.
    return zonesById[zonesById.length - 1] ?? null;
  }, [zonesById]);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  const start = useCallback(() => {
    if (!enabled) return;
    if (isActive) return;

    pausedZonesRef.current.clear();
    pauseUntilRef.current = 0;
    currentSpeedRef.current = 0;
    lastTimeRef.current = null;
    activatedAtRef.current = performance.now();

    setIsActive(true);
  }, [enabled, isActive]);

  const toggle = useCallback(() => {
    if (isActive) {
      stop();
    } else {
      start();
    }
  }, [isActive, start, stop]);

  useEffect(() => {
    if (!isActive) {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const frame = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const dtMs = Math.max(0, time - (lastTimeRef.current ?? time));
      lastTimeRef.current = time;
      const dtSec = dtMs / 1000;

      const maxScroll = getBottomLimit();
      const scrollY = window.scrollY;

      if (scrollY >= maxScroll - 1) {
        stop();
        return;
      }

      const activeZone = getActiveZone();
      let targetSpeed = activeZone?.speed ?? 0;

      const now = performance.now();
      if (activeZone?.pauseMs && !pausedZonesRef.current.has(activeZone.id)) {
        pauseUntilRef.current = now + activeZone.pauseMs;
        pausedZonesRef.current.add(activeZone.id);
      }

      if (now < pauseUntilRef.current) {
        targetSpeed = 0;
      }

      const lerpAlpha = Math.min(1, dtMs / transitionMs);
      currentSpeedRef.current =
        currentSpeedRef.current + (targetSpeed - currentSpeedRef.current) * lerpAlpha;

      const nextY = Math.min(maxScroll, scrollY + currentSpeedRef.current * dtSec);
      const lenis = lenisRef?.current;

      if (lenis) {
        lenis.scrollTo(nextY, { immediate: true, force: true, lock: false });
      } else {
        window.scrollTo({ top: nextY, behavior: "auto" });
      }

      rafRef.current = window.requestAnimationFrame(frame);
    };

    rafRef.current = window.requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [getActiveZone, isActive, lenisRef, stop, transitionMs]);

  useEffect(() => {
    const canKill = () => performance.now() - activatedAtRef.current > killArmDelayMs;

    const handleWheel = (event: WheelEvent) => {
      if (!canKill()) return;
      // Ignore tiny momentum noise; require meaningful manual input.
      if (Math.abs(event.deltaY) < 2 && Math.abs(event.deltaX) < 2) return;
      stop();
    };

    const handleTouch = () => {
      if (!canKill()) return;
      stop();
    };

    const handleKey = () => {
      if (!canKill()) return;
      stop();
    };

    const handleAuxClick = (event: MouseEvent) => {
      if (event.button !== 1) return;
      event.preventDefault();
      toggle();
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });
    window.addEventListener("keydown", handleKey);
    window.addEventListener("auxclick", handleAuxClick);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("auxclick", handleAuxClick);
    };
  }, [killArmDelayMs, stop, toggle]);

  return { isActive, start, stop, toggle };
}
