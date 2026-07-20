/**
 * NavLink — Thin wrapper around react-router-dom's <NavLink>.
 *
 * Why wrap it?
 *   react-router's <NavLink> expects you to pass a FUNCTION to className that
 *   receives `{ isActive, isPending }` and returns a string. That works, but
 *   it's awkward to write at every call site:
 *
 *     <RouterNavLink className={({ isActive }) => isActive ? "foo bar" : "foo"} />
 *
 *   This wrapper lets you pass three plain strings instead:
 *     - className         → always applied
 *     - activeClassName   → applied only when the link matches the current URL
 *     - pendingClassName  → applied while a navigation is in-flight (data router)
 *
 *   …and we handle the merging internally. Much cleaner at every call site:
 *     <NavLink to="/about" className="link" activeClassName="link-active" />
 *
 * Internally it merges them with `cn` (the Tailwind class merger from utils),
 * which dedupes and resolves conflicts intelligently.
 *
 * Why forwardRef?
 *   `forwardRef` lets parent components attach a `ref` to the underlying
 *   <a> element. Without it, refs passed to <NavLink> would be ignored
 *   (you'd get a React warning). Useful for: tooltip libraries that need
 *   the DOM node, focus management, scroll-into-view, etc.
 *
 *   Even if no caller uses it today, forwarding the ref is good hygiene —
 *   it costs nothing and prevents future bugs.
 */

import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// We extend the original NavLink props but REPLACE its className type
// (which is `string | function`) with our simpler `string` version.
// `Omit<T, "className">` removes the original `className` field, then we
// re-add our own three flavors of class strings.
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

// forwardRef signature: forwardRef<RefElementType, PropsType>(...)
// → first generic = type of element the ref points to (the <a> tag)
// → second generic = our props interface
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}    // pass the forwarded ref straight through to the anchor
        to={to}
        // react-router calls this function on every render and passes the
        // current link state. We combine the three optional class strings
        // based on that state. `cn` handles falsy values gracefully —
        // `cn("a", false && "b", true && "c")` → `"a c"`.
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        // Spread the rest of the props (children, onClick, etc.) onto the
        // underlying NavLink. This keeps us API-compatible with react-router.
        {...props}
      />
    );
  },
);

// React DevTools shows the displayName instead of "ForwardRef" — easier to
// debug. Always set this for forwardRef components.
NavLink.displayName = "NavLink";

export { NavLink };
