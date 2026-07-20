const VibeCodingBody = () => (
  <>
    <p>
      The landscape of software engineering is undergoing its most radical
      transformation since the advent of high-level programming languages.
      This shift — coined <span className="text-primary font-mono">"vibe coding"</span>{" "}
      by Andrej Karpathy in early 2025 — describes a workflow where the
      developer's role transitions from manual code author to high-level
      supervisor of AI agents.
    </p>
    <h4 className="text-lg font-bold text-foreground font-mono mt-4">
      <span className="text-primary">##</span> The four quadrants
    </h4>
    <ul className="list-disc list-inside space-y-1 marker:text-primary">
      <li><strong>Full-Stack App Builders</strong> — v0, Bolt.new, Replit Agent</li>
      <li><strong>AI-Native IDEs</strong> — Cursor, Windsurf, Claude Code</li>
      <li><strong>Frontend UI Generators</strong> — v0, Banani</li>
      <li><strong>Specialized Vertical Builders</strong> — RapidNative, Reflex</li>
    </ul>
    <h4 className="text-lg font-bold text-foreground font-mono mt-4">
      <span className="text-primary">##</span> The "Last 20%" problem
    </h4>
    <p>
      AI tools generate the first 80% of an app — UI, basic CRUD, core
      workflows — with remarkable speed. The final 20% (edge cases,
      performance, security) remains hard. The pragmatic workflow:
      prototype with AI web generators, then harden in Cursor using deep codebase
      indexing.
    </p>
    <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground mt-4">
      "Vibe coding doesn't remove engineers from the loop — it elevates
      their role from author to architect."
    </blockquote>
  </>
);

export default VibeCodingBody;
