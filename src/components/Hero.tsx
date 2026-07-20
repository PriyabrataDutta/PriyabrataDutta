/**
 * Hero — The first ("above-the-fold") section of the page.
 *
 * This file is now a thin **orchestrator**: it owns the GSAP timeline and the
 * magnetic-hover behaviour, but delegates the actual markup to three focused
 * sub-components in `src/components/hero/`:
 *
 *   • HeroIntro          — terminal-style typewriter (name, role, bio)
 *   • HeroSocials        — CTA buttons + social links (.hero-fade + .magnetic)
 *   • HeroProfileWindow  — profile photo inside a fake code-editor window
 *
 * Animations (all powered by GSAP via useGSAP):
 *   1. Typewriter effect for the three intro lines (refs are forwarded to HeroIntro).
 *   2. Staggered fade-up of `.hero-fade` items AFTER typing finishes.
 *   3. Pop-in of the `.hero-window` profile frame on mount.
 *   4. "Magnetic" hover — `.magnetic` buttons gently follow the cursor.
 */

// useRef → mutable handle to a DOM element. Updating .current does NOT cause
// a re-render, which is exactly what we want when handing nodes off to GSAP.
import { useRef, useState } from "react";
// useGSAP → React-friendly wrapper around gsap.context(). It auto-cleans every
// tween/timeline/ScrollTrigger created inside on unmount, AND scopes selector
// strings to the element you pass via `scope` (no global ".magnetic" matches).
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Terminal, Sparkles } from "lucide-react";
import HeroIntro from "@/components/hero/HeroIntro";
import HeroSocials from "@/components/hero/HeroSocials";
import HeroProfileWindow from "@/components/hero/HeroProfileWindow";
import HeroTerminalConsole from "@/components/hero/HeroTerminalConsole";

const Hero = () => {
  const [isInteractiveTerminal, setIsInteractiveTerminal] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null); // name
  const line2Ref = useRef<HTMLSpanElement>(null); // role
  const line3Ref = useRef<HTMLSpanElement>(null); // bio

  useGSAP(
    () => {
      if (isInteractiveTerminal) return;

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      const typeText = (el: HTMLElement | null, text: string, duration: number) => {
        if (!el) return;
        el.textContent = "";
        tl.to(el, {
          duration,
          text: { value: text },
          onUpdate: function () {
            const progress = this.progress();
            const len = Math.floor(text.length * progress);
            el.textContent = text.slice(0, len);
          },
        });
      };

      typeText(line1Ref.current, "Priyabrata Dutta", 1.2);
      tl.to({}, { duration: 0.3 });
      typeText(line2Ref.current, "Technical Lead | Full Stack Developer | Building AI-Powered Products", 1.6);
      tl.to({}, { duration: 0.3 });
      typeText(line3Ref.current, "10+ Years IT Experience · 5+ Years Building Scalable Web Apps — shipping production applications with React, Next.js, Node & AWS, building GenAI & agentic workflows.", 2.0);

      gsap.from(".hero-fade", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        delay: 4,
        ease: "power2.out",
      });

      gsap.from(".hero-window", {
        opacity: 0,
        scale: 0.92,
        y: 40,
        duration: 1,
        ease: "power3.out",
      });

      const buttons = gsap.utils.toArray<HTMLElement>(".magnetic");
      buttons.forEach((btn) => {
        const onMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: "power3.out" });
        };
        const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
      });
    },
    { scope: containerRef, dependencies: [isInteractiveTerminal] },
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="pt-24 pb-6 md:pt-28 md:pb-8 lg:pt-32 lg:pb-10 relative overflow-hidden"
    >
      {/* Decorative grid background, sits behind the content */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          {/* === LEFT: intro/terminal + CTAs === */}
          <div className="lg:col-span-3 space-y-6 text-center lg:text-left">
            {/* View Mode Toggle / Rollback Control */}
            <div className="flex items-center justify-center lg:justify-start">
              <button
                onClick={() => setIsInteractiveTerminal(!isInteractiveTerminal)}
                className="font-mono text-xs px-3 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-all inline-flex items-center gap-2 shadow-sm"
              >
                {isInteractiveTerminal ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>[ Switch to Standard Intro View ]</span>
                  </>
                ) : (
                  <>
                    <Terminal className="w-3.5 h-3.5" />
                    <span>[ Launch Interactive CLI Terminal ]</span>
                  </>
                )}
              </button>
            </div>

            {isInteractiveTerminal ? (
              <HeroTerminalConsole onToggleStandardView={() => setIsInteractiveTerminal(false)} />
            ) : (
              <HeroIntro line1Ref={line1Ref} line2Ref={line2Ref} line3Ref={line3Ref} />
            )}

            <HeroSocials />
          </div>

          {/* === RIGHT: profile photo inside a CodeWindow === */}
          <div className="lg:col-span-2">
            <HeroProfileWindow />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
