/**
 * Projects — Section 03: featured project cards + "other noteworthy" grid.
 *
 * Two parts:
 *   1. A 2x2 grid of featured projects, each rendered as a CodeWindow with
 *      a JSDoc-style header, tech stack array, and live/source links.
 *   2. Below that, a 4-up grid of additional skill domains (digital marketing,
 *      CMS, etc.) shown as compact cards.
 *
 * Animations:
 *   • `.project-card` fades up + slides up as the grid enters the viewport.
 *   • `.other-project` cards do the same for the second grid.
 *     `immediateRender: false` prevents GSAP from hiding them on mount before
 *     the trigger fires (fixes a flicker / invisible-card bug).
 */

// useRef → stable handle to a DOM node; updating it does NOT cause a re-render.
import { useRef } from "react";
// useGSAP → React wrapper for GSAP. Handles cleanup on unmount + selector scoping.
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ExternalLink, Github } from "lucide-react";
import SectionLabel from "@/components/SectionLabel";
import CodeWindow from "@/components/CodeWindow";

// Featured project data — edit these to add/remove showcase items.
const projects = [
  {
    title: "Clinic Appointment SaaS Platform",
    description:
      "Multi-tenant appointment SaaS for clinics — online booking, OTP auth, doctor scheduling, RBAC, and automated patient reminders. Solved concurrent-booking conflicts with optimistic locking + DB-level unique constraints.",
    tags: ["React", "Node.js", "MySQL", "AWS", "Docker"],
    live: "#", github: "#",
  },
  {
    title: "B2B E-commerce Platform (5000+ SKUs)",
    description:
      "B2B e-commerce with bulk ordering, tiered pricing engine, and Razorpay with idempotency keys preventing double-charges. Catalog search tuned to <40ms via MySQL full-text + Redis cache.",
    tags: ["React", "Node.js", "Express", "MySQL", "Redis", "Razorpay"],
    live: "#", github: "#",
  },
  {
    title: "Generative AI Assistant Platform",
    description:
      "LLM-powered assistant automating client report generation — prompt pipelines, RAG retrieval, and context-aware responses. Separated deterministic retrieval from LLM analysis via Pydantic validation to eliminate hallucinated numbers.",
    tags: ["React", "FastAPI", "Python", "LangChain", "OpenAI", "ChromaDB"],
    live: "#", github: "#",
  },
  {
    title: "Sales & Marketing CRM w/ Predictive Analytics",
    description:
      "CRM with lead capture, pipeline management, and predictive lead scoring to prioritise high-conversion prospects. Handled cold-start with population-level feature defaults until 3+ interactions accrue.",
    tags: ["React", "Node.js", "FastAPI", "scikit-learn", "MySQL"],
    live: "#", github: "#",
  },
];

// Smaller "other_noteworthy[]" cards shown below the featured grid.
const otherProjects = [
  {
    title: "digital_marketing",
    desc: "SEO, social campaigns & growth strategy — drove a 10% lead lift and 6% admissions rise via end-to-end digital initiatives.",
  },
  {
    title: "cms_platforms",
    desc: "Custom WordPress, Joomla, Drupal & Moodle builds — themes, plugins, and headless integrations for content-heavy sites.",
  },
  {
    title: "performance_marketing",
    desc: "Google Ads, Meta Ads, conversion tracking, A/B testing & funnel optimization for measurable ROAS gains.",
  },
  {
    title: "analytics_automation",
    desc: "GA4, Tag Manager, Zapier & custom API workflows — turning marketing data into actionable client reports.",
  },
];

const Projects = () => {
  // Section ref → used as GSAP's `scope` so our class selectors below
  // (.project-card, .other-project) only match inside this component.
  const sectionRef = useRef<HTMLElement>(null);

  // useGSAP fires once on mount and registers ScrollTriggers that wait for
  // the user to scroll the grids into view.
  useGSAP(() => {
    // Featured grid: cards stagger up as the grid enters the viewport.
    gsap.from(".project-card", {
      scrollTrigger: { trigger: ".project-grid", start: "top 80%" },
      opacity: 0, y: 50, duration: 0.7, stagger: 0.12, ease: "power3.out",
    });
    // Secondary grid: same effect but starts later (top 90%) and is more subtle.
    // immediateRender:false avoids cards being stuck invisible if the trigger
    // hasn't initialised yet on first paint.
    gsap.from(".other-project", {
      scrollTrigger: { trigger: ".other-grid", start: "top 90%" },
      opacity: 0, y: 30, duration: 0.5, stagger: 0.08, ease: "power2.out",
      immediateRender: false,
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="projects" className="section-padding">
      <div className="container mx-auto px-4">
        <SectionLabel number="03" title="Projects" description="// selected work — case studies and side builds" />

        {/* === Featured projects grid === */}
        <div className="project-grid grid md:grid-cols-2 gap-6">
          {projects.map((p) => {
            // Convert "Realtime Trading Dashboard" → "realtime-trading-dashboard"
            // for use in the fake filename + variable name.
            const slug = p.title.toLowerCase().replace(/\s+/g, "-");
            return (
              <div key={p.title} className="project-card">
                <CodeWindow filename={`${slug}.tsx`} language="tsx" className="h-full hover:-translate-y-1 transition-transform duration-300">
                  <div className="space-y-2 text-xs md:text-sm">
                    {/* JSDoc-style header */}
                    <div className="text-comment">/**</div>
                    <div className="text-comment"> * @project {p.title}</div>
                    <div className="text-comment"> * {p.description}</div>
                    <div className="text-comment"> */</div>
                    {/* Fake `export const projectName = { stack: [...] };` */}
                    <div className="pt-2">
                      <span className="text-keyword">export const</span>{" "}
                      <span className="text-fn">{slug.replace(/-/g, "_")}</span> = {`{`}
                    </div>
                    <div className="pl-4">
                      <span className="text-property">stack</span>: [
                    </div>
                    <div className="pl-8 flex flex-wrap gap-x-2">
                      {p.tags.map((t, idx) => (
                        <span key={t} className="text-string">'{t}'{idx < p.tags.length - 1 ? "," : ""}</span>
                      ))}
                    </div>
                    <div className="pl-4">],</div>
                    <div>{`}`};</div>

                    {/* Action links — live demo + source code */}
                    <div className="pt-3 flex gap-4 font-mono text-sm border-t border-border mt-3">
                      <a href={p.live} className="text-primary hover:underline inline-flex items-center gap-1 mt-3">
                        <ExternalLink className="w-3 h-3" /> live()
                      </a>
                      <a href={p.github} className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 mt-3 transition-colors">
                        <Github className="w-3 h-3" /> source()
                      </a>
                    </div>
                  </div>
                </CodeWindow>
              </div>
            );
          })}
        </div>

        {/* === "other_noteworthy[]" — secondary skill domains === */}
        <div className="mt-20">
          <h3 className="font-mono text-lg mb-6">
            <span className="text-comment">// </span>
            <span className="text-foreground">other_noteworthy</span>
            <span className="text-primary">[]</span>
          </h3>
          <div className="other-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherProjects.map((o) => (
              <div key={o.title} className="other-project p-5 rounded-md border border-border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all">
                <div className="font-mono text-sm text-primary mb-2">{`<${o.title} />`}</div>
                <p className="text-sm text-muted-foreground">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
