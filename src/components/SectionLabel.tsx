/**
 * SectionLabel — Reusable heading block used at the top of every section.
 *
 * Renders the consistent "01. // about" style header you see above each
 * section (About, Skills, Projects, etc). Keeping this in one component
 * means the visual style stays identical everywhere AND a single tweak
 * here propagates to every section header — no copy-pasted markup to keep
 * in sync.
 *
 * This is a "presentational component": it takes props in, renders JSX
 * out, holds no state, runs no effects. Easiest kind of component to
 * read, test, and reuse.
 *
 * Props:
 *   number      — the section number shown in primary colour ("01", "02"...)
 *   title       — the big heading text ("About", "Skills"...)
 *   description — optional subtitle, shown as a code-style comment
 */

interface SectionLabelProps {
  number: string;        // string (not number) so leading zeros are preserved
  title: string;
  description?: string;  // `?` = optional; we render the <p> only if provided
}

const SectionLabel = ({ number, title, description }: SectionLabelProps) => {
  return (
    // `mb-12 md:mb-16` = 3rem bottom margin on mobile, 4rem on tablet+.
    // The `md:` prefix is a Tailwind responsive modifier — see tailwind.config.ts
    // for the breakpoint values.
    <div className="mb-12 md:mb-16">
      {/* Top row: section number + lowercase title comment + decorative line.
          `flex items-center gap-3` lays them out horizontally with consistent spacing.
          The `flex-1` on the line below pushes it to fill remaining space — that's
          why the line auto-resizes to whatever's left after the number + comment. */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-sm text-primary">{number}.</span>
        {/* `.toLowerCase()` is called on every render — that's fine for a string
            this short. We do it here (not in the parent) so callers can pass
            "About" naturally without thinking about casing. */}
        <span className="font-mono text-sm text-comment">// {title.toLowerCase()}</span>
        <div className="h-px flex-1 bg-border max-w-xs" />
      </div>

      {/* Big heading with a primary-coloured period accent. The `.` is a separate
          <span> so we can color it differently — small detail, but it gives the
          heading a punchy "command-line" feel that matches the site's vibe. */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
        <span className="text-foreground">{title}</span>
        <span className="text-primary">.</span>
      </h2>

      {/* Optional one-line description shown beneath the heading.
          Conditional rendering: `description && (...)` renders the <p> ONLY when
          a description was passed. If omitted, React renders nothing — no empty
          <p> tag, no extra spacing. */}
      {description && (
        <p className="mt-3 text-muted-foreground font-mono text-sm max-w-2xl">{description}</p>
      )}
    </div>
  );
};

export default SectionLabel;
