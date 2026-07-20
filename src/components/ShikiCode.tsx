/**
 * ShikiCode — Async-loaded syntax-highlighted code block.
 *
 * What is Shiki?
 *   Shiki is a syntax highlighter that uses real TextMate grammars (the
 *   same ones VS Code uses). The output looks IDENTICAL to your editor —
 *   way nicer than libraries like Prism that approximate colors with regex.
 *
 * Why is this file so careful about loading?
 *   The full `shiki` package bundles every language and every theme — it's
 *   ~5MB unminified. We only need 6 languages and 1 theme, so we use
 *   `shiki/core` + dynamic `import()`s to ship ONLY what we use. The result
 *   is a few hundred KB, loaded ASYNCHRONOUSLY when a code block first
 *   renders (i.e. when a reader expands a blog post, not on initial page
 *   load).
 *
 * Three layers of laziness:
 *   1. The blog body chunks are React.lazy → don't load until a card expands.
 *   2. Inside a body, this component mounts and triggers `getHighlighter()`.
 *   3. `getHighlighter()` itself uses dynamic imports for langs + WASM engine.
 *   So a visitor who never opens a post never downloads any of this.
 */

import { useEffect, useState } from "react";
// `shiki/core` is the lightweight entry point — it does NOT include any
// languages or themes by default. We add them ourselves below.
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
// We use Shiki's pure-JavaScript regex engine instead of the Oniguruma WASM
// engine. Trade-off: WASM is ~622 KB (~231 KB gzip) and parses TextMate
// regexes natively; the JS engine is ~10 KB and transpiles them to native
// RegExp at runtime. For our 6 grammars (md/tsx/ts/sql/css/bash) the JS
// engine is fully compatible AND faster — saving ~600 KB on the wire.
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// ---------- Shared highlighter (singleton) ----------
//
// Why a module-level variable? Creating a Shiki highlighter is expensive
// (loads WASM, parses grammars). If two ShikiCode components mount at the
// same time, we want them to SHARE one highlighter instance instead of
// each spinning up their own.
//
// We store a Promise (not the resolved highlighter) so simultaneous calls
// to getHighlighter() all `await` the SAME in-flight initialization
// instead of starting it twice. Classic "memoized async singleton" pattern.
let highlighterPromise: Promise<HighlighterCore> | null = null;

// The languages we actually use across the blog posts. Adding a new one?
// Append the alias here AND add an `import("@shikijs/langs/...")` below.
const SUPPORTED_LANGS = ["tsx", "ts", "css", "sql", "md", "bash"] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export const getHighlighter = () => {
  // First call: kick off initialization. Subsequent calls reuse the same Promise.
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      // Each `import("...")` here is a SEPARATE dynamic import. Vite turns
      // each one into its own JS chunk that's fetched in parallel. None of
      // them are in the main bundle.
      themes: [import("@shikijs/themes/github-dark-default")],
      langs: [
        import("@shikijs/langs/tsx"),
        import("@shikijs/langs/typescript"),
        import("@shikijs/langs/css"),
        import("@shikijs/langs/sql"),
        import("@shikijs/langs/markdown"),
        import("@shikijs/langs/bash"),
      ],
      // The JS regex engine is synchronous and tiny — no WASM fetch.
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
};

// Map the short aliases we use in blog posts to Shiki's full language names.
// Authors write `language="ts"`, Shiki internally calls it "typescript".
// `md` → "markdown" same idea. Add new entries here, not in component logic.
const ALIAS: Record<string, string> = {
  ts: "typescript",
  md: "markdown",
};

interface ShikiCodeProps {
  code: string;
  language?: string;
}

const ShikiCode = ({ code, language = "tsx" }: ShikiCodeProps) => {
  // The highlighted HTML output. Starts null while we wait for the
  // highlighter to load — we render a plain <pre> placeholder until then.
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    // Race-condition guard: if `code` or `language` changes while a previous
    // highlight is still in flight, we don't want the stale result to call
    // setHtml() and overwrite the current one. The cleanup function below
    // sets `cancelled = true` so the resolved callback bails out.
    let cancelled = false;

    getHighlighter().then((hl) => {
      if (cancelled) return;

      // Resolve the user-facing alias ("ts") to Shiki's internal name
      // ("typescript"). Then validate it's a language Shiki actually knows
      // about — falling back to "tsx" for anything unrecognized so we never
      // throw inside the renderer.
      const resolved = ALIAS[language] ?? language;
      const lang = (SUPPORTED_LANGS as readonly string[]).includes(resolved)
        ? resolved
        : hl.getLoadedLanguages().includes(resolved)
          ? resolved
          : "tsx";

      // codeToHtml returns a string of fully-styled HTML (every token wrapped
      // in a <span style="color:..."> with the theme colors baked in).
      const out = hl.codeToHtml(code, {
        lang,
        theme: "github-dark-default",
      });
      setHtml(out);
    });

    // Cleanup: runs when deps change OR when the component unmounts.
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  // ── Loading state ──
  // Show the raw code in a plain <pre> while we wait. This avoids a layout
  // shift when the highlighted version arrives (same monospace font + size)
  // and still gives the reader something to look at if highlighting fails.
  if (!html) {
    return (
      <pre className="mt-3 mb-3 rounded-md bg-editor-bg border border-border p-4 overflow-x-auto text-[12.5px] leading-relaxed font-mono text-foreground/80">
        <code>{code}</code>
      </pre>
    );
  }

  // ── Highlighted state ──
  // Why dangerouslySetInnerHTML? Shiki returns a chunk of HTML as a string;
  // we'd lose all the styling info if we put it through React's normal text
  // rendering. The "dangerously" name is React being honest — if the input
  // were user-controlled, this would be an XSS vector. But here:
  //   1. The HTML comes from Shiki, not from any user input.
  //   2. Shiki escapes the source code it embeds (your code blocks can
  //      contain `<script>` tags safely — they'll be rendered as text).
  // So this is a safe, idiomatic Shiki integration.
  return (
    <div
      className="shiki-wrapper mt-3 mb-3 rounded-md border border-border overflow-hidden text-[12.5px] leading-relaxed font-mono"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default ShikiCode;
