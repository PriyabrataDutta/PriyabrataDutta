/**
 * Skills — Section 02: tabbed list of skills + a fake "exploring" log.
 *
 * Two pieces of UI:
 *   1. A tabbed editor-style panel (frontend / backend / devops / ai / leadership).
 *      An animated underline indicator slides between active tabs.
 *      Skill chips fade-in whenever the tab changes.
 *
 *   2. Below that, a CodeWindow styled like a tail -f log showing what I'm
 *      currently exploring / learning.
 */

// React hooks used here:
//   useRef    → keeps a mutable reference to a DOM node *without* causing re-renders
//                (we use it to point GSAP at the section element and tab buttons).
//   useState  → React's "remember a value between renders" hook. Changing it
//                triggers a re-render so the UI reflects the new value.
//   useEffect → runs side-effects (DOM measurements, subscriptions, etc.) AFTER
//                the component has rendered. Re-runs when its dependency array changes.
import { useRef, useState, useEffect } from "react";
// useGSAP is the official React wrapper for GSAP. It auto-cleans up animations
// when the component unmounts (no memory leaks) and respects React 18 strict mode.
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import SectionLabel from "@/components/SectionLabel";
import CodeWindow from "@/components/CodeWindow";

// All skill data lives here as a single object keyed by tab name.
// Each entry has a display name + a self-rated proficiency level (0–100).
const skillTabs = {
  frontend: [
    { name: "React.js", level: 95 },
    { name: "Next.js", level: 92 },
    { name: "TypeScript", level: 90 },
    { name: "JavaScript (ES6+)", level: 95 },
    { name: "HTML5", level: 95 },
    { name: "CSS3", level: 95 },
    { name: "Tailwind CSS", level: 92 },
    { name: "SSR / SSG / CSR", level: 88 },
    { name: "Responsive & Mobile-First", level: 92 },
  ],
  backend: [
    { name: "Node.js", level: 92 },
    { name: "Express.js", level: 92 },
    { name: "FastAPI", level: 82 },
    { name: "Python", level: 85 },
    { name: "REST APIs", level: 95 },
    { name: "JWT & OAuth Auth", level: 88 },
    { name: "Payment Gateway Integration (Razorpay)", level: 85 },
    { name: "Prisma ORM", level: 85 },
  ],
  databases: [
    { name: "MySQL", level: 90 },
    { name: "PostgreSQL", level: 88 },
    { name: "Redis", level: 82 },
    { name: "Schema Design", level: 90 },
    { name: "Query Optimization", level: 88 },
    { name: "Indexing", level: 85 },
  ],
  devops: [
    { name: "AWS (EC2, S3, Lambda, CloudFront)", level: 90 },
    { name: "Docker", level: 85 },
    { name: "Kubernetes", level: 78 },
    { name: "Git / GitHub", level: 95 },
    { name: "CI/CD Pipelines", level: 88 },
    { name: "Automated Testing & Deploy", level: 85 },
    { name: "Infrastructure Mgmt", level: 82 },
  ],
  ai: [
    { name: "OpenAI API", level: 90 },
    { name: "LangChain", level: 85 },
    { name: "ChromaDB", level: 80 },
    { name: "Generative AI", level: 88 },
    { name: "RAG Pipelines", level: 82 },
    { name: "Prompt Engineering", level: 88 },
    { name: "Vector Embeddings", level: 82 },
    { name: "Agentic AI Workflows", level: 80 },
  ],
  leadership: [
    { name: "Agile / Scrum", level: 90 },
    { name: "Team Leadership (5+ engineers)", level: 92 },
    { name: "Sprint Planning", level: 90 },
    { name: "Code Reviews & Mentoring", level: 92 },
    { name: "Project Management", level: 90 },
    { name: "Client Communication", level: 90 },
  ],
};

// TS magic: TabKey is the union of skillTabs' keys ("frontend" | "backend" | ...).
type TabKey = keyof typeof skillTabs;
const tabs: TabKey[] = ["frontend", "backend", "databases", "devops", "ai", "leadership"];

// Fake log entries shown in the "exploring.log" code window below the tabs.
const exploringLogs = [
  { time: "10:24:12", msg: "building agentic workflows with LLM tooling" },
  { time: "10:25:48", msg: "prepping for AWS Cloud Developer Associate exam" },
  { time: "10:27:03", msg: "exploring FastAPI for AI service backends" },
  { time: "10:28:21", msg: "experimenting with RAG over internal docs" },
  { time: "10:29:55", msg: "scaling Next.js apps with edge caching + ISR" },
];

