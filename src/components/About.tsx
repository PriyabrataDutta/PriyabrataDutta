/**
 * About — Section 01: short bio + animated stats.
 *
 * Layout: two equal-height columns on desktop.
 *   • Left  — a CodeWindow showing an `aboutMe = { ... }` object literal.
 *   • Right — paragraph bio + a 2x2 grid of stat counters.
 *
 * Animations:
 *   • `.about-fade` items fade up as the section enters the viewport.
 *   • `.stat-counter` numbers count up from 0 to their target value
 *     (e.g. 10+ years, 100+ projects) using GSAP's tween + onUpdate.
 */

// useRef → mutable container that doesn't trigger re-renders. Perfect for
// holding a DOM node reference we hand off to GSAP.
import { useRef } from "react";
// useGSAP → React wrapper that auto-cleans GSAP timelines on unmount and
// scopes selectors so they only match elements inside this component.
import { useGSAP } from "@gsap/react";
// We import ScrollTrigger directly here because the stat-counter logic
// creates one manually (instead of attaching it to a tween).
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionLabel from "@/components/SectionLabel";
import CodeWindow from "@/components/CodeWindow";

// Stat tiles shown in the bottom-right of the section.
// `value` is the final number; `data-target` on the DOM drives the count-up.
const stats = [
  { value: 10, suffix: "+", label: "years_in_IT" },
  { value: 100, suffix: "+", label: "projects_shipped" },
  { value: 5, suffix: "+", label: "engineers_led" },
  { value: 15, suffix: "+", label: "active_clients" },
];

const About = () => {
  // Ref attached to <section>. Passed to useGSAP's `scope` so any selector
  // strings (".about-fade", ".stat-counter") are scoped to this section only.
  const sectionRef = useRef<HTMLElement>(null);

  // useGSAP runs the callback once on mount with automatic cleanup.
  // The `scope` option means gsap.utils.toArray(".stat-counter") below will
  // only find counters inside THIS section — not other matching elements on the page.
  useGSAP(
    () => {
      // 1) Fade everything tagged `.about-fade` upward when section scrolls into view.
      gsap.from(".about-fade", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });

      // 2) Animated number counters.
      // For each .stat-counter element, read its data-target attribute,
      // then tween a temp { val } object from 0 → target while writing the
      // floored value back into the element's text on every frame.
      gsap.utils.toArray<HTMLElement>(".stat-counter").forEach((el) => {
        const target = parseInt(el.dataset.target || "0");
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => {
            gsap.to(obj, {
              val: target,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.floor(obj.val).toString();
              },
            });
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="about" className="section-padding pt-4 md:pt-6">
      <div className="container mx-auto px-4">
        <SectionLabel number="01" title="About" description="// who I am, what I do, and why" />

        {/* items-stretch keeps both columns the same height */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* === LEFT: code window with aboutMe object === */}
          <div className="about-fade flex">
            <CodeWindow
              filename="aboutMe.ts"
              language="ts"
              showLineNumbers
              lineCount={12}
              className="flex flex-col w-full"
            >
              <div className="space-y-1 text-xs md:text-sm leading-6 h-full flex flex-col justify-center">
                <div>
                  <span className="text-keyword">const</span> <span className="text-foreground">aboutMe</span> = {`{`}
                </div>
                <div className="pl-4">
                  <span className="text-property">name</span>: <span className="text-string">'Priyabrata Dutta'</span>,
                </div>
                <div className="pl-4">
                  <span className="text-property">role</span>:{" "}
                  <span className="text-string">'Technical Lead | Full Stack Developer'</span>,
                </div>
                <div className="pl-4">
                  <span className="text-property">location</span>:{" "}
                  <span className="text-string">'Bangalore, India'</span>,
                </div>
                <div className="pl-4">
                  <span className="text-property">experience</span>: <span className="text-number">10+</span>,
                </div>
                <div className="pl-4">
                  <span className="text-property">stack</span>: [<span className="text-string">'React'</span>,{" "}
                  <span className="text-string">'Next.js'</span>, <span className="text-string">'Node'</span>,{" "}
                  <span className="text-string">'AWS'</span>],
                </div>
                <div className="pl-4">
                  <span className="text-property">focus</span>: [
                </div>
                <div className="pl-8">
                  <span className="text-string">'scalable architecture'</span>,
                </div>
                <div className="pl-8">
                  <span className="text-string">'AI integration'</span>,
                </div>
                <div className="pl-8">
                  <span className="text-string">'team leadership'</span>,
                </div>
                <div className="pl-4">],</div>
                <div>{`}`};</div>
              </div>
            </CodeWindow>
          </div>

          {/* === RIGHT: bio paragraphs + stat tiles === */}
          <div className="space-y-6">
            <div className="about-fade space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Technical Lead & Full Stack Developer with <span className="text-primary font-mono">10+ Years IT Experience</span>{" "}
                and <span className="text-primary font-mono">5+ Years Building Scalable Web Apps</span> with React, Next.js, Node.js, Express & AWS.
              </p>
              <p>
                I currently lead a cross-functional team of <span className="text-foreground font-medium">5+ engineers</span> at
                Appadd India, having shipped <span className="text-foreground font-medium">100+ projects</span> across
                healthcare, legal, B2B and e-commerce — maintaining 99.7% uptime with zero P0 incidents over 3+ years.
              </p>
              <p>
                Actively expanding into <span className="text-foreground font-medium">Generative AI integration</span> and
                agentic AI workflows — building LLM-powered assistants with FastAPI, LangChain, and ChromaDB.
              </p>
            </div>

            {/* 2x2 grid of stat tiles. The <span className="stat-counter">
                starts at "0" and is animated up to data-target by GSAP. */}
            <div className="about-fade grid grid-cols-2 gap-4 pt-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="border border-border rounded-md p-4 bg-card hover:border-primary/40 transition-colors"
                >
                  <div className="font-mono text-3xl font-bold text-primary flex items-baseline">
                    <span className="stat-counter" data-target={s.value}>
                      0
                    </span>
                    <span>{s.suffix}</span>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground mt-1">// {s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
