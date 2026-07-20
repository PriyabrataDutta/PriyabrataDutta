/**
 * utils.ts — Tiny shared utilities used across the project.
 *
 * `cn` (short for "class names") is the helper you'll see on almost every
 * component. It does two things:
 *
 *   1. clsx       — Joins multiple class name arguments into one string,
 *                   skipping falsy values. Lets you write:
 *                     cn("base", isActive && "text-primary", { "p-4": padded })
 *
 *   2. twMerge    — Resolves conflicting Tailwind classes intelligently.
 *                   Without it, `"px-2 px-4"` would render both classes
 *                   (and the last one wins by source order, which is fragile).
 *                   With twMerge, `cn("px-2", "px-4") === "px-4"` — the later
 *                   value reliably overrides the earlier one.
 *
 * Use `cn(...)` whenever you build a className from multiple sources
 * (props, conditional state, variants).
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
