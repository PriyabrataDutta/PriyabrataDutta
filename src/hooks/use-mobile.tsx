/**
 * useIsMobile — React hook that returns `true` when the viewport is narrower
 * than the mobile breakpoint (768px, matching Tailwind's `md:` breakpoint).
 *
 * Built on `window.matchMedia` so it reacts instantly to viewport changes
 * (resize, device rotation) without polling scroll/resize events.
 *
 * @returns `true` if the viewport width is `< 768px`, otherwise `false`.
 *          During the very first render (before `useEffect` runs) it returns
 *          `false` — useful for SSR where `window` is undefined.
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileMenu /> : <DesktopMenu />;
 * ```
 */
import * as React from "react";

// 768px is Tailwind's `md` breakpoint. Anything below = mobile.
const MOBILE_BREAKPOINT = 768;

/**
 * Hook that tracks whether the current viewport is mobile-sized.
 *
 * Internally uses a {@link MediaQueryList} subscription so changes are
 * delivered as native browser events — no scroll listeners, no polling.
 *
 * @returns `boolean` — `true` for viewports `< 768px`, otherwise `false`.
 */
export function useIsMobile() {
  // Start as `undefined` so we can distinguish "not yet measured" from
  // "definitely not mobile". The `!!` at the bottom coerces to boolean.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // MediaQueryList: a live object that knows when the query starts/stops matching.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    /** Re-read the current viewport width and update state. */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Subscribe to breakpoint-crossings.
    mql.addEventListener("change", onChange);
    // Set the initial value on mount (the listener only fires on CHANGES).
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup: remove the listener when the component unmounts.
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
