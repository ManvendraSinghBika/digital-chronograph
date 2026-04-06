"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
 *  CONFIGURATION
 * ───────────────────────────────────────────── */
const FRAME_COUNT = 360; // Total frames in the sequence (120 per era × 3)
const SCRUB_DURATION = 2.5; // Higher = more inertia, smoother interpolation
const BLEND_THRESHOLD = 0.01; // Skip blending when fractional part is negligible

// Era breakpoints mapped to frame indices
export const ERA_FRAMES = {
  skeuomorphism: { start: 0, end: 119, label: "996 · 2000s" },
  minimalism: { start: 120, end: 239, label: "991 · 2010s" },
  modern: { start: 240, end: 359, label: "992 · Modern" },
} as const;

const ERA_NARRATION: Record<keyof typeof ERA_FRAMES, { era: string; line: string }> = {
  skeuomorphism: {
    era: "ERA 01 · SKEUOMORPHISM",
    line: "The 996 taught us that function could wear texture.",
  },
  minimalism: {
    era: "ERA 02 · MINIMALISM",
    line: "The 991 proved that restraint is its own kind of power.",
  },
  modern: {
    era: "ERA 03 · DIGITAL BRUTALISM",
    line: "The Taycan fused raw industrial form with digital transparency.",
  },
};

/**
 * Generates frame URLs for the image sequence.
 * 360 WebP frames: frame_0000.webp → frame_0359.webp
 */
function getFrameUrl(index: number): string {
  return `/frames/frame_${String(index).padStart(4, "0")}.webp`;
}

/* ─────────────────────────────────────────────
 *  COMPONENT
 * ───────────────────────────────────────────── */
interface ChronographCanvasProps {
  className?: string;
}

