/**
 * Experience — Section 04: work history rendered as a `git log` timeline.
 *
 * Each role is a "commit" on a vertical timeline (commit hash, branch tag,
 * author, date, message, then bullet-pointed achievements as `+` diff lines).
 *
 * Animations:
 *   • `.commit-line` (the vertical spine) scales in from the top.
 *   • `.commit-row` items slide in from the left, staggered.
 *   Both trigger when the `.git-log` container scrolls into view.
 */

// useRef → returns a stable `{ current: ... }` object that survives re-renders
// without causing them. We use it to give GSAP a handle to our <section>.
import { useRef } from "react";
// useGSAP is the React-friendly GSAP hook: it auto-cleans up animations on
// unmount and re-runs when its `dependencies` array changes.
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import SectionLabel from "@/components/SectionLabel";

// Work history. Newest first — they render top-to-bottom in this order.
// Each entry maps roughly to fields you'd see in `git log`:
//   hash   → fake commit hash for visual flavour
//   branch → reflects the role/context (e.g. "main", "freelance/global")
//   date   → date range of the role
//   achievements → shown as `+` diff lines under the description
const experiences = [
  {
    hash: "a3f8c91",
    branch: "main",
    date: "Feb 2022 — Present",
    title: "Technical Lead / Full Stack Developer",
    company: "Appadd India (P) Ltd",
    location: "Bangalore, India",
    description:
      "Leading architecture, delivery, and engineering culture across a multi-client product engineering practice serving healthcare, legal, and B2B domains.",
    achievements: [
      "Architected and shipped 100+ production web applications serving 50K+ MAU — maintained 99.7% uptime with zero P0 incidents over 3+ years",
      "Reduced average page load 4.2s → 1.1s (74% improvement) — lifted Core Web Vitals scores 45 → 92 across 8 client domains",
      "Designed and built 35+ REST APIs handling 10K+ daily requests — implemented JWT, RBAC & Razorpay/Cashfree (₹15L+/mo transactions)",
      "Built and deployed multi-tenant Clinic SaaS + B2B E-Commerce Platform handling 5,000+ SKUs with <40ms catalog search",
      "Migrated 15+ client web applications to AWS (EC2, S3, CloudFront, Lambda) — reduced infrastructure costs by 40% and raised uptime 95% → 99.7%",
      "Implemented CI/CD pipelines using GitHub Actions & Docker — reduced deployment duration 45 mins → 8 mins",
      "Managed, mentored, and scaled a team from 2 → 5+ engineers — conducted 500+ code reviews, cut prod bug rate by 60% & resolution 48h → 12h",
      "Spearheaded Generative AI integration initiatives — built AI document analysis assistant (FastAPI + LangChain + ChromaDB), automating report generation 3h → 10min",
    ],
  },
  {
    hash: "b1d4e72",
    branch: "freelance/global",
    date: "2021 — 2022",
    title: "Freelance Full Stack Developer",
    company: "GraphicxIT",
    location: "Siliguri, India",
    description:
      "End-to-end product engineering for international clients across 4 countries — from requirements to production deployment, owning every technical decision solo.",
    achievements: [
      "Delivered 20+ custom web apps across India, USA, UAE & UK — 100% on-time, zero critical bugs",
      "Sole engineer on a Laravel govt-body platform: 5K+ users, 25+ tables, full auth & RBAC",
      "Achieved Google PageSpeed 90+ across all sites — 30% avg organic-traffic lift within 3 months",
      "Optimized MySQL schemas: 65% faster queries, one dashboard load 8s → 2.8s",
      "Automated 10+ client workflows via Zapier + custom APIs — saved 15+ hrs/mo per client",
    ],
  },
  {
    hash: "9e2c5a4",
    branch: "media/scale",
    date: "2019 — 2021",
    title: "Technical Resource / Web Developer",
    company: "Uttarbanga Sambad",
    location: "Siliguri, India",
    description:
      "Digital infrastructure powering one of North Bengal's largest news organizations — full-stack development, team leadership, and real-time content delivery at scale.",
    achievements: [
      "Built high-traffic news portal serving 100K+ monthly readers — sub-second loads at 3-5x traffic spikes",
      "Led a 20-member cross-functional team — cut publishing bottlenecks by 50%",
      "Drove CMS transformation: article output 20 → 60+/day (3x) with no editorial headcount added",
      "Hardened security (WAF/SSL/DDoS) + tuned NGINX+MySQL — 99.5% uptime through election cycles",
      "Built technical infrastructure for Facebook Live broadcasts reaching 10K+ concurrent viewers",
      "Launched ad monetization platform (Google AdSense + direct placements) generating ₹2L+/month in new digital revenue",
      "Implemented responsive redesign that increased mobile traffic share from 45% → 72%",
    ],
  },
  {
    hash: "0f1a8b3",
    branch: "init",
    date: "2010 — 2019",
    title: "Technical Assistant / Web Developer",
    company: "Surendra Institute of Engineering & Management (SIEM)",
    location: "Siliguri, India",
    description:
      "Dual role combining academic program delivery with institutional digital transformation — the foundation for my engineering leadership.",
    achievements: [
      "Conducted programming labs for 500+ students annually across 9 years in C, C++, Java, VB.NET, and DSA",
      "Designed and executed data-driven admission promotion strategy — +10% inquiry leads and +6% confirmed admissions (2015-16), contributing ₹15L+ additional revenue",
      "Built college website from scratch and managed digital marketing driving 5K+ monthly visitors — transformed website into #1 admission channel (40%+ of all new inquiries)",
      "Supervised 50+ final-year student capstone projects across web, DB & software design",
      "Implemented centralized data management and security infrastructure across 3 computer labs (60+ machines) — reduced system downtime by 70%",
      "Organized and delivered 10+ technical workshops on emerging web technologies for students and faculty",
    ],
  },
];

