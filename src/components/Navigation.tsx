/**
 * Navigation — Sticky top header with nav links + mobile menu.
 *
 * Responsibilities:
 *   1. Render the brand mark + nav links on desktop, hamburger on mobile/tablet.
 *   2. Add a frosted-glass background once the user scrolls down (UX polish).
 *   3. Highlight the nav item for the section currently on screen
 *      (uses GSAP ScrollTrigger to detect which <section> is in view).
 *   4. Smooth-scroll to the right section when a link is clicked.
 *   5. Provide a "resume.pdf" download button.
 *
 * React refresher (read once, then the rest makes sense):
 *   - useState  → reactive value. Changing it re-renders the component.
 *                 We use it for things the UI must redraw when they change
 *                 (scrolled style, drawer open/closed, active link).
 *   - useRef    → mutable box that survives renders WITHOUT triggering one.
 *                 Used here to grab the <header> DOM node.
 *   - useEffect → run code AFTER render. Perfect for subscribing to
 *                 browser events (scroll, resize) that React itself
 *                 doesn't know about. Always return a cleanup function
 *                 to undo the subscription on unmount — otherwise you
 *                 leak listeners every time the component remounts.
 *   - useGSAP   → React wrapper around GSAP. Same idea as useEffect,
 *                 but it auto-cleans every tween / ScrollTrigger created
 *                 inside, which is exactly what we need here.
 */

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import ThemeSwitcher from "@/components/ThemeSwitcher";

// Single source of truth for nav items — used for both desktop & mobile menus.
// Keeping them in one array means adding a new section is a one-line change
// (versus editing two parallel JSX lists that can drift out of sync).
const navItems = [
  { num: "01", label: "about", href: "#about" },
  { num: "02", label: "skills", href: "#skills" },
  { num: "03", label: "projects", href: "#projects" },
  { num: "04", label: "experience", href: "#experience" },
  { num: "05", label: "education", href: "#education" },
  { num: "06", label: "blog", href: "#blog" },
  { num: "07", label: "contact", href: "#contact" },
];

