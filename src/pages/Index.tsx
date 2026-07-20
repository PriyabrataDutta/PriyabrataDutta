/**
 * Index.tsx — The home page of the portfolio.
 *
 * Above-the-fold sections (Navigation, Hero) load eagerly so first paint is fast.
 * Below-the-fold sections are code-split via React.lazy and rendered inside a
 * Suspense boundary — keeping the initial JS bundle small.
 */

import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { useIdleMount } from "@/hooks/useIdleMount";
// AVIF hero image variants — preloaded in <head> so the LCP image starts
// downloading in parallel with the JS bundle (huge LCP win).
import heroAvif512 from "@/assets/profile-photo-512.avif";
import heroAvif1024 from "@/assets/profile-photo-1024.avif";

// Lazy-loaded below-the-fold sections — fetched in parallel after first paint.
const About = lazy(() => import("@/components/About"));
const Skills = lazy(() => import("@/components/Skills"));
const Projects = lazy(() => import("@/components/Projects"));
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
const Blog = lazy(() => import("@/components/Blog"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));
const WhatsAppFloat = lazy(() => import("@/components/WhatsAppFloat"));
const BackToTop = lazy(() => import("@/components/BackToTop"));

// Minimal placeholder so layout doesn't jump while a chunk loads.
const SectionFallback = () => <div className="min-h-[200px]" aria-hidden="true" />;

const Index = () => {
  // Defer below-the-fold sections until the browser is idle. This lets the
  // critical path (Navigation + Hero) hydrate first, freeing the main thread
  // during LCP. After idle (or 1.5s timeout), the rest mounts and lazy chunks
  // start downloading in parallel.
  const belowFoldReady = useIdleMount(1500);

  return (
    <>
      {/* SEO + social sharing tags. These get injected into <head>. */}
      <Helmet>
        <title>Priyabrata Dutta | Full Stack Developer Portfolio</title>
        <meta
          name="description"
          content="Full Stack Developer with 10+ Years IT Experience · 5+ Years Building Scalable Web Apps with React, Node.js, AWS. Leading cross-functional teams. Based in Bangalore, India."
        />
        <meta name="keywords" content="Full Stack Developer, React, Node.js, AWS, Web Developer, Bangalore, Portfolio" />
        <meta property="og:title" content="Priyabrata Dutta | Full Stack Developer" />
        <meta property="og:description" content="10+ Years IT Experience · 5+ Years Building Scalable Web Apps with React, Node.js & AWS." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/" />
        {/* Preload the LCP hero image — AVIF, viewport-specific.
            Mobile gets the 512w variant, desktop gets the 1024w. */}
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href={heroAvif512}
          media="(max-width: 1023px)"
        />
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href={heroAvif1024}
          media="(min-width: 1024px)"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Hero />
          {belowFoldReady && (
            <Suspense fallback={<SectionFallback />}>
              <About />
              <Skills />
              <Projects />
              <Experience />
              <Education />
              <Blog />
              <Contact />
            </Suspense>
          )}
        </main>
        {belowFoldReady && (
          <Suspense fallback={null}>
            <Footer />
            <WhatsAppFloat />
            <BackToTop />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default Index;
