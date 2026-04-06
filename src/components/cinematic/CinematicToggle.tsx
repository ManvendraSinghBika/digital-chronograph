"use client";

type CinematicToggleProps = {
  isActive: boolean;
  onToggle: () => void;
};

export default function CinematicToggle({ isActive, onToggle }: CinematicToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={[
        "font-mono-accent rounded border border-accent/35 px-4 py-2",
        "text-[10px] tracking-[0.2em] text-accent",
        "transition-all duration-300 focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isActive
          ? "opacity-0 pointer-events-none translate-y-1"
          : "opacity-100 hover:border-accent hover:bg-accent/10",
      ].join(" ")}
      aria-label={isActive ? "Cinematic mode active" : "Watch the essay in cinematic mode"}
      aria-pressed={isActive}
      type="button"
    >
      ▶ WATCH THE ESSAY
    </button>
  );
}
