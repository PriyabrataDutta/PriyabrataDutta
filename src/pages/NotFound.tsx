/**
 * NotFound — The 404 page shown for any URL that doesn't match a route.
 *
 * Wired up in App.tsx as the catch-all `<Route path="*" />`. It logs the
 * bad path to the console (handy for debugging broken links) and offers
 * a link back home.
 */

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  // useLocation gives us info about the current URL (path, query, hash).
  const location = useLocation();

  // Log the missing path once when this page mounts. Helpful in production
  // so we can spot 404s in browser logs / monitoring tools.
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        {/* Plain anchor (not <Link>) is fine here — it's a hard reload back to root. */}
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
