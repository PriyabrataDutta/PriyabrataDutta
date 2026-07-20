/**
 * BlogFilters — Presentational UI for the Blog section's filter bar.
 *
 * What it renders:
 *   1. Header row with a `clear_all` shortcut when any filter is active.
 *   2. Full-width search input with a live "searching…" indicator while
 *      the debounce timer is running, plus an X to clear the text.
 *   3. A row of tag pills, each showing how many posts use that tag.
 *   4. A summary line ("3 posts matching tag #React and query 'hooks'")
 *      whenever the user has narrowed the list.
 *
 * IMPORTANT: this component owns ZERO state. All values + handlers are
 * passed in as props (provided by the `useBlogFilters` hook). That makes
 * it easy to test and reuse — and keeps logic separate from layout.
 */

import { Filter, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_TAG } from "./constants";

/**
 * Props for <BlogFilters />.
 *
 * NOTE: This component is "controlled" — it never owns state. Every value
 * and handler comes in from the parent (which gets them from the
 * `useBlogFilters` hook). Benefits:
 *   • Single source of truth (the hook).
 *   • Easy to test — feed it props, snapshot the output.
 *   • Easy to reuse in another layout without rewriting filter logic.
 */
interface BlogFiltersProps {
  /** Currently selected tag pill, or ALL_TAG. */
  activeTag: string;
  /** Called when a tag pill is clicked. */
  setActiveTag: (tag: string) => void;
  /** Bound to the search <input> — updates on every keystroke (instant feedback). */
  inputValue: string;
  setInputValue: (value: string) => void;
  /** The DEBOUNCED search query — used only for the result-count summary line. */
  query: string;
  /** True while the debounce timer is pending — drives the "searching…" spinner. */
  isPending: boolean;
  /** [tag, count] pairs already sorted; first entry is always [ALL_TAG, total]. */
  tagCounts: ReadonlyArray<readonly [string, number]>;
  /** Number of posts after applying both tag + search filters. */
  filteredCount: number;
  /** True when any filter is active (drives the "clear_all" button visibility). */
  isFiltered: boolean;
  /** Empties the search input only (keeps the active tag). */
  onClearSearch: () => void;
  /** Resets BOTH the active tag and the search input. */
  onResetAll: () => void;
}

export const BlogFilters = ({
  activeTag,
  setActiveTag,
  inputValue,
  setInputValue,
  query,
  isPending,
  tagCounts,
  filteredCount,
  isFiltered,
  onClearSearch,
  onResetAll,
}: BlogFiltersProps) => {
  return (
    <div className="mb-8 md:mb-10 space-y-4">
      {/* Header (label + global clear) */}
      <div className="flex items-center gap-2 text-xs font-mono text-comment uppercase tracking-wider">
        <Filter className="w-3.5 h-3.5" />
        <span>filter_posts()</span>
        {isFiltered && (
          <button
            onClick={onResetAll}
            className="ml-auto inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors normal-case"
            aria-label="Clear all filters"
          >
            <X className="w-3 h-3" /> clear_all
          </button>
        )}
      </div>

      {/* Full-width search input */}
      <div className="relative w-full">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-comment"
          aria-hidden="true"
        />
        <input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="search('title, subtitle or excerpt...')"
          aria-label="Search blog posts"
          className={cn(
            "w-full font-mono text-sm pl-10 py-3 rounded-md border bg-editor-bg",
            "border-border text-foreground placeholder:text-comment",
            "focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20",
            "transition-colors",
            // Reserve more right padding while the pending indicator is visible.
            isPending ? "pr-32" : "pr-10",
          )}
        />
        {/* Right-side controls: pending indicator + clear button */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isPending && (
            <span
              role="status"
              aria-live="polite"
              className="flex items-center gap-1.5 font-mono text-[11px] text-primary/80 px-1.5"
            >
              <span className="relative flex w-2 h-2" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-primary/60 animate-ping" />
                <span className="relative rounded-full w-2 h-2 bg-primary" />
              </span>
              searching…
            </span>
          )}
          {inputValue && (
            <button
              onClick={onClearSearch}
              aria-label="Clear search"
              className="p-1 rounded text-comment hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tag pills row */}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter blog posts by tag"
      >
        {tagCounts.map(([tag, count]) => {
          const isActive = tag === activeTag;
          return (
            <button
              key={tag}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "group/tag inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded border transition-all",
                "hover:-translate-y-0.5",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_-4px_hsl(var(--primary)/0.6)]"
                  : "bg-primary/5 text-primary/90 border-border hover:border-primary/50 hover:bg-primary/10",
              )}
            >
              <span>{tag === ALL_TAG ? "all" : `#${tag}`}</span>
              <span
                className={cn(
                  "text-[10px] leading-none px-1.5 py-0.5 rounded-full font-semibold tabular-nums",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary/15 text-primary/80 group-hover/tag:bg-primary/25",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result count when filtering */}
      {isFiltered && (
        <p className="text-xs font-mono text-comment">
          <span className="text-primary">{filteredCount}</span>{" "}
          {filteredCount === 1 ? "post" : "posts"} matching
          {activeTag !== ALL_TAG && <> tag <span className="text-primary">#{activeTag}</span></>}
          {query.trim() && (
            <>
              {activeTag !== ALL_TAG ? " and " : " "}query{" "}
              <span className="text-primary">"{query.trim()}"</span>
            </>
          )}
        </p>
      )}
    </div>
  );
};