export default function ChronographCanvas({
  className,
}: ChronographCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const playheadRef = useRef({ frame: 0 });
  const currentEraRef = useRef<keyof typeof ERA_FRAMES>("skeuomorphism");
  const [currentEra, setCurrentEra] = useState<keyof typeof ERA_FRAMES>("skeuomorphism");
  const [progressPercent, setProgressPercent] = useState(0);
  const [isInView, setIsInView] = useState(false);

  /* ── Determine era from frame index ── */
  const getEraFromFrame = useCallback(
    (frame: number): keyof typeof ERA_FRAMES => {
      if (frame <= ERA_FRAMES.skeuomorphism.end) return "skeuomorphism";
      if (frame <= ERA_FRAMES.minimalism.end) return "minimalism";
      return "modern";
    },
    []
  );

  /* ── Draw a single image onto the canvas (cover-fit) ── */
  const drawImage = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) => {
      const hRatio = w / img.width;
      const vRatio = h / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const cx = (w - img.width * ratio) / 2;
      const cy = (h - img.height * ratio) / 2;
      ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
    },
    []
  );

  /* ── Render with frame blending for buttery-smooth interpolation ── */
  const renderBlended = useCallback(
    (exactFrame: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const floorFrame = Math.floor(exactFrame);
      const ceilFrame = Math.min(floorFrame + 1, FRAME_COUNT - 1);
      const blend = exactFrame - floorFrame; // 0.0 → 1.0 fractional part

      const imgA = imagesRef.current[floorFrame];
      if (!imgA || !imgA.complete) return;

      // Draw base frame (cover-fit fills entire canvas, no need to clearRect)
      ctx.globalAlpha = 1;
      drawImage(ctx, imgA, w, h);

      // Crossfade to next frame if blend is significant
      if (blend > BLEND_THRESHOLD && ceilFrame !== floorFrame) {
        const imgB = imagesRef.current[ceilFrame];
        if (imgB && imgB.complete) {
          ctx.globalAlpha = blend;
          drawImage(ctx, imgB, w, h);
          ctx.globalAlpha = 1;
        }
      }
    },
    [drawImage]
  );

  /* ── Legacy single-frame render (used by resize) ── */
  const renderFrame = useCallback(
    (frameIndex: number) => {
      renderBlended(frameIndex);
    },
    [renderBlended]
  );

  /* ── Canvas resize handler ── */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    renderFrame(Math.round(playheadRef.current.frame));
    ScrollTrigger.refresh();
  }, [renderFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // ── Size the canvas ──
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // ── Progressive image loading ──
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;

    // Priority 1: Load first frame immediately
    const firstImg = new window.Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      images[0] = firstImg;
      renderFrame(0);
      // Priority 2: Load remaining in batches of 40 for faster availability
      loadBatch(1, 40);
    };

    function loadBatch(start: number, batchSize: number) {
      const end = Math.min(start + batchSize, FRAME_COUNT);
      let loaded = 0;
      for (let i = start; i < end; i++) {
        const img = new window.Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          images[i] = img;
          loaded++;
          if (loaded === end - start && end < FRAME_COUNT) {
            if (typeof requestIdleCallback !== "undefined") {
              requestIdleCallback(() => loadBatch(end, batchSize));
            } else {
              setTimeout(() => loadBatch(end, batchSize), 0);
            }
          }
        };
      }
    }

    // ── GSAP ScrollTrigger — playhead interpolation ──
    // No snap: "frame" — we keep the fractional value for smooth blending
    const tween = gsap.to(playheadRef.current, {
      frame: FRAME_COUNT - 1,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: SCRUB_DURATION,
        pin: canvas,
        anticipatePin: 1,
        fastScrollEnd: true,
        preventOverlaps: true,
        onEnter: () => setIsInView(true),
        onLeave: () => setIsInView(false),
        onEnterBack: () => setIsInView(true),
        onLeaveBack: () => setIsInView(false),
        onUpdate: () => {
          const exactFrame = playheadRef.current.frame;
          renderBlended(exactFrame);
          setProgressPercent((exactFrame / (FRAME_COUNT - 1)) * 100);
          const newEra = getEraFromFrame(Math.round(exactFrame));
          if (newEra !== currentEraRef.current) {
            currentEraRef.current = newEra;
            setCurrentEra(newEra);
          }
        },
      },
    });

    // ── Resize listener ──
    window.addEventListener("resize", handleResize);

    return () => {
      tween.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, renderFrame, renderBlended, getEraFromFrame]);

  return (
    <div
      ref={containerRef}
      className={`canvas-scrub-container ${className ?? ""}`}
      style={{ height: `${FRAME_COUNT * 2}vh` }} // Scroll runway — 2vh per frame for smooth pacing
    >
      <canvas
        ref={canvasRef}
        className="w-full bg-background"
        aria-label="Interactive Porsche evolution timeline — scroll to explore"
        role="img"
      />

      {/* ── Narrative Text Overlay ── */}
      <div
        className="fixed inset-0 z-[201] pointer-events-none flex items-end justify-start px-6 md:px-16 lg:px-24 pb-16 md:pb-12 transition-opacity duration-500"
        style={{ opacity: isInView ? 1 : 0 }}
      >
        <div className="max-w-xl">
          <div className="font-mono-accent text-accent tracking-[0.2em] text-[10px] mb-2 transition-all duration-700">
            {ERA_NARRATION[currentEra].era}
          </div>
          <div
            key={currentEra}
            className="text-foreground/80 text-lg md:text-2xl font-light leading-relaxed"
            style={{ animation: "fadeUp 0.6s ease-out" }}
          >
            {ERA_NARRATION[currentEra].line}
          </div>
        </div>
      </div>

      {/* ── Era Indicator Dots (top-right) ── */}
      <div
        className="fixed top-6 right-8 z-[200] pointer-events-none hidden md:flex items-center gap-3 transition-opacity duration-500"
        style={{ opacity: isInView ? 1 : 0 }}
      >
        {Object.entries(ERA_FRAMES).map(([key, era]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full transition-colors duration-500"
              style={{
                backgroundColor:
                  key === currentEra
                    ? "var(--accent)"
                    : "var(--border)",
              }}
            />
            <span className="font-mono-accent text-muted text-[10px]">
              {era.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Scroll Progress Bar ── */}
      <div
        className="fixed top-0 left-0 w-full h-[2px] z-[200] bg-border transition-opacity duration-500"
        style={{ opacity: isInView ? 1 : 0 }}
      >
        <div
          className="h-full bg-accent transition-none"
          style={{
            width: `${progressPercent}%`,
          }}
        />
      </div>
    </div>
  );
}
