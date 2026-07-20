/**
 * highlightMatch — Wraps every occurrence of `query` inside `text` with a
 * styled <mark> element so the user sees their search term highlighted.
 *
 * Used by the blog grid: when someone types "react" in the search box,
 * every "react" in the visible card titles/excerpts gets a yellow box
 * around it. Pure visual feedback — has no effect on which cards show.
 *
 * Example:
 *   highlightMatch("React hooks tutorial", "hooks")
 *   →  React <mark>hooks</mark> tutorial
 *
 * Why return ReactNode instead of an HTML string?
 *   We could build a string and dump it via `dangerouslySetInnerHTML`,
 *   but returning real React elements is safer (no XSS risk, no manual
 *   escaping) and lets React diff them efficiently when the query changes.
 */

import type { ReactNode } from "react";

/**
 * Escape characters that have special meaning inside a RegExp.
 *
 * The problem: regex characters like `.`, `*`, `+`, `(`, `)` mean
 * something — `.` matches any character, `+` means "one or more", etc.
 * If a user types a search like `c++` or `node.js`, naively building
 * `new RegExp("c++")` either throws a syntax error or matches the wrong
 * thing (the `.` in `node.js` would match ANY character).
 *
 * The fix: walk the input and prefix every special character with `\`,
 * which tells the regex engine "treat this literally, not as a metachar".
 *
 * How the replace call works:
 *   /[.*+?^${}()|[\]\\]/g  — character class listing every regex metachar
 *   "\\$&"                  — `$&` is "the matched character"; `\\` becomes
 *                             a single backslash in the final string.
 *   Result: "node.js" → "node\\.js", which matches a LITERAL dot.
 *
 * This is the standard MDN-recommended escape; copy it verbatim if you
 * ever need it elsewhere.
 */
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Highlight occurrences of `query` inside `text`. Case-insensitive.
 * Returns the original string unchanged when no query is given.
 *
 * Strategy: build a regex with a CAPTURING GROUP, split the text on it,
 * then walk the resulting array wrapping matches in <mark>.
 */
export const highlightMatch = (text: string, query: string): ReactNode => {
  const q = query.trim();
  // Empty query → nothing to highlight, return the plain string. React is
  // fine rendering a string where it expects ReactNode.
  if (!q) return text;

  // The capturing group `(...)` is the trick. Normally `"foo bar".split(/ /)`
  // returns ["foo", "bar"] and throws away the separator. But when the regex
  // contains a capture group, split() KEEPS the matched parts in the output:
  //
  //   "React hooks tutorial".split(/(hooks)/gi)
  //   → ["React ", "hooks", " tutorial"]
  //
  // The result alternates: [non-match, match, non-match, match, ...].
  // The `g` flag = global (find ALL occurrences).
  // The `i` flag = case-insensitive ("HOOKS" matches "hooks").
  const regex = new RegExp(`(${escapeRegExp(q)})`, "gi");
  const parts = text.split(regex);
  const lower = q.toLowerCase();

  // Walk the parts. Because of how split() with capture works, we can't
  // assume "every odd index is a match" reliably across edge cases — so we
  // re-test each part by lowercased equality. That also gives us the
  // case-insensitive comparison for free.
  return parts.map((part, i) =>
    part.toLowerCase() === lower && part.length > 0 ? (
      // <mark> is a real semantic HTML tag — screen readers announce the
      // highlight, and it's exactly what this element was designed for.
      // The Tailwind classes use design-system tokens (bg-primary/25,
      // text-primary) so highlights match the theme automatically.
      <mark
        key={i}
        className="bg-primary/25 text-primary rounded px-0.5 font-semibold"
      >
        {part}
      </mark>
    ) : (
      // Wrap non-matches in <span> so React has a stable element to diff
      // (and so the `key` prop has somewhere to go without warnings).
      <span key={i}>{part}</span>
    ),
  );
};
