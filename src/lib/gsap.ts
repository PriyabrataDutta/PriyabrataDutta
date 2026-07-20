/**
 * gsap.ts — Centralised GSAP setup.
 *
 * What is GSAP?
 *   GSAP (GreenSock Animation Platform) is the animation library powering
 *   all the smooth motion on this site — typewriter intros, scroll-triggered
 *   fade-ins, magnetic hover effects, tab indicator slides, etc. It's
 *   battle-tested, performant, and works the same across every browser.
 *
 * What is ScrollTrigger?
 *   GSAP's plugin for firing animations based on scroll position — "fade
 *   this section in when its top reaches 75% down the viewport", etc.
 *   It's not part of GSAP's core, so it has to be registered before use.
 *
 * Why does this file exist?
 *   1. Plugins like ScrollTrigger MUST be registered exactly once via
 *      `gsap.registerPlugin()` before any component uses them. Forgetting
 *      to register results in "ScrollTrigger is not defined" errors at
 *      runtime — a confusing failure mode.
 *   2. Doing the registration HERE (in one shared module) means it happens
 *      automatically the first time any component imports from this file.
 *      No "did you remember to register the plugin?" trap for new contributors.
 *   3. Components import `{ gsap, ScrollTrigger }` from "@/lib/gsap" instead
 *      of importing directly from "gsap" — guaranteeing the plugin is ready.
 *
 * The `typeof window !== "undefined"` check:
 *   In a browser, `window` is a global object. In server-side rendering or
 *   build-time evaluation, `window` doesn't exist and accessing it throws.
 *   We're a fully client-side app, but this guard is cheap insurance —
 *   it keeps the file safe to import from any context (e.g. Vite's SSR
 *   pre-render step, Vitest, etc.).
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// The check runs once when this module is first evaluated. Subsequent
// imports just reuse the already-registered plugin — registerPlugin is
// idempotent, but the guard avoids even calling it server-side.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Re-export both so callers always get a "ready-to-use" pair.
// Importing ScrollTrigger from here (instead of "gsap/ScrollTrigger") is
// what guarantees registration has happened by the time you use it.
export { gsap, ScrollTrigger };
