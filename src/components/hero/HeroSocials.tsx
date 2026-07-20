/**
 * HeroSocials — CTA buttons + social links shown below the typewriter intro.
 *
 * Two rows:
 *   1. Primary CTAs: contact() (smooth-scrolls to #contact) and download_cv()
 *   2. Social links: email, GitHub, LinkedIn
 *
 * Both rows carry the `.hero-fade` class — the parent <Hero /> uses GSAP to
 * fade them up *after* the typewriter finishes. The buttons also carry
 * `.magnetic` so the parent's magnetic-hover effect picks them up.
 */

import { Download, Github, Linkedin, Mail } from "lucide-react";

const HeroSocials = () => {
  /**
   * Smooth-scrolls to the Contact section.
   *
   * `document.getElementById("contact")` returns the DOM node (or `null` if
   * not yet mounted). The `?.` (optional chaining) makes the call safe — if
   * the element doesn't exist, the whole expression evaluates to `undefined`
   * instead of throwing. `behavior: "smooth"` asks the browser for a native
   * animated scroll instead of a hard jump.
   */
  const scrollToContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* CTA buttons — fade in after typing completes (.hero-fade) */}
      <div className="hero-fade flex flex-wrap gap-3 font-mono text-sm justify-center lg:justify-start">
        <button
          onClick={scrollToContact}
          className="magnetic px-5 py-2.5 bg-primary text-primary-foreground rounded hover:shadow-lg hover:shadow-primary/30 transition-shadow inline-flex items-center gap-2"
        >
          <span className="text-primary-foreground/60">[</span>
          <Mail className="w-4 h-4" />
          contact()
          <span className="text-primary-foreground/60">]</span>
        </button>
        <a
          href="/DuttaPriyabrata-9832465858-Latest-1.0.pdf"
          download="DuttaPriyabrata-9832465858-Latest-1.0.pdf"
          className="magnetic px-5 py-2.5 border border-primary/40 text-primary rounded hover:bg-primary/10 transition-colors inline-flex items-center gap-2"
        >
          <span className="opacity-60">[</span>
          <Download className="w-4 h-4" />
          download_cv()
          <span className="opacity-60">]</span>
        </a>
      </div>

      {/* Social links row */}
      <div className="hero-fade flex gap-5 font-mono text-sm pt-2 justify-center lg:justify-start flex-wrap">
        <a
          href="mailto:priyabrata.dutta369@gmail.com"
          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          <Mail className="w-4 h-4" /> email
        </a>
        <a
          href="https://github.com/PriyabrataDutta"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          <Github className="w-4 h-4" /> github
        </a>
        <a
          href="https://www.linkedin.com/in/priyabratadutta/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
        >
          <Linkedin className="w-4 h-4" /> linkedin
        </a>
      </div>
    </>
  );
};

export default HeroSocials;