const Navigation = () => {
  // === State ===
  // True once the user has scrolled past 50px — toggles the blurred bg style.
  // Keeping this in state (not a ref) is intentional: the header's className
  // depends on it, so React must re-render when it flips.
  const [isScrolled, setIsScrolled] = useState(false);

  // Mobile drawer open/closed state. Same reasoning — controls className,
  // so it has to live in state to drive re-renders.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // The currently-active section href (e.g. "#about") used for highlighting.
  // Set by the ScrollTrigger callbacks below.
  const [active, setActive] = useState<string>("");

  // Ref to the <header> element. Not strictly needed for the current logic
  // (we don't read it anywhere), but kept as a stable handle in case future
  // animations want to scope tweens to the header subtree.
  const headerRef = useRef<HTMLElement>(null);

  // === Scroll listener: toggle the "scrolled" header style ===
  // We can't use CSS alone here because we want a JS threshold (50px) and
  // a class change, not a continuous transform. So we subscribe to the
  // window's `scroll` event in useEffect.
  //
  // Why useEffect (not useGSAP)?
  //   This isn't a GSAP animation — it's a plain DOM subscription. useEffect
  //   is the right primitive: run after mount, clean up on unmount.
  //
  // The empty dep array `[]` means "run this exactly once when the component
  // first mounts, never re-run on subsequent renders".
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    // Cleanup: React calls this when the component unmounts. Forgetting to
    // remove the listener leaks memory and can cause "setState on unmounted
    // component" warnings in development.
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // === ScrollTriggers: highlight the active nav link as you scroll ===
  //
  // The pattern: for each section, create a ScrollTrigger that "owns" a
  // vertical band of the page (top 40% → bottom 40% of viewport). Whenever
  // a section enters that band, we set `active` to that section's href,
  // which makes its nav button render with the primary color + underline.
  //
  // `start: "top 40%"` means: this trigger becomes ACTIVE when the section's
  //   TOP edge crosses 40% down from the top of the viewport.
  // `end:   "bottom 40%"` means: it becomes INACTIVE when the section's
  //   BOTTOM edge crosses the same 40% line.
  // Together: the trigger is active while the section straddles the
  //   ~middle/upper-third of the screen — a sweet spot for "what am I
  //   looking at right now?".
  //
  // `onToggle` fires whenever the trigger flips between active/inactive.
  // We only update `active` when the trigger BECOMES active (`self.isActive`),
  // not when it leaves — otherwise we'd briefly clear the highlight while
  // transitioning between sections.
  //
  // Why useGSAP (not useEffect)?
  //   ScrollTrigger instances need to be `.kill()`ed on cleanup or they
  //   keep firing after the component unmounts. useGSAP does that for us
  //   automatically, which is much safer than tracking them by hand.
  useGSAP(() => {
    navItems.forEach((item) => {
      const el = document.querySelector(item.href);
      if (!el) return; // section not on the page (e.g. on a 404 route) — skip
      ScrollTrigger.create({
        trigger: el,
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => self.isActive && setActive(item.href),
      });
    });
  }, []);

  // === Smooth-scroll helper used by both desktop & mobile nav buttons ===
  // `scrollIntoView({ behavior: "smooth" })` is a native browser API — no
  // library needed. The optional chaining (`?.`) protects us if the section
  // isn't found in the DOM (defensive — shouldn't happen in practice).
  // Closing the mobile menu after navigating prevents the drawer from
  // hovering over the destination section.
  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        // Add blurred translucent bg + smaller padding once scrolled.
        // The `transition-all duration-300` above animates the change smoothly.
        isScrolled ? "bg-background/85 backdrop-blur-lg border-b border-border py-3" : "py-5"
      }`}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between">
        {/* Brand / logo — clicking it scrolls back to the top of the page.
            We call e.preventDefault() because the href="#" would otherwise
            jump instantly (no smooth animation) and add "#" to the URL. */}
        <a
          href="#"
          className="font-mono text-sm flex items-center gap-2 group"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        >
          <span className="text-primary">~/</span>
          <span className="text-foreground group-hover:text-primary transition-colors">priyabrata</span>
          <span className="text-primary animate-blink">_</span>
        </a>

        {/* === Desktop nav (≥ lg breakpoint = 1024px) ===
            On tablets (md = 768–1023px) the 7 items + resume button overflow,
            so we use the hamburger menu there too. Hence `hidden lg:flex`. */}
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => scrollToSection(item.href)}
                className={`px-3 py-2 font-mono text-sm rounded transition-colors relative ${
                  // Compare against `active` (set by ScrollTrigger above) to
                  // light up the link for the section currently on screen.
                  active === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-primary/70">{item.num}.</span> {item.label}
                {/* Underline rendered conditionally beneath the active item.
                    `absolute` positions it relative to the button (which is
                    `relative` above). Mounted/unmounted via JSX truthiness
                    instead of a className toggle so it doesn't take up space
                    when inactive. */}
                {active === item.href && (
                  <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-primary" />
                )}
              </button>
            </li>
          ))}
          {/* Resume download */}
          <li className="ml-2 flex items-center gap-2">
            <a
              href="/DuttaPriyabrata-9832465858-Latest-1.0.pdf"
              download="DuttaPriyabrata-9832465858-Latest-1.0.pdf"
              className="px-4 py-2 font-mono text-sm border border-primary text-primary rounded hover:bg-primary/10 transition-colors"
            >
              resume.pdf
            </a>
            <ThemeSwitcher />
          </li>
        </ul>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </nav>

      {/* === Mobile + tablet dropdown drawer (hidden ≥ lg) ===
          The drawer is ALWAYS in the DOM — we just toggle its visibility via
          opacity + translate + pointer-events. Why not unmount it conditionally?
          Two reasons:
            1. The CSS transition (`transition-all duration-300`) needs both
               states present to animate between them. If we unmounted the
               drawer, it would pop in/out instantly with no slide effect.
            2. `pointer-events-none` ensures the hidden drawer doesn't block
               clicks on content beneath it, even though it's still in the DOM. */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[60px] bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <ul className="container mx-auto px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left font-mono text-base text-muted-foreground hover:text-primary transition-colors py-2"
              >
                <span className="text-primary/70">{item.num}.</span> {item.label}
              </button>
            </li>
          ))}
          {/* Resume download — mirrors the desktop nav button. We close the
              drawer on click so it doesn't linger after the file dialog opens. */}
          <li className="pt-2">
            <a
              href="/DuttaPriyabrata-9832465858-Latest-1.0.pdf"
              download="DuttaPriyabrata-9832465858-Latest-1.0.pdf"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-block px-4 py-2 font-mono text-sm border border-primary text-primary rounded hover:bg-primary/10 transition-colors"
            >
              resume.pdf
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navigation;
