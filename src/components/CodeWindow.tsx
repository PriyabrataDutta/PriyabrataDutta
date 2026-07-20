/**
 * CodeWindow — A reusable "code editor" frame used throughout the site.
 *
 * Visually mimics a macOS editor window (traffic-light buttons, title bar,
 * filename tab, optional line-number gutter). Whatever JSX you pass as
 * `children` is rendered inside the editor body — usually styled to look
 * like code (using the text-keyword, text-string, text-property colour
 * tokens defined in index.css).
 *
 * This is a "compound" or "container" pattern: the parent owns the chrome
 * (window frame, title bar, gutter), the child owns the content. That
 * separation means we can drop a CodeWindow around ANYTHING — fake code,
 * the hero photo, a log feed, a chat list — and get the same look-and-feel
 * for free.
 *
 * Props:
 *   filename        — text shown on the file tab (e.g. "aboutMe.ts")
 *   language        — small uppercase label next to the filename (TS, JSX...)
 *   children        — the "code" content to render inside the window body
 *   className       — extra Tailwind classes for the outer container
 *                     (used to constrain width, add margin, etc. from outside)
 *   showLineNumbers — if true, renders a left-side gutter with line numbers
 *   lineCount       — how many line numbers to render (when showLineNumbers)
 */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// TypeScript interface = a contract describing what props this component
// accepts. The `?` after a name means "optional" — callers don't have to
// pass it. Defaults for optional props are set in the destructuring below.
interface CodeWindowProps {
  filename: string;
  language?: string;
  children: ReactNode; // ReactNode = "anything renderable" (string, JSX, array, …)
  className?: string;
  showLineNumbers?: boolean;
  lineCount?: number;
}

const CodeWindow = ({
  filename,
  language = "tsx",      // default if caller omits it
  children,
  className,
  showLineNumbers = false,
  lineCount = 0,
}: CodeWindowProps) => {
  return (
    // `cn(...)` merges Tailwind classes intelligently — later classes override
    // earlier ones (e.g. a caller passing `max-w-md` will override our default
    // sizing without producing duplicate-class garbage in the DOM).
    <div className={cn("rounded-lg overflow-hidden bg-editor-bg border border-border editor-shadow", className)}>
      {/* === Title bar (top of window) === */}
      <div className="flex items-center bg-editor-titlebar border-b border-border px-3 py-2">
        {/* macOS traffic-light buttons (red/yellow/green) — purely decorative.
            The hex colors are hard-coded ONLY here because they're a literal
            recreation of the macOS palette, not part of our design system. */}
        <div className="flex gap-1.5 mr-4">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        {/* Filename tab pill — the `-mb-2` pulls it down so it visually
            "sits on top of" the editor body, like a real editor file tab. */}
        <div className="flex items-center">
          <div className="px-3 py-1 bg-editor-bg rounded-t-md border-t border-l border-r border-border -mb-2 flex items-center gap-2">
            <span className="text-xs font-mono text-foreground/80">{filename}</span>
            <span className="text-[10px] font-mono text-comment uppercase">{language}</span>
          </div>
        </div>
      </div>

      {/* === Body: optional line-number gutter + content area === */}
      <div className="flex font-mono text-sm flex-1">
        {/* Conditional rendering: `&&` short-circuits — if the left side is
            falsy, React renders nothing. So the gutter only appears when
            both `showLineNumbers` is true AND we have lines to number. */}
        {showLineNumbers && lineCount > 0 && (
          <div className="select-none py-4 px-3 text-right text-editor-gutter border-r border-border bg-editor-bg">
            {/* `Array.from({ length: N })` builds an array of N empty slots —
                a one-line trick to render a numbered list of any length.
                The `_` first arg means "ignore the value, only use the index". */}
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>
        )}
        {/* The actual editor body. `overflow-x-auto` lets long code lines
            scroll horizontally instead of wrapping or breaking the layout. */}
        <div className="flex-1 py-4 px-4 overflow-x-auto">{children}</div>
      </div>
    </div>
  );
};

export default CodeWindow;
