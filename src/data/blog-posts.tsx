/**
 * blog-posts.tsx — Single source of truth for the Blog section content.
 *
 * Architecture:
 *   • Each post's *metadata* (title, tags, date, excerpt…) is defined here as
 *     plain JSON-like data — cheap to import everywhere.
 *   • The *body* (the long-form JSX with code samples) lives in its own file
 *     under `./blog-bodies/` and is loaded LAZILY via `React.lazy()`.
 *
 * Why lazy-load the bodies?
 *   The body files import <ShikiCode /> for syntax highlighting, which pulls
 *   in a sizeable WASM grammar bundle. If we imported them eagerly, every
 *   visitor would download that bundle just to see the blog *cards* — even if
 *   they never click "read_more". With React.lazy, the body chunk is fetched
 *   on-demand the first time a user expands that specific post.
 *
 * How React.lazy works:
 *   • `lazy(() => import("./path"))` returns a special component that, when
 *     first rendered, triggers a dynamic `import()` (Vite splits this into
 *     a separate JS chunk).
 *   • While the chunk loads, React looks UP the tree for the nearest
 *     <Suspense> boundary and shows its `fallback`. (See BlogCard.tsx.)
 *   • Once the chunk arrives, React swaps the fallback for the real body.
 *
 * Adding a new post:
 *   1. Create `src/data/blog-bodies/your-slug.tsx` — `export default` the JSX.
 *   2. Add a new entry to the `posts` array below — newest first.
 *   3. Reference the body via `Body: lazy(() => import("./blog-bodies/your-slug"))`.
 */

import { lazy, type ComponentType } from "react";

/**
 * Shape of a single blog post entry.
 * Every field is required EXCEPT `trending`, which optionally pins a 🔥
 * badge in the card's title bar.
 */
export interface Post {
  /** URL-safe identifier; used as React key + future deep-linking. */
  id: string;
  /** Fake filename shown in the card's editor title bar (e.g. "post.md"). */
  filename: string;
  /** Language pill shown next to the filename (md / tsx / ts / sql / css). */
  language: string;
  title: string;
  subtitle: string;
  /** ISO date string — also displayed verbatim in the card meta row. */
  date: string;
  readingTime: string;
  /** Tags drive the filter pills in <BlogFilters />. */
  tags: string[];
  /** Optional 🔥 badge in the card title bar — set true on hot posts. */
  trending?: boolean;
  /** Short summary shown in the collapsed card. Highlighted on search match. */
  excerpt: string;
  /** Lazy-loaded post body. Only fetched when the card is expanded. */
  Body: ComponentType;
  /**
   * Raw dynamic-import factory — called on hover/focus to prefetch the body
   * chunk *before* the user clicks [ read_more() ]. React.lazy doesn't
   * expose its internal loader, so we keep our own reference here.
   */
  preload: () => Promise<unknown>;
}

/** Pair a React.lazy component with its raw loader (for preloading). */
const body = (loader: () => Promise<{ default: ComponentType }>) => ({
  Body: lazy(loader),
  preload: loader,
});

export const posts: Post[] = [
  {
    id: "vibe-coding",
    filename: "vibe-coding-revolution.md",
    language: "md",
    title: "The Vibe Coding Revolution",
    subtitle:
      "A technical & economic analysis of agentic software development platforms",
    date: "2026-04-18",
    readingTime: "8 min read",
    tags: ["AI", "Agentic IDEs", "v0", "Cursor"],
    trending: true,
    excerpt:
      "Software engineering is undergoing its most radical shift since high-level languages. From prompt-driven full-stack builders to autonomous IDEs — here's the 2026 landscape.",
    ...body(() => import("./blog-bodies/vibe-coding")),
  },
  {
    id: "gsap-scroll",
    filename: "gsap-scroll-reveals.tsx",
    language: "tsx",
    title: "Scroll Reveals with GSAP & React",
    subtitle: "How I animate every section in this portfolio without jank",
    date: "2026-04-10",
    readingTime: "5 min read",
    tags: ["React", "GSAP", "ScrollTrigger"],
    excerpt:
      "useGSAP scopes animations to the component lifecycle so unmounts stay clean. Pair it with ScrollTrigger for buttery section reveals.",
    ...body(() => import("./blog-bodies/gsap-scroll")),
  },
  {
    id: "supabase-rls",
    filename: "supabase-roles.sql",
    language: "sql",
    title: "Roles in Supabase, the Right Way",
    subtitle: "Avoid privilege-escalation by storing roles in their own table",
    date: "2026-04-02",
    readingTime: "4 min read",
    tags: ["Supabase", "Postgres", "Security"],
    excerpt:
      "Never store roles on the profiles table. Use a dedicated user_roles table + a SECURITY DEFINER function for safe, recursion-free RLS.",
    ...body(() => import("./blog-bodies/supabase-rls")),
  },
  {
    id: "ai-edge-function",
    filename: "ai-edge.ts",
    language: "ts",
    title: "Calling AI from an Edge Function",
    subtitle: "Clean serverless AI integration with zero SDK bloat",
    date: "2026-03-22",
    readingTime: "4 min read",
    tags: ["Cloud", "Edge Functions", "Gemini"],
    excerpt:
      "Call AI gateways directly from Deno edge functions using standard fetch with zero SDK overhead.",
    ...body(() => import("./blog-bodies/ai-edge-function")),
  },
  {
    id: "ts-discriminated-unions",
    filename: "discriminated-unions.ts",
    language: "ts",
    title: "Discriminated Unions Killed My Bug Backlog",
    subtitle: "Make impossible states truly impossible in TypeScript",
    date: "2026-03-08",
    readingTime: "5 min read",
    tags: ["TypeScript", "Patterns", "DX"],
    excerpt:
      "Optional fields create a combinatorial explosion of invalid states. A discriminated union forces every consumer to handle each case — at compile time.",
    ...body(() => import("./blog-bodies/ts-discriminated-unions")),
  },
  {
    id: "shadcn-tokens",
    filename: "design-tokens.css",
    language: "css",
    title: "Stop Hard-Coding Colors in Tailwind",
    subtitle: "How HSL design tokens unlock instant theme swaps",
    date: "2026-02-19",
    readingTime: "3 min read",
    tags: ["Tailwind", "Design System", "shadcn/ui"],
    excerpt:
      "Every text-white in your codebase is a future refactor. Push colors into HSL CSS variables and your dark mode, brand swap, and accessibility audit all collapse into one diff.",
    ...body(() => import("./blog-bodies/shadcn-tokens")),
  },
];