const Skills = () => {
  // sectionRef → attached to the <section> below. We pass it to GSAP's `scope`
  // so any selector strings (".skill-fade", ".skill-chip") are scoped to THIS
  // section only — preventing accidental matches in other components.
  const sectionRef = useRef<HTMLElement>(null);

  // activeTab is reactive: changing it via setActiveTab() re-renders the
  // component, which in turn re-renders the chips for the new tab.
  const [activeTab, setActiveTab] = useState<TabKey>("frontend");

  // tabIndicatorRef → the sliding underline DOM node we'll animate.
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  // tabRefs holds a dictionary of every tab button keyed by its name.
  // Storing them in a ref (instead of state) avoids re-renders when we
  // assign refs during render via the `ref={el => ...}` callback below.
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // ─── Animation #1: one-time fade-in when the section scrolls into view ───
  // useGSAP runs this callback once on mount and cleans up automatically.
  // ScrollTrigger watches the viewport; "top 75%" means the trigger fires
  // when the top of the section reaches 75% down the viewport.
  useGSAP(() => {
    gsap.from(".skill-fade", {
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      opacity: 0, y: 30, duration: 0.7, stagger: 0.08, ease: "power2.out",
    });
  }, { scope: sectionRef });

  // ─── Animation #2: re-animate chips every time the user clicks a new tab ───
  // The `dependencies` array works like useEffect's deps — GSAP re-runs the
  // animation whenever activeTab changes, giving newly-rendered chips a fade-up.
  useGSAP(() => {
    gsap.from(".skill-chip", { opacity: 0, y: 15, duration: 0.4, stagger: 0.05, ease: "power2.out" });
  }, { dependencies: [activeTab] });

  // ─── Effect: slide the underline indicator under the active tab ───
  // We use useEffect (not useGSAP) because we just need a quick measurement
  // + tween whenever activeTab changes. Reading offsetLeft/offsetWidth must
  // happen AFTER the DOM has painted, which is exactly when useEffect fires.
  useEffect(() => {
    const btn = tabRefs.current[activeTab];
    const indicator = tabIndicatorRef.current;
    // Defensive guard: refs may be null on the very first render.
    if (!btn || !indicator) return;
    gsap.to(indicator, { x: btn.offsetLeft, width: btn.offsetWidth, duration: 0.4, ease: "power3.out" });
  }, [activeTab]); // ← re-run whenever the active tab changes

  return (
    <section ref={sectionRef} id="skills" className="section-padding bg-card/30">
      <div className="container mx-auto px-4">
        <SectionLabel number="02" title="Skills" description="// tech stack & tools I work with" />

        {/* === Tabbed editor-style panel === */}
        <div className="skill-fade rounded-lg border border-border bg-editor-bg overflow-hidden editor-shadow">
          <div className="flex bg-editor-titlebar border-b border-border relative overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t}
                // Save each button's DOM node so the indicator can measure it.
                ref={(el) => (tabRefs.current[t] = el)}
                onClick={() => setActiveTab(t)}
                className={`px-5 py-3 font-mono text-sm whitespace-nowrap transition-colors ${
                  activeTab === t ? "text-primary bg-editor-bg" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}.ts
              </button>
            ))}
            {/* The sliding underline — position/width set by the useEffect above */}
            <div ref={tabIndicatorRef} className="absolute bottom-0 h-0.5 bg-primary" style={{ width: 0 }} />
          </div>

          {/* Skill chips for the currently active tab. Re-renders on tab change. */}
          <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-sm">
            {skillTabs[activeTab].map((s) => (
              <div key={s.name} className="skill-chip flex items-center justify-between px-4 py-3 rounded border border-border bg-card hover:border-primary/50 transition-colors">
                <span className="text-foreground">{s.name}</span>
                <span className="text-comment text-xs">// {s.level}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* === "exploring.log" code window — what I'm currently learning === */}
        <div className="skill-fade mt-12">
          <CodeWindow filename="exploring.log" language="log">
            <div className="space-y-1 text-xs md:text-sm">
              <div className="text-comment mb-2">$ tail -f /var/log/learning.log</div>
              {exploringLogs.map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-comment shrink-0">[{l.time}]</span>
                  <span className="text-string">INFO</span>
                  <span className="text-foreground">{l.msg}</span>
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <span className="text-primary">▋</span>
                <span className="text-comment animate-blink">awaiting next experiment...</span>
              </div>
            </div>
          </CodeWindow>
        </div>
      </div>
    </section>
  );
};

export default Skills;