const Experience = () => {
  // Ref attached to the <section> below. Passed to useGSAP's `scope` so
  // GSAP only looks for ".commit-row" / ".commit-line" inside this component.
  const sectionRef = useRef<HTMLElement>(null);

  // useGSAP runs this animation setup once on mount, then cleans up on unmount.
  useGSAP(() => {
    // Reveal each commit row with a fade + upward slide.
    // (Previously used `x: -40` which pushed rows off-screen on mobile and
    //  created a horizontal scrollbar — y/opacity stays inside the viewport.)
    // ScrollTrigger watches scroll position; "top 75%" = fire when the top of
    // .git-log reaches 75% down the viewport.
    gsap.from(".commit-row", {
      scrollTrigger: { trigger: ".git-log", start: "top 75%" },
      opacity: 0, y: 30, duration: 0.6, stagger: 0.15, ease: "power3.out",
    });
    // Animate the vertical timeline line growing downward (scaleY 0 → 1).
    // transformOrigin: "top" anchors the scale so it grows from top → bottom.
    gsap.from(".commit-line", {
      scrollTrigger: { trigger: ".git-log", start: "top 75%" },
      scaleY: 0, transformOrigin: "top", duration: 1.5, ease: "power2.out",
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="experience" className="section-padding bg-card/30">
      <div className="container mx-auto px-4">
        <SectionLabel number="04" title="Experience" description="// $ git log --oneline --decorate" />

        <div className="git-log relative max-w-4xl mx-auto">
          {/* Vertical "git timeline" spine running down the left edge */}
          <div className="commit-line absolute left-3 md:left-4 top-2 bottom-2 w-px bg-border" />

          <div className="space-y-10">
            {experiences.map((exp) => (
              <div key={exp.hash} className="commit-row relative pl-10 md:pl-14">
                {/* Circular "commit dot" anchored on the spine */}
                <div className="absolute left-0 md:left-1 top-2 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>

                {/* Commit card */}
                <div className="rounded-md border border-border bg-card p-5 md:p-6 hover:border-primary/40 transition-colors">
                  {/* git-log header line: commit + hash + (HEAD → branch) */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-3">
                    <span className="text-primary">commit</span>
                    <span className="text-foreground">{exp.hash}</span>
                    <span className="text-comment">(</span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
                      HEAD → {exp.branch}
                    </span>
                    <span className="text-comment">)</span>
                  </div>
                  {/* Author + date metadata */}
                  <div className="font-mono text-xs text-muted-foreground mb-1">Author: Priyabrata Dutta</div>
                  <div className="font-mono text-xs text-muted-foreground mb-4">Date:   {exp.date}</div>

                  {/* Body: title + company + location + description + diff lines */}
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-semibold text-foreground">
                      {exp.title} <span className="text-primary">@ {exp.company}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">// {exp.location}</p>
                    <p className="text-muted-foreground pt-2">{exp.description}</p>

                    {/* Achievements styled as `+` diff additions */}
                    <ul className="pt-3 space-y-1.5">
                      {exp.achievements.map((a) => (
                        <li key={a} className="font-mono text-sm text-foreground flex gap-2">
                          <span className="text-primary mt-0.5">+</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
