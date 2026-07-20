/**
 * BlogCard — A single blog post rendered as a "code editor window" card.
 *
 * Each card shows: filename-style title bar, meta (date/reading time), the
 * post title + subtitle, tag chips, an excerpt, and a `[ read_more() ]`
 * button. When expanded, it lazy-loads the full post body (which may pull
 * in Shiki for syntax highlighting — that's why we use <Suspense>).
 *
 * Owns its own expanded/collapsed state — each card opens independently.
 */

// Suspense lets us declaratively show a fallback while a lazy()-loaded
// component is still being fetched from the network. See the body section
// below for the actual <Suspense> + <post.Body /> combo.
import { Suspense, useCallback, useRef, useState } from "react";
import { Calendar, Clock, Flame, ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post } from "@/data/blog-posts";
// highlightMatch wraps occurrences of `query` inside a string with a <mark>
// element, returning a JSX fragment. Used to visually emphasize search hits.
import { highlightMatch } from "./highlightMatch";
// Pre-warms the Shiki highlighter (langs, theme, engine) so the very first
// "read_more" click doesn't have to wait for a cold-start network + parse.
import { getHighlighter } from "../ShikiCode";

/**
 * Props for <BlogCard />.
 */
interface BlogCardProps {
  /** The post to render (metadata + lazy Body component). */
  post: Post;
  /** When true, this card spans both columns of the grid (the hero post). */
  featured?: boolean;
  /** Active search query — passed to highlightMatch() to bold matching keywords. */
  query?: string;
}

export const BlogCard = ({ post, featured, query = "" }: BlogCardProps) => {
  // Local state — each card opens/closes independently. Lifting this into the
  // parent would force EVERY card to re-render when any one is expanded.
  const [expanded, setExpanded] = useState(false);

  // Warm both expensive deps (the lazy body chunk + the Shiki highlighter)
  // the moment the user *signals intent* — hover on desktop, focus on
  // keyboard, touchstart on mobile. By the time they actually click
  // [ read_more() ], the chunks are usually already cached, so expansion
  // feels instant instead of waiting on a cold network + parse round-trip.
  const warmedRef = useRef(false);
  const warm = useCallback(() => {
    if (warmedRef.current) return;
    warmedRef.current = true;
    // Kick off the body-chunk download + Shiki init in parallel. We swallow
    // errors because preloading is best-effort — if it fails, the real
    // <Suspense>/effect on click will surface the error normally.
    void post.preload().catch(() => {});
    void getHighlighter().catch(() => {});
  }, [post]);

  return (
    <article
      onMouseEnter={warm}
      onFocus={warm}
      onTouchStart={warm}
      className={cn(
        "blog-card group rounded-lg overflow-hidden bg-editor-bg border border-border editor-shadow",
        "transition-all duration-300 hover:border-primary/50 hover:-translate-y-1",
        featured && "lg:col-span-2",
      )}
    >
      {/* Title bar (mac-style) */}
      <div className="flex items-center bg-editor-titlebar border-b border-border px-3 py-2">
        <div className="flex gap-1.5 mr-4">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-editor-bg rounded-t-md border-t border-l border-r border-border -mb-2 flex items-center gap-2">
            <span className="text-xs font-mono text-foreground/80">{post.filename}</span>
            <span className="text-[10px] font-mono text-comment uppercase">{post.language}</span>
          </div>
        </div>
        {post.trending && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-mono uppercase text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded">
            <Flame className="w-3 h-3" /> trending
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 md:p-6 flex flex-col gap-4">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-comment font-mono">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {post.readingTime}
          </span>
        </div>

        {/* Title */}
        <header>
          <div className="font-mono text-primary text-xs mb-1">
            {post.language === "md" ? "#" : "//"} post
          </div>
          <h3
            className={cn(
              "font-bold tracking-tight text-foreground leading-tight",
              featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
            )}
          >
            {highlightMatch(post.title, query)}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground italic">
            {highlightMatch(post.subtitle, query)}
          </p>
        </header>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] px-2 py-0.5 rounded border border-border text-primary/90 bg-primary/5"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Excerpt (always visible) */}
        <p className="text-foreground/85 leading-relaxed text-[14.5px]">
          {highlightMatch(post.excerpt, query)}
        </p>

        {/* ─── Expanded body — lazy-loaded chunk ───────────────────────────
            `post.Body` is a `React.lazy(() => import("..."))` component.
            On first render here, React triggers the dynamic import; while the
            chunk is downloading, Suspense shows the fallback below. Once it
            arrives, React swaps the fallback for the real JSX (which may
            contain <ShikiCode> for syntax-highlighted code blocks).

            Each card has its OWN <Suspense> boundary so a slow network only
            delays THIS card — not the whole grid. Without a boundary, React
            would walk further up the tree and could blank out the page. */}
        {expanded && (
          <div className="space-y-4 text-foreground/90 leading-relaxed text-[14.5px] border-t border-border pt-4">
            <Suspense
              fallback={
                <p className="font-mono text-xs text-comment">// loading_post()…</p>
              }
            >
              <post.Body />
            </Suspense>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="self-start inline-flex items-center gap-2 px-4 py-2 font-mono text-sm border border-primary text-primary rounded hover:bg-primary/10 transition-colors mt-1"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" /> [ collapse() ]
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> [ read_more() ]
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </article>
  );
};
