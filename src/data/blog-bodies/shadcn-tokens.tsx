import ShikiCode from "@/components/ShikiCode";

const ShadcnTokensBody = () => (
  <>
    <p>
      The shadcn/ui pattern is deceptively powerful: store every color as
      three space-separated HSL values in a CSS variable, then reference it
      with <span className="font-mono">hsl(var(--primary))</span>. Tailwind
      pipes it through opacity modifiers automatically.
    </p>
    <ShikiCode
      language="css"
      code={`/* index.css — single source of truth */
:root {
  --background: 222 47% 7%;
  --foreground: 210 40% 98%;
  --primary:    18  95% 55%;  /* ember orange */
}

/* tailwind.config.ts */
colors: {
  primary: "hsl(var(--primary) / <alpha-value>)",
}`}
    />
    <p>
      Now <span className="font-mono">bg-primary/20</span> just works.
      Rebrand the entire app by editing four lines. Add a{" "}
      <span className="font-mono">.theme-mint</span> class to any subtree
      and that branch instantly retones — no extra build step, no JS.
    </p>
  </>
);

export default ShadcnTokensBody;
