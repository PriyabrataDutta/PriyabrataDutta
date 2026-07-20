/**
 * Contact — Section 06: contact form + contact info / status card.
 *
 * Layout: two equal-height columns (items-stretch).
 *   • Left  — code-styled contact form ("sendMessage.ts"). Submitting
 *             currently just shows a toast — no real email is sent. Wire it
 *             to a backend function (e.g. supabase edge function + resend) to
 *             actually deliver messages.
 *   • Right — a "contact.ts" card with email/phone/location/socials, plus a
 *             small "open to opportunities" status card below it.
 *
 * Animation: `.contact-fade` items fade up as the section enters the viewport.
 */

// useRef    → mutable handle to a DOM node, doesn't trigger re-renders.
// useState  → reactive value; calling its setter re-renders the component.
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Mail, Phone, MapPin, Github, Linkedin, MessageCircle } from "lucide-react";
// Custom hook that returns a `toast()` function. Calling it shows a small
// notification popup (rendered globally by <Toaster /> in App.tsx).
import { useToast } from "@/hooks/use-toast";
import SectionLabel from "@/components/SectionLabel";

const Contact = () => {
  // Ref for the <section> wrapper — used by GSAP's scope so selectors only
  // match elements inside THIS component, not the whole page.
  const sectionRef = useRef<HTMLElement>(null);

  // Destructure `toast` from the hook. Each call shows one notification popup.
  const { toast } = useToast();

  // ─── Controlled form pattern ───
  // "Controlled" means React owns the input values via state instead of the DOM.
  // Pros: easy validation, easy reset, single source of truth.
  // We store all 3 fields in one object so a single setForm() call updates any field.
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // Scroll-triggered fade-in for everything tagged `.contact-fade`.
  // useGSAP = React wrapper around GSAP: runs after render, auto-cleans
  // every tween/ScrollTrigger on unmount, and the `{ scope: ref }` option
  // limits selectors to descendants of `sectionRef` (no cross-section bleed).
  useGSAP(() => {
    gsap.from(".contact-fade", {
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      opacity: 0, y: 30, duration: 0.7, stagger: 0.1, ease: "power2.out",
    });
  }, { scope: sectionRef });

  // ─── Form submit handler ───
  // React.FormEvent is TypeScript's type for native <form> submit events.
  // e.preventDefault() stops the browser's default page-reload behavior.
  // TODO: Wire this to a real backend (e.g. Edge function + Resend)
  // to actually deliver emails. Right now it just shows a fake success toast.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent ✓", description: "I'll get back to you shortly." });
    // Reset form by overwriting state with empty strings.
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section ref={sectionRef} id="contact" className="section-padding bg-card/30">
      <div className="container mx-auto px-4">
        <SectionLabel number="07" title="Contact" description="// let's build something together" />

        {/* items-stretch keeps both columns the same height */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* === LEFT: code-styled message form === */}
          <div className="contact-fade rounded-lg border border-border bg-editor-bg overflow-hidden editor-shadow flex flex-col">
            {/* Editor title bar */}
            <div className="bg-editor-titlebar border-b border-border px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="font-mono text-xs text-foreground/80 ml-2">sendMessage.ts</span>
            </div>

            {/* The form itself, dressed up to look like an async function */}
            <form onSubmit={handleSubmit} className="p-5 font-mono text-sm space-y-4">
              <div className="text-xs">
                <span className="text-keyword">async function</span>{" "}
                <span className="text-fn">sendMessage</span>
                <span className="text-foreground">({`{`}</span>
              </div>

              {/* Three fields: name, email, message — all controlled by `form` state */}
              <div className="space-y-3 pl-4">
                <div>
                  <label className="text-property text-xs block mb-1">name:</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="'your name'"
                    className="w-full bg-card border border-border rounded px-3 py-2 text-string font-mono text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-comment"
                  />
                </div>
                <div>
                  <label className="text-property text-xs block mb-1">email:</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="'you@domain.com'"
                    className="w-full bg-card border border-border rounded px-3 py-2 text-string font-mono text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-comment"
                  />
                </div>
                <div>
                  <label className="text-property text-xs block mb-1">message:</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="'tell me about your project...'"
                    className="w-full bg-card border border-border rounded px-3 py-2 text-string font-mono text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-comment resize-none"
                  />
                </div>
              </div>

              <div className="text-xs text-foreground">{`})`};</div>

              {/* Submit button styled as `[execute()]` */}
              <button
                type="submit"
                className="w-full mt-2 px-5 py-2.5 bg-primary text-primary-foreground rounded hover:shadow-lg hover:shadow-primary/30 transition-shadow inline-flex items-center justify-center gap-2"
              >
                <span className="opacity-60">[</span>
                execute()
                <span className="opacity-60">]</span>
              </button>
            </form>
          </div>

          {/* === RIGHT: contact info card + status card === */}
          <div className="contact-fade flex flex-col gap-6">
            {/* Contact info rendered as a JS export */}
            <div className="rounded-lg border border-border bg-editor-bg overflow-hidden editor-shadow flex-1">
              <div className="bg-editor-titlebar border-b border-border px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="font-mono text-xs text-foreground/80 ml-2">contact.ts</span>
              </div>
              <div className="p-5 font-mono text-xs md:text-sm space-y-2">
                <div>
                  <span className="text-keyword">export const</span>{" "}
                  <span className="text-foreground">contact</span> = {`{`}
                </div>
                {/* Each contact line is a clickable link (mailto / tel / external).
                    `min-w-0` + `break-all` on the value lets long emails wrap
                    instead of forcing horizontal overflow on small screens. */}
                <a href="mailto:priyabrata.dutta369@gmail.com" className="pl-4 flex items-start gap-2 hover:text-primary transition-colors group min-w-0">
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                  <span className="text-property shrink-0">email</span>
                  <span className="text-foreground shrink-0">:</span>
                  <span className="text-string group-hover:underline break-all min-w-0">'priyabrata.dutta369@gmail.com'</span>
                </a>
                <a href="tel:+919832465858" className="pl-4 flex items-start gap-2 hover:text-primary transition-colors group min-w-0">
                  <Phone className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                  <span className="text-property shrink-0">phone</span>
                  <span className="text-foreground shrink-0">:</span>
                  <span className="text-string group-hover:underline break-all min-w-0">'+91 98324 65858'</span>
                </a>
                <a href="tel:+919239265858" className="pl-4 flex items-start gap-2 hover:text-primary transition-colors group min-w-0">
                  <Phone className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                  <span className="text-property shrink-0">phone2</span>
                  <span className="text-foreground shrink-0">:</span>
                  <span className="text-string group-hover:underline break-all min-w-0">'+91 92392 65858'</span>
                </a>
                <a
                  href="https://wa.me/919832465858?text=Hi%20Priyabrata%2C%20I%20came%20across%20your%20portfolio%20and%20would%20love%20to%20connect."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="pl-4 flex items-start gap-2 hover:text-primary transition-colors group min-w-0"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                  <span className="text-property shrink-0">whatsapp</span>
                  <span className="text-foreground shrink-0">:</span>
                  <span className="text-string group-hover:underline break-all min-w-0">'wa.me/919832465858'</span>
                </a>
                <div className="pl-4 flex items-start gap-2 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                  <span className="text-property shrink-0">location</span>
                  <span className="text-foreground shrink-0">:</span>
                  <span className="text-string break-all min-w-0">'Bangalore, India'</span>
                </div>
                {/* Nested `socials: { ... }` block */}
                <div className="pl-4">
                  <span className="text-property">socials</span>: {`{`}
                </div>
                <a href="https://github.com/PriyabrataDutta" target="_blank" rel="noopener noreferrer" className="pl-8 flex items-start gap-2 hover:text-primary transition-colors group min-w-0">
                  <Github className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                  <span className="text-property shrink-0">github</span>
                  <span className="text-foreground shrink-0">:</span>
                  <span className="text-string group-hover:underline break-all min-w-0">'@PriyabrataDutta'</span>
                </a>
                <a href="https://www.linkedin.com/in/priyabratadutta/" target="_blank" rel="noopener noreferrer" className="pl-8 flex items-start gap-2 hover:text-primary transition-colors group min-w-0">
                  <Linkedin className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                  <span className="text-property shrink-0">linkedin</span>
                  <span className="text-foreground shrink-0">:</span>
                  <span className="text-string group-hover:underline break-all min-w-0">'/in/priyabratadutta'</span>
                </a>
                <div className="pl-4 text-foreground">{`},`}</div>
                <div className="text-foreground">{`}`};</div>
              </div>
            </div>

            {/* Small "open to opportunities" status card with pulsing dot */}
            <div className="p-5 rounded-lg border border-primary/30 bg-primary/5 font-mono text-sm">
              <div className="text-comment mb-2">// status</div>
              <div className="flex items-center gap-2 text-foreground">
                <span className="w-2 h-2 rounded-full bg-string animate-pulse" />
                <span>open to new opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
