/**
 * HeroProfileWindow — Profile photo wrapped inside a fake code-editor window.
 *
 * Renders to the right of the intro on desktop. The "code" around the photo
 * is decorative — it spells out `function Profile() { … return "Let's build
 * something." }` to lean into the developer aesthetic.
 *
 * The photo itself is served as <picture> with three formats for best perf:
 *   AVIF (smallest) → WebP → JPEG fallback,
 * each in two responsive widths (512w mobile, 1024w desktop). The 512w AVIF
 * is also <link rel="preload"> in Index.tsx — that's the LCP image.
 *
 * The wrapper carries `.hero-window` so the parent <Hero /> can pop it in
 * with a scale+fade GSAP animation on mount.
 */

import CodeWindow from "@/components/CodeWindow";
// Vite resolves these `@/assets/...` imports at build time and returns the
// final hashed URL (e.g. "/assets/profile-photo-512.abc123.avif"). That means
// the bundler can fingerprint, cache-bust, and tree-shake unused images.
//
// We ship the same photo in three formats × two sizes:
//   • AVIF — best compression, modern browsers
//   • WebP — broad support, decent compression
//   • JPEG — universal fallback for ancient browsers
// The browser picks the FIRST <source> it understands, so order matters
// (smallest format first). The 512w AVIF is also <link rel="preload"> in
// Index.tsx because this image is the page's LCP (Largest Contentful Paint).
import profilePhotoJpeg from "@/assets/profile-photo.jpeg";
import profilePhotoAvif512 from "@/assets/profile-photo-512.avif";
import profilePhotoAvif1024 from "@/assets/profile-photo-1024.avif";
import profilePhotoWebp512 from "@/assets/profile-photo-512.webp";
import profilePhotoWebp1024 from "@/assets/profile-photo-1024.webp";

const HeroProfileWindow = () => {
  return (
    // `.hero-window` is targeted by the parent <Hero /> for a scale+fade pop-in.
    <div className="hero-window">
      <CodeWindow filename="priyabrata.jsx" language="jsx" className="max-w-md mx-auto">
        <div className="space-y-3">
          {/* Fake `export default function Profile() {` line */}
          <div className="text-xs">
            <span className="text-keyword">export default</span> <span className="text-keyword">function</span>{" "}
            <span className="text-fn">Profile</span>
            <span className="text-foreground">() {`{`}</span>
          </div>
          {/* The actual photo with online status + version overlay */}
          <div className="relative aspect-square rounded overflow-hidden border border-border">
            <picture>
              <source
                type="image/avif"
                srcSet={`${profilePhotoAvif512} 512w, ${profilePhotoAvif1024} 1024w`}
                sizes="(min-width: 1024px) 384px, (min-width: 640px) min(448px, 50vw), min(448px, 90vw)"
              />
              <source
                type="image/webp"
                srcSet={`${profilePhotoWebp512} 512w, ${profilePhotoWebp1024} 1024w`}
                sizes="(min-width: 1024px) 384px, (min-width: 640px) min(448px, 50vw), min(448px, 90vw)"
              />
              <img
                src={profilePhotoJpeg}
                alt="Priyabrata Dutta"
                className="w-full h-full object-cover object-top"
                fetchPriority="high"
                decoding="async"
                width={512}
                height={512}
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-editor-bg/40 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono">
              <span className="px-2 py-0.5 bg-background/80 backdrop-blur rounded text-string">● online</span>
              <span className="px-2 py-0.5 bg-background/80 backdrop-blur rounded text-comment">v10.2.0</span>
            </div>
          </div>
          {/* Closing fake-code lines */}
          <div className="text-xs space-y-1">
            <div>
              <span className="text-comment"> // experience</span>
            </div>
            <div>
              <span className="text-keyword"> const</span> <span className="text-foreground">years</span> ={" "}
              <span className="text-number">5</span>;
            </div>
            <div>
              <span className="text-keyword"> return</span>{" "}
              <span className="text-string">"Let's build something."</span>;
            </div>
            <div className="text-foreground">{`}`}</div>
          </div>
        </div>
      </CodeWindow>
    </div>
  );
};

export default HeroProfileWindow;
