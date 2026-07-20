/**
 * App.tsx — Root of the entire React application.
 *
 * Think of this file as the "outer shell" that wraps every page. It sets up:
 *
 *   1. <HelmetProvider>      — lets any page edit <title>, <meta>, etc.
 *                              (used for SEO tags in Index.tsx)
 *   2. <QueryClientProvider> — TanStack Query: caches server data for any
 *                              component that calls useQuery/useMutation.
 *   3. <TooltipProvider>     — shadcn/ui tooltips need a global provider.
 *   4. <Toaster /> + <Sonner /> — two toast notification systems mounted once
 *                              so any component can call `toast(...)`.
 *   5. <BrowserRouter>       — react-router: enables URL-based navigation
 *                              without full page reloads.
 *   6. <Routes>              — declares which component renders for which URL.
 *
 * Performance note:
 *   Index (the home page) is imported eagerly because users almost always
 *   land there first. NotFound is wrapped in `lazy()` so its code is only
 *   downloaded if someone actually hits a missing route — keeping the home
 *   bundle smaller and faster.
 */

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";

// Code-split: NotFound only downloads when a user visits an unknown URL.
const NotFound = lazy(() => import("./pages/NotFound"));

// One QueryClient instance shared across the whole app.
// Holds the in-memory cache for any TanStack Query call.
const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Two toast systems — they don't conflict; pick whichever API fits. */}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Suspense shows `fallback` while a lazy component is fetching.
              null = render nothing during the (very brief) load. */}
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* IMPORTANT: add any custom routes ABOVE the catch-all "*" below */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
