/**
 * Footer — Bottom strip of the page.
 *
 * Shows a small copyright credit (with the year auto-updated each year)
 * and a row of social icons. The blinking underscore is a nod to the
 * terminal-prompt aesthetic used throughout the site.
 */

import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  // Always reflects the current year — no manual updates needed.
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-sm">
          {/* Left: code-comment style credit line */}
          <p className="text-comment">
            // built with <span className="text-primary">React</span> + <span className="text-primary">GSAP</span> — © {currentYear} Priyabrata Dutta
          </p>

          {/* Right: social icon links + a blinking cursor for flair */}
          <div className="flex items-center gap-5">
            <a href="mailto:priyabrata.dutta.slg@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <a href="https://github.com/PriyabrataDutta" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/priyabratadutta/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <span className="text-primary animate-blink">_</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
