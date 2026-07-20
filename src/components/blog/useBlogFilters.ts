/**
 * useBlogFilters — Custom React hook that owns ALL blog filtering state.
 *
 * Pulling this out of the Blog component keeps the UI components dumb
 * (presentational) and makes the logic easy to test or reuse.
 *
 * State it manages:
 *   - activeTag    : which tag pill the user clicked (or ALL_TAG)
 *   - inputValue   : what's currently typed in the search box (updates on every keystroke)
 *   - query        : the DEBOUNCED search value used for actual filtering
 *   - isPending    : true while we're waiting for the debounce to settle
 *                    (powers the "searching…" indicator next to the input)
 *
 * Why two values for search?
 *   Filtering on every keystroke would re-render the whole grid on every
 *   letter — wasteful and visually jittery. We debounce: the input feels
 *   instant, but actual filtering happens 200ms after the user stops typing.
 */

import { useEffect, useMemo, useState } from "react";
import { posts } from "@/data/blog-posts";
import { ALL_TAG, SEARCH_DEBOUNCE_MS } from "./constants";

export const useBlogFilters = () => {
  const [activeTag, setActiveTag] = useState<string>(ALL_TAG);
  const [inputValue, setInputValue] = useState(""); // bound to the <input>
  const [query, setQuery] = useState("");           // debounced — drives filtering

  // Debounce: every time inputValue changes, schedule a commit to `query`
  // after SEARCH_DEBOUNCE_MS. If the user keeps typing, the previous timer
  // is cleared (via the cleanup function) and a fresh one starts.
  useEffect(() => {
    if (inputValue === query) return; // already in sync, nothing to do
    const id = window.setTimeout(() => setQuery(inputValue), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [inputValue, query]);

  // Build the tag pill data: [tag, count] tuples, sorted by popularity then
  // alphabetically. Memoized so we only recompute when posts change (never,
  // in practice — it's a static import — so this runs exactly once).
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    const sorted = Array.from(counts.entries()).sort(
      ([a, ca], [b, cb]) => cb - ca || a.localeCompare(b),
    );
    // Prepend the "All" pseudo-tag with the total post count.
    return [[ALL_TAG, posts.length] as const, ...sorted];
  }, []);

  // Apply both filters in order: tag first (cheaper), then text search.
  // useMemo recomputes only when activeTag or query changes.
  const filteredPosts = useMemo(() => {
    const byTag =
      activeTag === ALL_TAG ? posts : posts.filter((p) => p.tags.includes(activeTag));
    const q = query.trim().toLowerCase();
    if (!q) return byTag;
    // Match against title, subtitle, AND excerpt — case-insensitive substring.
    return byTag.filter((p) =>
      [p.title, p.subtitle, p.excerpt].some((field) => field.toLowerCase().includes(q)),
    );
  }, [activeTag, query]);

  // Convenience flags consumed by the UI.
  const isFiltered = activeTag !== ALL_TAG || query.trim() !== "";
  const isPending = inputValue !== query; // true while debounce is in flight

  // Reset helpers — clearer at call sites than inlining setState calls.
  const clearSearch = () => {
    setInputValue("");
    setQuery("");
  };

  const resetAll = () => {
    setActiveTag(ALL_TAG);
    clearSearch();
  };

  return {
    activeTag,
    setActiveTag,
    inputValue,
    setInputValue,
    query,
    isPending,
    tagCounts,
    filteredPosts,
    isFiltered,
    clearSearch,
    resetAll,
  };
};
