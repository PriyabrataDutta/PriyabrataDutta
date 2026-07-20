/**
 * HeroIntro — The terminal-style typewriter intro on the left of the hero.
 *
 * Renders three "shell prompt" lines (whoami, cat role.txt, cat bio.md)
 * each followed by a target string that gets typed out character-by-character
 * via GSAP. The actual typing animation is set up by the parent <Hero />
 * (which owns the timeline) — this component just exposes refs through props
 * so the parent can target the right <span>s.
 *
 * Why split it out?
 *   • Keeps Hero.tsx focused on orchestration (timelines + magnetic hover).
 *   • Makes the markup easier to scan when tweaking copy or layout.
 */

// `RefObject<T>` is the TypeScript type for a value returned by `useRef<T>(null)`.
// We import it so our props can describe "here's a ref I want you to attach
// to a DOM node for me." The parent creates the ref; we just wire it up.
import { RefObject } from "react";

/**
 * Why are refs passed in as props instead of being created here?
 *
 * The GSAP timeline that animates these <span>s lives in the parent <Hero />.
 * To keep things simple, the parent OWNS the refs (single source of truth)
 * and "forwards" them down so:
 *   • Hero creates → const line1Ref = useRef<HTMLSpanElement>(null)
 *   • HeroIntro receives → <span ref={line1Ref} />
 *   • Hero animates → typeText(line1Ref.current, ...)
 *
 * Alternative would be `React.forwardRef` — but that only forwards ONE ref.
 * We need three, so passing them via props is cleaner.
 */
interface HeroIntroProps {
  line1Ref: RefObject<HTMLSpanElement>; // name (typed first)
  line2Ref: RefObject<HTMLSpanElement>; // role (typed second)
  line3Ref: RefObject<HTMLSpanElement>; // bio  (typed third)
}

const HeroIntro = ({ line1Ref, line2Ref, line3Ref }: HeroIntroProps) => {
  return (
    <div className="font-mono text-sm space-y-2">
      {/* `$ whoami` — primes the typewriter for the name */}
      <div className="flex items-center gap-2 text-comment justify-center lg:justify-start">
        <span className="text-primary">$</span>
        <span>whoami</span>
      </div>
      {/* min-h reserves vertical space so the typewriter doesn't shift layout (CLS). */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight min-h-[1.1em]">
        <span ref={line1Ref} className="text-ember-gradient" />
        <span className="text-primary animate-blink">_</span>
      </h1>

      {/* `$ cat role.txt` — second typewriter line */}
      <div className="flex items-center gap-2 text-comment pt-4 justify-center lg:justify-start">
        <span className="text-primary">$</span>
        <span>cat role.txt</span>
      </div>
      <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-mono text-foreground min-h-[1.5em] whitespace-nowrap overflow-hidden text-ellipsis">
        <span className="text-comment">// </span>
        <span ref={line2Ref} />
      </p>

      {/* `$ cat bio.md` — third typewriter line */}
      <div className="flex items-center gap-2 text-comment pt-4 justify-center lg:justify-start">
        <span className="text-primary">$</span>
        <span>cat bio.md</span>
      </div>
      <p className="text-base md:text-lg text-muted-foreground max-w-xl font-sans mx-auto lg:mx-0 min-h-[3em]">
        <span ref={line3Ref} />
      </p>
    </div>
  );
};

export default HeroIntro;
