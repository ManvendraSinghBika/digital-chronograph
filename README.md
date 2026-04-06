# The Digital Chronograph

**A design essay on how we learned to see.**

Three decades. Three Porsches. Three design revolutions. This website maps the parallel evolution of automotive design and digital interface design — from the texture-heavy skeuomorphism of the 2000s, through the stripped-down minimalism of the 2010s, to the brutalist transparency of the modern era.

The way Stuttgart sculpted metal is the same way we learned to sculpt pixels.

---

## The Thesis

Every era of digital design mirrors an era of Porsche engineering:

| Era | Years | Porsche | Design Movement |
|-----|-------|---------|-----------------|
| **01** | 2000–2010 | 996 Carrera | Skeuomorphism — glossy textures, brushed metal, material mimicry |
| **02** | 2010–2020 | 991 Carrera | Minimalism — flat design, typography-first, content as interface |
| **03** | 2020–Present | Taycan / 992 | Digital Brutalism — glassmorphism, bento grids, industrial transparency |

## Features

- **Scroll-driven canvas animation** — 360-frame image sequence scrubbed by scroll position with frame blending
- **Era-narrated timeline** — contextual text overlay that guides visitors through each design period
- **Interactive Chronograph** — a precision stopwatch instrument built as the "final artifact" of the essay
- **Cinematic loading** — counter-based preloader that sets narrative mood
- **3D tilt cards** — perspective-aware card components for the Skeuomorphism era
- **Sticky scroll panels** — parallax content blocks for the Minimalism era
- **Bento grid layout** — modular dashboard grid for the Modern era
- **Text generation effect** — character-by-character reveal for key quotes

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | GSAP (ScrollTrigger) + Framer Motion |
| Fonts | Inter + Space Mono (via `next/font`) |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Design tokens, theme, keyframes
│   ├── layout.tsx           # Root layout with font loading
│   └── page.tsx             # Main page orchestration
├── components/
│   ├── chronograph/
│   │   ├── ChronographCanvas.tsx   # Scroll-driven 360-frame canvas
│   │   └── ChronographWidget.tsx   # Interactive precision stopwatch
│   ├── eras/
│   │   ├── EraSkeuomorphism.tsx    # 2000s era — 3D cards, rich textures
│   │   ├── EraMinimalism.tsx       # 2010s era — sticky scroll, flat design
│   │   └── EraModern.tsx           # 2020s era — bento grid, glassmorphism
│   ├── hero/Hero.tsx               # Landing section with thesis statement
│   ├── loading/LoadingScreen.tsx   # Counter-based preloader
│   ├── navigation/Navigation.tsx   # Side nav + mobile bottom bar
│   ├── transitions/ShutterTransition.tsx
│   └── ui/                        # Reusable UI primitives
│       ├── 3d-card.tsx
│       ├── aceternity-bento.tsx
│       ├── aurora-background.tsx
│       ├── glow-card.tsx
│       ├── sticky-scroll-reveal.tsx
│       └── text-generate.tsx
├── lib/utils.ts
public/
├── frames/                # 360 WebP frames (frame_0000.webp → frame_0359.webp)
└── images/                # Static photography assets
```

## Frame Assets

The scroll animation uses 360 WebP frames in `public/frames/`. Each era spans 120 frames:

- **0000–0119** — Porsche 996 (Skeuomorphism)
- **0120–0239** — Porsche 991 (Minimalism)
- **0240–0359** — Porsche 992/Taycan (Modern)

Recommended resolution: 1920×1080, WebP quality 80–85.

## Design System

**Telemetry Noir** — a dark, precision-engineered aesthetic:

- **Background:** `#0A0A0A` (near-black)
- **Accent:** `#FF5500` (engineering orange)
- **Typography:** Inter (body) + Space Mono (labels/data)
- **Rule:** Zero border-radius on structural elements

---

*A design essay by MSB.*
