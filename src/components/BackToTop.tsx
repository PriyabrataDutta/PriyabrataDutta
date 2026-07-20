/**
 * BackToTop — floating button that appears after the user scrolls past
 * the hero (~1 viewport height). Stacks above the WhatsApp button.
 *
 * Includes a circular SVG progress ring around the button showing how
 * far down the page the user has scrolled (0% at top → 100% at bottom).
 */

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const SIZE = 48;          // button diameter in px (matches w-12 h-12)
const STROKE = 2;         // ring thickness
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(1, Math.max(0, ratio)));
      setVisible(scrollTop > window.innerHeight * 0.9);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label={`Back to top — ${Math.round(progress * 100)}% scrolled`}
      className={`fixed bottom-24 right-6 z-50 group flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border text-foreground shadow-lg hover:border-primary hover:text-primary transition-all ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Progress ring (SVG overlay) */}
      <svg
        className="absolute inset-0 -rotate-90 pointer-events-none"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={STROKE}
        />
        {/* Progress */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>

      <ArrowUp className="w-5 h-5 relative" />

      <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs px-3 py-1.5 rounded-md bg-card border border-border text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        // {Math.round(progress * 100)}% — back to top
      </span>
    </button>
  );
};

export default BackToTop;
