import ShikiCode from "@/components/ShikiCode";

const GsapScrollBody = () => (
  <>
    <p>
      The trick to clean GSAP in React is the{" "}
      <span className="font-mono text-primary">useGSAP</span> hook from{" "}
      <span className="font-mono text-primary">@gsap/react</span>. It auto-
      reverts every animation on unmount — no leaked tweens, no zombie
      ScrollTriggers. Here's the pattern I use in every section:
    </p>
    <ShikiCode
      language="tsx"
      code={`import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

useGSAP(() => {
  // Stagger every .reveal child as it enters the viewport
  gsap.from(".reveal", {
    scrollTrigger: { trigger: "#blog", start: "top 75%" },
    y: 30,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: "power2.out",
  });
}, []);`}
    />
    <p>
      Two gotchas: (1) register plugins <em>once</em> in a shared{" "}
      <span className="font-mono">gsap.ts</span>, and (2) prefer{" "}
      <span className="font-mono">y/opacity</span> over{" "}
      <span className="font-mono">x</span> so you don't need
      {" "}<span className="font-mono">overflow-hidden</span> guards.
    </p>
  </>
);

export default GsapScrollBody;
