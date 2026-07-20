/**
 * Education — Section 05: degrees + certifications shown as JSON files.
 *
 * Two side-by-side CodeWindows ("education.json" and "certifications.json")
 * that visually present the data as JSON to match the editor aesthetic.
 *
 * `items-stretch` on the grid + `flex-1 flex flex-col` on the windows keeps
 * both boxes the same height even if one has more content than the other.
 *
 * Animation: each `.edu-card` fades + slides up as the section enters view.
 */

// useRef → mutable ref to a DOM node (no re-renders when changed).
import { useRef } from "react";
// useGSAP → React wrapper that auto-cleans animations + scopes selectors.
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import SectionLabel from "@/components/SectionLabel";
import CodeWindow from "@/components/CodeWindow";

const Education = () => {
  // Ref to the <section>. Passed to useGSAP `scope` so ".edu-card" selectors
  // only match inside this component (safer than global queries).
  const sectionRef = useRef<HTMLElement>(null);

  // Stagger-fade the two .edu-card columns in when the section scrolls into view.
  // ScrollTrigger fires when the top of the section hits 75% down the viewport.
  useGSAP(() => {
    gsap.from(".edu-card", {
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      opacity: 0, y: 40, duration: 0.7, stagger: 0.15, ease: "power3.out",
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="education" className="section-padding">
      <div className="container mx-auto px-4">
        <SectionLabel number="05" title="Education" description="// formal training & certifications" />

        {/* items-stretch ensures both columns share the tallest column's height */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* === LEFT: education.json (degrees) === */}
          <div className="edu-card flex">
            <CodeWindow filename="education.json" language="json" showLineNumbers lineCount={15} className="flex-1 flex flex-col">
              <div className="space-y-1 text-xs md:text-sm leading-6 h-full flex flex-col justify-center">
                <div>{`{`}</div>
                <div className="pl-4"><span className="text-property">"degrees"</span>: [</div>
                <div className="pl-8">{`{`}</div>
                <div className="pl-12"><span className="text-property">"degree"</span>: <span className="text-string">"MCA"</span>,</div>
                <div className="pl-12"><span className="text-property">"institute"</span>: <span className="text-string">"Siliguri Institute of Technology"</span>,</div>
                <div className="pl-12"><span className="text-property">"year"</span>: <span className="text-number">2022</span>,</div>
                <div className="pl-12"><span className="text-property">"focus"</span>: <span className="text-string">"Software Eng. + Cloud"</span></div>
                <div className="pl-8">{`}`},</div>
                <div className="pl-8">{`{`}</div>
                <div className="pl-12"><span className="text-property">"degree"</span>: <span className="text-string">"BCA"</span>,</div>
                <div className="pl-12"><span className="text-property">"institute"</span>: <span className="text-string">"Sikkim Manipal University"</span>,</div>
                <div className="pl-12"><span className="text-property">"year"</span>: <span className="text-number">2011</span></div>
                <div className="pl-8">{`}`}</div>
                <div className="pl-4">]</div>
                <div>{`}`}</div>
              </div>
            </CodeWindow>
          </div>

          {/* === RIGHT: certifications.json === */}
          <div className="edu-card flex">
            <CodeWindow filename="certifications.json" language="json" showLineNumbers lineCount={15} className="flex-1 flex flex-col">
              <div className="space-y-1 text-xs md:text-sm leading-6 h-full flex flex-col justify-center">
                <div>{`[`}</div>
                <div className="pl-4">{`{`}</div>
                <div className="pl-8"><span className="text-property">"name"</span>: <span className="text-string">"Full Stack Dev & Product Eng."</span>,</div>
                <div className="pl-8"><span className="text-property">"by"</span>: <span className="text-string">"PESTO"</span>,</div>
                <div className="pl-8"><span className="text-property">"year"</span>: <span className="text-number">2024</span></div>
                <div className="pl-4">{`}`},</div>
                <div className="pl-4">{`{`}</div>
                <div className="pl-8"><span className="text-property">"name"</span>: <span className="text-string">"Cloud Computing (NPTEL)"</span>,</div>
                <div className="pl-8"><span className="text-property">"by"</span>: <span className="text-string">"IIT Kharagpur"</span>,</div>
                <div className="pl-8"><span className="text-property">"score"</span>: <span className="text-string">"69%"</span>,</div>
                <div className="pl-8"><span className="text-property">"year"</span>: <span className="text-number">2022</span></div>
                <div className="pl-4">{`}`},</div>
                <div className="pl-4">{`{`}</div>
                <div className="pl-8"><span className="text-property">"name"</span>: <span className="text-string">"AWS Cloud Developer Associate"</span>,</div>
                <div className="pl-8"><span className="text-property">"status"</span>: <span className="text-comment">"// in progress"</span></div>
                <div className="pl-4">{`}`}</div>
                <div>{`]`}</div>
              </div>
            </CodeWindow>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
