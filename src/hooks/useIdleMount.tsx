/**
 * useIdleMount — Defer rendering of non-critical components until the browser
 * is idle (or a timeout fires).
 *
 * Why: Above-the-fold components (Navigation, Hero) should hydrate first.
 * Below-the-fold sections add JS work that competes for the main thread
 * during LCP. Wrapping them in this hook delays their mount to
 * `requestIdleCallback`, which runs only when the browser has spare time.
 *
 * Falls back to `setTimeout(…, timeout)` in browsers without rIC (Safari).
 */

import { useEffect, useState } from "react";

export const useIdleMount = (timeout = 1500): boolean => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // SSR / older Safari guard
    const ric =
      typeof window !== "undefined" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).requestIdleCallback as
        | ((cb: () => void, opts?: { timeout: number }) => number)
        | undefined;

    if (ric) {
      const id = ric(() => setReady(true), { timeout });
      return () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cic = (window as any).cancelIdleCallback as ((id: number) => void) | undefined;
        cic?.(id);
      };
    }

    const id = window.setTimeout(() => setReady(true), Math.min(timeout, 800));
    return () => window.clearTimeout(id);
  }, [timeout]);

  return ready;
};
