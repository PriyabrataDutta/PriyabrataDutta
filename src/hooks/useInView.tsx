/**
 * useInView — Detects when an element enters (or leaves) the viewport.
 *
 * Built on the browser's IntersectionObserver API, which is far more
 * efficient than listening to scroll events. Common use cases:
 *   - Triggering reveal animations
 *   - Lazy-loading images / heavy components
 *   - Firing analytics ("section viewed") events
 *
 * @example
 * ```tsx
 * const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });
 * return <div ref={ref}>{isInView && <Reveal />}</div>;
 * ```
 */

import { useState, useEffect, useRef, RefObject } from "react";

/**
 * Options accepted by {@link useInView}.
 */
interface UseInViewOptions {
  /**
   * How much of the element must be visible (0–1) before it counts as "in view".
   * - `0`   → fires as soon as 1px is visible
   * - `0.5` → fires when 50% of the element is visible
   * - `1`   → fires only when the element is fully visible
   * @default 0.1
   */
  threshold?: number;

  /**
   * Extra margin around the viewport when calculating visibility.
   * Uses CSS-margin syntax (e.g. `"100px 0px"` to start triggering 100px
   * BEFORE the element enters the viewport). Negative values shrink the area.
   * @default "0px"
   */
  rootMargin?: string;

  /**
   * If `true`, stops observing after the first time the element becomes visible
   * (perfect for one-shot reveal animations). If `false`, `isInView` toggles
   * back to `false` whenever the element scrolls back out.
   * @default true
   */
  triggerOnce?: boolean;
}

/**
 * Return value of {@link useInView}.
 */
interface UseInViewReturn {
  /** Attach this to the DOM element you want to observe. */
  ref: RefObject<HTMLElement>;
  /** `true` once the element has entered the viewport (per the configured options). */
  isInView: boolean;
}

/**
 * React hook that observes a DOM element and reports whether it is in view.
 *
 * @param options - Configuration object (see {@link UseInViewOptions}).
 * @param options.threshold - Visibility ratio (0–1) needed to trigger. Default `0.1`.
 * @param options.rootMargin - CSS margin string expanding/shrinking the viewport. Default `"0px"`.
 * @param options.triggerOnce - If `true`, only fires the first time. Default `true`.
 * @returns An object with `ref` (attach to the element) and `isInView` (boolean state).
 *
 * @example
 * // Reveal an animation only the first time the section becomes visible
 * const { ref, isInView } = useInView({ threshold: 0.3 });
 * <section ref={ref} className={isInView ? "animate-fade-in" : "opacity-0"} />
 */
export const useInView = ({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
}: UseInViewOptions = {}): UseInViewReturn => {
  // Ref attached to the DOM element we want to observe.
  const ref = useRef<HTMLElement>(null);
  // Reactive state — flipping this re-renders the consumer component.
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create the observer; its callback fires whenever visibility changes.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // One-shot mode: detach after the first visibility event.
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          // Continuous mode: also flip back to false when it leaves.
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Cleanup on unmount or when deps change — prevents memory leaks.
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView };
};
