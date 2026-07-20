/**
 * Blog — Section 06: card grid of trending dev articles.
 *
 * Composition:
 *   • useBlogFilters  → owns ALL state (search, tag, debounce, derived data)
 *   • BlogFilters     → renders the search bar + tag pills (pure UI)
 *   • BlogCard        → renders a single post (with lazy-loaded body)
 *
 * Performance:
 *   • Cards beyond INITIAL_VISIBLE are progressively revealed via an
 *     IntersectionObserver sentinel — keeps initial DOM small (PageSpeed)
 *     and avoids mounting all lazy Body Suspense boundaries up front.
 *   • The visible window resets whenever filters change.
 */

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import SectionLabel from "./SectionLabel";
import { posts } from "@/data/blog-posts";
import { BlogCard } from "./blog/BlogCard";
import { BlogFilters } from "./blog/BlogFilters";
import { useBlogFilters } from "./blog/useBlogFilters";
import { getHighlighter } from "./ShikiCode";

const INITIAL_VISIBLE = 6;
const REVEAL_STEP = 6;

const Blog = () => {
  const {
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
  } = useBlogFilters();

  // Show featured card only when no filter or search is active.
  const showFeatured = !isFiltered;
  const [featured, ...rest] = posts;
  const sourceList = showFeatured ? rest : filteredPosts;

  // Progressive reveal window.
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const gridPosts = sourceList.slice(0, visibleCount);
  const hasMore = visibleCount < sourceList.length;

  // Reset window whenever filters change.
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activeTag, query]);

  // Once the Blog section has mounted (it's already lazy-loaded behind an
  // idle gate in Index.tsx), opportunistically warm the Shiki highlighter
  // during browser idle time. This pulls down the langs/themes/engine
  // chunks BEFORE any user clicks [ read_more() ], so expansion feels
  // instant on the first click instead of waiting on a cold fetch+parse.
  useEffect(() => {
    const ric: typeof requestIdleCallback | undefined =
      typeof window !== "undefined" ? window.requestIdleCallback : undefined;
    const schedule = ric ?? ((cb: IdleRequestCallback) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 } as IdleDeadline), 1500));
    const cancel: typeof cancelIdleCallback | undefined =
      typeof window !== "undefined" ? window.cancelIdleCallback : undefined;
    const id = schedule(() => {
      void getHighlighter().catch(() => {});
    });
    return () => {
      if (cancel && typeof id === "number") cancel(id);
    };
  }, []);

  // Observe the sentinel; bump visibleCount when near viewport.
  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((c) => c + REVEAL_STEP);
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [hasMore, gridPosts.length]);

  // Re-run reveal animation whenever the visible set changes.
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".blog-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: i * 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 95%", once: true },
          },
        );
      });
    },
    { dependencies: [activeTag, query, visibleCount] },
  );

  const isEmpty = !showFeatured && sourceList.length === 0;

  return (
    <section id="blog" className="section-padding grid-bg">
      <div className="container mx-auto px-4">
        <SectionLabel
          number="06"
          title="Blog"
          description="// trending notes on AI, animation & full-stack craft"
        />

        <BlogFilters
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          inputValue={inputValue}
          setInputValue={setInputValue}
          query={query}
          isPending={isPending}
          tagCounts={tagCounts}
          filteredCount={filteredPosts.length}
          isFiltered={isFiltered}
          onClearSearch={clearSearch}
          onResetAll={resetAll}
        />

        {isEmpty ? (
          <div className="text-center py-16 font-mono text-comment border border-dashed border-border rounded-lg">
            <p className="text-sm">// no posts match your filters</p>
            <button
              onClick={resetAll}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm border border-primary text-primary rounded hover:bg-primary/10 transition-colors"
            >
              [ reset_filters() ]
            </button>
          </div>
        ) : (
          <>
            <div
              key={`${activeTag}-${query}`}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
            >
              {showFeatured && <BlogCard post={featured} featured query={query} />}
              {gridPosts.map((post) => (
                <BlogCard key={post.id} post={post} query={query} />
              ))}
            </div>
            {hasMore && (
              <div
                ref={sentinelRef}
                aria-hidden="true"
                className="h-10 mt-6 font-mono text-xs text-comment text-center"
              >
                // loading_more_posts()…
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Blog;
