/**
 * Shared constants for the Blog feature.
 *
 * Keeping these in one place avoids "magic strings" scattered across
 * components — change a value here and every consumer updates.
 */

/**
 * Sentinel value for the "show all posts" tag.
 *
 * Why a constant?
 *   - The tag UI treats "All" specially (no `#` prefix, never filters).
 *   - Comparing against ALL_TAG everywhere is safer than typing "All"
 *     by hand in several files (typos won't compile-error otherwise).
 */
export const ALL_TAG = "All";

/**
 * Debounce window (ms) between the user typing and the search actually
 * running. 200ms is a sweet spot:
 *   - Short enough to feel instant.
 *   - Long enough that we don't re-filter on every keystroke (which would
 *     be wasteful and could cause flicker on slower devices).
 */
export const SEARCH_DEBOUNCE_MS = 200;
